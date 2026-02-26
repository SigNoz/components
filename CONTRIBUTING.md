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
- `pnpm clean` - Clean up all `node_modules` and `dist` folders

## Adding a New Component

All components live in the single package `@signozhq/ui` under `packages/ui`. To add a new component:

1. Create a new branch:

   ```sh
   git checkout -b feature/new-component-name
   ```

2. Add the component under `packages/ui/src/`:

   - Create a folder named after the component (e.g. `packages/ui/src/my-component/`).
   - Add the component file (e.g. `my-component.tsx`) and an `index.ts` that re-exports the public API.
   - Follow the structure of existing components (e.g. `packages/ui/src/badge/`).

3. Register the new export in `packages/ui/package.json`:

   - Add an entry under `exports` for the new subpath (e.g. `"./my-component": { ... }`).
   - Copy the pattern from an existing component export (e.g. `"./badge"`).

4. Register the new export in `packages/ui/index.ts`:
   - Add an entry under `export * from './my-component';` for the new subpath (e.g. `export * from './my-component';`).

5. Register the new export in `packages/ui/vite.config.ts`:
   - Add an entry under `index: 'src/index.ts',` for the new subpath (e.g. `'my-component/index': 'src/my-component/index.ts',`).

6. Add a Storybook story in `apps/docs/stories/`:

   - Create `apps/docs/stories/my-component.stories.tsx`.
   - Import from `@signozhq/ui` and use the same story/doc pattern as other stories (see e.g. `badge.stories.tsx`).

7. Build and verify:

   ```sh
   pnpm build
   pnpm dev
   ```

8. Commit and push:

   ```sh
   git add .
   git commit -m "Add new component: my-component"
   git push origin feature/new-component-name
   ```

9. Open a pull request.

## Releasing

Releases are driven by Release Please. Create a pull request with your changes and the Release Please bot will create a release draft with generated notes.
