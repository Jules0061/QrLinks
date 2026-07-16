import { useEffect, useState } from 'react';
import { getQr, deleteQr, qrImageUrl } from '../lib/api';
import type { QrData } from '../lib/types';
import { useToast } from './Toast';
import {
  CopyIcon,
  CheckIcon,
  DownloadIcon,
  EyeIcon,
  ClockIcon,
  ZapIcon,
  TrashIcon,
  RefreshIcon,
} from './Icons';

interface Props {
  qr: QrData;
  onDeleted: () => void;
  onNew: () => void;
}

function formatDate(ms: number | null): string {
  if (ms === null) return 'Never';
  return new Date(ms).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function QrResult({ qr: initial, onDeleted, onNew }: Props) {
  const toast = useToast();
  const [qr, setQr] = useState(initial);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      getQr(initial.id).then(setQr).catch(() => clearInterval(timer));
    }, 5000);
    return () => clearInterval(timer);
  }, [initial.id]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(qr.shortUrl);
      setCopied(true);
      toast.success('Short link copied to clipboard');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Could not access clipboard');
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteQr(qr.id);
      toast.success('QR code deleted');
      onDeleted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
      setDeleting(false);
    }
  }

  const expired = qr.expiresAt !== null && Date.now() > qr.expiresAt;
  const consumed = qr.oneTime && qr.used;

  return (
    <div className="animate-pop mt-8 border-t border-white/10 pt-8">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="shrink-0 rounded-2xl bg-white p-3 shadow-xl shadow-primary/20">
          <img
            src={qrImageUrl(qr.id, 'png')}
            alt={`QR code linking to ${qr.originalUrl}`}
            width={192}
            height={192}
            className="h-48 w-48 rounded-lg"
          />
        </div>

        <div className="flex w-full min-w-0 flex-col gap-4">
          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Short link
            </div>
            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-xl border border-white/10 bg-surface/70 px-3.5 py-2.5 text-sm text-primary-light">
                {qr.shortUrl}
              </code>
              <button
                onClick={copyLink}
                title="Copy link"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-gray-300 transition-all hover:border-primary/50 hover:text-white active:scale-95"
              >
                {copied ? <CheckIcon className="text-emerald-400" /> : <CopyIcon />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {(expired || consumed) && (
              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-medium text-rose-300">
                {consumed ? 'Used — link expired' : 'Expired'}
              </span>
            )}
            {qr.oneTime && !consumed && (
              <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-medium text-amber-300">
                <ZapIcon width={12} height={12} /> One-time
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-gray-400">
              <EyeIcon width={12} height={12} /> {qr.scanCount} scan{qr.scanCount === 1 ? '' : 's'}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-gray-400">
              <ClockIcon width={12} height={12} /> Expires: {formatDate(qr.expiresAt)}
            </span>
          </div>

          <div className="text-xs text-gray-500">
            Created {formatDate(qr.createdAt)} · Points to{' '}
            <span className="break-all text-gray-400">{qr.originalUrl}</span>
          </div>

          <div className="mt-1 flex flex-wrap gap-2.5">
            <a
              href={qrImageUrl(qr.id, 'png', true)}
              download
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-95"
            >
              <DownloadIcon width={16} height={16} /> PNG
            </a>
            <a
              href={qrImageUrl(qr.id, 'svg', true)}
              download
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-gray-200 transition-all hover:border-white/25 active:scale-95"
            >
              <DownloadIcon width={16} height={16} /> SVG
            </a>
            <button
              onClick={onNew}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-gray-200 transition-all hover:border-white/25 active:scale-95"
            >
              <RefreshIcon width={16} height={16} /> New QR
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-300 transition-all hover:border-rose-500/40 active:scale-95 disabled:opacity-50"
            >
              <TrashIcon width={16} height={16} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
