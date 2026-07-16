import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { createQr } from '../lib/api';
import { EXPIRY_PRESETS, type ExpiryPreset, type QrData } from '../lib/types';
import OptionsPanel from './OptionsPanel';
import QrResult from './QrResult';
import { useToast } from './Toast';
import { LinkIcon, LoaderIcon } from './Icons';

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.length > 0;
  } catch {
    return false;
  }
}

export default function GeneratorCard() {
  const toast = useToast();

  const [url, setUrl] = useState('');
  const [oneTime, setOneTime] = useState(false);
  const [expiry, setExpiry] = useState<ExpiryPreset>('never');
  const [customDate, setCustomDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QrData | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const urlValid = useMemo(() => isValidUrl(url), [url]);
  const showInvalid = url.trim().length > 0 && !urlValid;

  useEffect(() => {
    if (!urlValid || result) {
      setPreview(null);
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(url.trim(), {
      width: 160,
      margin: 1,
      color: { dark: '#e5e7eb', light: '#00000000' },
    })
      .then((data) => !cancelled && setPreview(data))
      .catch(() => !cancelled && setPreview(null));
    return () => {
      cancelled = true;
    };
  }, [url, urlValid, result]);

  function resolveExpiresAt(): number | null | 'invalid' {
    if (expiry === 'never') return null;
    if (expiry === 'custom') {
      if (!customDate) return 'invalid';
      const ts = new Date(customDate).getTime();
      return Number.isFinite(ts) && ts > Date.now() ? ts : 'invalid';
    }
    const preset = EXPIRY_PRESETS.find((p) => p.value === expiry);
    return preset?.ms ? Date.now() + preset.ms : null;
  }

  async function handleGenerate() {
    if (!urlValid || loading) return;
    const expiresAt = resolveExpiresAt();
    if (expiresAt === 'invalid') {
      toast.error('Pick a valid future date & time');
      return;
    }
    setLoading(true);
    try {
      const qr = await createQr({ url: url.trim(), oneTime, expiresAt });
      setResult(qr);
      toast.success('QR code generated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setUrl('');
    setOneTime(false);
    setExpiry('never');
    setCustomDate('');
  }

  return (
    <section className="glass w-full max-w-2xl p-6 sm:p-10">
      <label htmlFor="url" className="mb-2 block text-sm font-semibold text-gray-300">
        Destination URL
      </label>
      <div className="relative">
        <LinkIcon
          width={18}
          height={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          id="url"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder="https://example.com/my-page"
          value={url}
          disabled={!!result}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          className={`w-full rounded-2xl border bg-surface/70 py-3.5 pl-11 pr-4 text-[15px] text-gray-100 placeholder-gray-600 outline-none transition-all duration-300 disabled:opacity-60 ${
            showInvalid
              ? 'border-rose-500/50 focus:border-rose-500/70'
              : 'border-white/10 focus:border-primary/60 focus:shadow-lg focus:shadow-primary/10'
          }`}
        />
      </div>
      <div className="mt-1.5 min-h-5 text-xs">
        {showInvalid && (
          <span className="text-rose-400 animate-rise">
            Enter a full valid URL, including http:// or https://
          </span>
        )}
      </div>

      {preview && !result && (
        <div className="animate-pop mb-5 mt-1 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <img src={preview} alt="Live QR preview" className="h-20 w-20" />
          <div className="text-xs leading-relaxed text-gray-500">
            <span className="font-semibold text-gray-300">Live preview</span>
            <br />
            Your final QR will use a secure short link with tracking, expiration and one-time
            options.
          </div>
        </div>
      )}

      {!result && (
        <div className="mb-6">
          <OptionsPanel
            oneTime={oneTime}
            onOneTimeChange={setOneTime}
            expiry={expiry}
            onExpiryChange={setExpiry}
            customDate={customDate}
            onCustomDateChange={setCustomDate}
            disabled={loading}
          />
        </div>
      )}

      {!result && (
        <button
          onClick={handleGenerate}
          disabled={!urlValid || loading}
          className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent py-4 text-[15px] font-bold text-white shadow-xl shadow-primary/30 transition-all duration-300 hover:shadow-primary/45 hover:brightness-110 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          {loading ? (
            <>
              <LoaderIcon width={18} height={18} /> Generating…
            </>
          ) : (
            'Generate QR Code'
          )}
        </button>
      )}

      {result && <QrResult qr={result} onDeleted={reset} onNew={reset} />}
    </section>
  );
}
