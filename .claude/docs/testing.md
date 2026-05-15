# Testing

## Test Runner

**Vitest** with **@testing-library/react** and **jsdom**, invoked via `npm test`.

## Running Tests

```bash
npm test                    # Run all tests once
npm run test:watch          # Watch mode
npm run test:coverage       # Run with coverage (v8 provider, HTML report in coverage/)
npx vitest path/to/file     # Run a single test file
```

## Test Structure

- `src/__tests__/` — colocated unit and component tests. Files named `*.test.js` or `*.test.jsx`.
- `vitest.setup.js` — global setup, loads `@testing-library/jest-dom` matchers.
- `vitest.config.mjs` — Vitest config (jsdom environment, React plugin, path alias `@/`).

## Writing Tests

- Component tests use `render` from `@testing-library/react` and query by accessible roles/labels (`getByRole`, `getByLabelText`) — avoid querying by class or test-id when a semantic query works.
- User interactions go through `userEvent.setup()` from `@testing-library/user-event`, not direct `fireEvent` calls.
- Group related cases with `describe`; each `it`/`test` asserts one behavior with a clear name.
- For server components or `next/*` modules, mock at the module level with `vi.mock(...)`.

## Workflow

- Write or update tests alongside the code they verify, not as a separate step after.
- Bug fixes: add a failing test that reproduces the bug before writing the fix.
- After implementation, run `npm test` to verify nothing else broke.

## Coverage

`npm run test:coverage` produces a terminal summary plus an HTML report under `coverage/` (open `coverage/index.html`). Coverage uses Vitest's built-in v8 provider.
