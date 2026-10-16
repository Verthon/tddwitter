---
name: tailwind-v4
description: Tailwind CSS 4.1 how-tos for this repo's web app. Use when writing or changing any `className`, styling a component in `web/src/**` (including `src/ui` wrappers), mapping props to classes, or editing `web/src/App.css` (`@theme`, `@source`, custom variants).
---

# Tailwind v4 in `web/`

Rules live in [web/AGENTS.md](../../../web/AGENTS.md) (generic UI in `src/ui`, no `className` prop on components). This skill shows how, for `tailwindcss@4.1.13` with `@tailwindcss/postcss@4.1.13`. If the two disagree, `AGENTS.md` wins; report the conflict.

Every recipe and table row below was checked with computed styles in temporary browser specs (chromium + webkit). Your v3 memory is wrong in several places; trust this file.

## Setup facts

- CSS-first config. No `tailwind.config.js`. `web/src/App.css` is the only stylesheet: `@import "tailwindcss";` plus `@theme { … }`.
- Build: `postcss.config.mjs` with `@tailwindcss/postcss` (rsbuild in the app, Vite in vitest). Browser specs import `src/App.css` in `src/test/setup.browser.ts`, so computed styles in tests are real.
- Classes are found by scanning source files as plain text. Everything under `web/` except `.gitignore`d files, `node_modules`, CSS and lock files.

## Always write complete class names

The scanner can't run code. `` `p-${n}` `` generates nothing. Verified: `p-${9}` gives `padding: 0`, while `{ seven: 'p-7' }[k]` gives 28px.

```tsx
const paddingClasses = {
  2: 'p-2',
  4: 'p-4',
  12: 'p-12',
} as const;

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:enabled:bg-blue-700',
  ghost: 'bg-transparent text-gray-900 hover:enabled:bg-gray-100',
} as const;
```

Map every prop value to a full literal, responsive prefixes included (`'md:p-6'`, not `` `md:p-${x}` ``). An interpolated class can look fine only because some other file happens to contain the same literal; delete that file and it breaks. Verified: adding `'lg:p-12'` in an unrelated spec made the broken `Box` padding "work".

`src/ui/box/Box.tsx` shows the pattern for responsive props: one literal map per breakpoint (`paddingMap`, `mdPaddingMap`, `lgPaddingMap`); `Box.browser.spec.tsx` checks computed padding per viewport.

## v4 differences that bite (verified)

| You write (v3 habit) | v4 result | Write instead |
|---|---|---|
| `border` | border color is `currentColor`, not gray-200 | `border border-gray-200` |
| `ring` | 1 px, `currentColor` | `ring-3 ring-blue-500` (or `ring-2 …` as in `Button`) |
| `rounded`, `shadow`, `blur` | still work; `rounded` = `rounded-sm` = 4 px | use the explicit scale: `rounded-sm`, `shadow-sm`, `blur-sm` (v3 `-sm` is now `-xs`) |
| `outline-none` | really sets `outline-style: none` | `outline-hidden` keeps a transparent outline only in forced-colors mode; use it for focus resets |
| `<button>` | `cursor: default` | add `cursor-pointer` (our `Button`/`IconButton` do) |
| `!p-2` | deprecated | `p-2!` |
| `bg-[--my-var]` | not a var | `bg-(--my-var)` |
| `bg-opacity-50` | removed | `bg-black/50` |
| `space-y-4` | margin-bottom on every child but the last | prefer `flex flex-col gap-4` |

Full rename/removal list: [references/v3-to-v4.md](references/v3-to-v4.md).

## Variants

```tsx
<Field.Label className="data-disabled:opacity-50" />
<Field.Control className="data-invalid:border-red-500 data-[disabled]:cursor-not-allowed" />
<div className="hidden md:block" />
<button aria-pressed={isLiked} className="aria-pressed:text-red-600 not-focus:opacity-60" />
<ul className="*:first:pt-1" />
```

- `data-<name>:` matches presence of `data-<name>` (Base UI state attributes). `data-[name]:` still works; prefer the short form in new code. Value match: `data-[side=top]:`.
- Breakpoints are min-width: `md` = 48 rem (768 px). Verified: `hidden md:block` is `none` at 767 px, `block` at 768 px.
- `hover:` is wrapped in `@media (hover: hover)` (read from the installed build): hover styles don't apply on touch screens. Don't hide anything that only appears on hover.
- Stacked variants apply left to right: `*:first:pt-0`.

## Theme tokens

Add design tokens in `App.css` `@theme`. A variable in a known namespace creates utilities:

```css
@theme {
  --color-brand: #1d9bf0;
}
```

Verified: `bg-brand` and `text-brand/50` work after adding it. Namespaces and z-index: [references/theme.md](references/theme.md).

## Pitfalls

| Don't | Do |
|---|---|
| `` `text-${color}-600` ``, `` `p-${n}` `` | A map of complete literals |
| A `className` prop on our components to let callers restyle | A variant/size prop mapped to literals (rule in `web/AGENTS.md`) |
| `z-foo` for a `--z-foo` token | There is no z-index namespace; `z-foo` does nothing. `z-(--z-foo)` works |
| `tailwind.config.js`, `@tailwind base`, `theme()` in new CSS | `@theme`, `@import "tailwindcss"`, `var(--color-…)` |
| Hard-coded hex in `className` (`bg-[#1d9bf0]`) for a brand color used twice | A `@theme` token |
| Assume a class works because the page looks right | In a browser spec, `getComputedStyle(locator.element())` on the property |

Sources: [references/sources.md](references/sources.md).
