import { useEffect, useRef, useState } from "react";

export default function useJobsOverTime(apiBase) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const stop = useRef(false);

  useEffect(() => {
    let retry = 0;
    const maxRetries = 6;   // ~30s
    const delayMs = 5000;

    const fetchOnce = async () => {
      try {
        const res = await fetch(`${apiBase}/jobs-over-time?ts=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (Array.isArray(json) && json.length === 0 && retry < maxRetries) {
          retry++;
          setTimeout(fetchOnce, delayMs);
          return;
        }
        setData(json);
        setLoading(false);
      } catch (e) {
        if (retry < maxRetries) {
          retry++;
          setTimeout(fetchOnce, delayMs);
        } else {
          setErr(e);
          setLoading(false);
        }
      }
    };

    fetchOnce();


    const revalidate = () => {
      if (stop.current) return;
      fetch(`${apiBase}/jobs-over-time?ts=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      })
        .then(r => (r.ok ? r.json() : Promise.reject()))
        .then(j => { setData(j); setErr(null); })
        .catch(() => {});
    };
    window.addEventListener("focus", revalidate);
    document.addEventListener("visibilitychange", revalidate);

    return () => {
      stop.current = true;
      window.removeEventListener("focus", revalidate);
      document.removeEventListener("visibilitychange", revalidate);
    };
  }, [apiBase]);

  return { data, loading, err };
}
