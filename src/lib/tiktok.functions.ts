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

export const fetchTikTok = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<TikTokResult> => {
    try {
      const res = await fetch("https://www.tikwm.com/api/", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "user-agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        },
        body: new URLSearchParams({ url: data.url, hd: "1" }).toString(),
      });

      if (!res.ok) {
        return {
          ok: false,
          error: "Our downloader is having trouble reaching TikTok. Please try again in a moment.",
        };
      }

      const json = (await res.json()) as {
        code: number;
        msg?: string;
        data?: {
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
      };

      if (json.code !== 0 || !json.data) {
        return { ok: false, error: friendlyMessage(json.msg) };
      }

      const d = json.data;
      const hasMedia = !!(d.play || d.hdplay || d.wmplay || d.music || (d.images && d.images.length));
      if (!hasMedia) {
        return {
          ok: false,
          error: "This TikTok doesn't contain downloadable media (it may be a live or unsupported format).",
        };
      }

      return {
        ok: true,
        title: (d.title ?? "TikTok video").trim() || "TikTok video",
        author: d.author?.nickname ?? d.author?.unique_id ?? "Unknown",
        cover: d.cover ?? "",
        duration: d.duration ?? 0,
        videoNoWatermark: d.play ?? "",
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
