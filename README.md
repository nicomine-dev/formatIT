# formatIT

Live resume editor that exports clean, ATS-friendly one-page PDFs. You type on the left, the page updates on the right, and an AI assistant can draft or translate any section for you.

**Live:** https://format-it-pied.vercel.app

## Features

- **Live preview**: the A4 page re-renders as you edit, on desktop or with mobile tabs.
- **PDF export** with `@react-pdf/renderer`: real text (selectable and parseable by ATS), clickable contact links, one-page layout.
- **AI fill**: Gemini (`gemini-2.5-flash`) drafts summaries, bullets and skills from a short prompt.
- **AI translate**: translates a section while keeping its JSON structure, proper names, emails and URLs intact.
- **Free and Pro tiers**: 3 free AI requests a day per IP (rate limited with Redis), a Pro plan paid through dLocal with a webhook, and an admin page to manage Pro users.

## Stack

Next.js 16 (App Router, route handlers) · React 19 · Tailwind CSS 4 · @react-pdf/renderer · Gemini API · Redis · dLocal · Vitest + Testing Library · ESLint + Prettier · Vercel

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # Vitest
npm run test:coverage
```

The AI and payment features need their API keys in `.env.local`. The editor and PDF export work without them.

## Project layout

```
src/app/            pages and API routes (ai, pro/status, dlocal/webhook, admin/pro)
src/components/     editor panel, sections, live preview, CVPdfDocument (the PDF template)
src/lib/            rate limiting, Redis client, Pro status
src/__tests__/      Vitest + Testing Library specs
```

Built by [Nicolás Miné](https://nicolas-developer.vercel.app).
