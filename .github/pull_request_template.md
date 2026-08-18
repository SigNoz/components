## What

<!-- What does this PR change? -->

## Why

<!-- Link the issue, the Figma frame, or the bug report. -->

## How to verify

<!-- Storybook path, story name, or the command to run. -->

---

<!--
The PR title becomes the squash commit, so it must be a Conventional Commit
(`feat(badge): ...`, `fix(dialog): ...`). Breaking change? Add `!` after the scope
and say what breaks. See RELEASE.md.

Visual change? Add the `run-visual-testing` label to get Chromatic snapshots.
See VISUAL_TESTING.md.

The checklist below is COMPONENT_GUIDELINES.md in checkbox form. Keep the sections
that apply to this PR and delete the rest — a docs-only or CI-only PR needs none of it.
-->

<details>
<summary><b>Component checklist</b> — required for any change under <code>packages/ui/src/</code></summary>

**Structure** ([guidelines](https://github.com/SigNoz/components/blob/main/COMPONENT_GUIDELINES.md#1-code-organization))

- [ ] Directory is kebab-case under `packages/ui/src/`, matches the export subpath
- [ ] `index.ts` only re-exports (+ generated token region); `export type *` plus explicit named exports
- [ ] Relative imports use the `.js` extension; types imported with `import type`
- [ ] Subcomponents in `subcomponents/`, opinionated compositions in `presets/`
- [ ] All four lists updated: `src/index.ts`, `vite.config.ts`, `package.json` exports, `README.md` + `intro.mdx`
- [ ] New runtime deps added to `externalPatterns`

**CSS** ([guidelines](https://github.com/SigNoz/components/blob/main/COMPONENT_GUIDELINES.md#2-css-organization))

- [ ] `{name}.module.scss`, no Tailwind, no CVA, no Sass variables
- [ ] Every overridable value is `var(--{component}-x, <design token>)`; no hardcoded values
- [ ] No literal fallback on a design token (`var(--spacing-4, 8px)`); a bare literal only where no token matches
- [ ] Colours use semantic tokens only, with no `--bg-*` / `--text-*` primitives referenced from a component
- [ ] Values that must not be overridden use `--{component}-internal-*`
- [ ] No `--x: var(--x)` and no duplicated variable definitions
- [ ] Variants are `data-*` attributes; `data-slot` and `data-testid` on the root
- [ ] `color-mix()` for derived shades, never `rgba()` over a token
- [ ] `:hover`, `:focus-visible`, `aria-invalid`, disabled all styled
- [ ] Transitions use the component's duration/easing tokens and are disabled under `@media (prefers-reduced-motion: reduce)`
- [ ] `pnpm run tokens` run and the `index.ts` region committed

**Visual QA** ([guidelines](https://github.com/SigNoz/components/blob/main/COMPONENT_GUIDELINES.md#6-visual-qa))

- [ ] Compared against the Figma frame side by side: spacing, sizes, colours, every state
- [ ] Figma frame linked from the story via `parameters.design`
- [ ] Checked in light *and* dark
- [ ] Sizing and density consistent with sibling components (`sm` matches `Button` / `Input`)
- [ ] Typography via `Typography` or the type-scale tokens, not an ad-hoc `font-size` / `font-weight`
- [ ] Icons from `@signozhq/icons`, sized with tokens, no inline SVG with hardcoded `px`
- [ ] Every state built: default, hover, focus-visible, active, disabled, loading, invalid, selected, empty, long/truncated
- [ ] Not a duplicate of an existing primitive or preset

**Types** ([guidelines](https://github.com/SigNoz/components/blob/main/COMPONENT_GUIDELINES.md#3-how-to-expose-props-via-typescript))

- [ ] `{Component}Props` exported; only the props the component actually needs are exposed
- [ ] Upstream-owned prop types borrowed by indexed access (`OriginalProps['x']`), never restated by hand
- [ ] Every type named by a public prop is exported from `index.ts`
- [ ] `forwardRef` + `displayName`; `asChild`, `testId` supported
- [ ] Defaults in the destructuring; controlled/uncontrolled naming follows Radix

**Docs** ([guidelines](https://github.com/SigNoz/components/blob/main/COMPONENT_GUIDELINES.md#4-how-to-document-props))

- [ ] JSDoc on **every** public prop, with `@default` where applicable
- [ ] Story file per exported component, correct `title` group
- [ ] `argTypes` complete with `category`, `type.summary`, `defaultValue.summary`
- [ ] Stories for every meaningful state, not just the happy path
- [ ] `{component}.mdx` with a usage snippet and a `<Controls>` per exported piece

**Tests** ([guidelines](https://github.com/SigNoz/components/blob/main/COMPONENT_GUIDELINES.md#7-tests))

- [ ] Behaviour test per interactive prop
- [ ] `forward-ref` test
- [ ] `run-visual-testing` label added if the change is visual

```sh
pnpm lint
pnpm run type-check
pnpm build
pnpm -F @signozhq/ui test:run
```

</details>
