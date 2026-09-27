/** Supports Cloudinary/Firebase URLs and the copied legacy image catalogue. */
export function assetUrl(path?: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  return `/media/${path.replace(/^\/+/, '')}`;
}
