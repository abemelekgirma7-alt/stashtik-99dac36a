export interface RecentItem {
  id: string;
  filename: string;
  url: string;
  size: number;
  date: number;
  hasBlob: boolean;
  contentType?: string;
}

const META_KEY = "stashtik:recent";
const DB_NAME = "stashtik";
const STORE = "blobs";
const MAX_ITEMS = 15;
const MAX_BLOB_ITEMS = 6;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putBlob(id: string, blob: Blob): Promise<boolean> {
  try {
    const db = await openDb();
    return await new Promise<boolean>((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(blob, id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
    });
  } catch {
    return false;
  }
}

export async function getBlob(id: string): Promise<Blob | null> {
  try {
    const db = await openDb();
    return await new Promise<Blob | null>((resolve) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(id);
      req.onsuccess = () => resolve((req.result as Blob | undefined) ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function deleteBlob(id: string): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    /* ignore */
  }
}

export function loadRecent(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as RecentItem[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveRecent(items: RecentItem[]) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("stashtik:recent"));
  } catch {
    /* ignore quota */
  }
}

export async function addRecent(item: RecentItem, blob?: Blob) {
  let stored = false;
  if (blob) {
    const currentWithBlob = loadRecent().filter((x) => x.hasBlob);
    // evict oldest blobs over the cap
    while (currentWithBlob.length >= MAX_BLOB_ITEMS) {
      const victim = currentWithBlob.pop()!;
      await deleteBlob(victim.id);
      victim.hasBlob = false;
    }
    stored = await putBlob(item.id, blob);
  }
  item.hasBlob = stored;
  const next = [item, ...loadRecent().filter((x) => x.id !== item.id)].slice(0, MAX_ITEMS);
  saveRecent(next);
}

export async function removeRecent(id: string) {
  const next = loadRecent().filter((x) => x.id !== id);
  saveRecent(next);
  await deleteBlob(id);
}

export async function clearRecent() {
  const all = loadRecent();
  saveRecent([]);
  await Promise.all(all.map((x) => deleteBlob(x.id)));
}

export function formatBytes(n: number): string {
  if (!n || !Number.isFinite(n)) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function saveBlobToDevice(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}