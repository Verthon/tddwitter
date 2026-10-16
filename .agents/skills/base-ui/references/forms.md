# Forms and fields

`Form` (`@base-ui/react/form`) + `Field` parts. Our styled parts are `Field` from `src/ui/field/Field.tsx`; reference implementation: `src/core/auth/components/LoginForm.tsx`.

## Anatomy

```tsx
<Form errors={errors} validationMode="onBlur" onFormSubmit={handleSubmit}>
  <Field.Root name="email">
    <Field.Label>{t('core.auth.login.emailLabel')}</Field.Label>
    <Field.Control type="email" autoComplete="email" required />
    <Field.Error />
  </Field.Root>
  <Button type="submit">…</Button>
</Form>
```

- `Field.Root name` is the key in submitted values and in `errors`.
- `onFormSubmit(values, eventDetails)` gets `{ [name]: value }`; `preventDefault()` is already called. Verified: a `textarea` control's value arrives under its `name`.
- `validationMode`: `'onSubmit'` (default), `'onBlur'`, `'onChange'`. `Field.Root validationMode` overrides the form's.
- Native constraints (`required`, `type="email"`) run before `onFormSubmit`; see `web-browser-tests` for the testing consequences.

## Client validation with zod

Return `z.flattenError(result.error).fieldErrors` as `errors`; keys match `Field.Root name`. See `LoginForm.tsx` and `web/docs/zod-mini.md`.

## Server errors (login: wrong password, register: email taken)

Put the API's error into `errors` under the field it belongs to:

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

<Form
  errors={errors}
  onFormSubmit={async (values) => {
    const result = await login(values);
    if (!result.ok) setErrors({ password: t('core.auth.login.error.invalidCredentials') });
  }}
>
```

Verified: the message renders in that field's `Field.Error`, the control becomes invalid (`toBeInvalid()`, `data-invalid`), and the error disappears as soon as the user edits that field. A form-level error that belongs to no field (network down) is not a field error; render it outside the fields (e.g. a `role="alert"` element or a toast).

## Textarea (composer)

```tsx
<Field.Root name="content">
  <Field.Label className="sr-only">{t('composer.form.label')}</Field.Label>
  <Field.Control render={<textarea rows={4} />} />
  <Field.Error />
</Field.Root>
```

Verified: label association and submitted value both work. Use the function form of `render` only when you must merge handlers by hand.

## Field validation props (from 1.0.0 `.d.ts`)

- `Field.Root validate={(value, formValues) => string | string[] | null | Promise<…>}` for per-field custom checks.
- `Field.Root disabled`, `invalid`, `name`.
- `Field.Error match="valueMissing"` shows a message only for that validity state.

These three are read from the types, not run here; verify in a spec before relying on them.

## Testing

Field + Form specs: `web-browser-tests` → "Forms (Base UI `Form` + zod)". Locate controls with `getByLabelText`; assert `toBeInvalid()` and the `Field.Error` text.
