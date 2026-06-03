import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ClipboardPaste, Download, Loader2, Music, Image as ImageIcon, Video } from "lucide-react";
import { fetchTikTok, type TikTokResult } from "@/lib/tiktok.functions";

type Mode = "video" | "mp3" | "stories";

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
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<TikTokResult, { ok: true }> | null>(null);

  const onPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
      /* ignored */
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetchFn({ data: { url } });
      if (!res.ok) setError(res.error);
      else setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const label =
    ctaLabel ?? (mode === "mp3" ? "Convert to MP3" : mode === "stories" ? "Get Story" : "Download Video");

  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft sm:flex-row sm:items-center sm:p-2"
      >
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary/60 px-4">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholder}
            inputMode="url"
            autoComplete="off"
            className="h-12 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={onPaste}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ClipboardPaste className="h-4 w-4" /> Paste
          </button>
        </div>
        <button
          type="submit"
          disabled={loading || !url}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 text-sm font-semibold text-white shadow-brand transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {loading ? "Processing…" : label}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && <ResultCard result={result} mode={mode} />}
    </div>
  );
}

function ResultCard({
  result,
  mode,
}: {
  result: Extract<TikTokResult, { ok: true }>;
  mode: Mode;
}) {
  const hasImages = result.images && result.images.length > 0;
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="grid gap-4 p-4 sm:grid-cols-[180px_1fr] sm:p-6">
        {result.cover && (
          <img
            src={result.cover}
            alt={result.title}
            className="aspect-[9/14] w-full max-w-[180px] rounded-xl object-cover"
            loading="lazy"
          />
        )}
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">@{result.author}</p>
          <h3 className="mt-1 line-clamp-3 text-base font-semibold">{result.title}</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {hasImages ? (
              result.images!.map((src, i) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
                >
                  <ImageIcon className="h-4 w-4" /> Image {i + 1}
                </a>
              ))
            ) : mode === "mp3" ? (
              <DownloadBtn href={result.audio} label="Download MP3" icon={<Music className="h-4 w-4" />} primary />
            ) : (
              <>
                <DownloadBtn
                  href={result.videoHd || result.videoNoWatermark}
                  label={result.videoHd ? "HD — No Watermark" : "No Watermark"}
                  icon={<Video className="h-4 w-4" />}
                  primary
                />
                {result.videoHd && (
                  <DownloadBtn href={result.videoNoWatermark} label="SD — No Watermark" icon={<Video className="h-4 w-4" />} />
                )}
                <DownloadBtn href={result.audio} label="MP3 Audio" icon={<Music className="h-4 w-4" />} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadBtn({
  href,
  label,
  icon,
  primary,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      download
      className={
        primary
          ? "inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-brand"
          : "inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
      }
    >
      {icon}
      {label}
    </a>
  );
}
