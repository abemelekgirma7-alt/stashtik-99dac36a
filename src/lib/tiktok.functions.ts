import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TIKTOK_HOST_RE =
  /^https?:\/\/((www|vt|vm|m|t)\.)?tiktok\.com\/[^\s]*$/i;

const InputSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Please paste a TikTok link to continue.")
    .max(500, "That link is too long to be a real TikTok URL.")
    .refine(
      (u) => TIKTOK_HOST_RE.test(u),
      "That doesn't look like a TikTok link. Paste a URL from tiktok.com (or a vm.tiktok.com / vt.tiktok.com short link).",
    )
    .refine(
      (u) => !/\/(login|signup|tag|search)\b/i.test(u),
      "This is a TikTok page link, not a video. Open the video itself, tap Share → Copy Link, then paste it here.",
    ),
});

export type TikTokSuccess = {
  ok: true;
  title: string;
  author: string;
  cover: string;
  duration: number;
  videoNoWatermark: string;
  videoWatermark: string;
  videoHd?: string;
  audio: string;
  images?: string[];
};

export type TikTokResult = TikTokSuccess | { ok: false; error: string };

function friendlyMessage(raw?: string): string {
  if (!raw) return "We couldn't process this TikTok. Please try a different link.";
  const m = raw.toLowerCase();
  if (m.includes("url") || m.includes("invalid")) {
    return "The TikTok link looks invalid or the video is private/region-locked. Try another public video.";
  }
  if (m.includes("limit") || m.includes("rate")) {
    return "Too many downloads right now. Wait a few seconds and try again.";
  }
  if (m.includes("not found") || m.includes("404")) {
    return "We couldn't find this TikTok. It may have been deleted or set to private.";
  }
  return "We couldn't fetch this TikTok. It may be private, deleted, or region-locked.";
}

const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15";

// Multiple upstream mirrors. We rotate through them and retry on rate-limits
// so the user request never fails purely because one host is throttling.
const TIKWM_HOSTS = [
  "https://www.tikwm.com",
  "https://tikwm.com",
  "https://api.tikwm.com",
];

const SLB_FALLBACK_ENDPOINT = "https://tdownv4.sl-bjs.workers.dev/";
const SANKA_FALLBACK_ENDPOINT = "https://www.sankavollerei.com/download/tiktok";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isRateLimited(msg?: string) {
  if (!msg) return false;
  const m = msg.toLowerCase();
  return (
    m.includes("limit") ||
    m.includes("rate") ||
    m.includes("too many") ||
    m.includes("free api")
  );
}

async function callTikwm(
  path: "/api/" | "/api/music/info",
  body: URLSearchParams,
): Promise<{ code: number; msg?: string; data?: any } | null> {
  // Try each mirror once first. If a mirror is protected by a web challenge,
  // move on quickly instead of making the user wait through doomed retries.
  const maxAttempts = TIKWM_HOSTS.length;
  let lastJson: { code: number; msg?: string; data?: any } | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const host = TIKWM_HOSTS[attempt % TIKWM_HOSTS.length];
    try {
      const res = await fetch(host + path, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": UA,
        },
        body: body.toString(),
      });

      if (!res.ok) {
        if (res.status === 403 || res.status === 401) continue;
        // 429 or 5xx — back off and try next mirror.
        await sleep(400 + attempt * 350);
        continue;
      }

      const json = (await res.json()) as { code: number; msg?: string; data?: any };
      lastJson = json;

      if (json.code === 0 && json.data) return json;

      if (isRateLimited(json.msg)) {
        // Wait longer the more we've retried (tikwm free tier is ~1 req/sec).
        await sleep(700 + attempt * 500);
        continue;
      }

      // Real error (invalid url, private, etc.) — no point retrying.
      return json;
    } catch {
      await sleep(500 + attempt * 400);
    }
  }
  return lastJson;
}

async function callSlbFallback(url: string): Promise<TikTokSuccess | null> {
  try {
    const res = await fetch(`${SLB_FALLBACK_ENDPOINT}?down=${encodeURIComponent(url)}`, {
      headers: {
        accept: "application/json,text/plain,*/*",
        "user-agent": UA,
      },
    });

    if (!res.ok) return null;
    const data = (await res.json()) as {
      title?: string;
      content_type?: string;
      download_url?: string;
      author?: {
        username?: string;
        nickname?: string;
        avatar?: string;
        duration?: number;
        audio_url?: string;
      };
    };

    if (!data.download_url && !data.author?.audio_url) return null;

    return {
      ok: true,
      title: (data.title ?? "TikTok video").trim() || "TikTok video",
      author: data.author?.nickname ?? data.author?.username ?? "TikTok",
      cover: data.author?.avatar ?? "",
      duration: data.author?.duration ?? 0,
      videoNoWatermark: data.download_url ?? "",
      videoWatermark: "",
      audio: data.author?.audio_url ?? "",
    };
  } catch {
    return null;
  }
}

async function callSankaFallback(url: string): Promise<TikTokSuccess | null> {
  try {
    const params = new URLSearchParams({ apikey: "planaai", url });
    const res = await fetch(`${SANKA_FALLBACK_ENDPOINT}?${params.toString()}`, {
      headers: {
        accept: "application/json,text/plain,*/*",
        "user-agent": UA,
      },
    });

    if (!res.ok) return null;
    const json = (await res.json()) as {
      status?: boolean;
      result?: {
        title?: string;
        cover?: string;
        play?: string;
        wmplay?: string;
        hdplay?: string;
        music?: string;
        duration?: number;
        images?: unknown[];
        author?: { nickname?: string; unique_id?: string; username?: string };
        music_info?: { play?: string; duration?: number };
      };
    };
    const d = json.result;
    if (!json.status || !d) return null;

    const images = Array.isArray(d.images)
      ? d.images.filter((item): item is string => typeof item === "string")
      : undefined;
    const videoNoWatermark = d.hdplay || d.play || d.wmplay || "";
    const audio = d.music || d.music_info?.play || "";
    if (!videoNoWatermark && !audio && !images?.length) return null;

    return {
      ok: true,
      title: (d.title ?? "TikTok video").trim() || "TikTok video",
      author: d.author?.nickname ?? d.author?.unique_id ?? d.author?.username ?? "TikTok",
      cover: d.cover ?? "",
      duration: d.duration ?? d.music_info?.duration ?? 0,
      videoNoWatermark,
      videoWatermark: d.wmplay ?? "",
      videoHd: d.hdplay,
      audio,
      images,
    };
  } catch {
    return null;
  }
}

async function callFallbackProviders(url: string): Promise<TikTokSuccess | null> {
  return (await callSankaFallback(url)) ?? (await callSlbFallback(url));
}

export const fetchTikTok = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<TikTokResult> => {
    try {
      const isMusicUrl = /tiktok\.com\/music\//i.test(data.url);

      if (isMusicUrl) {
        const mj = await callTikwm(
          "/api/music/info",
          new URLSearchParams({ url: data.url }),
        );
        if (mj?.code === 0 && mj.data?.play) {
          const md = mj.data;
          return {
            ok: true,
            title: (md.title ?? "TikTok audio").trim() || "TikTok audio",
            author: md.author ?? "TikTok",
            cover: md.cover ?? "",
            duration: md.duration ?? 0,
            videoNoWatermark: "",
            videoWatermark: "",
            audio: md.play,
          };
        }
        // Fall through to generic endpoint as a last resort.
      }

      const json = await callTikwm(
        "/api/",
        new URLSearchParams({ url: data.url, hd: "1" }),
      );

      if (!json) {
        const fallback = await callFallbackProviders(data.url);
        if (fallback) return fallback;
        return { ok: false, error: "High demand right now — keep this page open and retry; StashTik will keep trying for you." };
      }

      if (json.code !== 0 || !json.data) {
        const fallback = await callFallbackProviders(data.url);
        if (fallback) return fallback;
        return { ok: false, error: friendlyMessage(json.msg) };
      }

      const d = json.data as {
        title?: string;
        cover?: string;
        duration?: number;
        play?: string;
        wmplay?: string;
        hdplay?: string;
        music?: string;
        images?: string[];
        author?: { nickname?: string; unique_id?: string };
      };
      const hasMedia = !!(d.play || d.hdplay || d.wmplay || d.music || (d.images && d.images.length));
      if (!hasMedia) {
        return {
          ok: false,
          error:
            "This TikTok doesn't contain downloadable media (it may be a live or unsupported format).",
        };
      }

      const noWatermark = d.play || d.hdplay || d.wmplay || "";
      return {
        ok: true,
        title: (d.title ?? "TikTok video").trim() || "TikTok video",
        author: d.author?.nickname ?? d.author?.unique_id ?? "Unknown",
        cover: d.cover ?? "",
        duration: d.duration ?? 0,
        videoNoWatermark: noWatermark,
        videoWatermark: d.wmplay ?? "",
        videoHd: d.hdplay,
        audio: d.music ?? "",
        images: d.images,
      };
    } catch (err) {
      console.error("TikTok fetch failed", err);
      return {
        ok: false,
        error: "Network hiccup while contacting TikTok. Check your connection and try again.",
      };
    }
  });
