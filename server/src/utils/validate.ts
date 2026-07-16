const MAX_URL_LENGTH = 2048;
const MAX_EXPIRY_MS = 10 * 365 * 24 * 60 * 60 * 1000;

export function validateUrl(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_URL_LENGTH) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (url.hostname.length === 0) return null;
  return url.toString();
}

export function validateExpiresAt(input: unknown): number | null | undefined {
  if (input === null || input === undefined) return null;
  if (typeof input !== 'number' || !Number.isFinite(input)) return undefined;
  const now = Date.now();
  if (input <= now || input > now + MAX_EXPIRY_MS) return undefined;
  return Math.floor(input);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
