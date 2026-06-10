# Tailwind → inline-styles: conversion reference

Detailed spec for `convert.mjs`. The codemod does the deterministic bulk; this
doc is the source of truth for the mapping rules and for resolving the cases the
codemod flags (which need human judgment).

## Scope

- Operates on `className="…"` / `className={'…'}` string literals on **lowercase
  HTML elements only**. `className` on `<Component>`s (capitalized) is an
  intentional component API and is left untouched.
- Skips elements that already have a `style=` and reports them as
  "skipped — merge manually".

## Auto-converted (deterministic)

- **Layout**: `flex`, `inline-flex`, `grid`, `flex-col/row`, `items-*`,
  `justify-*`, `self-*`, `gap-N` (+`-x/-y`), `flex-1/auto/none`, `grow`,
  `shrink-0`, `space-x/y-N` → `display:flex` + `flexDirection` + `gap`.
- **Grid**: `grid-cols-N` → `gridTemplateColumns: repeat(N, minmax(0,1fr))`;
  `col-span-N`/`row-span-N` → `gridColumn`/`gridRow`; `col-span-full`.
- **Spacing**: `p*-N` / `m*-N`, scale = `N × 0.25rem` (`px`=1px, fractions,
  `[arbitrary]` supported, `mx-auto`).
- **Sizing**: `w/h/min-*/max-*/size-N`, `w-full`, `h-full`, `max-w-sm…7xl`,
  fractions (`1/2`→50%), arbitrary `[400px]`, `w-fit`, `w-screen`.
- **Typography**: `text-xs…6xl`, `font-thin…extrabold`, `text-center/left/right`,
  `uppercase/lowercase/capitalize`, `italic`, `truncate`, `leading-*`,
  `font-mono`, `font-inter`.
- **Borders/radius**: `border`, `border-t/b/l/r`, `border-0`, `rounded*`.
- **Effects**: `shadow-sm…xl`, `opacity-N`, `z-N`.
- **Colors → design-token CSS vars** (auto light/dark):
  - semantic: `text-foreground`, `text-muted-foreground`, `bg-background`,
    `bg-muted`, `bg-card`, `border-border`, … → `var(--…)`
  - single palette shade (`text-vanilla-800`, `bg-slate-900`) →
    `var(--text-…)` / `var(--bg-…)` (signoz palettes only)
  - `white`/`black`/`transparent`/`current`
- **Misc**: `overflow-*`, `cursor-*`, `position`, `appearance`-via static,
  `no-underline`, `whitespace-*`. The `!important` prefix is stripped (inline wins).

`space-y-N` becomes `display:flex; flexDirection:column; gap` — an approximation
that's correct for the simple stacked layouts in stories.

## Flagged cases — resolve by hand

The codemod leaves these in `className` and lists them. Apply:

- **`dark:` colour pairs** (`text-vanilla-800 dark:text-vanilla-300`): collapse to
  ONE auto-adapting token — `var(--foreground)` for strong text,
  `var(--muted-foreground)` for secondary/labels; `dark:bg-background` pair →
  `var(--background)`; border pair → `var(--border)`.
- **Gradients** (`bg-gradient-to-br from-A to-B`): →
  `backgroundImage: 'linear-gradient(<dir>, <A>, <B>)'` (`to-r`→'to right',
  `to-br`→'to bottom right'). Use standard Tailwind hex for `from-/to-`. The
  `dark:from-*/dark:to-*` variants can't be inline — drop them (light gradient only).
- **Standard Tailwind palette colours** (`text-green-600`, `bg-red-500`, …): map
  to their hex (these aren't signoz tokens). e.g. green-600 `#16a34a`, red-600
  `#dc2626`, blue-600 `#2563eb`, gray-500 `#6b7280`, yellow-600 `#ca8a04`.
- **`hover:` / `focus:` / `active:` / `group-*` / `peer-*`**: can't inline. For
  demo stories, drop (cosmetic) or add a scoped `<style>` if essential.
- **Responsive `sm:`/`md:`/`lg:`**: use the most relevant breakpoint's value as a
  static inline style (docs canvas is wide), drop the prefix.
- **`[&::pseudo]:…` arbitrary selectors**: style a pseudo-element — can't inline;
  drop (note it) or add scoped CSS.
- **Opacity modifier** (`bg-muted/50`): →
  `color-mix(in srgb, var(--muted) 50%, transparent)`.
- **Existing `style=`**: merge the mapped properties into the existing object.
- **`className={cn(...)}` / interpolated / template-literal**: convert the literal
  parts manually.

## Component-prop classNames (separate concern)

Tailwind classes passed as a `className` *prop* to a component
(`<Icon className="h-4 w-4 text-green-600" />`, `<Button className="…">`) are NOT
touched by the codemod. They still depend on Tailwind. Handle them per component:
icons usually take a numeric `size` prop + `style`; semantic colors map to the
component's `color` prop where one exists.

## Spacing/size scale quick ref

`0.5`→0.125rem, `1`→0.25rem, `2`→0.5rem, `3`→0.75rem, `4`→1rem, `6`→1.5rem,
`8`→2rem, `10`→2.5rem, `12`→3rem, `16`→4rem. Font: xs 0.75 / sm 0.875 / base 1 /
lg 1.125 / xl 1.25 / 2xl 1.5 rem. Weight: medium 500 / semibold 600 / bold 700.
