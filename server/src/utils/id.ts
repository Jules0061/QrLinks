import { randomBytes } from 'node:crypto';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateId(length = 8): string {
  const out: string[] = [];
  const limit = 256 - (256 % ALPHABET.length);
  while (out.length < length) {
    for (const byte of randomBytes(length)) {
      if (byte < limit) {
        out.push(ALPHABET[byte % ALPHABET.length]);
        if (out.length === length) break;
      }
    }
  }
  return out.join('');
}

export function isValidId(id: unknown): id is string {
  return typeof id === 'string' && /^[A-Za-z0-9]{4,32}$/.test(id);
}
