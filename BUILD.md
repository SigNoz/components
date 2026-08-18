# Build & Styling Architecture

Why this repo is built the way it is: one package, Vite library mode, CSS Modules over CSS
custom properties, and no Tailwind inside the library.

Read this before you change `packages/ui/vite.config.ts`,
`packages/typescript-config/vite.config.extend.ts`, `packages/ui/package.json`, or the
styling approach of a component. For day-to-day component work, see
[COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md).

## Decisions at a glance

| Decision | What we do | Why |
| --- | --- | --- |
| Packaging | One publishable package, `@signozhq/ui`, with one subpath export per component | Ship several components in one go, maintain one package instead of many, and make changes across components that depend on each other trivial. Tree-shaking keeps consumers from paying for the whole library |
| Bundler | Vite library mode, with `vite` aliased to `rolldown-vite` | Vite 8 was not out at the time and `rolldown-vite` was much faster. **Now superseded**; see the note below |
| Output | Dual ESM + CJS, one output file per source file | Consumers are both bundlers and Node tooling (SSR/test runners), and per-module output is what makes tree-shaking actually work |
| Styles | CSS Modules (`*.module.scss`) driven by CSS custom properties | Consumers can retheme any value with plain CSS, without our build tool or our class hashes |
| CSS delivery | Injected by JS at import time (`vite-plugin-css-injected-by-js`) | `import { Badge }` must be enough. No CSS file for a consumer to remember, and no CSS-handling requirement on their bundler |
| Tailwind | Not used in `packages/ui` or `apps/docs` | Duplicated CSS + duplicated custom properties across packages froze Chrome DevTools, and Storybook's Tailwind reset hid the fact that the SigNoz app has no comparable reset |
| Lint/format | `oxlint` + `oxfmt` | Speed. Same setup as `signoz/signoz`. Faster than ESLint + Prettier, and no OOM like Biome |

## 1. Package topology

### One package, many entry points

Everything ships from `packages/ui` as `@signozhq/ui`. Each component is also reachable on
its own subpath:

```ts
import { Badge } from '@signozhq/ui';          // barrel
import { Badge } from '@signozhq/ui/badge';    // subpath
```

This used to be one npm package per component (`@signozhq/badge`, `@signozhq/button`, and so on),
consolidated in `feat: single package (#120)`. Reasons:

- **Shipping several components at once is one release**, not one release per package with
  version bumps between them.
- **One package is less to maintain** than twenty-two: one build, one dependency set, one
  changelog.
- **Components use each other.** `badge` renders `text-ellipsis`; `drawer` builds on
  `dialog`. As separate packages every such change crossed a published version boundary.
  Now it's a relative import.
- **Tree-shaking keeps the size honest.** A consumer importing `Badge` doesn't pay for the
  rest of the library, which is why the build emits per-module output rather than one chunk
  (see [section 2](#the-shared-config-getvitelibconfig)).

The cost: "one package" and "many entry points" mean lists that must agree: component
directory, `src/index.ts`, `vite.config.ts` entries, `package.json` exports. That parity is
enforced by tests, see [section 5](#5-guardrails).

### The other workspace packages

| Package | Published? | Role |
| --- | --- | --- |
| `packages/ui` | yes (`@signozhq/ui`) | Every component |
| `packages/tailwind-config` | yes (`@signozhq/tailwind-config`) | **Only** exposes our design tokens to a consuming app's Tailwind. Ships `tailwind.config.js` + `global.css`, nothing else. Not used by `packages/ui` |
| `packages/typescript-config` | no (`@repo/typescript-config`) | Shared `tsconfig` bases **and** the shared Vite library config (`vite.config.extend.ts`) |
| `apps/docs` | no | Storybook site |

`@signozhq/tailwind-config` exists so an app that already uses Tailwind can get our design
tokens as Tailwind values. It is a consumer-side bridge, not part of how the library is
built, and components must never import from it. See
[`.cursor/rules/BUGBOT.md`](./.cursor/rules/BUGBOT.md).

## 2. The build pipeline

`pnpm build` runs `turbo run build`, which for `packages/ui` is `vite build && publint`.

### `vite` is actually `rolldown-vite`, and this is on its way out

Root `package.json` aliases and patches it:

```json
"devDependencies": { "vite": "npm:rolldown-vite@7.3.1" },
"pnpm": {
  "overrides": { "vite": "npm:rolldown-vite@7.3.1" },
  "patchedDependencies": { "rolldown-vite@7.3.1": "patches/rolldown-vite@7.3.1.patch" }
}
```

The reason is historical: Vite 8 had not been released, and `rolldown-vite` built this repo
much faster than Vite at the time. **Vite 8 is out, so this setup is deprecated and will
eventually be replaced by plain Vite.** Treat the alias as temporary; don't build new
tooling that depends on it.

Consequence while it lasts: every Vite-consuming dependency (Storybook, Vitest,
`@vitejs/plugin-react`) has to accept the alias, which is why root
`pnpm.packageExtensions` widens their `vite` peer range. If you add a Vite-based tool and
pnpm reports an unmet `vite` peer, add it there rather than un-aliasing.

The patch itself is unrelated to output: it fixes `convertToNotifyOptions` so `pollInterval`
is only set when `usePolling` is on.

### The shared config: `getViteLibConfig`

`packages/ui/vite.config.ts` is thin on purpose: a map of entries handed to the shared
factory in `packages/typescript-config/vite.config.extend.ts`:

```ts
const entries: Record<string, string> = {
  index: 'src/index.ts',
  'badge/index': 'src/badge/index.ts',
  // one line per component
};

export default defineConfig(getViteLibConfig(entries, { plugins: [react()] }));
```

What the factory sets:

| Option | Value | Note |
| --- | --- | --- |
| `build.lib.formats` | `['es', 'cjs']` | Dual publish |
| `build.lib.fileName` | `[name].mjs` / `[name].cjs` | Explicit extensions, so Node resolves the format regardless of the consumer's `"type"` |
| `output.preserveModules` | `true` | One output file per source file instead of one bundled chunk. Keeps tree-shaking effective, and keeps CSS split per component |
| `output.preserveModulesRoot` | `'src'` | `dist/` mirrors `src/`, so `dist/badge/index.mjs` matches the `./badge` export path |
| `build.cssCodeSplit` | `true` | Each component's CSS stays attached to that component's chunk |
| `rolldownOptions.platform` | `'browser'` | No Node built-in shims |
| `build.sourcemap` | `true` | Debuggable in consumer apps |
| `build.minify` | `false` | Current value, inherited |
| `build.target` / `lib` | `es2018` | Current value, inherited |

### Dual-publish types are generated, then duplicated

TypeScript ≥5 resolves `.d.ts` in the *consumer's* module context, so one type file cannot
serve both the ESM and CJS export of a package.
[`publint` flags it](https://publint.dev/rules#export_types_invalid_format).

`vite-plugin-dts` emits `.d.ts`, then an `afterBuild` hook copies every file to `.d.cts` and
rewrites its internals:

- `sourceMappingURL=...d.ts.map` becomes `...d.cts.map`
- `from './x.js'` becomes `from './x.cjs'` (and `.jsx` becomes `.cjs`)
- the `.map` file's own `file` field

Which is why `package.json` exports carry two type entries per subpath, not one:

```json
"./badge": {
  "import": { "types": "./dist/badge/index.d.ts",  "import": "./dist/badge/index.mjs" },
  "require": { "types": "./dist/badge/index.d.cts", "require": "./dist/badge/index.cjs" }
}
```

`publint` runs right after `vite build` and fails if this contract breaks. Don't hand-edit
`dist`. Fix the factory.

### Externals

`externalPatterns` in `vite.config.extend.ts` is the single list of what we do **not**
bundle: React, every `@radix-ui/*`, every `@signozhq/*`, `clsx`, `cmdk`, `sonner`, `dayjs`,
`lodash-es`, `@tanstack/*`, `motion/react`, `nuqs`, and friends.

Rule of thumb: **anything a consumer could also install must be external.** Bundling a copy
of Radix means two instances of its context: a `Dialog` from our bundle and one from the
app's would not see each other's provider.

A test enforces this: `packages/ui/src/__tests__/vite-externals.test.ts` computes
`dependencies + peerDependencies` minus `externalPatterns` and asserts the remainder is
`[]`. If you add a runtime dep without externalizing it, the test fails with its name.

### Output shape

```
packages/ui/dist/
├── index.mjs / index.cjs            # barrel
├── index.d.ts / index.d.cts
├── badge/
│   ├── index.mjs / index.cjs
│   ├── badge.mjs  / badge.cjs       # preserveModules: one file per source file
│   └── index.d.ts / index.d.cts
└── ...
```

Only `dist` is published (`"files": ["dist"]`). `prepack` copies the root `README.md` in.

## 3. Styling

### CSS Modules + Sass

Component styles live next to the component as `{name}.module.scss` and are imported as an
object:

```tsx
import styles from './badge.module.scss';

className={cn(styles.badge, className)}
```

Sass is used for **nesting and the occasional `@mixin`** (see `skeleton.module.scss`), not
for variables, colour math or `@use` graphs. All values come from CSS custom properties
instead, because those survive into the browser and stay overridable; a Sass variable is
compiled away and a consumer can never reach it.

All component styles are `*.module.scss`. The last `*.module.css` files were renamed in
the same pass that removed the leftover non-module `index.css` sheets, so `.module.scss` is
now the only styling entry point in `packages/ui`.

### Custom properties are the public API

Every value a consumer might reasonably want to change is read through a `--{component}-`
variable with a fallback:

```scss
.badge {
    padding: var(--badge-padding, var(--spacing-2) var(--spacing-4));
    font-size: var(--badge-font-size, var(--periscope-font-size-small));
    background-color: var(--badge-background);
    color: var(--badge-foreground);
}
```

Variants are **data attributes on the element**, which re-point those variables:

```scss
.badge[data-variant="outline"] { /* ... */ }
.badge[data-color="forest"] {
    --badge-background: var(--accent-forest);
    --badge-foreground: var(--accent-forest-foreground);
}
```

Consequences:

- A consumer themes a component with plain CSS (`.my-scope { --badge-padding: 0 }`) and needs
  no access to our class hashes, our Sass, or our build tool. **Allowing this override is the
  rule**: a hardcoded value is a value nobody can change.
- Variant explosion stays in CSS, not in JS. There is no class-name matrix to generate, which
  is why CVA was dropped (`chore(ui): remove Tailwind CSS and CVA dependencies`) and why
  `cn()` is just `clsx`.
- Naming: public tokens are `--{component}-{thing}`; anything **not** meant to be overridden
  carries an `-internal-` segment (`--button-internal-background`) and is excluded from the
  generated docs.
- The chain is two links: `var(--{component}-x, <design token>)`. A design token never needs a
  literal fallback; see
  [COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md#values-come-from-design-tokens).
- Never write `--x: var(--x)`, and never define the same variable twice in one block. Both
  silently break the variable, and BugBot comments on both in review
  (`.cursor/rules/BUGBOT.md`).

The token tables in each `packages/ui/src/{component}/index.ts` are **generated** from the
style files by `packages/ui/scripts/extract-css-tokens.mjs`:

```sh
cd packages/ui
pnpm run tokens        # regenerate
pnpm run tokens:check  # CI + pre-commit check
```

They live in a `// #region css-tokens` JSDoc block so both humans and AI agents can discover
the customization surface without reading SCSS.

### CSS is injected by JS

`vite-plugin-css-injected-by-js` with `relativeCSSInjection: true` inlines each chunk's CSS
into that chunk as a runtime `<style>` injection. Two reasons:

1. **A consumer should never have to import a CSS file.** `import { Badge } from
   '@signozhq/ui'` and it is styled. A separate `@signozhq/ui/styles.css` is a step people
   forget, and a subpath import would then render unstyled.
2. **No CSS-handling requirement on the consumer's bundler.** Works the same under Vite,
   webpack, Next, SSR and test runners.

`package.json` declares `"sideEffects": ["*.css"]` so bundlers don't drop the injection.
Trade-off: no consumer-side CSS extraction, styles land at runtime rather than in a
stylesheet.

What consumers *do* import is the **design tokens**: the `--accent-*`, `--l2-*`,
`--spacing-*`, `--radius-*` values our components read:

```css
@import "@signozhq/design-tokens/dist/style.css";
@import "@signozhq/design-tokens/dist/themes/signoz-tokens.css";
```

Theme is selected with `data-theme` on `<html>`/`<body>`. See [README.md](./README.md).

### Why Tailwind is gone

Tailwind was removed from `packages/ui` and `apps/docs` after two bugs:

1. **DevTools froze on pages using multiple components.** Each package shipped its own
   Tailwind output, so twenty components meant twenty copies of the same CSS custom
   properties. Chrome's style panel choked resolving the duplicated cascade.

2. **Components broke in the SigNoz app but looked fine in Storybook.** Tailwind's Preflight
   reset masked styling issues that only surfaced in apps without that reset. See commit
   `41e2073`.

`apps/docs/index.css` has a minimal reset now, the comment "*replaces Tailwind preflight*"
marks what was kept.

Apps that want our tokens as Tailwind utilities can install `@signozhq/tailwind-config`.

## 4. Supporting toolchain

`oxlint` + `oxfmt` replaced ESLint + Prettier (Biome was tried in between but OOMed). Reason:
speed. Same setup as `signoz/signoz`.

**`oxfmt` skips styles, markdown, YAML** (`ignorePatterns` in `.oxfmtrc.json`). Your editor
formats those; CI won't reformat a style-only diff.

Other tools: `tsgo` (`@typescript/native-preview`) for type checking, `vitest` in jsdom for
unit tests, `vitest` in Chromium for interaction tests, `@storybook/react-vite` for docs,
Chromatic for snapshots ([VISUAL_TESTING.md](./VISUAL_TESTING.md)), Release Please for
publishing ([RELEASE.md](./RELEASE.md)). See
[CONTRIBUTING.md](./CONTRIBUTING.md#useful-commands) for commands.

**Storybook gotcha:** `react-docgen-typescript` only parses the docs app's sources. Stories
import from `dist`, so props tables come from `argTypes`, not component JSDoc. See
[COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md#jsdoc-on-every-public-prop).

## 5. Guardrails

`packages/ui/src/__tests__/` exists because the single-package/many-entry-points design has
lists that must agree. Each test names exactly what is missing.

| Test | Asserts |
| --- | --- |
| `package-json-exports.test.ts` | every `src/{component}/index.ts` has a `package.json` export, no orphan exports, and `package.json` exports match `vite.config.ts` entries |
| `vite-config-exports.test.ts` | every component directory has a `vite.config.ts` entry, and no entry is orphaned |
| `documentation.test.ts` | every component appears in root `README.md` **and** `apps/docs/stories/intro.mdx` |
| `vite-externals.test.ts` | no runtime dependency is silently bundled |

A fifth class has no test: prop types restated by hand over an upstream primitive drift
silently on upgrade, so components are supposed to borrow the upstream type per prop instead
([COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md#wrapping-a-third-party-primitive)).
Convention only, already broken: `resizable` still narrows `onLayoutChanged`, and nothing in
CI notices.

## 6. Adding or removing an entry point

An entry point is four lists that must agree: `src/{name}/index.ts`, `src/index.ts`,
`vite.config.ts`, `package.json` exports. Plus the two docs files
(`README.md`, `intro.mdx`) that [section 5](#5-guardrails) enforces. The step-by-step version,
including the stories, lives in
[CONTRIBUTING.md](./CONTRIBUTING.md#adding-a-new-component).

Verify with:

```sh
pnpm build                       # vite build + publint
pnpm run type-check
pnpm -F @signozhq/ui test:run    # parity + docs + externals tests
```

Removing a component is the same list in reverse, and removing a `package.json` export is a
**breaking change**, so it needs a `feat!:`/`fix!:` commit. See [RELEASE.md](./RELEASE.md).

## 7. Gotchas

Build-level traps. The component-authoring rules they imply are in
[COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md).

- **`import type` is mandatory.** `verbatimModuleSyntax` + `isolatedModules` are on; a value
  import of a type breaks the CJS output. `oxlint` errors on it.
- **Relative imports carry `.js`.** `moduleResolution: "Bundler"` with the `.js` suffix is
  what makes the emitted ESM/CJS resolve. Write `from './badge.js'` in `.ts` files.
- **Don't import CSS from another component's module.** CSS Modules hash per file, and
  `cssCodeSplit` attaches each sheet to its own chunk, so the class you import is not the class
  that ships. Share a custom property instead.
- **Adding a runtime dep?** Add it to `externalPatterns` in the same commit, or the externals
  test fails.
- **New Vite-based tool?** Add the `vite` peer widening to root `pnpm.packageExtensions`, and
  remember the alias is temporary.
- **Never hand-edit `dist`.** `publint` runs after every build; fix the factory in
  `vite.config.extend.ts` instead.
