import { useEffect, useState } from "react";
import { Download, Trash2, History, HardDrive, Cloud } from "lucide-react";
import {
  formatBytes,
  getBlob,
  loadRecent,
  removeRecent,
  saveBlobToDevice,
  type RecentItem,
} from "@/lib/downloads";

export function RecentDownloads() {
  const [items, setItems] = useState<RecentItem[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setItems(loadRecent());
    refresh();
    window.addEventListener("stashtik:recent", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("stashtik:recent", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (items.length === 0) return null;

  const reDownload = async (item: RecentItem) => {
    setBusy(item.id);
    try {
      if (item.hasBlob) {
        const blob = await getBlob(item.id);
        if (blob) {
          saveBlobToDevice(blob, item.filename);
          return;
        }
      }
      // Fallback: re-trigger network download via the proxy.
      const a = document.createElement("a");
      a.href = item.url;
      a.download = item.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border bg-card p-4 shadow-soft">
      <header className="mb-3 flex items-center gap-2">
        <History className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Recent downloads</h2>
        <span className="text-xs text-muted-foreground">({items.length})</span>
      </header>
      <ul className="flex flex-col divide-y divide-border">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold" title={item.filename}>
                {item.filename}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                {item.hasBlob ? (
                  <>
                    <HardDrive className="h-3 w-3" />
                    <span>On device</span>
                  </>
                ) : (
                  <>
                    <Cloud className="h-3 w-3" />
                    <span>Re-fetch</span>
                  </>
                )}
                <span>•</span>
                <span>{formatBytes(item.size)}</span>
                <span>•</span>
                <span>{new Date(item.date).toLocaleString()}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => reDownload(item)}
              disabled={busy === item.id}
              className="inline-flex items-center gap-1 rounded-lg bg-brand-gradient px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-brand disabled:opacity-60"
            >
              <Download className="h-3 w-3" />
              {item.hasBlob ? "Save again" : "Re-download"}
            </button>
            <button
              type="button"
              onClick={() => removeRecent(item.id)}
              aria-label="Remove from recent"
              className="rounded-lg border border-border bg-card p-1.5 text-muted-foreground hover:bg-secondary"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}