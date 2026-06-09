import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Music,
  Image as ImageIcon,
  Video,
  RotateCcw,
  Sparkles,
  PlayCircle,
  Package,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  X,
  Pause,
  Play,
  CheckCircle2,
  WifiOff,
} from "lucide-react";
import JSZip from "jszip";
import type { TikTokSuccess } from "@/lib/tiktok.functions";
import { useDownload, preflightSize } from "@/lib/use-download";
import { formatBytes } from "@/lib/downloads";

export type Mode = "video" | "mp3" | "stories" | "photos";

export function makeFilename(title: string, ext: string) {
  const clean =
    (title || "")
      // strip emojis / pictographs / symbols that confuse downloads on iOS
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, "")
      // strip filesystem-illegal characters
      .replace(/[\\/:*?"<>|\n\r\t]/g, " ")
      // strip control chars
      .replace(/[\x00-\x1F\x7F]/g, "")
      // collapse whitespace
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80) || "tiktok";
  return `StashTik-(${clean}).${ext}`;
}

export function proxiedDownloadUrl(url: string, filename: string) {
  const params = new URLSearchParams({ url, filename });
  return `/api/download?${params.toString()}`;
}

const downloadedNames = new Set<string>();
export function uniqueFilename(name: string) {
  if (!downloadedNames.has(name)) {
    downloadedNames.add(name);
    return name;
  }
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  let i = 1;
  while (downloadedNames.has(`${base} ${i}${ext}`)) i++;
  const fresh = `${base} ${i}${ext}`;
  downloadedNames.add(fresh);
  return fresh;
}

export function ResultCard({
  result,
  mode,
  onReset,
}: {
  result: TikTokSuccess;
  mode: Mode;
  onReset?: () => void;
}) {
  const hasImages = result.images && result.images.length > 0;
  const [zipping, setZipping] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const images = result.images ?? [];
  const currentImg = images[imgIdx];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hdStatus, setHdStatus] = useState<string | null>(null);

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
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft animate-fade-up">
      <div className="grid gap-4 p-3 sm:grid-cols-[200px_1fr] sm:gap-5 sm:p-5 md:grid-cols-[240px_1fr]">
        {hasImages ? (
          <div className="relative mx-auto sm:mx-0">
            <img
              src={currentImg}
              alt={`${result.title} — ${imgIdx + 1}`}
              className="aspect-[9/14] w-40 rounded-xl object-cover sm:w-[200px] md:w-[240px]"
              loading="lazy"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                  aria-label="Previous image"
                  className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                  aria-label="Next image"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {imgIdx + 1} / {images.length}
                </span>
              </>
            )}
          </div>
        ) : mode !== "mp3" && result.videoNoWatermark ? (
          <div className="mx-auto sm:mx-0">
            <video
              ref={videoRef}
              src={result.videoNoWatermark}
              poster={result.cover}
              controls
              controlsList="nodownload"
              playsInline
              preload="metadata"
              className="aspect-[9/16] w-40 rounded-xl bg-black object-contain sm:w-[200px] md:w-[240px]"
            />
            <p className="mt-1 text-center text-[10px] text-muted-foreground">
              Fullscreen &amp; Picture-in-Picture are in the player ⋯ menu
            </p>
          </div>
        ) : (
          result.cover && (
            <div className="relative mx-auto sm:mx-0">
              <img
                src={result.cover}
                alt={result.title}
                className="aspect-[9/14] w-24 rounded-xl object-cover sm:w-[200px] md:w-[240px]"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                <PlayCircle className="h-8 w-8 text-white" />
              </span>
            </div>
          )
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
                label="Download MP3 (Audio only)"
                icon={<Music className="h-3.5 w-3.5" />}
                primary
                fullWidth
              />
            ) : (
              <>
                {(result.videoHd || result.videoNoWatermark) && (
                  <DownloadBtn
                    url={result.videoHd || result.videoNoWatermark}
                    filename={makeFilename(`${result.title}-HD`, "mp4")}
                    label="Download HD Video (No Watermark)"
                    icon={<Sparkles className="h-3.5 w-3.5" />}
                    primary
                    fullWidth
                    hdNote
                    
                  />
                )}
                <DownloadBtn
                  url={result.videoNoWatermark}
                  filename={makeFilename(`${result.title}-SD`, "mp4")}
                  label="Download SD Video (No Watermark) — Free"
                  icon={<Video className="h-3.5 w-3.5" />}
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

          {hdStatus && (
            <p className="mt-2 text-[11px] text-muted-foreground">{hdStatus}</p>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Download another
            </button>
          )}
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
  if (!url) return null;
  const href = proxiedDownloadUrl(url, filename);
  const finalName = useRef(uniqueFilename(filename)).current;
  const { state, pct, received, total, error, start, cancel, resume } =
    useDownload(href, finalName);
  const [preSize, setPreSize] = useState<number | null>(null);

  // Preflight once on mount so the user sees an estimated file size before clicking.
  useEffect(() => {
    let alive = true;
    preflightSize(href).then((n) => {
      if (alive) setPreSize(n);
    });
    return () => {
      alive = false;
    };
  }, [href]);

  const base =
    "relative overflow-hidden inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100";
  const variant = primary
    ? "bg-brand-gradient text-white shadow-brand"
    : "border border-border bg-card hover:bg-secondary";

  const isWorking = state === "checking" || state === "downloading" || state === "paused";
  const sizeLabel = total > 0 ? formatBytes(total) : preSize ? formatBytes(preSize) : null;

  const handleClick = () => {
    if (state === "downloading" || state === "checking") return;
    if (state === "paused") {
      resume();
      return;
    }
    start();
  };

  let inner: React.ReactNode;
  if (state === "checking") {
    inner = (
      <>
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>Checking link…</span>
      </>
    );
  } else if (state === "downloading") {
    inner = (
      <>
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>
          Downloading {pct}% • {formatBytes(received)}
          {total ? ` / ${formatBytes(total)}` : ""}
        </span>
      </>
    );
  } else if (state === "paused") {
    inner = (
      <>
        <WifiOff className="h-3.5 w-3.5" />
        <span>
          Paused at {pct}% — tap to resume
        </span>
      </>
    );
  } else if (state === "done") {
    inner = (
      <>
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span>Saved • Download again</span>
      </>
    );
  } else if (state === "error") {
    inner = (
      <>
        <X className="h-3.5 w-3.5" />
        <span>{error || "Failed"} — Retry</span>
      </>
    );
  } else {
    inner = (
      <>
        {icon}
        <span>
          {label}
          {sizeLabel ? ` • ${sizeLabel}` : ""}
        </span>
        {hdNote && (
          <Megaphone className="h-3 w-3 opacity-90" aria-label="Contains an ad" />
        )}
      </>
    );
  }

  return (
    <div className={`flex items-stretch gap-1 ${fullWidth ? "w-full" : ""}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "checking" || state === "downloading"}
        className={`${base} ${variant} ${fullWidth ? "flex-1" : ""}`}
      >
        {/* progress fill */}
        {isWorking && (
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 bg-white/25"
            style={{ width: `${pct}%`, transition: "width 150ms linear" }}
          />
        )}
        <span className="relative z-10 inline-flex items-center gap-1.5">{inner}</span>
      </button>
      {(state === "downloading" || state === "paused" || state === "checking") && (
        <button
          type="button"
          onClick={cancel}
          aria-label="Cancel download"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-2 text-muted-foreground hover:bg-secondary"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
