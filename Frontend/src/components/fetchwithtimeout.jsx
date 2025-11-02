// src/utils/fetchWithTimeout.js
export async function fetchWithTimeout(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}
