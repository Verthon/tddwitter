---
name: base-ui
description: Base UI 1.0 (`@base-ui/react`) how-tos for this repo's web app. Use when importing from `@base-ui/react/*`, building or changing a `web/src/ui` wrapper, or adding forms/fields, buttons, dialogs/modals, menus, toasts or avatars.
---

# Base UI in `web/`

Rules live in [web/AGENTS.md](../../../web/AGENTS.md): generic wrappers in `src/ui/<name>/`, compound components, at most 10 props, no `className` prop, heroicons for icons. This skill shows how with `@base-ui/react@1.0.0`. If the two disagree, `AGENTS.md` wins; report the conflict.

The package is `@base-ui/react` (not the old `@base-ui-components/react`). base-ui.com documents a newer 1.x; when a prop from the docs doesn't type-check, read `web/node_modules/@base-ui/react/esm/<component>/**/*.d.ts`. Every recipe here was run on chromium and webkit.

## Load on demand

| Building | Read |
|---|---|
| A form, field, server-side errors (login), textarea | [references/forms.md](references/forms.md) |
| A modal (compose post, confirm logout) | [references/dialog.md](references/dialog.md) |
| An account menu, toasts ("Post sent") | [references/menu-toast.md](references/menu-toast.md) |

## Imports

Import each component from its subpath and use the namespace's parts and types:

```tsx
import { Field as BaseField } from '@base-ui/react/field';

const FieldLabel = (props: BaseField.Label.Props) => (
  <BaseField.Label {...props} className="text-sm font-medium text-gray-900 data-disabled:opacity-50" />
);
```

Subpaths in 1.0.0 include `button`, `field`, `form`, `input`, `dialog`, `alert-dialog`, `menu`, `popover`, `tooltip`, `toast`, `avatar`, `tabs`, `switch`, `checkbox`, `scroll-area`, `separator`, `toggle`.

## Wrapping a part in `src/ui`

Pattern used by `src/ui/field/Field.tsx`: take the part's `Props` type, spread it, then set `className` **after** the spread so callers can't override styling.

```tsx
const FieldControl = (props: BaseField.Control.Props) => (
  <BaseField.Control
    {...props}
    className="h-10 w-full rounded-md border border-gray-200 pl-3.5 data-invalid:border-red-500"
  />
);

export const Field = { Root: FieldRoot, Label: FieldLabel, Control: FieldControl, Error: FieldError };
```

To drop `className` from the public type too: `Omit<BaseField.Control.Props, 'className'>`.

## Styling state

Base UI sets `data-*` attributes for state; style them with Tailwind's `data-<name>:` variants (see the `tailwind-v4` skill).

| Part | Attributes we use |
|---|---|
| `Field.*` | `data-disabled`, `data-invalid`, `data-valid`, `data-touched`, `data-dirty`, `data-filled`, `data-focused` |
| `Button` | `data-disabled` |
| `Dialog.Popup` / `Backdrop` | `data-open`, `data-closed`, `data-starting-style`, `data-ending-style` |
| `Menu.Item` | `data-highlighted`, `data-disabled` |
| `Toast.Root` | `data-type`, `data-starting-style`, `data-ending-style` |

`className` also accepts a function of the part's state:

```tsx
<Button disabled className={(state) => (state.disabled ? 'opacity-50' : 'opacity-100')}>
```

Prefer the `data-*` variant in a static string; use the function only when the classes differ by more than one variant.

## Buttons

`@base-ui/react/button` renders a native `<button>` and sets `data-disabled`. For a submit button that shows a pending state, keep it focusable so focus doesn't jump:

```tsx
import { Button } from '@base-ui/react/button';

<Button type="submit" disabled={isPending} focusableWhenDisabled>
```

Verified: `aria-disabled="true"`, and Tab still focuses it.

## `render` prop

Swap the element a part renders, keeping its behaviour and ARIA wiring:

```tsx
<Field.Control render={<textarea rows={4} />} />
```

Verified: `getByLabelText` resolves to the `<textarea>`. A custom component passed to `render` must accept `ref` and spread all props onto its DOM node. The function form `render={(props, state) => …}` exists for full control; `CreatePostForm` uses it, but the element form is enough for a textarea.

## Pitfalls

| Don't | Do |
|---|---|
| `import … from '@base-ui-components/react'` | `@base-ui/react/<component>` |
| Copy a prop from base-ui.com without checking | Docs are ahead of 1.0.0; check the installed `.d.ts`. Example: `toastManager.close(id)` requires the id in 1.0.0 |
| Leave a `Dialog.Popup` unpositioned | Give it `fixed …`. A static popup sits under Base UI's inert overlay and clicks on it fail ("data-base-ui-inert intercepts pointer events") |
| Portalled popups (Dialog, Menu, Toast) next to page `z-10`/`z-50` layers | The app root needs `isolation: isolate` (Tailwind `isolate`); without it a `z-10` page layer covers the popup (verified). `#root` doesn't have it yet |
| Hard-coded strings in wrappers | Labels come from the feature's `i18n/en.json` (rule in `web/AGENTS.md`) |
| Treat "Vite unexpectedly reloaded a test" + `Cannot read properties of null (reading 'useContext')` as an app bug | It happens the first time a spec imports a Base UI subpath Vite hasn't pre-bundled. Re-run the spec |

For testing Base UI UI (roles, toast close button, forms): the `web-browser-tests` skill plus the "Testing" notes in each reference. Sources: [references/sources.md](references/sources.md).
