---
name: web-browser-tests
description: Recipes and pitfalls for writing, fixing or reviewing web component and page tests (`web/**/*.browser.spec.tsx`) on Vitest 4 browser mode with vitest-browser-react, MSW overrides, React Router and React Query. Use before touching any `*.browser.spec.tsx`.
---

# Web browser tests

Every snippet here was run green on chromium and webkit with vitest 4.0.16, vitest-browser-react 2.0.2 and msw 2.12.4.

## Setup facts

- File name `**/*.browser.spec.tsx`; anything else is not picked up. Each spec runs in **chromium and webkit**.
- Run one file: `cd web && CI=true pnpm vitest run --project browser <path>`.
- `src/test/setup.browser.ts`: starts the MSW worker in `beforeAll`, calls `worker.resetHandlers()` in `afterEach`. Default handlers live in `src/integrations/mockServer.ts` (feature `mocks/*Handlers.ts`).
- The test worker is `quiet` (no request logs) and answers dicebear avatar URLs with a blank SVG. Any other unhandled non-asset request logs `[MSW] Error` and gets a 500: add a handler, never a real network call.
- `vitest-browser-react` cleans up the previous render **before** each test. No manual `cleanup`.
- Locator text matching (`getByText`, `getByLabelText`, `name:`) is case-insensitive substring by default; pass `{ exact: true }` or a regex to tighten.
- `expect.element` retries until the test timeout runs out (minus 100 ms) unless you pass `{ timeout }`.
- `expect.poll` gives up after **5 s** in this repo (`expect.poll.timeout` in `web/vitest.config.ts`; Vitest's own default is 1 s), `interval` 50 ms. Don't pass a per-call `{ timeout }` to make a flaky poll pass. Only pass one when the app itself is slow by design (`retry: 3` backoff, a `delay(...)` handler).
- Chromium and webkit run one after the other (`sequence.groupOrder` per instance), not in parallel. Running them at the same time starved the CPU: frames came every 100 ms or less often, IntersectionObserver callbacks were seconds late, and Playwright clicks (which wait for animation frames) timed out. Keep them sequential.
- Don't shorten action timeouts (`click(..., { timeout: 2000 })`) to make a failing test fail sooner. Under load a click alone took over 2 s. A click that is really intercepted still fails at the test timeout.
- `userEvent`, `locator.click()` and similar must be awaited. An un-awaited call never starts.

## Rendering

Use `renderWithProviders` from `src/test/renderWithProviders.tsx`. Each call gets a fresh QueryClient (`retry: false`), i18n and a `MemoryRouter`.

```tsx
import { renderWithProviders } from 'src/test/renderWithProviders';

await renderWithProviders(<LikeButton postId="p1" />);
await renderWithProviders(<LoginPage />, { route: '/login' });
await renderWithProviders(<PostDetailPage />, { route: '/post/1', path: '/post/:id' });
```

- `route` is the initial URL and `path` is the `<Route path>` the UI is mounted on (defaults to `route`). Pass `path` when the page reads `useParams`.
- If the code navigates away from `path`, a probe renders the new pathname in `getByTestId('location')`. See [references/router-and-query.md](references/router-and-query.md).
- Always `await` the render. It returns a Promise.

## Text comes from i18n, not literals

```tsx
import enCore from 'src/core/i18n/en.json';

page.getByRole('button', { name: enCore['core.auth.login.submitButton'] });
page.getByLabelText(enCore['core.auth.register.passwordLabel'], { exact: true });
page.getByRole('button', { name: enEngagement['engagement.like.ariaLabel'], exact: true });
```

Matching is substring, so add `exact: true` whenever one translation is contained in another on the page: `Password` vs `Confirm Password`, `Like` vs `Unlike`, `Post` vs `View post by …`. A loose `/like/i` also matches `Unlike` and makes the test pass whatever state is rendered.

Keys with simple `{placeholder}` values: fill them in the test.

```tsx
enComposer['composer.form.charCount'].replace('{remaining}', '256').replace('{max}', '300');
enTimeline['timeline.viewPost'].replace('{username}', 'johndoe');
```

ICU plural keys (`{count, plural, …}`) can't be filled this way; assert the rendered literal (`'1,230 likes'`).

## Locators (priority order)

1. `page.getByRole(role, { name })` covers buttons, links, headings, `alert`, `status` (`<output>`), `feed`, `listitem`.
2. `page.getByLabelText(label)` for form fields.
3. `page.getByPlaceholder` / `page.getByText` for non-interactive content.
4. `getByAltText`, `getByTitle`.
5. `getByTestId` is a last resort (the router probe is the only sanctioned use).

```tsx
const feed = page.getByRole('feed', { name: 'Timeline feed' });
await expect.element(feed.getByRole('listitem').first()).toBeVisible();
await expect.poll(() => feed.getByRole('listitem').length).toBe(10);
await expect.element(feed.getByRole('listitem').filter({ hasText: 'johndoe' })).toBeVisible();
await expect.element(page.getByRole('link', { name: 'View post by johndoe' })).toHaveAttribute('href', '/post/1');
```

Scope with chaining or `filter`. Use `first()`/`nth()` only after scoping.

### Elements that stay in the DOM when "closed"

Off-canvas drawers that slide with `translate-x-*` are always rendered and count as visible. Assert position instead, on a child that fits the viewport fully (a `h-screen` container with padding gives a ratio below 1):

```tsx
await page.viewport(414, 896);
await renderWithProviders(<ShellNav />);
const homeLink = page
  .getByRole('complementary', { name: 'Sidebar navigation' })
  .getByRole('link', { name: enCore['core.nav.home'] });
await expect.element(homeLink).not.toBeInViewport();
await userEvent.click(page.getByRole('button', { name: enCore['core.toggleMenu'] }));
await expect.element(homeLink).toBeInViewport({ ratio: 1 });
```

### Infinite scroll

Prove the count grows: assert the first page, scroll, then assert the full fixture length.

```tsx
import { timelineMockItems } from 'src/timeline/mocks/fixtures';

await page.viewport(414, 896);
await renderWithProviders(<Timeline />);
await expect.poll(() => feed.getByRole('listitem').length).toBe(10);
window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
await expect.poll(() => feed.getByRole('listitem').length).toBe(timelineMockItems.length);
await expect.element(page.getByText(enTimeline['timeline.endOfTimeline'])).toBeVisible();
```

## Assertions

| Need | Use |
|---|---|
| DOM state | `await expect.element(locator).toBeVisible()` / `toHaveTextContent` / `toHaveValue` / `toBeInvalid` / `toBeEnabled` / `toHaveFocus` / `toHaveAttribute` |
| Element gone | `await expect.element(locator).not.toBeInTheDocument()` |
| Count, or any non-DOM value (captured request, counter) | `await expect.poll(() => value).toBe(x)` |
| A value that is already final (synchronous) | plain `expect` |

Never write `expect(locator.element())...` or `expect(locator.length)...` for something that is still rendering. Plain `expect` does not retry.

## Interactions

```tsx
import { page, userEvent } from 'vitest/browser';

await page.viewport(414, 896);
await userEvent.fill(page.getByLabelText(enCore['core.auth.login.emailLabel']), 'user@example.com');
await userEvent.click(page.getByRole('button', { name: enCore['core.auth.login.submitButton'] }));
await userEvent.click(email);
await userEvent.keyboard('a@b.co');
await userEvent.tab();
await expect.element(page.getByLabelText(enCore['core.auth.login.passwordLabel'])).toHaveFocus();
```

`fill` is the fast default. Use `keyboard` only when the behaviour under test depends on keystrokes.

## Forms (Base UI `Form` + zod)

Native constraints (`required`, `type="email"`) run **before** `onFormSubmit`. A value the browser itself rejects, like `'nope'` in an email field, never reaches zod. The message you get is then the browser's own text and differs between chromium and webkit. To assert a zod message, use input the browser accepts and zod rejects:

```tsx
const email = page.getByLabelText(enCore['core.auth.login.emailLabel']);
await userEvent.fill(email, 'user@example');
await userEvent.fill(page.getByLabelText(enCore['core.auth.login.passwordLabel']), 'password123');
await userEvent.click(page.getByRole('button', { name: enCore['core.auth.login.submitButton'] }));
await expect.element(email).toBeInvalid();
await expect.element(page.getByText(enCore['core.auth.login.error.emailInvalid'])).toBeVisible();
```

For required-field checks, `toBeInvalid()` on each field is enough. Don't assert the browser's message text.

## Network (MSW)

Override per test with `worker.use(...)` from `src/integrations/mockServer`. The reset happens automatically after each test.

```tsx
import { HttpResponse, http } from 'msw';
import { apiBase } from 'src/api/apiBase';
import { worker } from 'src/integrations/mockServer';

worker.use(http.get(`${apiBase}/timeline`, () => HttpResponse.json({ items: [], nextCursor: null, hasMore: false })));
```

For error, network failure, slow/loading, request-body capture and mutation-failure recipes, see [references/msw.md](references/msw.md).

## Pitfalls

| Don't | Do |
|---|---|
| `expect.poll(() => globalThis.location.pathname).toBe('/')` | Under `MemoryRouter` the pathname is always `/`, so the check passes vacuously. Assert `getByTestId('location')` with `toHaveTextContent(/^\/$/)` |
| `render(...)` without `await` | `await renderWithProviders(...)` |
| `toHaveTextContent('/')` for a path | It matches as a substring. Anchor with a regex: `/^\/$/` |
| Shared `QueryClient` across tests | One client per render (the helper does this) |
| Rely on `retry: false` for error tests | Query-level `retry` wins. `useInfiniteTimeline` sets `retry: 3`, so error tests take about 7 s. Expect that, or fix the hook |
| `{ once: true }` in a file that also uses `delay('infinite')` | We saw the next test's `once` handler get consumed (order-dependent failure). Prefer plain overrides |
| Hard-coded English strings | Keys from `src/<feature>/i18n/en.json` |
| A poll whose expected value is the same before and after the action | Assert a value only the action can produce |
| `force: true` or a click `position` to get past "subtree intercepts pointer events" | That message means a real user can't click there either. Click like a user and report the app bug |
| `it.fails`, `.skip`, `.todo` or a weaker assertion for a test that fails because the app is wrong | Leave it failing and report the app bug. The fix goes in app code, with the user's OK if the task didn't allow app changes |
| `getByTestId` / CSS selectors for UI | Role + accessible name. Add a label to the component if one is missing |
| A test with no assertion after the last click | End with an `expect.element` / `expect.poll` |
| Assert the browser's native validation text | `toBeInvalid()`, or zod messages via input the browser accepts |
| Assert "signed out" right after render | `SignedOut` renders while the `me` query is still pending, so the check passes before `/me` answers (and passes against the wrong URL). Count `/me` requests in the handler and `await expect.poll(() => meRequests).toBeGreaterThan(0)` first. See [references/router-and-query.md](references/router-and-query.md#auth-state-from-me) |
| Prove a cache invalidation through navigation | An errored query refetches when a new observer mounts, whatever its `staleTime`, so a page change hides a missing `invalidateQueries`. Test the outcome, or keep the observer mounted. See [references/router-and-query.md](references/router-and-query.md#errored-queries-refetch-on-remount) |

## Prove each assertion can fail

After writing or fixing an assertion, break the app behaviour it covers (drop a `navigate`, make `onClick` a no-op, skip `fetchNextPage`), run the one spec, see it fail on both browsers, restore. When two layers enforce the same rule (native `type="email"` and zod), break both or the test stays green.

Imports must come from Vitest 4 paths. For the list of APIs never to use, see [references/outdated-apis.md](references/outdated-apis.md). Sources are in [references/sources.md](references/sources.md).
