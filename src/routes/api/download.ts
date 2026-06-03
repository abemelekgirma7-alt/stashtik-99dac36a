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
      GET: async ({ request }) => {
        const u = new URL(request.url);
        const target = u.searchParams.get("url");
        const filenameRaw = u.searchParams.get("filename") || "tiktok";

        if (!target) {
          return new Response("Missing url", { status: 400 });
        }

        // Only allow common TikTok media CDNs to prevent open-proxy abuse.
        let allowed = false;
        try {
          const t = new URL(target);
          allowed = /(tiktok|tiktokcdn|tikwm|byteoversea|bytedance|musical)\./i.test(t.hostname);
        } catch {
          return new Response("Bad url", { status: 400 });
        }
        if (!allowed) return new Response("Host not allowed", { status: 400 });

        const upstream = await fetch(target, {
          headers: {
            "user-agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
            referer: "https://www.tiktok.com/",
          },
        });

        if (!upstream.ok || !upstream.body) {
          return new Response("Upstream error", { status: 502 });
        }

        // Sanitize filename — strip path separators and quotes.
        const safeName = filenameRaw
          .replace(/[\\/:*?"<>|\n\r]/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 120) || "tiktok";

        const contentType = upstream.headers.get("content-type") || "application/octet-stream";
        const contentLength = upstream.headers.get("content-length");

        const headers = new Headers({
          "content-type": contentType,
          "content-disposition": `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`,
          "cache-control": "no-store",
        });
        if (contentLength) headers.set("content-length", contentLength);

        return new Response(upstream.body, { status: 200, headers });
      },
    },
  },
});
