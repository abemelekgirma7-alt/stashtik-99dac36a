import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ClipboardPaste,
  Download,
  Loader2,
  Music,
  Image as ImageIcon,
  Video,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { fetchTikTok, type TikTokSuccess } from "@/lib/tiktok.functions";

type Mode = "video" | "mp3" | "stories";

const TIKTOK_RE = /^https?:\/\/((www|vt|vm|m|t)\.)?tiktok\.com\/[^\s]+$/i;

function makeFilename(title: string, ext: string) {
  const clean =
    title
      .replace(/[\\/:*?"<>|\n\r]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80) || "tiktok";
  return `${clean}.${ext}`;
}

function proxiedDownloadUrl(url: string, filename: string) {
  const params = new URLSearchParams({ url, filename });
  return `/api/download?${params.toString()}`;
}

export function DownloaderForm({
  mode = "video",
  ctaLabel,
  placeholder = "Paste TikTok link here…",
}: {
  mode?: Mode;
  ctaLabel?: string;
  placeholder?: string;
}) {
  const fetchFn = useServerFn(fetchTikTok);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TikTokSuccess | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSubmittedRef = useRef<string>("");

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

  const reset = () => {
    setUrl("");
    setError(null);
    setResult(null);
    setProgress(0);
    setStatus("");
    autoSubmittedRef.current = "";
  };

  const submit = async (linkValue: string) => {
    setError(null);
    setResult(null);
    setLoading(true);
    setStatus("Fetching TikTok…");
    startProgress();
    try {
      const res = await fetchFn({ data: { url: linkValue } });
      if (!res.ok) {
        setError(res.error);
      } else {
        setStatus("Ready!");
        setResult(res);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      // Strip Zod issue noise if it slipped through
      const clean = msg.includes("[")
        ? "That link doesn't look like a valid TikTok URL. Please paste a video link from tiktok.com."
        : msg;
      setError(clean);
    } finally {
      stopProgress();
      setProgress(100);
      setLoading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    submit(url);
  };

  // Auto-process as soon as a valid TikTok link is entered/pasted
  useEffect(() => {
    const trimmed = url.trim();
    if (!trimmed || loading || result) return;
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
    ctaLabel ?? (mode === "mp3" ? "Download MP3" : mode === "stories" ? "Get Story" : "Download Video");

  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-2.5 shadow-soft sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary/70 px-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholder}
            inputMode="url"
            autoComplete="off"
            className="h-11 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={onPaste}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-gradient px-2.5 py-1.5 text-xs font-semibold text-white shadow-brand transition-transform hover:scale-105"
          >
            <ClipboardPaste className="h-3.5 w-3.5" /> Paste
          </button>
        </div>
        <button
          type="submit"
          disabled={loading || !url}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-5 text-sm font-semibold text-white shadow-brand transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {loading ? "Processing…" : label}
        </button>
      </form>

      {(loading || progress > 0) && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
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
          <button
            type="button"
            onClick={reset}
            className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-destructive underline"
          >
            <RotateCcw className="h-3 w-3" /> Try again
          </button>
        </div>
      )}

      {result && <ResultCard result={result} mode={mode} onReset={reset} />}
    </div>
  );
}

function ResultCard({
  result,
  mode,
  onReset,
}: {
  result: TikTokSuccess;
  mode: Mode;
  onReset: () => void;
}) {
  const hasImages = result.images && result.images.length > 0;
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="grid gap-4 p-4 sm:grid-cols-[140px_1fr] sm:p-5">
        {result.cover && (
          <img
            src={result.cover}
            alt={result.title}
            className="aspect-[9/14] w-full max-w-[140px] rounded-xl object-cover"
            loading="lazy"
          />
        )}
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">@{result.author}</p>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold">{result.title}</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {hasImages ? (
              result.images!.map((src, i) => (
                <DownloadBtn
                  key={src}
                  url={src}
                  filename={makeFilename(`${result.title}-${i + 1}`, "jpg")}
                  label={`Image ${i + 1}`}
                  icon={<ImageIcon className="h-3.5 w-3.5" />}
                  primary={i === 0}
                />
              ))
            ) : mode === "mp3" ? (
              <DownloadBtn
                url={result.audio}
                filename={makeFilename(result.title, "mp3")}
                label="Download MP3"
                icon={<Music className="h-3.5 w-3.5" />}
                primary
              />
            ) : (
              <>
                <DownloadBtn
                  url={result.videoHd || result.videoNoWatermark}
                  filename={makeFilename(result.title, "mp4")}
                  label={result.videoHd ? "HD — No Watermark" : "No Watermark"}
                  icon={<Video className="h-3.5 w-3.5" />}
                  primary
                />
                {result.videoHd && (
                  <DownloadBtn
                    url={result.videoNoWatermark}
                    filename={makeFilename(`${result.title}-SD`, "mp4")}
                    label="SD — No Watermark"
                    icon={<Video className="h-3.5 w-3.5" />}
                  />
                )}
                <DownloadBtn
                  url={result.audio}
                  filename={makeFilename(result.title, "mp3")}
                  label="MP3 Audio"
                  icon={<Music className="h-3.5 w-3.5" />}
                />
              </>
            )}
          </div>

          {/* Ad slot placeholder — leave space for an ad to be added manually later */}
          <div
            data-ad-slot="result-inline"
            className="mt-4 flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground"
          >
            Ad space
          </div>

          <button
            type="button"
            onClick={onReset}
            className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Download another
          </button>
        </div>
      </div>
    </div>
  );
}

function DownloadBtn({
  url,
  filename,
  label,
  icon,
  primary,
}: {
  url: string;
  filename: string;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
}) {
  if (!url) return null;
  const href = proxiedDownloadUrl(url, filename);
  return (
    <a
      href={href}
      download={filename}
      className={
        primary
          ? "inline-flex items-center gap-1.5 rounded-lg bg-brand-gradient px-3 py-1.5 text-xs font-semibold text-white shadow-brand"
          : "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-secondary"
      }
    >
      {icon}
      {label}
    </a>
  );
}
