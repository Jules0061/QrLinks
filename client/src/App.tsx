import Background from './components/Background';
import Logo from './components/Logo';
import GeneratorCard from './components/GeneratorCard';
import { ZapIcon, ClockIcon, EyeIcon } from './components/Icons';

const FEATURES = [
  {
    icon: ClockIcon,
    title: 'Expiring links',
    text: 'Set codes to expire after minutes, days, or a custom date.',
  },
  {
    icon: ZapIcon,
    title: 'One-time scans',
    text: 'Codes that self-destruct after their very first scan.',
  },
  {
    icon: EyeIcon,
    title: 'Scan analytics',
    text: 'Live scan counter and last-scan timestamps for every code.',
  },
];

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Background />

      <header className="mx-auto w-full max-w-5xl px-6 pt-8 animate-rise">
        <Logo />
      </header>

      <main className="flex flex-1 flex-col items-center px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
        <div className="animate-rise mb-10 max-w-2xl text-center" style={{ animationDelay: '80ms' }}>
          <div className="mx-auto mb-5 w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-light">
            Secure short-link QR codes
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            QR codes that{' '}
            <span className="bg-gradient-to-r from-primary-light via-accent to-primary-light bg-clip-text text-transparent">
              expire on your terms
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-gray-400">
            Generate premium QR codes in seconds. Every code points to a secure short link with
            optional expiration, one-time use, and live scan tracking.
          </p>
        </div>

        <div className="animate-rise w-full max-w-2xl" style={{ animationDelay: '160ms' }}>
          <GeneratorCard />
        </div>

        <div
          className="animate-rise mt-14 grid w-full max-w-4xl gap-4 sm:grid-cols-3"
          style={{ animationDelay: '240ms' }}
        >
          {FEATURES.map(({ icon: FeatureIcon, title, text }) => (
            <div
              key={title}
              className="glass !rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-accent/15 text-primary-light">
                <FeatureIcon width={18} height={18} />
              </div>
              <div className="text-sm font-bold text-white">{title}</div>
              <div className="mt-1 text-[13px] leading-relaxed text-gray-500">{text}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} QrLink — Premium QR code generator
      </footer>
    </div>
  );
}
