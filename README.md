# ClipQuiz

The global guessing game platform — a Machugi.io-inspired international quiz experience.

## Quick Start

```bash
npm install
npm run dev
```

## Deploy on Cloudflare Workers

**Production URL:** https://clipquiz.jwonlabs.com

See **[DEPLOY.md](./DEPLOY.md)** for Cloudflare Workers setup (htv.jwonlabs.com과 동일 패턴).

`main` push → GitHub Actions → Worker `clipquiz` 자동 배포.

Quick check: `GET /api/health` · `GET /ads.txt` · `/en`

## Supabase (persistent UGC storage)

See **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** for the full step-by-step guide (Korean).

Quick check after setup: `GET /api/health` should return `"storage": "supabase"`.

## Features

- Image / Crop / Audio quiz modes
- Percentile ranking
- UGC quiz creation
- 5 languages: EN, KO, JA, ES, PT
