# MSW per-test overrides (msw 2.12.4, browser worker)

The worker comes from `src/integrations/mockServer.ts`. `setup.browser.ts` resets runtime handlers after each test, so put `worker.use` at the top of a test, before you render. Build URLs from the same env var the service uses (`import.meta.env.PUBLIC_<FEATURE>_API`).

```tsx
import { delay, HttpResponse, http } from 'msw';
import { worker } from 'src/integrations/mockServer';
import enTimeline from 'src/timeline/i18n/en.json';

const timelineApi = import.meta.env.PUBLIC_TIMELINE_API;
const authApi = import.meta.env.PUBLIC_AUTH_API;
const engagementApi = import.meta.env.PUBLIC_ENGAGEMENT_API;
```

## Success with custom data (query and mutation)

The handler method must match the service (`unlikePost` uses `DELETE`, not `POST`).

```tsx
worker.use(
  http.get(`${engagementApi}/posts/p1/like`, () => HttpResponse.json({ isLiked: true, likeCount: 4 })),
  http.delete(`${engagementApi}/posts/p1/like`, () => HttpResponse.json({ isLiked: false, likeCount: 3 })),
);
await renderWithProviders(<LikeButton postId="p1" />);
const unlike = page.getByRole('button', { name: /unlike/i });
await expect.element(unlike).toBeVisible();
await userEvent.click(unlike);
await expect.element(page.getByRole('button', { name: /^like/i })).toBeVisible();
```

## HTTP error (4xx/5xx)

```tsx
worker.use(http.get(`${timelineApi}/timeline`, () => HttpResponse.json({ error: 'boom' }, { status: 500 })));
await renderWithProviders(<TimelineList />);
await expect.element(page.getByRole('alert')).toBeVisible();
await expect.element(page.getByRole('button', { name: enTimeline['timeline.tryAgain'] })).toBeVisible();
```

## Network failure

`HttpResponse.error()` makes `fetch` reject. The error message differs between chromium and webkit, so assert the UI state, not the message.

```tsx
worker.use(http.get(`${timelineApi}/timeline`, () => HttpResponse.error()));
await renderWithProviders(<TimelineList />);
await expect.element(page.getByRole('alert')).toBeVisible();
```

## Empty

```tsx
worker.use(http.get(`${timelineApi}/timeline`, () => HttpResponse.json({ items: [], nextCursor: null, hasMore: false })));
await renderWithProviders(<TimelineList />);
await expect.element(page.getByText(enTimeline['timeline.noPosts'])).toBeVisible();
```

## Loading state forever

```tsx
worker.use(
  http.get(`${timelineApi}/timeline`, async () => {
    await delay('infinite');
    return HttpResponse.json({});
  }),
);
await renderWithProviders(<TimelineList />);
await expect.element(page.getByRole('status')).toHaveTextContent(enTimeline['timeline.loading']);
```

## Loading, then data

```tsx
worker.use(
  http.get(`${timelineApi}/timeline`, async () => {
    await delay(200);
    return HttpResponse.json({
      items: [{ id: 'x1', avatar: '', username: 'slowpoke', content: 'late', timestamp: '2024-01-20T10:30:00Z' }],
      nextCursor: null,
      hasMore: false,
    });
  }),
);
await renderWithProviders(<TimelineList />);
await expect.element(page.getByText(enTimeline['timeline.loading'])).toBeVisible();
await expect.element(page.getByText('slowpoke')).toBeVisible();
await expect.element(page.getByText(enTimeline['timeline.loading'])).not.toBeInTheDocument();
```

## Capture the request body and call count

```tsx
let body: unknown;
worker.use(
  http.post(`${authApi}/login`, async ({ request }) => {
    body = await request.json();
    return HttpResponse.json({ id: 'u1' });
  }),
);
await renderWithProviders(<LoginPage />, { route: '/login' });
await expect.element(page.getByTestId('location')).toHaveTextContent(/^\/$/);
expect(body).toEqual({ email: 'user@example.com', password: 'password123' });
```

```tsx
let calls = 0;
worker.use(
  http.get(`${timelineApi}/timeline`, () => {
    calls += 1;
    return HttpResponse.json({ items: [], nextCursor: null, hasMore: false });
  }),
);
await renderWithProviders(<TimelineList />);
await expect.poll(() => calls).toBe(1);
```

## Mutation failure keeps the user on the page

```tsx
worker.use(http.post(`${authApi}/login`, () => HttpResponse.json({ error: 'bad' }, { status: 401 })));
await renderWithProviders(<LoginPage />, { route: '/login' });
await expect.element(page.getByRole('button', { name: enCore['core.auth.login.submitButton'] })).toBeEnabled();
await expect.element(page.getByTestId('location')).not.toBeInTheDocument();
```

## Notes

- Feature helpers such as `mockEngagementResponse(method, path, response)` (built on `src/integrations/mockUtils.ts`) call `worker.use` for you. Either style is fine.
- Unhandled requests print a warning (custom `onUnhandledRequest` in `mockServer.ts`). Don't depend on real network calls.
- `{ once: true }` is order-sensitive here: a preceding `delay('infinite')` test made it fail. Don't use it unless the test needs a different response for the second call.
- Query-level `retry` overrides the test client's `retry: false`. Error tests for `useInfiniteTimeline` take about 7 s because it retries 3 times with backoff.
