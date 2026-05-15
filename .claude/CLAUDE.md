<!-- Keep this file and .claude/docs/ updated when project structure, conventions, or tooling changes -->

@../AGENTS.md

# formatIT

Next.js web app (purpose TBD by the user). Built with Next.js 16, React 19, JavaScript, Tailwind CSS v4, and ESLint 9.

## Conventions

- App Router only — routes live under `src/app/` as nested segment folders with `page.js` / `layout.js`. No `pages/` directory.
- Path alias `@/*` resolves to `src/*` (see `jsconfig.json`).
- Styling: Tailwind CSS v4 utility classes; global tokens in `src/app/globals.css` (CSS-first config — no `tailwind.config.js`).
- This Next.js version has breaking changes versus older training data — when touching framework APIs, consult `node_modules/next/dist/docs/` and heed deprecation notices (see root `AGENTS.md`).

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm start            # Serve production build
npm run lint         # ESLint
npm test             # Run Vitest test suite
npm run test:coverage # Tests with coverage report (coverage/)
```

## Project Structure

- `src/app/` — App Router routes, layouts, and global styles
- `src/__tests__/` — unit and component tests (Vitest + Testing Library)
- `public/` — static assets served at the site root

## Before Writing Code

ALWAYS read `.claude/docs/coding-guidelines.md` before planning or implementing any changes. All code must follow these principles.

## Documentation

- `.claude/docs/styling.md` — Tailwind v4 conventions, component styling patterns
- `.claude/docs/testing.md` — Vitest setup, test layout, coverage workflow
