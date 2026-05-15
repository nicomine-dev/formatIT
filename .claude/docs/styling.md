# Styling

## Stack

React 19 components (Next.js App Router) styled with **Tailwind CSS v4**. Global styles in `src/app/globals.css`.

## Conventions

- Apply styles via Tailwind utility classes directly on JSX elements — no separate `.css` or CSS Modules per component unless a clear reason exists.
- Global tokens, base layers, and `@theme` customizations live in `src/app/globals.css`. Tailwind v4 uses CSS-first config (no `tailwind.config.js`).
- Fonts are loaded via `next/font` in `src/app/layout.js` and exposed as CSS variables — reference them through Tailwind's `font-*` utilities or `var(--font-*)`.
- Use semantic HTML and Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) for layout; prefer composition over conditional class soup.

## File Organization

- `src/app/globals.css` — Tailwind imports, theme tokens, base layer.
- `src/app/layout.js` — root layout, font setup, top-level wrappers.
- Per-route styles co-located inside each route segment under `src/app/`.

## Adding New Components

- Build with Tailwind utilities first; extract a component when the same markup is reused.
- For variants, accept a `className` prop and merge with `clsx` or template literals — do not hardcode caller-specific styles.
- Shared design tokens (colors, spacing, fonts) belong in `globals.css` under `@theme`, not duplicated across components.
