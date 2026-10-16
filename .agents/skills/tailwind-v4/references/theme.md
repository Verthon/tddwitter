# Theme tokens (`web/src/App.css`)

## Adding a token

```css
@import "tailwindcss";

@theme {
  --color-brand: #1d9bf0;
}
```

Verified: `bg-brand`, `text-brand/50` work. The token is also a CSS variable: `var(--color-brand)`.

## Namespaces that create utilities

| Variable | Utilities |
|---|---|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `ring-*`, `fill-*`, … |
| `--font-*` | `font-*` (family) |
| `--text-*` | `text-*` (size) |
| `--font-weight-*` | `font-*` (weight) |
| `--tracking-*`, `--leading-*` | letter spacing, line height |
| `--breakpoint-*` | `sm:`, `md:`, … variants |
| `--container-*` | `@sm:` container variants, `max-w-*` |
| `--spacing` | one base unit (default `0.25rem`); `p-4` = 4 × spacing |
| `--radius-*` | `rounded-*` |
| `--shadow-*`, `--inset-shadow-*`, `--drop-shadow-*` | shadows |
| `--blur-*` | `blur-*` |
| `--aspect-*` | `aspect-*` |
| `--ease-*`, `--animate-*` | transitions, `animate-*` |

There is **no z-index namespace**. `App.css` defines `--z-floating: 50`, but nothing uses it and `z-floating` generates nothing (verified: `z-index: auto`). Use `z-(--z-floating)` (verified: `50`) or plain `z-50`.

## Other options

- Replace a whole namespace: `--color-*: initial;` then define your own (removes `bg-red-500` etc.).
- A token that references another variable: `@theme inline { --font-sans: var(--font-inter); }`.
- Only used variables are emitted. `@theme static` emits all.

These three are doc claims; verify before relying on them.
