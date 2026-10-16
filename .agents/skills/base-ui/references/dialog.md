# Dialog

`@base-ui/react/dialog`. Use for the compose-post modal or a logout confirmation (`@base-ui/react/alert-dialog` exists for confirmations; not verified here, check its docs and `.d.ts` first).

## Uncontrolled

```tsx
import { Dialog } from '@base-ui/react/dialog';

<Dialog.Root>
  <Dialog.Trigger>{t('composer.open')}</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop className="fixed inset-0 bg-black/40 transition-opacity data-starting-style:opacity-0 data-ending-style:opacity-0" />
    <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-xl -translate-1/2 rounded-2xl bg-white p-4 transition-opacity data-starting-style:opacity-0 data-ending-style:opacity-0">
      <Dialog.Title>{t('composer.createPost.heading')}</Dialog.Title>
      <Dialog.Description>…</Dialog.Description>
      …
      <Dialog.Close>{t('core.close')}</Dialog.Close>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

Verified behaviour (modal by default):
- `Trigger` and `Close` are `<button>`s. The popup has `role="dialog"`, named by `Dialog.Title` (`getByRole('dialog', { name })`), and `data-open` while open.
- Focus moves to the first tabbable element inside; `Escape` closes; focus returns to the trigger.
- Closed popups are unmounted (`not.toBeInTheDocument()`).

## Controlled: close after an async submit

```tsx
const [open, setOpen] = useState(false);

<Dialog.Root open={open} onOpenChange={setOpen}>
  …
  <form
    onSubmit={async (event) => {
      event.preventDefault();
      await createPost(values);
      setOpen(false);
    }}
  >
```

Verified. `onOpenChange` is `(open, eventDetails) => void`; passing `setOpen` directly works.

## Root props (1.0.0 `.d.ts`)

`open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`, `modal` (`true` | `false` | `'trap-focus'`), `disablePointerDismissal`, `actionsRef` (`close`, `unmount`). `Popup` takes `initialFocus` / `finalFocus` (ref, boolean or function).

## Pitfalls

- The popup **must be positioned** (`fixed …`). Unpositioned, it sits under Base UI's inert overlay: Playwright reports `<div … data-base-ui-inert> intercepts pointer events` and real users can't click it either.
- Page layers with `z-*` cover the portalled popup unless the app root has `isolation: isolate`. Verified both ways.
- Keep a `Dialog.Close` inside the popup for modal dialogs (touch screen-reader users need it).

## Testing

```tsx
await userEvent.click(page.getByRole('button', { name: enComposer['composer.open'] }));
const dialog = page.getByRole('dialog', { name: enComposer['composer.createPost.heading'] });
await expect.element(dialog).toBeVisible();
await userEvent.keyboard('{Escape}');
await expect.element(dialog).not.toBeInTheDocument();
```
