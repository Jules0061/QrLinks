export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
        }}
      />
      <div className="absolute -top-32 left-1/4 h-[480px] w-[480px] rounded-full bg-primary/25 blur-[140px] animate-blob" />
      <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-accent/20 blur-[140px] animate-blob-slow" />
      <div className="absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-900/40 blur-[120px] animate-blob" />
    </div>
  );
}
