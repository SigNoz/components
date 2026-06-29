# Contributing to Signoz Components

## Getting Started

1. Clone the repository:
  ```sh
   git clone git@github.com:SigNoz/components.git
  ```
2. Install dependencies:
  ```sh
   pnpm install
  ```
3. Build the packages:
  ```sh
   pnpm build
  ```
4. Start Storybook:
  ```sh
   pnpm run dev
  ```

## Useful Commands

- `pnpm build` - Build all packages, including the Storybook site
- `pnpm dev` - Run all packages locally and preview with Storybook
- `pnpm lint` - Lint all packages
- `pnpm run type-check` - Type-check the repo with `tsgo --noEmit` (also runs in CI on every push)
- `pnpm clean` - Clean up all `node_modules` and `dist` folders
- `pnpm run tokens` (in `packages/ui`) - Regenerate CSS token JSDoc tables in component `index.ts` files
- `pnpm run tokens:check` (in `packages/ui`) - Fail if token docs are out of date (same check as CI)

## CSS token documentation

Component styles use CSS custom properties with a `--{component}-` prefix (for example `--button-primary-background`). Public customization tokens are documented in each component’s `packages/ui/src/{component}/index.ts` inside a `// #region css-tokens` block so agents and consumers can discover them without reading SCSS.

After you add or change `--{component}-*` variables in a component’s `.scss` or `.css` files, regenerate the docs:

```sh
cd packages/ui
pnpm run tokens
```

Commit the updated `index.ts` regions together with your style changes. CI runs `pnpm run tokens:check` on pull requests; if it fails, run `pnpm run tokens` locally and commit the result.

Implementation-only variables should use an `-internal-` segment in the name (for example `--button-internal-background`). Those are excluded from the generated tables and are not part of the public customization API.

## Adding a New Component

All components live in the single package `@signozhq/ui` under `packages/ui`.

### Using the Generator (Recommended)

The easiest way to add a new component is using the turbo generator:

1. Create a new branch:
  ```sh
   git checkout -b feature/new-component-name
  ```
2. Run the generator:
  ```sh
   pnpm turbo gen
  ```
3. Select `new-component` and follow the prompts:
  - Enter the component name in kebab-case (e.g., `my-component`)
  - Provide a brief description
  - Choose whether to import from shadcn or create from scratch
   The generator will automatically:
  - Create the component folder at `packages/ui/src/{name}/`
  - Add the export to `packages/ui/src/index.ts`
  - Add the build entry to `packages/ui/vite.config.ts`
  - Create a Storybook story at `apps/docs/stories/{name}.stories.tsx`
  - Run `pnpm install`
4. Build and verify:
  ```sh
   pnpm build
   pnpm dev
  ```
5. Commit and push:
  ```sh
   git add .
   git commit -m "Add new component: my-component"
   git push origin feature/new-component-name
  ```
6. Open a pull request.

### Manual Setup

If you prefer to add a component manually:

1. Create a new branch:
  ```sh
   git checkout -b feature/new-component-name
  ```
2. Add the component under `packages/ui/src/`:
  - Create a folder named after the component (e.g., `packages/ui/src/my-component/`)
  - Add the component file (e.g., `my-component.tsx`) and an `index.ts` that re-exports the public API
  - Add an `index.css` for component styles
  - Follow the structure of existing components (e.g., `packages/ui/src/badge/`)
3. Register the new export in `packages/ui/src/index.ts`:
  ```ts
   export * from './my-component/index.js';
  ```
4. Register the new entry in `packages/ui/vite.config.ts`:
  ```ts
   const entries: Record<string, string> = {
     // ... existing entries
     'my-component/index': 'src/my-component/index.ts',
   };
  ```
5. Add a Storybook story in `apps/docs/stories/`:
  - Create `apps/docs/stories/my-component.stories.tsx`
  - Import from `@signozhq/ui` and use the same story/doc pattern as other stories (see e.g., `badge.stories.tsx`)
6. Build and verify:
  ```sh
   pnpm build
   pnpm dev
  ```
7. Commit and push:
  ```sh
   git add .
   git commit -m "Add new component: my-component"
   git push origin feature/new-component-name
  ```
8. Open a pull request.

## Releasing

Releases are driven by Release Please. Create a pull request with your changes and the Release Please bot will create a release draft with generated notes.