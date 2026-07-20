Yes, this was made using AI.
# QrLink

Premium QR code generator. Every QR code encodes a secure short link (`/r/:id`) instead of the raw URL, enabling expiration, one-time scans, and live scan tracking.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS 4 (Vite)
- **Backend:** Node.js + Express + TypeScript
- **Database:** SQLite via better-sqlite3 (swap `server/src/db.ts` for Postgres later)
- **QR generation:** `qrcode`

## Quick Start

```bash
npm run install:all   # install root + server + client dependencies
npm run dev           # backend on :3001, frontend on :5173
```

Open http://localhost:5173

## Production

```bash
npm run build         # compile server + build client
npm start             # Express serves API + built client on :3001
```

Set `BASE_URL=https://yourdomain.com` so short links point at your real domain, and `PORT` to change the port.

## API

| Method | Route               | Description                              |
| ------ | ------------------- | ---------------------------------------- |
| POST   | `/api/create`       | Create a QR code `{url, oneTime, expiresAt}` |
| GET    | `/r/:id`            | Redirect (validates expiry / one-time)   |
| GET    | `/api/qr/:id`       | Metadata (scan count, expiry, …)         |
| GET    | `/api/qr/:id/image` | QR image `?format=png\|svg&download=1`   |
| DELETE | `/api/qr/:id`       | Delete a QR code                         |

## Security

- Strict URL validation (http/https only, blocks `javascript:` etc.)
- Prepared SQL statements everywhere (no injection)
- Cryptographically secure random ids (`crypto.randomBytes`, no modulo bias)
- Rate limiting (global + stricter on creation)
- helmet security headers + CSP
- One-time scan resolution runs in a DB transaction (no double-scan race)

## Structure

```
├── server/           Express + SQLite backend
│   └── src/
│       ├── index.ts        app entry, security, static serving
│       ├── db.ts           SQLite layer (prepared statements)
│       ├── routes/         api.ts, redirect.ts
│       ├── utils/          id.ts, validate.ts
│       └── views/          expired.ts (expired page)
└── client/           React + Tailwind frontend (Vite)
    └── src/
        ├── components/     Logo, GeneratorCard, OptionsPanel, QrResult, Toast, …
        └── lib/            api.ts, types.ts
```
