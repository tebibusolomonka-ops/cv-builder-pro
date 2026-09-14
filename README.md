# CV Builder Pro

A local-first resume builder with live A4 previews, multiple layouts, JSON backup and PDF export. No account is required. Resume and application data stays in the browser unless the user exports a file.

## Stack

- TypeScript and TSX
- React 19
- Next.js 16 App Router
- Tailwind CSS 4
- Zustand for browser-local state
- Puppeteer Core for downloadable PDF rendering

There is no separate Python, PHP or database backend. The PDF endpoint is a Next.js server route written in TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production build:

```bash
npm run build
npm run start
```

## Data and exports

Resume data is stored under `cv-builder-resume` in `localStorage`. Applications use `cv-builder-applications`. The editor and settings pages can export and restore portable JSON backups.

PDF export uses an installed Chrome or Edge browser when available. If server-side rendering is unavailable, the editor falls back to the browser print dialog.

## Checks

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run build
```
