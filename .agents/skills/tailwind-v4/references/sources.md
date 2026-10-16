# Sources

Checked 2026-10-16 against installed `tailwindcss@4.1.13` and `@tailwindcss/postcss@4.1.13`. When the docs and the installed code differ, the code wins for this repo.

## Official (tailwindcss.com)

- Upgrade guide (renames, removed utilities, default changes, variant order, `!`, `bg-(--var)`, `space-*`, hover media query): https://tailwindcss.com/docs/upgrade-guide
- Detecting classes in source files (plain-text scan, complete class names, ignored files, `@source`, `@source inline`): https://tailwindcss.com/docs/detecting-classes-in-source-files
- Theme variables (namespaces, `initial`, `inline`, `static`): https://tailwindcss.com/docs/theme
- Hover, focus and other states (`data-*`, `aria-*`, `not-*`, `in-*`, named groups/peers, `@custom-variant`): https://tailwindcss.com/docs/hover-focus-and-other-states
- Responsive design (min-width breakpoints): https://tailwindcss.com/docs/responsive-design
- z-index: https://tailwindcss.com/docs/z-index

## Read from installed source (`web/node_modules/tailwindcss/dist/lib.js`)

- `hover` variant: `&:hover` inside `@media (hover: hover)`.
- `outline-hidden`: `outline-style: none`, plus `outline: 2px solid transparent` only under `@media (forced-colors: active)`.

## Repo-observed (computed styles, chromium + webkit, temporary specs since deleted)

- `` `p-${n}` `` → no padding; literal from a map → padding.
- `Box` with `padding={[4, 6, 12]}` at 1280 px → 16 px (bug); a literal `lg:p-12` anywhere in the project made it 48 px.
- `border` color = `currentColor`; `ring` = 1 px, `ring-3` = 3 px; `<button>` cursor `default`; `outline-none` = `none`; `rounded` = `rounded-sm` = 4 px; `bg-black/30`; `bg-(--var)`; `p-1 p-2!` → 8 px; `space-y-4` → margin-bottom on non-last children.
- `data-disabled:` and `data-[disabled]:` both match Base UI's `data-disabled`; `data-[side=top]:`; `aria-pressed:`; `not-focus:`; `*:first:`.
- `hidden md:block`: hidden at 767 px, block at 768 px.
- `@theme { --color-brand }` → `bg-brand`, `text-brand/50`. `z-floating` → `auto`; `z-(--z-floating)` → `50`.

No secondary sources were needed. The previously linked community `tailwind-llms.txt` was not used.
