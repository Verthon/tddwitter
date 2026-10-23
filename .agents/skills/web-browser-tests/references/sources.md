# Sources

Official:
- Vitest browser mode guide: https://vitest.dev/guide/browser/
- Vitest locators: https://vitest.dev/guide/browser/locators
- Vitest assertion API (`expect.element`): https://vitest.dev/guide/browser/assertion-api
- Vitest migration guide (v4 → v5: exact locators, `toMatchTextContent`, `expect.poll` rejects on timeout; v3 → v4: provider objects, `vitest/browser` import): https://vitest.dev/guide/migration
- vitest-browser-react README: https://github.com/vitest-community/vitest-browser-react
- MSW in Vitest browser mode: https://mswjs.io/docs/recipes/vitest-browser-mode
- MSW network behavior overrides: https://mswjs.io/docs/best-practices/network-behavior-overrides
- MSW `delay`: https://mswjs.io/docs/api/delay
- MSW `HttpResponse`: https://mswjs.io/docs/api/http-response
- MSW `worker.start` options: https://mswjs.io/docs/api/setup-worker/start
- Testing Library query priority: https://testing-library.com/docs/queries/about/#priority
- TanStack Query testing guide: https://tanstack.com/query/v5/docs/framework/react/guides/testing
- React Router `createMemoryRouter` / `initialEntries`: https://reactrouter.com/api/data-routers/createMemoryRouter

Verified from installed sources (`node_modules`) or with a temporary spec on chromium and webkit:
- `vitest-browser-react@2.3.0`: `render` returns a Promise; auto-cleanup runs in `beforeEach`.
- `@vitest/browser@5.0.5`: locators match exactly and case-sensitively (`getByText('timeline')` finds nothing in `Timeline Feed`; `exact: false` finds it). `toHaveTextContent('Timeline')` fails on `Timeline Feed`; `toHaveTextContent(/regex/)` fails even when the regex matches; `toMatchTextContent` takes the regex. `expect.element` timeout defaults to the remaining test time; interactions that aren't awaited never start.
- `vitest@5.0.5`: `expect.poll` rejects after `test.expect.poll.timeout` (5 s here, measured 5001 ms); Vitest's own default is 1 s, `interval` 50 ms. `expect.element` passes its own timeout on playwright (about the remaining test time: 19.6 s measured in a 20 s test), so `expect.poll.timeout` does not change it (`processTimeoutOptions` in `@vitest/browser`).
- `msw@2.12.4`: the option is `onUnhandledRequest`. Current MSW docs show `onUnhandledFrame`, which belongs to a newer major.

Repo-observed (run on chromium and webkit):
- Under `MemoryRouter`, `globalThis.location.pathname` stays `/`.
- `{ once: true }` handler consumed after a `delay('infinite')` test.
- Query-level `retry: 3` in `useInfiniteTimeline` makes error tests take about 7 s.
- Base UI timeline cards: the `relative z-10` content layer intercepts pointer events over the stretched `<Link>`; Playwright reports "subtree intercepts pointer events".
