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

**The non-negotiables**, if you read nothing else:

1. Styles are **CSS Modules**, and every value a consumer might want to change is a
   `--{component}-*` custom property. No hardcoded values.
2. Anything **not** meant to be overridden is named `--{component}-internal-{thing}`.
3. Subcomponents live in **`subcomponents/`**, opinionated compositions in **`presets/`**.
4. Props are **picked deliberately**, exposing only what the component actually needs, and
   **every prop carries JSDoc**, so a human or an agent reading the type declaration
   understands it without opening the implementation.
5. **One story file per exported component**, subcomponents included.

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

- **`subcomponents/`** holds the composable primitives. One file per exported component, named
  after it in kebab-case (`dialog-close-button.tsx` for `DialogCloseButton`). `select/` uses
  `components/` for this. That is drift, not an alternative. Use `subcomponents/`.
- **`presets/`** holds the batteries-included versions. A preset must be buildable from the
  exported primitives. If it needs something the primitives don't expose, expose it.
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

className={cn(styles.badge, className)}
```

- Always `.scss`. There are no `.module.css` files left in `packages/ui`, and no plain
  (non-module) stylesheets. Don't reintroduce either.
- Sass is for **nesting** and the rare `@mixin` (`skeleton.module.scss`). No Sass variables,
  colour functions or `@use` graphs, a Sass variable is compiled away and a consumer can
  never reach it, so values belong in custom properties.
- Always merge the incoming `className` last: `cn(styles.badge, className)`.
- Don't import CSS from another component's module; CSS Modules hash per file. Share a custom
  property instead.
- Keep every selector scoped to the component class. A bare `[data-color]` selector applies to
  every matching element on the page, write `.checkbox[data-color="forest"]` instead.

### Every overridable value goes through a custom property

```scss
.badge {
    padding: var(--badge-padding, var(--spacing-4));
    font-size: var(--badge-font-size, var(--periscope-font-size-small));
    background-color: var(--badge-background);
}
```

- Prefix is `--{component}-` and must match the directory name.
- The chain is `var(--{component}-x, <design token>)`: our override hook, then the design
  token. **Two links, not three: do not add a literal fallback to a design token.**
- Anything **not** meant to be overridden carries an `-internal-` segment
  (`--button-internal-background`). Those are excluded from the generated docs and are not
  public API. Use this rather than hardcoding, because an internal variable is still readable and
  debuggable, a magic number is not.
- **Never** write `--x: var(--x)`, and never define the same variable twice in one block. Both
  silently break the variable.

A hardcoded value is a value no consumer can theme. If you catch yourself typing a literal,
it needs a variable, and that variable should resolve to a design token.

### Variants are data attributes, not class matrices

Set `data-*` on the element in TSX, and let CSS re-point the variables:

```tsx
const badgeProps = {
  'data-slot': 'badge',
  'data-variant': variant,
  'data-color': colorMap[color] || color,
  'data-testid': testId,
  className: cn(styles.badge, className),
};
```

```scss
.badge[data-color="forest"] {
    --badge-background: var(--accent-forest);
    --badge-foreground: var(--accent-forest-foreground);
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
- **No token matches?** Use a literal, and treat that as a signal the token set may need
  extending. Raise it rather than quietly inventing a one-off scale.

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
    transition: background-color var(--badge-transition-duration, 150ms) ease;
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
  'className' | 'children' | 'id' | 'style'
> {
  testId?: string;
  variant?: BadgeVariant;
  color?: BadgeColor;
  asChild?: boolean;
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

`Pick<React.ComponentProps<'span'>, ...>` is for the props nobody needs prose for: `className`,
`style`, `id`, `children`. Anything a consumer has to make a decision about gets its own
documented line.

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
`toggle`, `checkbox`, plus `table`, where TanStack's own types cross the prop boundary. Prefer
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
| `forwardRef` | Every component forwards its ref to the real DOM node, and sets `Component.displayName = 'Component'` |
| `asChild` | Support it (via `@radix-ui/react-slot`) wherever a consumer might want to swap the element. Document what it disables: `Badge` ignores `closable` under `asChild`; `Button` doesn't support `loading`/`prefix`/`suffix` |
| `testId` | Always present; forwarded as `data-testid`. Don't make consumers use `className` for test hooks |
| Defaults | Set in the destructuring (`variant = 'default'`), and mirrored in an `@default` JSDoc tag |
| Controlled/uncontrolled | Follow Radix naming: `value`/`defaultValue`/`onChange`, `open`/`defaultOpen`/`onOpenChange` |
| Escape hatches | `className` and `style` merge, never replace |
| Accessibility | Interactive elements get a real role and a labellable prop (`closeAriaLabel`, `aria-label`). `jsx-a11y` rules are on |
| Cancellable callbacks | If a callback can veto the default behaviour, use the DOM idiom: run the handler, then check `event.defaultPrevented` (see `Badge`'s `onClose`) |
| No console noise in the happy path | `console.warn` only for genuine misuse, as `Badge` does for `textEllipsis` with non-string children |

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
| `dialog-content.stories.tsx` | `Primitive Components/Dialog/DialogContent` |
| `confirm-dialog.stories.tsx` | `Composed Components/ConfirmDialog` |

Top-level groups are fixed by `storySort.order` in `apps/docs/.storybook/preview.tsx`:
`Intro`, `Design System`, `Primitive Components`, `Composed Components`, `Old Components`.

- Primitives and their subcomponents go under `Primitive Components`.
- Presets go under `Composed Components`.
- `Old Components` is for **deprecated** components still awaiting a rework-or-delete decision.
  Never put a new component there.
- Don't invent a new top-level group.

**One story file per exported component**, subcomponents included. That is what makes
per-component Controls tables possible. Bind `Meta` to the actual symbol:

```tsx
const meta: Meta<typeof DialogContent> = {
  title: 'Primitive Components/Dialog/DialogContent',
  component: DialogContent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: { /* ... */ },
};
export default meta;
type Story = StoryObj<typeof DialogContent>;
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
3. **Subcomponent stories render inside a realistic parent**: `DialogContent` inside a
   `Dialog`, `RadioGroupItem` inside a `RadioGroup`.
4. **Interactive stories own their state** via `useState` in `render`, or via a decorator.
   URL-driven presets need a `NuqsAdapter` decorator plus `useQueryState` in the decorator,
   keeping `args` hook-free.

Layout: use the shared classes in `apps/docs/index.css` (`story-container`, `story-section`,
`story-grid`, `story-row`, `story-panel`, `icon-md`) or a `{name}.stories.module.css`. No
Tailwind classes, and no ad-hoc inline `style` where a shared class exists.

### The MDX page

One `{component}.mdx` per component, wiring Controls per exported piece:

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
`radio-group.mdx`. Each `<Controls>` must point at the story module for *that* component. A
wrong reference silently renders the wrong props table.

Long-form version of this as a Claude skill: `.claude/skills/component-docs-stories/SKILL.md`.

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
| `{name}.test.tsx` | Behaviour: each variant renders, callbacks fire, controlled + uncontrolled, keyboard interaction, `asChild` composition |
| `{name}.forward-ref.test.tsx` | `ref.current` is the expected element instance and carries `data-slot` |
| `{name}.test-utils.tsx` | Shared render helpers, when several test files need them |
| `apps/docs/stories/*.stories.tsx` | Render + interaction in a real browser via `@storybook/addon-vitest` |

Run them:

```sh
pnpm -F @signozhq/ui test:run     # jsdom unit + guardrail tests
pnpm run type-check
cd apps/docs && pnpm test-storybook
```

Query by role and accessible name (`getByRole('button', { name: /close badge/i })`) or by
`testId`. Don't assert on hashed CSS Module class names.

## 8. Reviewing

- **Per PR**: the checklist in [`.github/pull_request_template.md`](./.github/pull_request_template.md)
  is this document in checkbox form. It ships with every PR body, tick it, don't delete it.
- **Auditing an existing component**: score it with
  [COMPONENT_AUDIT_RUBRIC.md](./COMPONENT_AUDIT_RUBRIC.md) and record the total in an issue.
