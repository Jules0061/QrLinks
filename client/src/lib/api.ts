import type { QrData } from './types';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export function createQr(input: {
  url: string;
  oneTime: boolean;
  expiresAt: number | null;
}): Promise<QrData> {
  return fetch('/api/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }).then((res) => handle<QrData>(res));
}

export function getQr(id: string): Promise<QrData> {
  return fetch(`/api/qr/${id}`).then((res) => handle<QrData>(res));
}

export function deleteQr(id: string): Promise<void> {
  return fetch(`/api/qr/${id}`, { method: 'DELETE' }).then((res) => handle<void>(res));
}

export function qrImageUrl(id: string, format: 'png' | 'svg', download = false): string {
  return `/api/qr/${id}/image?format=${format}${download ? '&download=1' : ''}`;
}
