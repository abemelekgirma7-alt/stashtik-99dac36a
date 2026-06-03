import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Please paste a TikTok link")
    .max(500)
    .refine(
      (u) => /^https?:\/\/((www|vt|vm|m)\.)?tiktok\.com\//i.test(u),
      "Must be a valid TikTok URL (tiktok.com)",
    ),
});

export type TikTokResult = {
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
} | { ok: false; error: string };

/**
 * Fetches TikTok media via the public TikWM endpoint (same source used by most
 * SSSTik/SnapTik clones). Returns no-watermark MP4, HD variant when available,
 * MP3 audio, and image slideshow URLs for photo posts and stories.
 */
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
        return { ok: false, error: `Upstream error ${res.status}` };
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
        return { ok: false, error: json.msg || "Could not fetch this TikTok" };
      }

      const d = json.data;
      return {
        ok: true,
        title: d.title ?? "TikTok video",
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
      return { ok: false, error: "Network error. Please try again." };
    }
  });
