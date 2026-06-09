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
  Maximize2,
  PictureInPicture2,
} from "lucide-react";
import JSZip from "jszip";
import type { TikTokSuccess } from "@/lib/tiktok.functions";

export type Mode = "video" | "mp3" | "stories" | "photos";

export function makeFilename(title: string, ext: string) {
  const clean =
    title
      .replace(/[\\/:*?"<>|\n\r]/g, " ")
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
    window.open(url, "_blank", "noopener");
    return false;
  }
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
  const [adOpen, setAdOpen] = useState(false);
  const [adSeconds, setAdSeconds] = useState(5);
  const pendingHd = useRef<null | { url: string; filename: string }>(null);

  useEffect(() => {
    if (!adOpen) return;
    setAdSeconds(5);
    const t = setInterval(() => {
      setAdSeconds((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [adOpen]);

  const handleFullscreen = async () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      const anyEl = el as HTMLVideoElement & {
        webkitEnterFullscreen?: () => void;
        webkitRequestFullscreen?: () => Promise<void>;
      };
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (anyEl.webkitRequestFullscreen) {
        await anyEl.webkitRequestFullscreen();
      } else if (anyEl.webkitEnterFullscreen) {
        anyEl.webkitEnterFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen failed", err);
    }
  };

  const handlePiP = async () => {
    const el = videoRef.current as
      | (HTMLVideoElement & { requestPictureInPicture?: () => Promise<PictureInPictureWindow> })
      | null;
    if (!el) return;
    try {
      const d = document as Document & {
        pictureInPictureElement?: Element | null;
        exitPictureInPicture?: () => Promise<void>;
      };
      if (d.pictureInPictureElement) {
        await d.exitPictureInPicture?.();
      } else if (el.requestPictureInPicture) {
        await el.requestPictureInPicture();
      }
    } catch (err) {
      console.error("PiP failed", err);
    }
  };

  const requestHdWithAd = (url: string, filename: string) => {
    pendingHd.current = { url, filename };
    setAdOpen(true);
  };

  const finishHdDownload = async () => {
    const p = pendingHd.current;
    setAdOpen(false);
    if (!p) return;
    await triggerDownload(proxiedDownloadUrl(p.url, p.filename), p.filename);
    pendingHd.current = null;
  };

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
              className="aspect-[9/16] w-40 rounded-xl bg-black object-cover sm:w-[200px] md:w-[240px]"
            />
            <div className="mt-1.5 flex justify-center gap-1.5">
              <button
                type="button"
                onClick={handleFullscreen}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10px] font-semibold hover:bg-secondary"
              >
                <Maximize2 className="h-3 w-3" /> Fullscreen
              </button>
              <button
                type="button"
                onClick={handlePiP}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10px] font-semibold hover:bg-secondary"
              >
                <PictureInPicture2 className="h-3 w-3" /> Picture-in-Picture
              </button>
            </div>
            <p className="mt-1 text-center text-[10px] text-muted-foreground">Preview without watermark</p>
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
                    label="Download HD — No Watermark"
                    icon={<Sparkles className="h-3.5 w-3.5" />}
                    primary
                    fullWidth
                    hdNote
                    onAdRequest={requestHdWithAd}
                  />
                )}
                <DownloadBtn
                  url={result.videoNoWatermark}
                  filename={makeFilename(`${result.title}-SD`, "mp4")}
                  label={result.videoHd ? "Download SD — No Watermark (Free)" : "Download Video (No Watermark)"}
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

      {adOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-center shadow-soft">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-white">
              <PlayCircle className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-base font-semibold">Watch a short ad to unlock HD</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              HD downloads are supported by a quick sponsor message. Thanks for keeping StashTik free!
            </p>
            <div className="mt-4 flex aspect-video items-center justify-center rounded-lg bg-black text-xs text-white/70">
              Sponsored — your ad plays here
            </div>
            <button
              type="button"
              disabled={adSeconds > 0}
              onClick={finishHdDownload}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-gradient px-3 py-2 text-xs font-semibold text-white shadow-brand disabled:opacity-60"
            >
              {adSeconds > 0 ? `Skip in ${adSeconds}s` : "Continue HD download"}
            </button>
            <button
              type="button"
              onClick={() => {
                pendingHd.current = null;
                setAdOpen(false);
              }}
              className="mt-2 w-full text-[11px] text-muted-foreground underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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
  onAdRequest,
}: {
  url: string;
  filename: string;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
  fullWidth?: boolean;
  hdNote?: boolean;
  onAdRequest?: (url: string, filename: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  if (!url) return null;
  const href = proxiedDownloadUrl(url, filename);
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAdRequest) {
      onAdRequest(url, filename);
      return;
    }
    setBusy(true);
    try {
      await triggerDownload(href, filename);
    } finally {
      setBusy(false);
    }
  };
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-transform hover:scale-[1.01] active:scale-[0.99]";
  const variant = primary
    ? "bg-brand-gradient text-white shadow-brand"
    : "border border-border bg-card hover:bg-secondary";
  return (
    <a href={href} onClick={handleClick} className={`${base} ${variant} ${fullWidth ? "w-full" : ""}`}>
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
