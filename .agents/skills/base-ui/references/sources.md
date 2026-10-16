# Sources

Checked 2026-10-16 against installed `@base-ui/react@1.0.0`. base-ui.com documents 1.9.0 at that date; when the docs and the installed code differ, the code wins for this repo.

## Official (base-ui.com)

- Quick start (package, subpath imports, portals, `isolation: isolate` root): https://base-ui.com/react/overview/quick-start
- Styling (`className` string or state function, data attributes, CSS variables, Tailwind): https://base-ui.com/react/handbook/styling
- Composition (`render` prop, ref + prop spreading): https://base-ui.com/react/handbook/composition
- Form (`errors`, `onFormSubmit`, `validationMode`, zod example): https://base-ui.com/react/components/form
- Field: https://base-ui.com/react/components/field
- Button: https://base-ui.com/react/components/button
- Dialog: https://base-ui.com/react/components/dialog
- Alert Dialog: https://base-ui.com/react/components/alert-dialog
- Menu: https://base-ui.com/react/components/menu
- Toast (anatomy, `useToastManager`, `createToastManager`, F6 landmark, screen-reader notes): https://base-ui.com/react/components/toast
- Avatar: https://base-ui.com/react/components/avatar

## Read from installed source (`web/node_modules/@base-ui/react/esm`)

- `package.json` exports: the subpath list in `SKILL.md`.
- `field/control/FieldControlDataAttributes.js`: `data-disabled`, `data-valid`, `data-invalid`, `data-touched`, `data-dirty`, `data-filled`, `data-focused`.
- `form/Form.d.ts`: `onFormSubmit(formValues, eventDetails)`, `errors`, `validationMode`.
- `button/Button.d.ts`: `focusableWhenDisabled`, `nativeButton`.
- `dialog/root/DialogRoot.d.ts`: `modal`, `disablePointerDismissal`, `actionsRef`; `dialog/popup/DialogPopup.d.ts`: `initialFocus`, `finalFocus`.
- `toast/useToastManager.d.ts`: `close: (toastId: string) => void` (id required); add options.
- `toast/close/ToastClose.js`: `aria-hidden` is `!expanded && !hasFocus`.

## Repo-observed (chromium + webkit, temporary specs since deleted)

- Form `errors` show in `Field.Error`, mark the control invalid and clear when the field is edited.
- `Field.Control render={<textarea />}` keeps label association; value is submitted under its `name`.
- `className` state function; `data-disabled` on `Button`; `focusableWhenDisabled` keeps Tab focus with `aria-disabled="true"`.
- Dialog: `role="dialog"` named by Title, focus to first tabbable, Escape closes, focus returns to trigger; controlled close after async submit.
- Unpositioned `Dialog.Popup`: click blocked by `data-base-ui-inert` overlay.
- Portalled popup covered by a `fixed z-10` page layer unless the app container has `isolation: isolate`.
- Menu: `menuitem` role, `onClick` runs, menu closes.
- Toast: `role="dialog"` named by title, `data-type`, Close removes it.
- First run of a spec importing new subpaths (`dialog`, `menu`, `toast`): "Vite unexpectedly reloaded a test" and `Cannot read properties of null (reading 'useContext')`; the re-run passed. A full cold-cache run did not reproduce it.

No secondary sources were needed. The previously linked `https://base-ui.com/llms.txt` was not used.
