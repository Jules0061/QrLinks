import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dataDir = path.resolve(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'qrlink.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS qr_codes (
    id            TEXT    PRIMARY KEY,
    original_url  TEXT    NOT NULL,
    created_at    INTEGER NOT NULL,
    expires_at    INTEGER,
    one_time      INTEGER NOT NULL DEFAULT 0,
    used          INTEGER NOT NULL DEFAULT 0,
    scan_count    INTEGER NOT NULL DEFAULT 0,
    last_scan_at  INTEGER
  );
`);

export interface QrRecord {
  id: string;
  original_url: string;
  created_at: number;
  expires_at: number | null;
  one_time: number;
  used: number;
  scan_count: number;
  last_scan_at: number | null;
}

const insertStmt = db.prepare(`
  INSERT INTO qr_codes (id, original_url, created_at, expires_at, one_time)
  VALUES (@id, @original_url, @created_at, @expires_at, @one_time)
`);

const getStmt = db.prepare('SELECT * FROM qr_codes WHERE id = ?');
const deleteStmt = db.prepare('DELETE FROM qr_codes WHERE id = ?');

const consumeStmt = db.prepare(`
  UPDATE qr_codes
  SET scan_count = scan_count + 1,
      last_scan_at = ?,
      used = CASE WHEN one_time = 1 THEN 1 ELSE used END
  WHERE id = ?
`);

export function createQr(record: {
  id: string;
  original_url: string;
  expires_at: number | null;
  one_time: boolean;
}): QrRecord {
  insertStmt.run({
    id: record.id,
    original_url: record.original_url,
    created_at: Date.now(),
    expires_at: record.expires_at,
    one_time: record.one_time ? 1 : 0,
  });
  return getQr(record.id)!;
}

export function getQr(id: string): QrRecord | undefined {
  return getStmt.get(id) as QrRecord | undefined;
}

export function deleteQr(id: string): boolean {
  return deleteStmt.run(id).changes > 0;
}

export const resolveScan = db.transaction((id: string): string | null => {
  const row = getStmt.get(id) as QrRecord | undefined;
  if (!row) return null;

  const now = Date.now();
  if (row.expires_at !== null && now > row.expires_at) return null;
  if (row.one_time === 1 && row.used === 1) return null;

  consumeStmt.run(now, id);
  return row.original_url;
});
