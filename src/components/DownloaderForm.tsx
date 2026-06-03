import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ClipboardPaste, Download, Loader2, CheckCircle2 } from "lucide-react";
import type { Mode } from "./ResultCard";

const TIKTOK_RE = /^https?:\/\/((www|vt|vm|m|t)\.)?tiktok\.com\/[^\s]+$/i;

export function DownloaderForm({
  mode = "video",
  ctaLabel,
  placeholder = "Paste TikTok link here…",
}: {
  mode?: Mode;
  ctaLabel?: string;
  placeholder?: string;
}) {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSubmittedRef = useRef<string>("");

  // Typing animation for the placeholder.
  useEffect(() => {
    if (url) return; // pause when user is typing
    const phrases =
      mode === "mp3"
        ? ["Paste TikTok audio link…", "https://vm.tiktok.com/…", "Paste any TikTok link for MP3…"]
        : mode === "stories"
          ? ["Paste TikTok story link…", "Story or slideshow URL…", "https://www.tiktok.com/@user/…"]
          : mode === "photos"
            ? ["Paste TikTok photo / slideshow link…", "https://www.tiktok.com/@user/photo/…"]
            : ["Paste TikTok video link here…", "https://vm.tiktok.com/…", "https://www.tiktok.com/@user/video/…"];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const current = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        setTypedPlaceholder(current.slice(0, charIdx));
        if (charIdx >= current.length) {
          setTimeout(() => {
            deleting = true;
            tick();
          }, 1400);
          return;
        }
      } else {
        charIdx--;
        setTypedPlaceholder(current.slice(0, charIdx));
        if (charIdx <= 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 70);
    };
    const t = setTimeout(tick, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [url, mode]);
  const stopProgress = () => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  };
  const startProgress = () => {
    setProgress(8);
    stopProgress();
    progressTimer.current = setInterval(() => {
      setProgress((p) => (p < 92 ? p + Math.max(1, (95 - p) / 12) : p));
    }, 180);
  };
  useEffect(() => () => stopProgress(), []);

  const submit = (linkValue: string) => {
    setError(null);
    if (!TIKTOK_RE.test(linkValue)) {
      setError("That doesn't look like a TikTok link. Paste a valid tiktok.com URL.");
      return;
    }
    setLoading(true);
    setStatus("Fetching TikTok…");
    startProgress();
    // Navigate to the result page where the actual processing happens.
    setTimeout(() => {
      navigate({ to: "/result", search: { u: linkValue, m: mode } as never });
    }, 250);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || loading) return;
    submit(url.trim());
  };

  useEffect(() => {
    const trimmed = url.trim();
    if (!trimmed || loading) return;
    if (!TIKTOK_RE.test(trimmed)) return;
    if (autoSubmittedRef.current === trimmed) return;
    autoSubmittedRef.current = trimmed;
    submit(trimmed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const onPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      /* ignored */
    }
  };

  const label =
    ctaLabel ??
    (mode === "mp3"
      ? "Download MP3"
      : mode === "stories"
        ? "Get Story"
        : mode === "photos"
          ? "Download Photos"
          : "Download Video");

  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft sm:flex-row sm:items-center sm:gap-2.5 sm:p-2.5"
      >
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary/70 px-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={url ? placeholder : (typedPlaceholder || placeholder) + "▍"}
            inputMode="url"
            autoComplete="off"
            disabled={loading}
            className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-60 sm:h-11 sm:text-[15px]"
          />
          <button
            type="button"
            onClick={onPaste}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-gradient px-2.5 py-1.5 text-xs font-semibold text-white shadow-brand transition-transform hover:scale-105 disabled:opacity-60"
          >
            <ClipboardPaste className="h-3.5 w-3.5" /> Paste
          </button>
        </div>
        <button
          type="submit"
          disabled={loading || !url}
          aria-busy={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:h-11 sm:px-5"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {loading ? "Processing…" : label}
        </button>
      </form>

      {(loading || progress > 0) && (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-brand-gradient transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {status && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              {progress >= 100 ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-foreground" />
              ) : (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {status}
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
