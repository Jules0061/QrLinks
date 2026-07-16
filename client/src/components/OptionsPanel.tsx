import { EXPIRY_PRESETS, type ExpiryPreset } from '../lib/types';
import { ClockIcon, ZapIcon } from './Icons';

interface Props {
  oneTime: boolean;
  onOneTimeChange: (value: boolean) => void;
  expiry: ExpiryPreset;
  onExpiryChange: (value: ExpiryPreset) => void;
  customDate: string;
  onCustomDateChange: (value: string) => void;
  disabled?: boolean;
}

export default function OptionsPanel({
  oneTime,
  onOneTimeChange,
  expiry,
  onExpiryChange,
  customDate,
  onCustomDateChange,
  disabled,
}: Props) {
  const minDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        type="button"
        role="switch"
        aria-checked={oneTime}
        disabled={disabled}
        onClick={() => onOneTimeChange(!oneTime)}
        className={`group flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 ${
          oneTime
            ? 'border-primary/50 bg-primary/15 shadow-lg shadow-primary/10'
            : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
        }`}
      >
        <span className="flex items-center gap-3">
          <ZapIcon
            width={18}
            height={18}
            className={`transition-colors ${oneTime ? 'text-primary-light' : 'text-gray-500'}`}
          />
          <span>
            <span className="block text-sm font-semibold text-gray-100">One-Time QR Code</span>
            <span className="block text-xs text-gray-500">Expires after the first scan</span>
          </span>
        </span>
        <span
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
            oneTime ? 'bg-primary' : 'bg-white/10'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
              oneTime ? 'left-[22px]' : 'left-0.5'
            }`}
          />
        </span>
      </button>

      <div className="flex flex-col justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
        <label htmlFor="expiry" className="flex items-center gap-3">
          <ClockIcon width={18} height={18} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-100">Expiration</span>
        </label>
        <select
          id="expiry"
          value={expiry}
          disabled={disabled}
          onChange={(e) => onExpiryChange(e.target.value as ExpiryPreset)}
          className="w-full cursor-pointer rounded-xl border border-white/10 bg-surface/80 px-3 py-2 text-sm text-gray-200 outline-none transition-colors focus:border-primary/60"
        >
          {EXPIRY_PRESETS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        {expiry === 'custom' && (
          <input
            type="datetime-local"
            value={customDate}
            min={minDate}
            disabled={disabled}
            onChange={(e) => onCustomDateChange(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-surface/80 px-3 py-2 text-sm text-gray-200 outline-none transition-colors focus:border-primary/60 [color-scheme:dark] animate-rise"
          />
        )}
      </div>
    </div>
  );
}
