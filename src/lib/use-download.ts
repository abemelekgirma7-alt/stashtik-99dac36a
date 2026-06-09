import { useCallback, useEffect, useRef, useState } from "react";
import { addRecent, saveBlobToDevice } from "./downloads";

export type DlState =
  | "idle"
  | "checking"
  | "downloading"
  | "paused"
  | "done"
  | "error";

/**
 * Stream-download a file via JS so we can show real progress, cancel on
 * tab-close (beforeunload aborts the fetch), and auto-pause/resume when
 * the network drops by issuing a Range request from the last received byte.
 */
export function useDownload(url: string, filename: string) {
  const [state, setState] = useState<DlState>("idle");
  const [received, setReceived] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const ctrlRef = useRef<AbortController | null>(null);
  const chunksRef = useRef<Uint8Array[]>([]);
  const stateRef = useRef<DlState>("idle");
  const receivedRef = useRef(0);
  const totalRef = useRef(0);

  const setS = (s: DlState) => {
    stateRef.current = s;
    setState(s);
  };
  const setR = (n: number) => {
    receivedRef.current = n;
    setReceived(n);
  };
  const setT = (n: number) => {
    totalRef.current = n;
    setTotal(n);
  };

  // Cancel on tab close.
  useEffect(() => {
    const onUnload = () => ctrlRef.current?.abort();
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
    };
  }, []);

  const finish = useCallback(async () => {
    const blob = new Blob(chunksRef.current as BlobPart[]);
    chunksRef.current = [];
    saveBlobToDevice(blob, filename);
    await addRecent(
      {
        id: `${filename}-${Date.now()}`,
        filename,
        url,
        size: blob.size,
        date: Date.now(),
        hasBlob: false,
      },
      blob,
    );
    setS("done");
  }, [filename, url]);

  const runFetch = useCallback(
    async (fromByte: number) => {
      const ctrl = new AbortController();
      ctrlRef.current = ctrl;
      const headers: Record<string, string> = {};
      if (fromByte > 0) headers["Range"] = `bytes=${fromByte}-`;
      try {
        const res = await fetch(url, { headers, signal: ctrl.signal });
        if (res.status !== 200 && res.status !== 206) {
          throw new Error(`HTTP ${res.status}`);
        }
        // If we asked for a Range but the server ignored it (returned 200 with
        // the full body), restart from byte 0 so our progress counter stays
        // in sync with what we actually receive.
        if (fromByte > 0 && res.status === 200) {
          chunksRef.current = [];
          fromByte = 0;
          setR(0);
        }
        const cl = res.headers.get("content-length");
        const cr = res.headers.get("content-range");
        if (cr) {
          const m = /\/(\d+)\s*$/.exec(cr);
          if (m) setT(parseInt(m[1], 10));
        } else if (cl) {
          setT(fromByte + parseInt(cl, 10));
        }
        if (!res.body) throw new Error("Empty response");
        const reader = res.body.getReader();
        let got = fromByte;
        setR(got);
        setS("downloading");
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value && value.byteLength) {
            chunksRef.current.push(value);
            got += value.byteLength;
            setR(got);
          }
        }
        await finish();
      } catch (e) {
        const err = e as Error;
        if (err.name === "AbortError") {
          if (!navigator.onLine || stateRef.current === "paused") {
            setS("paused");
            return;
          }
          // user-initiated cancel
          chunksRef.current = [];
          setR(0);
          setT(0);
          setS("idle");
          return;
        }
        // Network failure (e.g. offline drop) — try to pause if we have bytes.
        if (!navigator.onLine && receivedRef.current > 0) {
          setS("paused");
          return;
        }
        setError(err.message || "Download failed");
        setS("error");
      }
    },
    [url, finish],
  );

  // Pause when the connection drops; resume when it comes back.
  useEffect(() => {
    const onOffline = () => {
      if (stateRef.current === "downloading") {
        setS("paused");
        ctrlRef.current?.abort();
      }
    };
    const onOnline = () => {
      if (stateRef.current === "paused") {
        runFetch(receivedRef.current);
      }
    };
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, [runFetch]);

  const start = useCallback(async () => {
    if (stateRef.current === "downloading" || stateRef.current === "checking") return;
    chunksRef.current = [];
    setR(0);
    setT(0);
    setError(null);
    setS("checking");
    // Preflight: HEAD to confirm reachability + size.
    try {
      const head = await fetch(url, { method: "HEAD" });
      if (head.ok) {
        const cl = head.headers.get("content-length");
        if (cl) setT(parseInt(cl, 10));
      }
    } catch {
      /* preflight failures are non-fatal; the GET will surface the real error */
    }
    await runFetch(0);
  }, [url, runFetch]);

  const cancel = useCallback(() => {
    if (ctrlRef.current) {
      // Force user-cancel path: clear paused flag so AbortError treats it as cancel.
      stateRef.current = "idle";
      ctrlRef.current.abort();
    }
    chunksRef.current = [];
    setR(0);
    setT(0);
    setS("idle");
  }, []);

  const resume = useCallback(() => {
    if (stateRef.current !== "paused") return;
    if (!navigator.onLine) return;
    runFetch(receivedRef.current);
  }, [runFetch]);

  const pct = total > 0 ? Math.min(100, Math.round((received / total) * 100)) : 0;

  return { state, received, total, pct, error, start, cancel, resume };
}

/** Lightweight HEAD preflight to grab content-length without starting a transfer. */
export async function preflightSize(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) return null;
    const cl = res.headers.get("content-length");
    return cl ? parseInt(cl, 10) : null;
  } catch {
    return null;
  }
}