import { createFileRoute } from "@tanstack/react-router";

/**
 * Server-side proxy that streams a remote media URL back to the browser with a
 * forced Content-Disposition: attachment header. This guarantees the file is
 * saved to disk (instead of opening in a new tab) and lets us name it after
 * the original TikTok video title.
 *
 * Usage: /api/download?url=<encoded-media-url>&filename=<encoded-filename>
 */
export const Route = createFileRoute("/api/download")({
  server: {
    handlers: {
      HEAD: async ({ request }) => handle(request, "HEAD"),
      GET: async ({ request }) => handle(request, "GET"),
    },
  },
});

async function handle(request: Request, method: "GET" | "HEAD") {
        const u = new URL(request.url);
        const target = u.searchParams.get("url");
        const filenameRaw = u.searchParams.get("filename") || "tiktok";

        if (!target) {
          return new Response("Missing url", { status: 400 });
        }

        // Only allow common TikTok / ByteDance media CDNs to prevent open-proxy abuse.
        let allowed = false;
        try {
          const t = new URL(target);
          allowed =
            /(^|\.)(tiktok\.com|tiktokcdn\.com|tiktokcdn-us\.com|tiktokcdn-eu\.com|tikwm\.com|tikcdn\.io|tikcdn\.com|byteoversea\.com|byteoversea\.net|bytedance\.net|bytecdn\.cn|bytefcdn\.com|muscdn\.com|musical\.ly)$/i.test(
              t.hostname,
            ) || /(tiktok|tiktokcdn|tikwm|tikcdn|byteoversea|bytedance|bytefcdn|bytecdn|muscdn|musical)\./i.test(t.hostname);
        } catch {
          return new Response("Bad url", { status: 400 });
        }
        if (!allowed) {
          return new Response(`Host not allowed: ${(() => { try { return new URL(target).hostname; } catch { return "?"; } })()}`, {
            status: 400,
          });
        }

        const fwdHeaders: Record<string, string> = {
          "user-agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
          referer: "https://www.tiktok.com/",
        };
        const range = request.headers.get("range");
        if (range) fwdHeaders["range"] = range;

        const upstream = await fetch(target, { method, headers: fwdHeaders });

        if (!upstream.ok || !upstream.body) {
          if (method === "HEAD" && upstream.ok) {
            // HEAD with no body is fine.
          } else {
          return new Response("Upstream error", { status: 502 });
          }
        }

        // Sanitize filename — strip path separators and quotes.
        const safeName = filenameRaw
          .replace(/[\\/:*?"<>|\n\r]/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 120) || "tiktok";

        const contentType = upstream.headers.get("content-type") || "application/octet-stream";
        const contentLength = upstream.headers.get("content-length");
        const contentRange = upstream.headers.get("content-range");
        const acceptRanges = upstream.headers.get("accept-ranges") || "bytes";

        const headers = new Headers({
          "content-type": contentType,
          "content-disposition": `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`,
          "cache-control": "no-store",
          "accept-ranges": acceptRanges,
          // CORS — same-origin in app but helps when called from blob URLs / workers.
          "access-control-allow-origin": "*",
          "access-control-expose-headers": "content-length, content-range, accept-ranges",
        });
        if (contentLength) headers.set("content-length", contentLength);
        if (contentRange) headers.set("content-range", contentRange);

        const status = contentRange ? 206 : 200;
        return new Response(method === "HEAD" ? null : upstream.body, { status, headers });
}
