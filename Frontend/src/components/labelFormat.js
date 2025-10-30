export function truncateLabel(value, max = 30) {
  if (value == null) return "";
  const firstLine = String(value).split(/\r?\n/)[0].trim(); // cut at line break
  if (firstLine.length <= max) return firstLine;
  return firstLine.slice(0, max) + "…"; // cap length
}
