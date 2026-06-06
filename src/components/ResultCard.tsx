import { useState } from "react";
import {
  Loader2,
  Music,
  Image as ImageIcon,
  Video,
  RotateCcw,
  Sparkles,
  PlayCircle,
  Package,
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
  return `StashTik - ${clean}.${ext}`;
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
        {!hasImages && mode !== "mp3" && result.videoNoWatermark ? (
          <div className="mx-auto sm:mx-0">
            <video
              src={result.videoNoWatermark}
              poster={result.cover}
              controls
              playsInline
              preload="metadata"
              className="aspect-[9/16] w-40 rounded-xl bg-black object-cover sm:w-[200px] md:w-[240px]"
            />
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
