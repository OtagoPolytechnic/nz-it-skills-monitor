import { useEffect, useRef, useState } from "react";

export default function useSalaryBuckets(apiBase) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const stop = useRef(false);

  useEffect(() => {
    const fetchOnce = async () => {
      try {
        const res = await fetch(`${apiBase}/salary-distribution?ts=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
        setLoading(false);
      } catch (e) {
        if (!stop.current) {
          setErr(e);
          setLoading(false);
        }
      }
    };
    fetchOnce();
    return () => { stop.current = true; };
  }, [apiBase]);

  return { data, loading, err };
}
