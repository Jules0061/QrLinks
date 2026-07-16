export function expiredPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QR Code expired — QrLink</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a12;
      background-image:
        radial-gradient(600px 400px at 20% 10%, rgba(79, 70, 229, 0.18), transparent),
        radial-gradient(600px 400px at 80% 90%, rgba(139, 92, 246, 0.12), transparent);
      color: #e5e7eb;
      padding: 24px;
    }
    .card {
      text-align: center;
      max-width: 420px;
      width: 100%;
      padding: 48px 36px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
      animation: rise 0.5s ease both;
    }
    @keyframes rise {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .icon {
      width: 72px; height: 72px;
      margin: 0 auto 24px;
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, rgba(79,70,229,0.25), rgba(139,92,246,0.15));
      border: 1px solid rgba(79, 70, 229, 0.35);
    }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 10px; color: #fff; }
    p  { font-size: 15px; line-height: 1.6; color: #9ca3af; }
    .brand {
      margin-top: 32px; font-size: 13px; font-weight: 600;
      letter-spacing: 0.04em; color: #6b7280;
    }
    .brand span { color: #818cf8; }
  </style>
</head>
<body>
  <main class="card">
    <div class="icon">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="7" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <h1>This QR Code has expired.</h1>
    <p>The link behind this code is no longer active. It may have reached its expiration date or was set for one-time use.</p>
    <div class="brand">Powered by <span>QrLink</span></div>
  </main>
</body>
</html>`;
}
