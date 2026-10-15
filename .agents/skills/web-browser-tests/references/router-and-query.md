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
