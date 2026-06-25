# ClipQuiz

The global guessing game platform — a Machugi.io-inspired international quiz experience.

**Guess from images, cropped close-ups, and music clips. Beat the percentile. Go viral.**

## Features

- **3 Quiz Modes**: Full image, extreme crop zoom, YouTube audio clips
- **Text-input answers** with fuzzy matching (like Machugi.io)
- **Percentile ranking** with score distribution chart
- **UGC quiz creation** — no account required
- **5 languages**: English, Korean, Japanese, Spanish, Portuguese
- **Streamer-friendly** dark UI with shareable results

## Quick Start

```bash
cd clipquiz
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- next-intl (i18n)
- Framer Motion

## Seed Quizzes

6 built-in quizzes covering flags, landmarks, 2010s pop, anime, gaming, and fast food.

## Deploy

```bash
npm run build
npm start
```

Works on Vercel, Railway, or any Node.js host. Quiz results persist to `data/` directory.
