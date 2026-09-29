export const NAVARATRI_BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

export function navaratriAsset(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (NAVARATRI_BASE_URL && clean.startsWith(NAVARATRI_BASE_URL)) {
    return clean;
  }
  return `${NAVARATRI_BASE_URL}${clean}`;
}
