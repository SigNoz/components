# Component Audit Rubric

Scoring instrument for **existing** components in `@signozhq/ui`. Use it to decide what to fix
next, and to record a component's state in an issue.

The standard being scored is [COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md). For a new
component or a PR, use the checklist in
[`.github/pull_request_template.md`](./.github/pull_request_template.md) instead, this document
is for auditing what already shipped.

## How to use it

1. Score each of the six dimensions 0, 1 or 2. Total out of 12.
2. Open an issue per component with the table filled in, and the total in the title.
3. Fix in band order: everything in 0-4 before anything in 8-10.

## Dimensions

| # | Dimension | 0 | 1 | 2 |
| --- | --- | --- | --- | --- |
| 1 | **Structure & exports** | Logic in `index.ts`, or a flat file dump, or missing from one of the four lists | Correct layout, but naming drift (`components/` instead of `subcomponents/`) or shared helpers inlined | Kebab-case dir, clean `index.ts`, `subcomponents/` + `presets/` split, all lists in sync |
| 2 | **CSS & tokens** | Hardcoded values, primitive (`--bg-*` / `--text-*`) colours, Tailwind remnants, global selectors, or a `--x: var(--x)` bug | Tokenized, but still carries literal fallbacks on design tokens, or some literals / class-based variants left | Every value a `--{component}-*` var resolving to a **semantic** design token with no literal fallback, `data-*` variants, `-internal-` used for non-overridable values, token region current, all interaction states styled |
| 3 | **Props & types** | Upstream signatures restated by hand, unexported types a prop needs, or no `forwardRef` | Correct `forwardRef`/`testId`, but some upstream-owned prop types still hand-written instead of borrowed | Every prop declared explicitly with JSDoc, upstream-owned types borrowed via `OriginalProps['x']`, `Pick` reserved for undocumented pass-throughs, all referenced types exported, `asChild` where sensible, Radix-style controlled/uncontrolled naming |
| 4 | **Prop documentation** | No JSDoc | Partial JSDoc, or `@default` tags that disagree with the implementation | Every public prop documented with its constraints and interactions; `@default` matches implementation *and* `argTypes` |
| 5 | **Stories & MDX** | No story, or wrong title group, or one story with no `argTypes` | `Default` story + some `argTypes`; no per-subcomponent stories or no MDX | Story per exported component, fully categorized `argTypes`, a story per meaningful state, MDX with usage snippet + correct per-piece `<Controls>` |
| 6 | **Tests** | None | Render smoke test only | Behaviour test per interactive prop, `forward-ref` test, interaction story exercised by `test-storybook` |

## Bands

| Total | Meaning |
| --- | --- |
| 11-12 | Reference quality, safe to point new contributors at |
| 8-10 | Solid. File issues for the gaps, no blocker |
| 5-7 | Needs work before we recommend it. Prioritize dimensions 2 and 3 |
| 0-4 | Rework before recommending it anywhere. If it is also deprecated, it belongs in the `Old Components` Storybook group with an explicit update-or-delete decision attached |

## Weighting

Dimensions 2 and 3 carry the most consumer-visible risk: a CSS gap means consumers cannot
theme the component at all, and a props gap breaks their build on the next dependency bump.
