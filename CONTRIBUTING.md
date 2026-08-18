# Contributing to Signoz Components

Start here, then follow the doc for what you're doing.

| Doc | Read it for |
| --- | --- |
| [COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md) | The standard every component is held to: layout, CSS, props, docs, stories, tests |
| [BUILD.md](./BUILD.md) | *Why* the packaging, build and CSS work this way. Read before changing `vite.config.ts` or the styling approach |
| [`.github/pull_request_template.md`](./.github/pull_request_template.md) | The per-PR checklist (it ships in every PR body) |
| [COMPONENT_AUDIT_RUBRIC.md](./COMPONENT_AUDIT_RUBRIC.md) | Scoring an existing component in an audit |
| [VISUAL_TESTING.md](./VISUAL_TESTING.md) | Chromatic and the `run-visual-testing` label |
| [RELEASE.md](./RELEASE.md) | How a version ships, and how to cut a hotfix |

## Getting started

```sh
git clone git@github.com:SigNoz/components.git
pnpm install
pnpm build     # packages/ui must be built before Storybook can import it
pnpm dev       # Storybook on http://localhost:6006
```

Stories import `@signozhq/ui` as a built package, so a fresh clone needs `pnpm build` before
`pnpm dev`. After that `pnpm dev` covers both: it runs Storybook *and* `vite build --watch` on
`packages/ui`, so component edits rebuild and reload.

## Useful commands

| Command | What | Notes |
| --- | --- | --- |
| `pnpm build` | Build every package + the Storybook site | `packages/ui` runs `vite build && publint` |
| `pnpm dev` | Storybook (`apps/docs`) + `vite build --watch` on `packages/ui` | Both are persistent turbo tasks |
| `pnpm lint` / `pnpm lint:fix` | Lint `apps` + `packages` with `oxlint` | Runs in CI. Config `.oxlintrc.json`. `typescript/consistent-type-imports` is an error, so write `import type` |
| `pnpm format` / `pnpm format:check` | Format with `oxfmt` | `.oxfmtrc.json`: tabs, width 100, single quotes, trailing commas. **Skips styles, markdown and YAML** (`ignorePatterns`), your editor formats those |
| `pnpm run type-check` | `tsgo --noEmit` over the whole repo | Runs in CI and in `lint-staged` |
| `pnpm -F @signozhq/ui test:run` | Unit + guardrail tests (jsdom, vitest) | |
| `cd apps/docs && pnpm test-storybook` | Story render + interaction tests in real Chromium | This is what CI runs |
| `pnpm -F @signozhq/ui tokens` | Regenerate the CSS token JSDoc tables in component `index.ts` files | Run after touching any `--{component}-*` variable |
| `pnpm -F @signozhq/ui tokens:check` | Fail if the token tables are stale | Same check as `lint-staged` and CI |
| `pnpm clean` | Remove every `node_modules` and `dist` | |

`husky` + `lint-staged` run on commit: `type-check`, `oxlint --fix` and `oxfmt` on JS/TS/JSON,
`tokens:check` when `packages/ui` style files change. Commit messages are validated by
`commitlint` against [Conventional Commits](./RELEASE.md#commit-messages), and since PRs are
squash merged, **the PR title is the commit message**, so the title has to be conventional too.

## Adding a new component

All components live in the single package `@signozhq/ui` under `packages/ui`. See
[BUILD.md](./BUILD.md#1-package-topology) for why, and
[COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md) for how each file should look.

There is no scaffolding generator. The `pnpm turbo gen` generator was removed because its
output did not follow these guidelines (plain `index.css`, no `forwardRef`, no `data-*`
variants, no token region) and it never registered the `package.json` export, so every
generated component needed rewriting anyway. **Copy an existing component instead.**

1. Branch: `git checkout -b feat/my-component`

2. Copy `packages/ui/src/badge/` to `packages/ui/src/my-component/` as the starting shape, then
   follow [Code organization](./COMPONENT_GUIDELINES.md#1-code-organization). For a component
   with subcomponents and presets, copy `packages/ui/src/dialog/` instead.

3. Register the export in `packages/ui/src/index.ts`:

   ```ts
   export * from './my-component/index.js';
   ```

4. Register the build entry in `packages/ui/vite.config.ts`:

   ```ts
   export const entries: Record<string, string> = {
     // ... existing entries
     'my-component/index': 'src/my-component/index.ts',
   };
   ```

5. Register the subpath in `packages/ui/package.json`:

   ```json
   "./my-component": {
     "import": { "types": "./dist/my-component/index.d.ts",  "import": "./dist/my-component/index.mjs" },
     "require": { "types": "./dist/my-component/index.d.cts", "require": "./dist/my-component/index.cjs" }
   }
   ```

6. Add the import line to root `README.md` and `apps/docs/stories/intro.mdx`.

7. Add `apps/docs/stories/my-component.stories.tsx` and `my-component.mdx`, following
   [How to create stories](./COMPONENT_GUIDELINES.md#5-how-to-create-stories).

8. Regenerate the token docs: `pnpm -F @signozhq/ui tokens`

9. Verify:

   ```sh
   pnpm lint
   pnpm build
   pnpm run type-check
   pnpm -F @signozhq/ui test:run
   pnpm dev
   ```

   Steps 3-6 are each enforced by a test in `packages/ui/src/__tests__/`. If you missed one,
   `test:run` names it, see [Guardrails](./BUILD.md#5-guardrails).

10. Commit and push:

    ```sh
    git commit -m "feat(my-component): add my-component"
    git push origin feat/my-component
    ```

11. Open a PR. The checklist is already in the body ,  fill it in. Add the
    `run-visual-testing` label if the change is visual.

Removing a component is the same list in reverse. Removing a `package.json` export is a
**breaking change** and needs a `feat!:` / `fix!:` commit, see [RELEASE.md](./RELEASE.md).

## Releasing

Releases are cut by Release Please from the commits on `main`. See
[RELEASE.md](./RELEASE.md).
