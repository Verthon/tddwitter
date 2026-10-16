# Menu and Toast

## Menu (account menu with "Log out")

```tsx
import { Menu } from '@base-ui/react/menu';

<Menu.Root>
  <Menu.Trigger>{t('core.account.menu')}</Menu.Trigger>
  <Menu.Portal>
    <Menu.Positioner sideOffset={8}>
      <Menu.Popup className="rounded-xl bg-white py-1 shadow-lg">
        <Menu.Item onClick={logout} className="px-4 py-2 data-highlighted:bg-gray-100">
          {t('core.auth.logout')}
        </Menu.Item>
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
</Menu.Root>
```

Verified: the trigger is a `button`; items are `role="menuitem"`; `onClick` runs and the menu closes (item unmounted). `Menu.Positioner` handles placement, so the popup needs no `fixed`. `Menu.Item closeOnClick={false}` keeps it open (from `.d.ts`, not run).

Testing:

```tsx
await userEvent.click(page.getByRole('button', { name: enCore['core.account.menu'] }));
await userEvent.click(page.getByRole('menuitem', { name: enCore['core.auth.logout'] }));
```

## Toast ("Post sent", "Couldn't like post")

One provider near the app root, one viewport that renders `toasts`, and `useToastManager().add` wherever a toast is raised:

```tsx
import { Toast } from '@base-ui/react/toast';

export const ToastList = () => {
  const { toasts } = Toast.useToastManager();
  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed right-4 bottom-4 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast} className="rounded-lg bg-gray-900 p-3 text-white data-[type=error]:bg-red-700">
            <Toast.Content>
              <Toast.Title />
              <Toast.Description />
              <Toast.Close aria-label={t('core.close')}>
                <XMarkIcon className="size-4" aria-hidden="true" />
              </Toast.Close>
            </Toast.Content>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
};

<Toast.Provider>
  <App />
  <ToastList />
</Toast.Provider>

const toastManager = Toast.useToastManager();
toastManager.add({ title: t('composer.toast.sent'), type: 'success' });
```

Verified: `add` renders the title and description; `type` becomes `data-type`; `Toast.Close` removes it.

Facts for 1.0.0:
- `Provider` props: `timeout` (ms, default 5000, `0` = never), `limit` (default 3), `toastManager`.
- `add(options)` returns the id. Options: `title`, `description`, `type`, `timeout`, `priority` (`'low'` | `'high'`), `actionProps`, `onClose`, `onRemove`.
- `close(id)` **requires** the id in 1.0.0 (newer docs show it optional).
- `promise(promise, { loading, success, error })` and `update(id, options)` exist (from `.d.ts`, not run).
- To raise toasts outside React (e.g. a React Query `onError`), create one manager with `Toast.createToastManager()` and pass it to `<Toast.Provider toastManager={…}>` (from `.d.ts`, not run).

Testing:
- Each toast is `role="dialog"` named by its title: `page.getByRole('dialog', { name: … })`.
- `Toast.Close` is `aria-hidden` until the viewport is expanded or the toast is focused (`ToastClose.js`), so `getByRole('button', { name })` doesn't find it. Use `toast.getByRole('button', { name, includeHidden: true })`.
- Render the provider with `timeout={0}` in specs that assert a toast, so it doesn't vanish mid-test.
