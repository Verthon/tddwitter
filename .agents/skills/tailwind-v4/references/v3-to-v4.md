# v3 → v4 changes

From the official upgrade guide (see [sources.md](sources.md)). Rows also listed in `SKILL.md` were verified in this repo; the rest are doc claims.

## Renamed scale (bare names still work but now mean the next size up)

| v3 | v4 |
|---|---|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `drop-shadow-sm` | `drop-shadow-xs` |
| `drop-shadow` | `drop-shadow-sm` |
| `blur-sm` | `blur-xs` |
| `blur` | `blur-sm` |
| `backdrop-blur-sm` | `backdrop-blur-xs` |
| `backdrop-blur` | `backdrop-blur-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `outline-none` | `outline-hidden` |
| `ring` | `ring-3` |

## Removed

| v3 | v4 |
|---|---|
| `bg-opacity-*`, `text-opacity-*`, `border-opacity-*`, `divide-opacity-*`, `ring-opacity-*`, `placeholder-opacity-*` | opacity modifier: `bg-black/50` |
| `flex-shrink-*` / `flex-grow-*` | `shrink-*` / `grow-*` |
| `overflow-ellipsis` | `text-ellipsis` |
| `decoration-slice` / `decoration-clone` | `box-decoration-slice` / `box-decoration-clone` |

## Behaviour changes

- Border and divide default color: `currentColor` (was gray-200).
- `ring`: 1 px `currentColor` (was 3 px blue-500).
- Placeholder default: current text color at 50 % opacity (was gray-400).
- Buttons: `cursor: default`.
- `space-*` / `divide-*`: style `:not(:last-child)` with bottom margin/border. Use `gap` in flex/grid.
- `hover:` only applies under `@media (hover: hover)`.
- Variants stack left to right.
- `!` goes at the end: `p-2!`.
- CSS variable shorthand: `bg-(--brand)`, not `bg-[--brand]`.
- Commas in arbitrary grid values are no longer spaces: `grid-cols-[max-content_auto]`.
- Preflight: `hidden` attribute wins over `block`/`flex`; `<dialog>` margins reset.
- `transform-none` no longer resets scale/rotate; use `scale-none` etc.
- `@tailwind base/components/utilities` → `@import "tailwindcss"`. `@layer components/utilities` for custom classes → `@utility name { … }`.
- `theme(colors.red.500)` → `var(--color-red-500)`.
- No `safelist`, `corePlugins`, `separator`. Safelist with `@source inline("…")`.
- CSS modules / separately bundled CSS need `@reference "…/App.css";` before `@apply`. We don't use CSS modules; keep styling in `className`.
- Browser floor: Safari 16.4, Chrome 111, Firefox 128.
