// src/utils/labels.js
export const truncateLabel = (s = "", max = 22) =>
    s.length > max ? `${s.slice(0, max)}…` : s;
  
  // A simple width heuristic based on the longest label
  export const yAxisWidthFromData = (data = [], key = "skill") => {
    const longest = data.reduce((m, d) => Math.max(m, String(d?.[key] ?? "").length), 0);
    // clamp between 120 and 260 px; ~7px per char works well for 12px font
    return Math.max(120, Math.min(260, Math.ceil(longest * 7)));
  };
  