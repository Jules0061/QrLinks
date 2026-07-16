export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4F46E5" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="13" fill="url(#logo-grad)" />
        <rect x="9" y="9" width="11" height="11" rx="3.5" fill="none" stroke="white" strokeWidth="2.6" />
        <rect x="28" y="9" width="11" height="11" rx="3.5" fill="none" stroke="white" strokeWidth="2.6" opacity="0.55" />
        <rect x="9" y="28" width="11" height="11" rx="3.5" fill="none" stroke="white" strokeWidth="2.6" opacity="0.55" />
        <g stroke="white" strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M31.5 33.5l5-5" />
          <path d="M34.8 27.2l1.6-1.6a3.4 3.4 0 0 1 4.8 4.8l-1.6 1.6" />
          <path d="M33.2 40.4l-1.6 1.6a3.4 3.4 0 0 1-4.8-4.8l1.6-1.6" transform="translate(3.6 -3.6)" />
        </g>
      </svg>
      <span className="text-2xl font-bold tracking-tight text-white">
        Qr<span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">Link</span>
      </span>
    </div>
  );
}
