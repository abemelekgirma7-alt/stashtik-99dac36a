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
  Sparkles,
  PlayCircle,
  Package,
} from "lucide-react";
import JSZip from "jszip";
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

// Track filenames downloaded this session to add (1), (2), (3)... suffixes
const downloadedNames = new Set<string>();
function uniqueFilename(name: string) {
  if (!downloadedNames.has(name)) {
    downloadedNames.add(name);
    return name;
  }
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  let i = 1;
  while (downloadedNames.has(`${base} (${i})${ext}`)) i++;
  const fresh = `${base} (${i})${ext}`;
  downloadedNames.add(fresh);
  return fresh;
}

async function triggerDownload(url: string, filename: string) {
  const finalName = uniqueFilename(filename);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = finalName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 5_000);
    return true;
  } catch (err) {
    console.error("Download failed", err);
    // Fallback: open in new tab
    window.open(url, "_blank", "noopener");
    return false;
  }
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
  const resultRef = useRef<HTMLDivElement>(null);

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
        // Scroll into view smoothly so users see the result card
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
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
        className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft sm:flex-row sm:items-center sm:gap-2.5 sm:p-2.5"
      >
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary/70 px-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholder}
            inputMode="url"
            autoComplete="off"
            className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:h-11 sm:text-[15px]"
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
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 sm:h-11 sm:px-5"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {loading ? "Processing…" : label}
        </button>
      </form>

      {/* Reserved blank space for a manually-inserted ad below the input */}
      <div data-ad-slot="below-input" className="mt-3 min-h-[80px] w-full" />

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

      {result && (
        <div ref={resultRef}>
          {/* Reserved blank ad space above the result card */}
          <div data-ad-slot="above-result" className="mx-auto mt-6 min-h-[90px] w-full" />
          <ResultCard result={result} mode={mode} onReset={reset} />
        </div>
      )}
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
  const [zipping, setZipping] = useState(false);

  const downloadAllAsZip = async () => {
    if (!result.images?.length) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      await Promise.all(
        result.images.map(async (src, i) => {
          const res = await fetch(proxiedDownloadUrl(src, makeFilename(`${result.title}-${i + 1}`, "jpg")));
          const buf = await res.arrayBuffer();
          zip.file(makeFilename(`${result.title}-${i + 1}`, "jpg"), buf);
        }),
      );
      const blob = await zip.generateAsync({ type: "blob" });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = uniqueFilename(makeFilename(result.title, "zip"));
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 5_000);
    } catch (err) {
      console.error("ZIP creation failed", err);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-soft animate-fade-up">
      <div className="grid gap-4 p-3 sm:grid-cols-[120px_1fr] sm:gap-5 sm:p-5 md:grid-cols-[140px_1fr]">
        {result.cover && (
          <div className="relative mx-auto sm:mx-0">
            <img
              src={result.cover}
              alt={result.title}
              className="aspect-[9/14] w-24 rounded-xl object-cover sm:w-[120px] md:w-[140px]"
              loading="lazy"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20 opacity-0 transition-opacity hover:opacity-100">
              <PlayCircle className="h-8 w-8 text-white" />
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">@{result.author}</p>
          <h3 className="mt-0.5 line-clamp-3 text-sm font-semibold sm:text-base">{result.title}</h3>
          <div className="mt-3 flex flex-col gap-1.5">
            {hasImages ? (
              <>
                <button
                  type="button"
                  onClick={downloadAllAsZip}
                  disabled={zipping}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-gradient px-3 py-2 text-xs font-semibold text-white shadow-brand disabled:opacity-60"
                >
                  {zipping ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Package className="h-3.5 w-3.5" />}
                  {zipping ? "Zipping…" : `Download all (${result.images!.length}) as ZIP`}
                </button>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {result.images!.map((src, i) => (
                    <DownloadBtn
                      key={src}
                      url={src}
                      filename={makeFilename(`${result.title}-${i + 1}`, "jpg")}
                      label={`Image ${i + 1}`}
                      icon={<ImageIcon className="h-3.5 w-3.5" />}
                    />
                  ))}
                </div>
              </>
            ) : mode === "mp3" ? (
              <DownloadBtn
                url={result.audio}
                filename={makeFilename(result.title, "mp3")}
                label="Download MP3"
                icon={<Music className="h-3.5 w-3.5" />}
                primary
                fullWidth
              />
            ) : (
              <>
                {result.videoHd && (
                  <DownloadBtn
                    url={result.videoHd}
                    filename={makeFilename(`${result.title}-HD`, "mp4")}
                    label="HD — No Watermark"
                    icon={<Sparkles className="h-3.5 w-3.5" />}
                    primary
                    fullWidth
                    hdNote
                  />
                )}
                  <DownloadBtn
                    url={result.videoNoWatermark}
                    filename={makeFilename(result.title, "mp4")}
                    label={result.videoHd ? "SD — No Watermark" : "Download Video (No Watermark)"}
                    icon={<Video className="h-3.5 w-3.5" />}
                    primary={!result.videoHd}
                    fullWidth
                  />
                <DownloadBtn
                  url={result.audio}
                  filename={makeFilename(result.title, "mp3")}
                  label="Download MP3 (Audio only)"
                  icon={<Music className="h-3.5 w-3.5" />}
                  fullWidth
                />
              </>
            )}
          </div>

          {/* Reserved blank ad space (insert ad manually) */}
          <div data-ad-slot="result-inline" className="mt-4 min-h-[80px] w-full" />

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
  fullWidth,
  hdNote,
}: {
  url: string;
  filename: string;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
  fullWidth?: boolean;
  hdNote?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  if (!url) return null;
  const href = proxiedDownloadUrl(url, filename);
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await triggerDownload(href, filename);
    } finally {
      setBusy(false);
    }
  };
  const base = "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-transform hover:scale-[1.01] active:scale-[0.99]";
  const variant = primary
    ? "bg-brand-gradient text-white shadow-brand"
    : "border border-border bg-card hover:bg-secondary";
  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${base} ${variant} ${fullWidth ? "w-full" : ""}`}
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : icon}
      <span>{busy ? "Preparing…" : label}</span>
      {hdNote && (
        <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-white/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
          <PlayCircle className="h-2.5 w-2.5" /> Watch ad
        </span>
      )}
    </a>
  );
}
