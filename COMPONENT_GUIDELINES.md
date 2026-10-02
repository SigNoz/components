# Component Guidelines

The standard every component in `@signozhq/ui` is held to. Read it when you build a
component, and use it when you review one.

| Also see | For |
| --- | --- |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Setup, commands, and the mechanical steps to add a component |
| [BUILD.md](./BUILD.md) | *Why* the build, packaging and CSS work this way |
| [`.github/pull_request_template.md`](./.github/pull_request_template.md) | The checklist version of this document, filled in per PR |
| [COMPONENT_AUDIT_RUBRIC.md](./COMPONENT_AUDIT_RUBRIC.md) | Scoring an existing component |
| [VISUAL_TESTING.md](./VISUAL_TESTING.md) | Chromatic snapshots and the `run-visual-testing` label |

## 0. Design philosophy

Five principles behind every component. Read when building; refer back when making tradeoffs.

1. **Variants are roles, not styles.** `critical` is a role; `redSmallPill` is not. A variant
   expresses *purpose*, not a one-off visual request. If a design asks for something that does
   not fit an existing role, that's a conversation about whether to add a role, not a prop.

2. **State is explicit and complete.** Every interactive component handles: default, hover,
   active, selected, focus, disabled, loading, invalid, and read-only where applicable. Missing
   states are bugs, not future work.

3. **Accessibility lives in the base, not the consumer.** Keyboard behaviour, focus management,
   labels, and ARIA relationships are encoded once in the component. A consumer should not have
   to wire them.

4. **Composition over configuration.** When props start contradicting each other, split the
   behaviour into purposeful patterns. A single component with `disableX`, `overrideY`,
   `forceZ` is usually two components pretending to be one.

5. **Minimum viable escape hatch.** Expose only what real product needs require. CSS overrides
   via custom properties are always possible, but they're a last resort, not the plan. When a
   consumer reaches for `--badge-padding` to fix a one-off, that's evidence the component may
   need a new size variant or prop. Record these exceptions and evolve the component rather
   than normalizing workarounds. `className` and `style` are not an escape hatch at all, see
   [No `className` or `style`](#no-classname-or-style).

**The non-negotiables**, if you read nothing else:

1. Styles are **CSS Modules**, and **every declaration** reads its value through a
   `--{component}-*` custom property, layout and resets included, with the default in the
   fallback. Colours default to a design token, never a literal.
2. Anything **not** meant to be overridden is named `--{component}-internal-{thing}`.
3. Subcomponents live in **`subcomponents/`**, opinionated compositions in **`presets/`**.
4. A component **does not accept `className` or `style`**, on its root or on any wrapper or
   part. Looks come from props, variants and `--{component}-*` custom properties.
5. Props are **picked deliberately**, exposing only what the component actually needs, and
   **every prop carries JSDoc**, so a human or an agent reading the type declaration
   understands it without opening the implementation.
6. **One story file per root component, plus one per preset.** Subcomponent stories live in
   their parent's file, never in a file of their own. Static members (`Callout.Expandable`) are
   the exception: they share one `{name}-components.stories.tsx` next to the root's file.
   Symbols tagged `@access private` are exempt.

Reference implementations to copy from:

| You are building | Copy |
| --- | --- |
| A single-element component | `packages/ui/src/badge/` |
| A component with variants + a context | `packages/ui/src/button/` |
| A primitive with subcomponents **and** presets | `packages/ui/src/dialog/` |
| A component wrapping a third-party primitive | `packages/ui/src/popover/` (derives its props, which is the pattern to follow) |

## 1. Code organization

### File layout

One directory per component under `packages/ui/src/`, named in **kebab-case**. The directory
name is also the public subpath (`@signozhq/ui/date-picker`).

```
packages/ui/src/badge/
├── index.ts                      # public surface + generated token docs
├── badge.tsx                     # implementation
├── badge.module.scss             # styles
├── badge.test.tsx                # behaviour tests
└── badge.forward-ref.test.tsx    # ref forwarding test
```

For anything bigger than one element, split it:

```
packages/ui/src/dialog/
├── index.ts
├── dialog.module.scss
├── subcomponents/                # the primitives a consumer composes
│   ├── dialog.tsx                # Root
│   ├── dialog-content.tsx
│   ├── dialog-header.tsx
│   └── ...
├── presets/                      # opinionated compositions built from the primitives
│   ├── dialog-wrapper.tsx
│   ├── confirm-dialog.tsx
│   └── confirm-dialog-url.tsx
└── dialog.forward-ref.test.tsx
```

Rules:

- **`subcomponents/`** holds the parts a component is composed from. One file per component,
  named after it in kebab-case (`dialog-close-button.tsx` for `DialogCloseButton`). `select/`
  uses `components/` for this. That is drift, not an alternative. Use `subcomponents/`.
- **`presets/`** holds the batteries-included versions, built from the subcomponents.
- A composed component exports only the composed surface. Its subcomponents stay out of
  `index.ts` and carry `@access private` (`tooltip/` exports `Tooltip`, not `TooltipTrigger` or
  `TooltipContent`). Another component that needs one imports it by relative path, and a change
  to that subcomponent has to keep those imports working.
- A part a consumer uses on its own, in place of the root, hangs off the root as a static member
  instead: `Pill.Closeable`, `Callout.Expandable`, `Callout.Link`. The part lives in
  `subcomponents/`, the root attaches it with `Object.assign(Root, { Closeable: PillCloseable })`,
  and `index.ts` exports the root plus the part's props type, never the part itself. Such a part
  is public API: no `@access private`, JSDoc on every prop, a story in
  `{name}-components.stories.tsx` and a `<Controls>` of its own in the MDX. Its component JSDoc
  says how it is reached ("Reached as `Pill.Closeable`, not imported on its own"), and its
  `displayName` is the dotted name.
- Shared non-component logic goes in `utils.ts` (see `pagination/utils.ts`) or a `lib/`
  subfolder (`table/lib/`). Cross-component helpers go in `src/lib/`.
- One style file per component directory is the norm; add `{subcomponent}.module.scss` only
  when the styles are genuinely independent (`button/button-group.module.scss`).
- Tests are colocated. Shared test setup goes in `{name}.test-utils.tsx`.

### `index.ts` is the contract

`index.ts` contains **only** the generated token block and exports. No logic, no components.

```ts
// #region css-tokens
/**
 * CSS Tokens for badge
 * Prefix: `--badge-`
 * ... generated table ...
 */
// #endregion css-tokens

export type * from './badge.js';
export { Badge } from './badge.js';
```

- `export type *` for the types, an explicit named export for each value. Never a bare
  `export *`, which makes the public surface invisible to review.
- Relative imports **must** carry the `.js` extension, here and everywhere else.
- Order for multi-part components: presets first, then Root, then subcomponents alphabetically
  (see `dialog/index.ts`).
- Every type referenced by a public prop must be exported here. A prop typed with something a
  consumer can't import is a bug: they cannot declare their own handler or hold the value in a
  typed variable.
- `@access private` in a symbol's JSDoc marks it as not public API: the subcomponents a
  composed component is built from, its contexts and hooks. Nothing outside the package may
  rely on it, it needs no story or MDX section, and it can change without a major version. A
  symbol can carry the tag and still be exported when another component in this repo needs it
  (`TooltipProviderIfMissing`).
- Applying it is mechanical: **every `export` in the component directory that `index.ts` does
  not re-export carries the tag**, props types as much as components (`TooltipTriggerProps`
  next to `TooltipTrigger`), contexts, providers and hooks included. A symbol that is never
  exported from its own file needs nothing, it is already unreachable. The one exception is a
  part attached as a static member of an exported root (`PillCloseable`, reached as
  `Pill.Closeable`): it is public through the root, so it carries no tag even though `index.ts`
  does not list it.
- A symbol listed in `index.ts` must **not** carry the tag. Public and private at once is a
  bug: it exempts a real part of the surface from its story, MDX section and prop docs.
- The tag goes last in the JSDoc block, after the prose and the other tags, separated by a
  blank ` *` line. A symbol with no prose gets a block holding only the tag:

```tsx
/**
 * Where the tooltip content is portalled to.
 *
 * @access private
 */
export type TooltipPortalProps = ...;

/**
 * @access private
 */
export type TooltipRootProps = ...;
```

### Import hygiene

- `import type` for types. `typescript/consistent-type-imports` is an error, and a value
  import of a type breaks the CJS build.
- Icons come from `@signozhq/icons` (externalized, and mocked in unit tests).
- Never import `tailwindcss` or `@signozhq/tailwind-config` inside `packages/`. See
  [BUILD.md](./BUILD.md#why-tailwind-is-gone).
- Adding a runtime dependency means adding it to `externalPatterns` in the same commit
  (`packages/typescript-config/vite.config.extend.ts`), or
  `packages/ui/src/__tests__/vite-externals.test.ts` fails.

## 2. CSS organization

Full rationale in [BUILD.md](./BUILD.md#3-styling). The rules:

### Use a CSS Module, in Sass

`{name}.module.scss`, imported as an object:

```tsx
import styles from './badge.module.scss';

className={styles.badge}
```

- Always `.scss`. There are no `.module.css` files left in `packages/ui`, and no plain
  (non-module) stylesheets. Don't reintroduce either.
- Sass is for **nesting** and the rare `@mixin` (`skeleton.module.scss`). No Sass variables,
  colour functions or `@use` graphs, a Sass variable is compiled away and a consumer can
  never reach it, so values belong in custom properties.
- The root class is `styles.badge` and nothing else. A component takes no `className`, so there
  is nothing to merge in. Use `cn()` only to combine the component's own classes.
- Don't import CSS from another component's module; CSS Modules hash per file. Share a custom
  property instead.
- Keep every selector scoped to the component class. A bare `[data-color]` selector applies to
  every matching element on the page, write `.checkbox[data-color="forest"]` instead.

### Every declaration goes through a custom property

```scss
.badge {
    display: var(--badge-display, inline-flex);
    padding: var(--badge-padding, var(--spacing-4));
    font-size: var(--badge-font-size, var(--periscope-font-size-small));
    background-color: var(--badge-background-color, var(--badge-background));
}
```

- Prefix is `--{component}-` and must match the directory name.
- The chain is `var(--{component}-x, <design token>)`: our override hook, then the design
  token. **Two links, not three: do not add a literal fallback to a design token.**
- Anything **not** meant to be overridden carries an `-internal-` segment
  (`--button-internal-background`). Those are excluded from the generated docs and are not
  public API.
- **Never** write `--x: var(--x)`, and never define the same variable twice in one block. Both
  silently break the variable.

A hardcoded value is a value no consumer can change. **Every declaration reads its value
through a `--{component}-*` variable, whatever the property.** There is no list of values that
are "only layout": `display: flex`, `flex-direction: column`, `margin: 0`, `min-inline-size: 0`,
`overflow-wrap: anywhere`, `cursor: pointer`, the `opacity: 0` of a state, `solid` and `ease`
all get a variable. The default sits in the fallback, so nothing changes until a consumer
overrides it.

```scss
.badge__text {
    display: var(--badge-text-display, flex);
    flex-direction: var(--badge-text-flex-direction, column);
    min-inline-size: var(--badge-text-min-inline-size, 0);
    overflow-wrap: var(--badge-text-overflow-wrap, anywhere);
}
```

Name the variable `--{component}-{part}-{state}-{property}`. The part is the BEM element, left
out on the root. The state is the data attribute or pseudo-class of the rule, left out in the
default rule. The property is the CSS property as written in the declaration, so
`.toast__content[data-behind] { opacity }` reads `--toast-content-behind-opacity`. A value that
feeds several declarations is named after what it is instead, like `--toast-icon-size` or
`--toast-stack-gap`.

What already counts as wrapped:

- A value written only from variables, such as `color: var(--toast-internal-title-color)` or a
  `calc()` over variables. The arithmetic in a `calc()` (`-1 *`, `1 -`, `/ 2`) is not a value.
  A literal inside it is: `calc(var(--gap) + 1px)` goes into a fallback whole.
- An `-internal-` variable that holds a sign or a rest state the rules swap, such as
  `--toast-internal-direction: 1` or `--toast-internal-float-x: 0px`. Any other literal in an
  internal variable reads from a public one first:
  `--toast-internal-scale-step: var(--toast-stack-scale-step, 0.05)`.

A shorthand that lists properties, such as `transition: opacity 150ms ease, color 150ms ease`,
splits into longhands so each part has its variable: `transition-property`,
`transition-duration` and `transition-timing-function`.

Three declarations stay bare, because an override would break a promise the component makes:

- Anything inside `@media (prefers-reduced-motion: reduce)`.
- `display: none` on `[hidden]`.
- `content` that only creates a pseudo-element.

#### Colours

The default of every colour is a design token, never a literal. The rule reads that token
through an override hook, so a consumer changes the colour without redefining the token:
`color: var(--toast-title-color, var(--toast-title))`. The token is named for its role
(`--toast-title`), the hook adds the property it sets (`--toast-title-color`).

A variant gets the same treatment, one hook per colour per variant, so a consumer can change
one variant alone. The variant re-points an `-internal-` variable, and the rules read only the
internal one:

```scss
.callout[data-color='success'] {
    --callout-internal-background: var(
        --callout-success-background-color,
        var(--callout-success-background)
    );
}
```

`transparent`, `currentcolor` and `inherit` are allowed as fallbacks, because they pick no
colour from the palette.

### Variants are data attributes, not class matrices

Set `data-*` on the element in TSX, and let CSS re-point the variables:

```tsx
const badgeProps = {
  'data-slot': 'badge',
  'data-variant': variant,
  'data-color': colorMap[color] || color,
  'data-testid': testId,
  className: styles.badge,
};
```

```scss
.badge[data-color="forest"] {
    --badge-internal-background: var(--badge-forest-background-color, var(--accent-forest));
    --badge-internal-foreground: var(
        --badge-forest-foreground-color,
        var(--accent-forest-foreground)
    );
}
.badge[data-variant="outline"] { /* ... */ }
```

This is why the library has no CVA and why `cn()` is just `clsx`. Do not generate class-name
combinations in JS.

Also required on the root element:

- `data-slot="{component}"`: a stable hook for consumers and tests, independent of hashed
  class names.
- `data-testid={testId}` from the `testId` prop.

### Values come from design tokens

**Design token first. A literal only when no token matches.** This applies to every kind of
value: colour, spacing, radius, font size and font weight, not just colour.

`@signozhq/design-tokens` ships scales for spacing, radius, font size, font weight and
colour. Assume a token exists before reaching for a number. Browse them in Storybook under
**Design System** (generated from the token package by `apps/docs/utils/tokenDocs.ts`).

#### Primitive vs semantic tokens

The token package has two layers, and **components consume the semantic layer only**:

| Layer | Where | Looks like | Theme-aware? |
| --- | --- | --- | --- |
| **Primitive** | `dist/style.css`, on bare `:root` | `--bg-robin-500`, `--bg-vanilla-200`, `--text-ink-400` | **No**. One fixed value, identical in every theme |
| **Semantic** | `dist/themes/*.css`, under `[data-theme=...]` | `--primary`, `--background`, `--border`, `--l2-foreground`, `--accent-forest`, `--destructive` | **Yes**. Redefined per theme, each pointing at a primitive |

A primitive is the raw palette entry. A semantic token is the *role* that entry plays, and it
is the layer a theme reassigns:

```css
/* dist/themes/signoz-tokens.css */
[data-theme="default"]      { --background: var(--bg-vanilla-200); }
[data-theme="default"].dark { --background: var(--bg-ink-500); }
```

So `background-color: var(--bg-vanilla-200)` is a **hardcoded light-theme colour wearing a
`var()`**. Flip to dark and it stays pale, because nothing reassigns a primitive. Writing
`var(--background)`, or `var(--l2-background)`, `var(--primary)`, `var(--accent-forest)`,
resolves through the theme and follows it.

This is also what lets a consumer rebrand: they redefine `--primary` for their theme and every
component that reads it moves. A component that reached for `--bg-robin-500` directly opts
itself out of that.

**Never reference a `--bg-*` or `--text-*` primitive from a component style.** If the role you
need has no semantic token, raise it so one gets added. Don't reach past the layer.

The non-colour scales (`--spacing-*`, `--font-size-*`, `--font-weight-*`) live in the primitive
layer and have no semantic counterpart, so those you use directly. For corner radius prefer the
themeable `--radius` over the fixed `--radius-0` to `--radius-3` steps where it fits.

Rules:

- Use the token: `padding: var(--badge-padding, var(--spacing-4));`
- For colour, always the **semantic** token: `var(--primary)`, not `var(--bg-robin-500)`.
- **Do not give a design token a literal fallback.** `var(--spacing-4, 8px)` is redundant, because the
  token is always defined once the consumer imports the token stylesheet, which they must do
  anyway for the component to have any colour at all.
- Never a hex or `rgb()` literal for colour. Use `color-mix(in srgb|oklab, ...)` for derived
  shades, not `rgba()` over a token.
- **No token matches?** Use a literal as the fallback of the component variable,
  `var(--badge-border-width, 1px)`, never bare in the property. Treat it as a signal the token
  set may need extending, and raise it rather than quietly inventing a one-off scale.

> [!NOTE]
> **Legacy pattern, being cleaned up.** Most existing style files still read
> `var(--spacing-4, 0.5rem)`, `var(--periscope-font-size-base, 13px)` and similar. Count what
> is left with:
>
> ```sh
> grep -rE "var\(--[a-z0-9-]+, *[0-9.]" packages/ui/src --include="*.scss" | wc -l
> ```
>
> Those fallbacks have already drifted, and not only in formatting: `--spacing-4` is written
> with a `0.5rem` fallback in 47 places, `8px` in 25 others, `.5rem` in 2, and `1rem` in 5,
> which is a different value from the token itself. They are being removed incrementally so
> only the token remains. **Don't add new ones, and drop the fallback when you touch a line
> that has one.**

### Interaction and motion states

Every interactive component styles all of these, not just the default:

| State | Hook |
| --- | --- |
| Hover | `:hover` |
| Keyboard focus | `:focus-visible`, via `--ring` |
| Invalid | `[aria-invalid="true"]`, via `--destructive` |
| Disabled | `:disabled` / `[data-disabled]` |
| Loading, selected, empty | component `data-*` attribute |

Transitions use the component's own duration/easing custom properties (so a consumer can
retime or remove them) and must be disabled under reduced motion:

```scss
.badge {
    transition: background-color var(--badge-transition-duration, 150ms)
        var(--badge-transition-timing-function, ease);
}

@media (prefers-reduced-motion: reduce) {
    .badge {
        transition: none;
    }
}
```

### Regenerate the token docs

After adding or changing any `--{component}-*` variable:

```sh
cd packages/ui
pnpm run tokens
```

Commit the updated `index.ts` regions with your style changes. `pnpm run tokens:check` runs in
`lint-staged` and in CI (`.github/workflows/tokens-check.yml`); if it fails, run
`pnpm run tokens` and commit the result.

## 3. How to expose props via TypeScript

### Pick the props you need, don't re-export the DOM

The props type is a deliberate, minimal surface. Expose what the component actually uses and
nothing else:

```tsx
export interface BadgeProps extends Pick<
  React.ComponentProps<'span'>,
  'children' | 'id'
> {
  testId?: string;
  variant?: BadgeVariant;
  color?: BadgeColor;
}
```

Spreading all of `HTMLAttributes` into a presentational component means a docs table nobody
reads, props nobody implemented, and a support surface nobody intended. `Pick` the handful
that are real. Components that genuinely *are* a DOM passthrough intersect instead, omitting
whatever they re-typed: `& Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'prefix' | 'color'>`
(`button`).

- Name it `{Component}Props` and export it.
- **Declare props explicitly, but borrow the upstream type per prop.** See
  [Wrapping a third-party primitive](#wrapping-a-third-party-primitive) below.
- **Re-export every upstream type a public prop mentions.** If `onChange` is typed
  `CheckedState`, `CheckedState` must be exported from `index.ts`.

### Wrapping a third-party primitive

Don't spread the primitive's whole props type, and don't hand-retype its signatures either.
**List each prop you support explicitly, and take its type from the upstream type by indexed
access**, as `propIWant: OriginalProps['propIWant']`. You get upstream's exact signature, so it
cannot drift on an upgrade, *and* a place to attach your own JSDoc, which spreading a type
would not give you.

`dropdown-menu` is the reference:

```tsx
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

type OriginalContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content>;

export type DropdownMenuContentProps = {
	/**
	 * Event handler called when auto-focusing on close.
	 * Can be prevented.
	 */
	onCloseAutoFocus?: OriginalContentProps['onCloseAutoFocus'];
	/**
	 * When `true`, keyboard navigation will loop from last item to first, and vice versa.
	 * @default false
	 */
	loop?: boolean;
	/**
	 * The testId associated with the content.
	 */
	testId?: string;
};
```

Conventions:

- Alias the upstream type once at the top of the file as `Original{Thing}Props`, via
  `React.ComponentProps<typeof Primitive.X>`.
- Use the indexed access for anything whose type is upstream's to define: event handlers,
  positioning props, enums. Declare the type inline only for props we own (`testId`), or where
  the upstream type is trivially `boolean` / `string` and naming it adds nothing.
- The same trick works for our own components: `confirmColor?: ButtonProps['color']`,
  `width?: DialogContentProps['width']` (see `dialog/presets/confirm-dialog.tsx`).
- **Every prop still gets JSDoc.** Copy the wording from upstream's docs when it's accurate, or
  write your own from what the prop actually does. That prose is the whole reason we declare
  props by hand instead of spreading a type: it's what a consumer or an agent reads off the
  declaration, and it ships in the published `.d.ts`.

`Pick<React.ComponentProps<'span'>, ...>` is for the props nobody needs prose for: `id`,
`children`. Never pick `className` or `style`. Anything a consumer has to make a decision about
gets its own documented line.

What not to do, restating a signature by hand:

```tsx
// Bad: a copy, goes stale the moment upstream adds a parameter
onLayoutChanged?: (layout: Layout) => void;
// Good: borrowed, follows upstream forever
onLayoutChanged?: OriginalGroupProps['onLayoutChanged'];
```

`resizable.tsx` still has this bug today: `react-resizable-panels` types
`GroupProps.onLayoutChanged` as `(layout: Layout, meta: LayoutChangedMeta) => void`, our copy
declares `(layout: Layout) => void`. `pnpm run type-check` passes, because nothing in this repo
compares the two. The error only lands in the consumer:

```
error TS2322: Type '(layout: Layout, meta: LayoutChangedMeta) => void' is not
assignable to type '(layout: Layout) => void | undefined'.
```

That is the failure mode to keep in mind: a narrowed copy is invisible to our own CI and only
breaks people downstream. Borrowing the type makes it impossible. The components most exposed
to it are the ones wrapping a third-party primitive with little or no derivation, `select`
(18 hand-written prop types, none derived), `tabs`, `radio-group`, `toggle-group`, `switch`,
`checkbox`, plus `table`, where TanStack's own types cross the prop boundary. Prefer
borrowing there before adding anything new.

### Variant values

Both shapes exist in the codebase and neither is mandated:

```ts
// plain string union (badge, dialog, most components)
export type BadgeVariant = 'default' | 'outline';

// const object + derived union (button): gives consumers a named symbol
export const ButtonVariant = { Solid: 'solid', Outlined: 'outlined' } as const;
export type ButtonVariantValue = (typeof ButtonVariant)[keyof typeof ButtonVariant];
```

Match whichever the component you're extending already uses. Either way the runtime value is
the lowercase string that lands in `data-*`, and never a TS `enum`.

### Required conventions

| Convention | Rule |
| --- | --- |
| `forwardRef` | Every component forwards its ref to the real DOM node. Name the render function, `forwardRef(function Badge(props, ref) { ... })`, so DevTools and stack traces show the name. An explicit `Component.displayName` does the same and stays valid where it already exists |
| Providers | A component that needs a provider wraps itself in `XProviderIfMissing` (see `TooltipProviderIfMissing`), never in `XProvider`. It adds the provider when none is above and reuses the existing one otherwise, so the component never fails for want of a provider and never shadows what the app configured. Apps place `XProvider` once near the root |
| `testId` | Always present; forwarded as `data-testid`. Consumers have no `className` to hang a test hook on |
| Defaults | Set in the destructuring (`variant = 'default'`), and mirrored in an `@default` JSDoc tag |
| Controlled/uncontrolled | Follow Radix naming: `value`/`defaultValue`/`onChange`, `open`/`defaultOpen`/`onOpenChange` |
| Escape hatches | No `className`, no `style`, no `classNames` or `styles` maps. See [No `className` or `style`](#no-classname-or-style) |
| Accessibility | Interactive elements get a real role and a labellable prop (`closeAriaLabel`, `aria-label`). `jsx-a11y` rules are on |
| Cancellable callbacks | If a callback can veto the default behaviour, use the DOM idiom: run the handler, then check `event.defaultPrevented` (see `Badge`'s `onClose`) |
| No console noise in the happy path | `console.warn` only for genuine misuse, as `Badge` does for `textEllipsis` with non-string children |

### No `className` or `style`

A component does not accept `className` or `style`. This covers the root, every wrapper
(`containerClassName`, `containerStyle`), every part (`classNames`, `styles`, `contentClassName`)
and third-party style props such as react-day-picker's `modifiersClassNames`. A consumer can
reach the look of a component in three ways, in this order:

1. A **prop or variant** (`variant`, `color`, `size`, `width`, `maxWidth`).
2. A **`--{component}-*` custom property**, set from the consumer's own CSS, for a one-off
   the variants do not cover. Treat each one as a request to add a prop.
3. A new **role** in the component, when the same one-off shows up twice.

Why: a class merged onto the root competes with the component's CSS on specificity and source
order, so the result depends on bundle order. An inline `style` beats every token and cannot be
themed. Both turn each component's markup into public API that no release can change safely.

How to apply it:

- **Never put `className` or `style` in a props type**, not through `Pick`, not through a spread
  of `ComponentProps<'x'>`. When a props type extends a DOM or third-party type, `Omit` them. If
  the type is a union, omit per member, since a plain `Omit` collapses it (see `CalendarProps`).
- **Reject them in the types, not only at runtime.** Build the component with the exact-props
  pattern (`T & Validate{Component}Props<T> & Record<Exclude<keyof T, keyof Props>, never>`), so
  a stray `className` is a type error that points at the prop. Add a `@ts-expect-error` case for
  each rejected prop to `{name}.types.test-d.tsx`.
- **Pass-through props still land where they must.** `aria-*` and `data-*` on a portalled popup
  go to the popup, because that is the only way to reach it. `className` and `style` do not.
- **Sizing is a prop.** `width` and `maxWidth` write `--{component}-internal-width` and
  `--{component}-internal-max-width` on the element. They compose with the tokens and never touch
  `style.width`. Numbers are written as `px`, through `toCssLength`.
- **The component's own inline `style` is allowed**, and only for those internal custom
  properties. Cast to `CSSProperties` once, and write nothing the consumer passed in.
- **Library components that build on another one** may need to style it. Export an
  `Internal{Component}` from the component file with the `@access private` tag, typed
  `Props & {Component}StyleProps`, and keep it out of `index.ts` (see `InternalButton`,
  `ButtonStyleProps`). Outside the package a component is only reachable through its public
  props.
- **Docs and stories follow.** Do not show `className` or `style` in a story, an MDX example or
  a JSDoc snippet. A story that needs layout wraps the component in a `*.stories.module.css`
  class instead. Delete the tests that asserted the old merge behaviour.

Removing a prop from a component that has it is a breaking change: use `feat(x)!:` or
`refactor(x)!:` and describe the migration (a prop, a variant, or a custom property) in the
commit body.

## 4. How to document props

Documentation lands in three places, for three different readers. None of them is generated
from another, so all three are written by hand.

### JSDoc on every public prop

JSDoc is read from the type declaration: editor hover, go-to-definition, and whatever a
consumer or an AI agent opens when it wants to know what a prop does. It survives into the
published types, so it reaches consumers too (`dist/{component}/{component}.d.ts` carries it
verbatim). **Every public prop gets a sentence.**

> [!IMPORTANT]
> **It does not feed the Storybook props table.** `.storybook/main.js` enables
> `react-docgen-typescript`, but stories import `@signozhq/ui` as a *built package*
> (`packages/ui/dist/`), and docgen only parses the docs app's own sources, so no
> `@signozhq/ui` component gets docgen info at all. Everything in the table comes from the
> `argTypes` you write in the story. The prose therefore exists twice, and both copies have to
> be kept in sync: JSDoc on the prop, `description` in `argTypes`.

```tsx
/**
 * Element rendered before the button label. Sized + class-injected automatically when no
 * `size` prop is set on the element.
 */
prefix?: React.ReactElement;
/**
 * When `true`, replaces `prefix` (and hides `suffix`) with a spinner and disables the button.
 * @default false
 */
loading?: boolean;
```

- `@default` whenever there is a real default, and it must match the implementation.
- Document constraints and interactions, not the type, which is already visible. "Only
  works when `children` is a string" is useful; "a boolean" is not.
- Component-level JSDoc on exported helpers and contexts too (see `ButtonGroupContext`).

### Component-level JSDoc

The block on the exported component is the one page a consumer or an agent gets before reading
the source. It documents behaviour the prop list cannot show: what the component does on its
own, what two props do together, and what will surprise the reader. `Button` and `Tooltip` are
the reference blocks. Same skeleton, same order, sections dropped when the component has
nothing to put in them:

1. **One opening sentence**: what it renders, and the primitive behind it.
   `Renders a native <button> (Base UI Button).`
2. **What is forwarded**, when the component passes props through to a DOM node.
3. **The theming line**, verbatim shape:
   ``Visual values are `--x-*` custom properties, defaults in the `css-tokens` region of
   [./index.ts](./index.ts).``
4. **Accessibility**, when the component decides something for the consumer, or needs
   something from them (`icon` mode needs an `aria-label`; the spinner has no role of its own).
5. **One `###` section per behaviour that is not obvious from the props.** Title it after the
   thing, not the prop (`### Disabled and loading`, `### Stacking`, `### Width`). Cross-prop
   interactions, gotchas that cost someone an hour, and how it behaves inside another component
   all live here.
6. **`### Asserting on it`**: where `testId` lands, then a table of the root data attributes
   and a table of the `data-slot`s with when each is rendered. Say to use those, never the
   hashed class names.
7. **`@example` blocks**, most common usage first, one per distinct shape. A one-line `//`
   comment on the later ones saying what they add.

Write it in short declarative sentences, one idea per paragraph, blank line between them. State
the consequence as its own sentence (`So the button stays tabbable`, `So the off switch is the
title itself`). Reach for a table whenever the content is a mapping. No bold for emphasis, no
selling, and nothing the types already say.

### The generated CSS token table

`pnpm run tokens` writes it into `index.ts`. This is how consumers and agents discover the
theming surface without reading SCSS. Keep variable names self-describing, because the name *is* the
documentation.

### `README.md` + `intro.mdx`

Add an import line for the component to root `README.md` and to
`apps/docs/stories/intro.mdx`. `packages/ui/src/__tests__/documentation.test.ts` fails the
build if you don't.

## 5. How to create stories

Stories live in `apps/docs/stories/`. They are the docs *and* the visual-regression and
interaction test corpus, so treat them as product surface.

### Naming and titles

| File | Title |
| --- | --- |
| `badge.stories.tsx` | `Primitive Components/Badge` |
| `dialog-primitive.stories.tsx` | `Primitive Components/Dialog` |
| `drawer-wrapper.stories.tsx` | `Composed Components/Drawer/DrawerWrapper` |
| `confirm-dialog.stories.tsx` | `Composed Components/ConfirmDialog` |

Top-level groups are fixed by `storySort.order` in `apps/docs/.storybook/preview.tsx`:
`Intro`, `Design System`, `Primitive Components`, `Composed Components`, `Old Components`.

- Primitives and their subcomponents go under `Primitive Components`.
- Presets go under `Composed Components`.
- `Old Components` is for **deprecated** components still awaiting a rework-or-delete decision.
  Never put a new component there.
- Don't invent a new top-level group.

**One story file per root component, plus one per preset.** A subcomponent never gets a file of
its own: `Meta` binds the parent, and the subcomponent gets a story in that same file with
`argTypes` overridden for any props it adds, drops or re-types, so its `<Controls>` table stays
accurate. Symbols tagged `@access private` are exempt: they are not public API, so they get no
story and no Controls table. Files such as `dialog-content.stories.tsx` predate this rule; don't
add more, and don't migrate them as a side effect of an unrelated change.

Static members are the exception. All the static members of one root share a second file,
`{name}-components.stories.tsx`, next to the root's file, so the root's file keeps only the
states of the root. `callout-components.stories.tsx` is the reference. That file:

- titles its `Meta` `<Group>/<Root>/Components`, so the parts sit under the root in the sidebar;
- binds the root in `Meta` and sets `tags: ['!autodocs']`, since the parts are documented on the
  root's MDX page and get no docs page of their own;
- takes the root's `argTypes` and `parameters` from `stories/shared/{name}-arg-types.ts`, which
  the root's file imports too.

Each story there is typed by its own component, overrides `argTypes` for the props the part adds,
and excludes the root args it does not take, so its table lists only the props it accepts:

```tsx
const meta: Meta<typeof Callout> = {
  title: 'Primitive Components/Callout/Components',
  component: Callout,
  tags: ['!autodocs'],
  parameters: calloutParameters,
  argTypes: calloutArgTypes,
};
export default meta;

export const Link: StoryObj<typeof Callout.Link> = {
  parameters: {
    // The callout props are declared on the parent `Meta`; `Callout.Link` has none of them.
    controls: { exclude: ['color', 'size', 'icon'] },
  },
  argTypes: { /* the props it adds */ },
  render: (args) => (
    <Callout color="primary" size="md" icon={<SolidInfoCircle />}>
      Read the <Callout.Link {...args} />.
    </Callout>
  ),
};
```

`Pill.Closeable` predates this rule and still has its story in `pill.stories.tsx`; don't migrate
it as a side effect of an unrelated change.

A preset is a root of its own, so it gets a file, and its `Meta` binds the preset:

```tsx
const meta: Meta<typeof ConfirmDialog> = {
  title: 'Composed Components/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: { /* ... */ },
};
export default meta;
type Story = StoryObj<typeof ConfirmDialog>;
```

`tags: ['autodocs']` is already global in `preview.tsx`, as is the docs page template
(Overview, Title, Subtitle, Description, Primary, Controls, Examples).

### Link the Figma frame

The story is where the design lives next to the code, so the next person can re-check it
without hunting in Figma:

```tsx
parameters: {
  design: { type: 'figma', url: 'https://www.figma.com/design/<file>?node-id=<id>' },
}
```

### `argTypes`

`argTypes` is the **only** source for the rendered props table. Nothing is inferred from the
component's types or JSDoc (see the note above). Every public prop needs an entry, and the
`description` has to be written here even though the prop already has JSDoc:

```tsx
argTypes: {
  color: {
    control: 'select',
    options: ['primary', 'secondary', 'success'],
    description: 'Color scheme applied to the variant.',
    table: {
      category: 'Appearance',
      type: { summary: 'BadgeColor' },
      defaultValue: { summary: 'primary' },
    },
  },
  onClose: { control: false, table: { category: 'Events' } },
  testId: { control: 'text', table: { category: 'Testing' } },
}
```

- Categories: `Content`, `Appearance`, `Behavior`, `State`, `Accessibility`, `Events`,
  `Testing`, `Styling`.
- `control: false` for callbacks and complex nodes. Use `fn()` from `storybook/test` as the arg
  so interactions are logged.
- `table.type.summary` is a readable summary, not the full TS type.
- `defaultValue.summary` only when there is a real default, and it must agree with the
  implementation *and* the `@default` JSDoc.

### Stories to write

1. **A controls story** (`Default`, or `Playground`): the one MDX wires `<Controls>` to.
   Realistic args, no hooks in `args`.
2. **One story per meaningful state**: each variant, each colour, sizes, loading, disabled,
   invalid, with icon, long/truncated content, empty state.
3. **Subcomponent stories sit in the parent's file and render inside a realistic parent**:
   `DialogContent` inside a `Dialog`, `RadioGroupItem` inside a `RadioGroup`. Static members sit
   in `{name}-components.stories.tsx` instead, and render inside a parent the same way
   (`Callout.Link` inside a `Callout`).
4. **Interactive stories own their state** via `useState` in `render`, or via a decorator.
   URL-driven presets need a `NuqsAdapter` decorator plus `useQueryState` in the decorator,
   keeping `args` hook-free.

Layout: use the shared classes in `apps/docs/index.css` (`story-container`, `story-section`,
`story-grid`, `story-row`, `story-panel`, `icon-md`) or a `{name}.stories.module.css`. No
Tailwind classes, and no ad-hoc inline `style` where a shared class exists.

Animation is a toolbar control, not a story class. **Motion** is **still** by default, which drops
every animation and every transition document-wide and leaves each element on the style it has once
it has settled; **live** is for watching a transition. Because it is a Storybook global, a
snapshotted story gets the same state from
`chromatic: { disableSnapshot: false, modes: allModes }` (`allModes` from
`apps/docs/.storybook/modes.ts`) rather than from any class in its `render`. **Theme** (dark/light)
is the other global and works the same way.

### The MDX page

One `{component}.mdx` per component, wiring Controls per exported piece (`@access private`
ones excluded):

```mdx
import { Meta, Controls, Primary } from '@storybook/addon-docs/blocks';
import * as BadgeStories from './badge.stories';

<Meta of={BadgeStories} />

# Badge

Short description, then a real usage snippet.

<Primary />

<Controls of={BadgeStories.Playground} />
```

For a component with subcomponents and presets, order the page the way people adopt it:
presets first, then the primitive composition example, then a `## X Props` +
`<Controls of={XStories.Default} />` section per subcomponent. Copy `dialog.mdx` /
`radio-group.mdx`. Each `<Controls>` must point at the story for *that* piece, which may live in
the parent's story module when the subcomponent shares it. A static member's story lives in the
`-components` module, which the MDX imports next to the root's
(`import * as CalloutComponentsStories from './callout-components.stories';`, then
`<Controls of={CalloutComponentsStories.Link} />`). A wrong reference silently renders the wrong
props table.

## 6. Visual QA

Tokens and types can be reviewed from the diff. The visual result cannot, so check it in
Storybook before you open the PR.

- **Compare against the Figma frame side by side**, not from memory: spacing, sizes, colours,
  and every state. Link the frame from the story ([above](#link-the-figma-frame)).
- **Check light *and* dark.** Semantic tokens resolve to different primitives per theme, so one
  pass proves nothing about the other. Toggle with the Storybook theme switch.
- **Match sibling components.** A `sm` here should be the same height as `sm` on `Button` and
  `Input`; density and radius should not be a one-off.
- **Typography through `Typography` or the type-scale tokens**, never an ad-hoc
  `font-size` / `font-weight` pair.
- **Icons from `@signozhq/icons`**, sized with tokens. No inline SVG with hardcoded `px`.
- **Every state built, not just designed**: default, hover, focus-visible, active, disabled,
  loading, invalid, selected, empty, and long/truncated content.
- **Not a duplicate.** Check no existing primitive or preset already covers this.

Visual changes need the `run-visual-testing` label on the PR to get Chromatic snapshots. See
[VISUAL_TESTING.md](./VISUAL_TESTING.md).

## 7. Tests

| File | Covers |
| --- | --- |
| `{name}.test.tsx` | Behaviour: each variant renders, callbacks fire, controlled + uncontrolled, keyboard interaction |
| `{name}.forward-ref.test.tsx` | `ref.current` is the expected element instance and carries `data-slot` |
| `{name}.test-utils.tsx` | Shared render helpers, when several test files need them |
| `apps/docs/stories/*.stories.tsx` | Render + interaction in a real browser via `@storybook/addon-vitest` |

Run them:

```sh
pnpm -F @signozhq/ui test:run     # jsdom unit + guardrail tests
pnpm run type-check
cd apps/docs && pnpm test-storybook
```

Every component with exact-props typing has a `{name}.types.test-d.tsx`. It carries one
`@ts-expect-error` case per prop the component must reject, `className` and `style` included, plus
`containerClassName` and `containerStyle` where a wrapper exists. Do not write a test that passes
a `className` and expects it on the DOM.

Query by role and accessible name (`getByRole('button', { name: /close badge/i })`) or by
`testId`. Don't assert on hashed CSS Module class names.

## 8. Reviewing

- **Per PR**: the checklist in [`.github/pull_request_template.md`](./.github/pull_request_template.md)
  is this document in checkbox form. It ships with every PR body, tick it, don't delete it.
- **Auditing an existing component**: score it with
  [COMPONENT_AUDIT_RUBRIC.md](./COMPONENT_AUDIT_RUBRIC.md) and record the total in an issue.
