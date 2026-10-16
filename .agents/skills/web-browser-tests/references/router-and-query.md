# Router and React Query

## How `renderWithProviders` routes

```tsx
<MemoryRouter initialEntries={[route]}>
  <Routes>
    <Route path={path} element={ui} />
    <Route path="*" element={<LocationProbe />} />
  </Routes>
</MemoryRouter>
```

`window.location` never changes under `MemoryRouter`. Navigation is only observable inside the router, through the probe.

## Route params

```tsx
await renderWithProviders(<PostDetailPage />, { route: '/post/1', path: '/post/:id' });
await expect.element(page.getByText('johndoe')).toBeVisible();
```

## Assert navigation

After navigating away from `path`, the page unmounts and the probe shows the pathname. Anchor the regex, because `toHaveTextContent` with a string is a substring match.

```tsx
await userEvent.click(page.getByRole('button', { name: 'Go back' }));
await expect.element(page.getByTestId('location')).toHaveTextContent(/^\/$/);
```

Mount the UI on its real route (`{ route: '/create-post' }`, `{ route: '/signup' }`). With the default `route: '/'`, a redirect to `/` lands on the UI's own route and the probe never appears.

To assert that no navigation happened: `await expect.element(page.getByTestId('location')).not.toBeInTheDocument();`

## Real route config (lazy pages, `Suspense`)

Mount `AppRoutes` on a splat path so the app's own `<Routes>` resolves the URL:

```tsx
import { AppRoutes } from 'src/routing/Routes';

await renderWithProviders(<AppRoutes />, { route: '/post/1', path: '/*' });
await expect.element(page.getByText('johndoe')).toBeVisible();
```

Use this for cross-page flows. For a single page, render the page itself; it's faster and fails closer to the cause.

## React Query

- The helper creates a new `QueryClient` per render (`retry: false`, `staleTime: 0`, `gcTime: 0` as defaults). Never create a module-level client in a spec.
- Defaults are only fallbacks. Options set in `queryOptions`/hooks (`retry`, `staleTime`) win. Override the network (MSW) rather than the client.

## Auth state from `/me`

`SignedIn`/`SignedOut` read `useAuth` (`authQueries.me()`). While the query is pending, `SignedOut` shows its children and `SignedIn` hides them. A "signed-out" assertion made right after render therefore passes before `/me` has answered, even if the app calls a different URL. Gate on the request first:

```tsx
let meRequests = 0;
worker.use(
  http.get(`${apiBase}/auth/me`, () => {
    meRequests += 1;
    return HttpResponse.json({ error: { en: 'Unauthorized' } }, { status: 401 });
  }),
);
await renderWithProviders(<AppRoutes />, { route: '/login', path: '/*' });
await expect.poll(() => meRequests).toBeGreaterThan(0);
await expect.poll(() => page.getByRole('link', { name: enCore['core.auth.sidebar.login'], exact: true }).length).toBeGreaterThan(0);
```

Verified: with `/me` held by `delay('infinite')`, the sidebar's Log in link is visible.

## Errored queries refetch on remount

A query in `error` state refetches when a new observer mounts (`retryOnMount`, default `true`), even with `staleTime: 5 min`. `authQueries.me()` sets `retry: false`, which doesn't stop this. Consequence: after a login that navigates to another page, the new page's `SignedIn` refetches the 401'd `/me` on its own, so a test that only checks the next page stays green without `invalidateQueries`. To prove an invalidation, assert on an observer that stays mounted across the mutation, or count requests without a remount.

Verified: unmounting and remounting a `useQuery(authQueries.me())` observer after a 401 sends a second `/me` request (chromium + webkit).
