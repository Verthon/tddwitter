# Outdated APIs: never use

| Outdated (Vitest 3 / other libs) | Use in this repo (Vitest 4) |
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

Not applicable to these versions: Vitest 5 changes (exact-by-default locators, `toMatchTextContent`, the async `render` in vue/svelte). If you read vitest.dev and it shows v5, use v4.vitest.dev instead.
