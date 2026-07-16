import { Router } from 'express';
import QRCode from 'qrcode';
import { createQr, getQr, deleteQr, type QrRecord } from '../db.js';
import { generateId, isValidId } from '../utils/id.js';
import { validateUrl, validateExpiresAt } from '../utils/validate.js';

const router = Router();

function baseUrl(): string {
  return process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3001}`;
}

function serialize(row: QrRecord) {
  return {
    id: row.id,
    shortUrl: `${baseUrl()}/r/${row.id}`,
    originalUrl: row.original_url,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    oneTime: row.one_time === 1,
    used: row.used === 1,
    scanCount: row.scan_count,
    lastScanAt: row.last_scan_at,
  };
}

router.post('/create', (req, res) => {
  const { url, oneTime, expiresAt } = req.body ?? {};

  const validUrl = validateUrl(url);
  if (!validUrl) {
    return res.status(400).json({ error: 'Please provide a valid http(s) URL.' });
  }

  const validExpiry = validateExpiresAt(expiresAt);
  if (validExpiry === undefined) {
    return res.status(400).json({ error: 'Expiration must be a future date.' });
  }

  const record = createQr({
    id: generateId(8),
    original_url: validUrl,
    expires_at: validExpiry,
    one_time: oneTime === true,
  });

  res.status(201).json(serialize(record));
});

router.get('/qr/:id', (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid id.' });
  const row = getQr(req.params.id);
  if (!row) return res.status(404).json({ error: 'QR code not found.' });
  res.json(serialize(row));
});

router.get('/qr/:id/image', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid id.' });
  const row = getQr(req.params.id);
  if (!row) return res.status(404).json({ error: 'QR code not found.' });

  const shortUrl = `${baseUrl()}/r/${row.id}`;
  const format = req.query.format === 'svg' ? 'svg' : 'png';
  const download = req.query.download === '1';

  try {
    if (format === 'svg') {
      const svg = await QRCode.toString(shortUrl, {
        type: 'svg',
        margin: 2,
        color: { dark: '#0a0a12', light: '#ffffff' },
      });
      res.type('image/svg+xml');
      if (download) res.setHeader('Content-Disposition', `attachment; filename="qrlink-${row.id}.svg"`);
      res.send(svg);
    } else {
      const png = await QRCode.toBuffer(shortUrl, {
        type: 'png',
        width: 1024,
        margin: 2,
        color: { dark: '#0a0a12', light: '#ffffff' },
      });
      res.type('image/png');
      if (download) res.setHeader('Content-Disposition', `attachment; filename="qrlink-${row.id}.png"`);
      res.send(png);
    }
  } catch {
    res.status(500).json({ error: 'Failed to render QR code.' });
  }
});

router.delete('/qr/:id', (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid id.' });
  if (!deleteQr(req.params.id)) return res.status(404).json({ error: 'QR code not found.' });
  res.status(204).end();
});

export default router;
