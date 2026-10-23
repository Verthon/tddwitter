# Outdated APIs: never use

| Outdated (Vitest 3–4 / other libs) | Use in this repo (Vitest 5) |
|---|---|
| `import { page, userEvent } from '@vitest/browser/context'` | `import { page, userEvent } from 'vitest/browser'` |
| `import ... from '@vitest/browser/utils'` | `vitest/browser` |
| `browser.provider: 'playwright'` (string) | `provider: playwright()` from `@vitest/browser-playwright` (already in `web/vitest.config.ts`) |
| `@testing-library/react` `render`, `screen`, `waitFor`, `findBy*` | `render` from `vitest-browser-react` (via `renderWithProviders`), `page.getBy*`, `expect.element` |
| `@testing-library/user-event` `userEvent.setup()` | `userEvent` from `vitest/browser` (real CDP/Playwright events) |
| `fireEvent.*` | `userEvent.*` |
| `act(...)` around interactions | Nothing. `expect.element` retries |
| `@testing-library/jest-dom` import | Built in to `expect.element` |
| `setupServer` from `msw/node` | `worker` from `src/integrations/mockServer` (`setupWorker`, `msw/browser`) |
| `rest.get(...)`, `res(ctx.json(...))` (MSW 1.x) | `http.get(...)`, `HttpResponse.json(...)` |
| `getByPlaceholderText` | `getByPlaceholder` |
| Non-awaited `render(...)` | `await render(...)` (2.x returns a Promise) |
| `toHaveTextContent(/regex/)` (Vitest 4) | `toMatchTextContent(/regex/)`; `toHaveTextContent('text')` is exact |
| `exact: true` on locators (Vitest 4 default was substring) | Nothing. Exact is the default |
| `v4.vitest.dev` docs | `vitest.dev` (v5) |

This repo is on Vitest 5. Pages on v4.vitest.dev and blog posts from before Vitest 5 describe substring locators and RegExp `toHaveTextContent`; don't follow them.
