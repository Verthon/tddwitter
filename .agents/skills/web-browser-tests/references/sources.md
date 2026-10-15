# Sources

Official:
- Vitest 4 browser mode guide: https://v4.vitest.dev/guide/browser/
- Vitest locators: https://vitest.dev/guide/browser/locators
- Vitest assertion API (`expect.element`): https://vitest.dev/guide/browser/assertion-api
- Vitest 4 migration (provider objects, `vitest/browser` import): https://v4.vitest.dev/guide/migration
- vitest-browser-react README: https://github.com/vitest-community/vitest-browser-react
- MSW in Vitest browser mode: https://mswjs.io/docs/recipes/vitest-browser-mode
- MSW network behavior overrides: https://mswjs.io/docs/best-practices/network-behavior-overrides
- MSW `delay`: https://mswjs.io/docs/api/delay
- MSW `HttpResponse`: https://mswjs.io/docs/api/http-response
- MSW `worker.start` options: https://mswjs.io/docs/api/setup-worker/start
- Testing Library query priority: https://testing-library.com/docs/queries/about/#priority
- TanStack Query testing guide: https://tanstack.com/query/v5/docs/framework/react/guides/testing
- React Router `createMemoryRouter` / `initialEntries`: https://reactrouter.com/api/data-routers/createMemoryRouter

Verified from installed sources (`node_modules`), where the web docs had already moved to newer majors:
- `vitest-browser-react@2.0.2`: `render` returns a Promise; auto-cleanup runs in `beforeEach`.
- `@vitest/browser@4.0.16`: locator `exact` defaults to `false`; `expect.element` timeout defaults to the remaining test time; interactions that aren't awaited never start.
- `vitest@4.0.16`: `expect.poll` defaults to `timeout: 1000`, `interval: 50` (`createExpectPoll`).
- `msw@2.12.4`: the option is `onUnhandledRequest`. Current MSW docs show `onUnhandledFrame`, which belongs to a newer major.

Repo-observed (run on chromium and webkit):
- Under `MemoryRouter`, `globalThis.location.pathname` stays `/`.
- `{ once: true }` handler consumed after a `delay('infinite')` test.
- Query-level `retry: 3` in `useInfiniteTimeline` makes error tests take about 7 s.
- Base UI timeline cards: the `relative z-10` content layer intercepts pointer events over the stretched `<Link>`; Playwright reports "subtree intercepts pointer events".
