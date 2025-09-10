// src/utils/fetchWithTimeout.js
export async function fetchWithTimeout(
    url,
    {
      timeout = 20000,     // 20s default
      retries = 1,         // one retry on timeout
      backoff = 1.5,
      signal: outerSignal, // optional caller-provided abort (e.g., unmount)
      ...options
    } = {}
  ) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
  
    // Combine outer signal (from useEffect cleanup) with our internal one
    const signals = [controller.signal].concat(outerSignal ? [outerSignal] : []);
    const combinedSignal = signals.length === 1
      ? signals[0]
      : AbortSignal.any(signals); // modern browsers support this
  
    try {
      const res = await fetch(url, { ...options, signal: combinedSignal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      // If the component unmounted, just bubble a tagged error so callers can ignore if desired
      if (outerSignal?.aborted) {
        const e = new Error('aborted:unmount');
        e.code = 'ABORT_UNMOUNT';
        throw e;
      }
      // Timeout -> optional retry with backoff
      if (err.name === 'AbortError') {
        if (retries > 0) {
          return fetchWithTimeout(url, {
            ...options,
            timeout: Math.ceil(timeout * backoff),
            retries: retries - 1,
            backoff,
            signal: outerSignal,
          });
        }
        const e = new Error('aborted:timeout');
        e.code = 'ABORT_TIMEOUT';
        throw e;
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
  