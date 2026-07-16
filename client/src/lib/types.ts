export interface QrData {
  id: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: number;
  expiresAt: number | null;
  oneTime: boolean;
  used: boolean;
  scanCount: number;
  lastScanAt: number | null;
}

export type ExpiryPreset =
  | 'never'
  | '1m'
  | '10m'
  | '1h'
  | '24h'
  | '7d'
  | 'custom';

export const EXPIRY_PRESETS: { value: ExpiryPreset; label: string; ms: number | null }[] = [
  { value: 'never', label: 'Never expire', ms: null },
  { value: '1m', label: '1 minute', ms: 60_000 },
  { value: '10m', label: '10 minutes', ms: 600_000 },
  { value: '1h', label: '1 hour', ms: 3_600_000 },
  { value: '24h', label: '24 hours', ms: 86_400_000 },
  { value: '7d', label: '7 days', ms: 604_800_000 },
  { value: 'custom', label: 'Custom date & time', ms: null },
];
