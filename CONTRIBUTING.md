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
- `pnpm changeset` - Generate a changeset
- `pnpm clean` - Clean up all `node_modules` and `dist` folders

## Adding a New Component

All components live in the single package `@signozhq/components` under `packages/components`. To add a new component:

1. Create a new branch:

   ```sh
   git checkout -b feature/new-component-name
   ```

2. Add the component under `packages/components/src/`:

   - Create a folder named after the component (e.g. `packages/components/src/my-component/`).
   - Add the component file (e.g. `my-component.tsx`) and an `index.ts` that re-exports the public API.
   - Follow the structure of existing components (e.g. `packages/components/src/badge/`).

3. Register the new export in `packages/components/package.json`:

   - Add an entry under `exports` for the new subpath (e.g. `"./my-component": { ... }`).
   - Copy the pattern from an existing component export (e.g. `"./badge"`).

4. Add a Storybook story in `apps/docs/stories/`:

   - Create `apps/docs/stories/my-component.stories.tsx`.
   - Import from `@signozhq/components/my-component` and use the same story/doc pattern as other stories (see e.g. `badge.stories.tsx`).

5. Build and verify:

   ```sh
   pnpm build
   pnpm dev
   ```

6. From the root of the project, run:

   ```sh
   pnpm changeset
   ```

   This will guide you through creating a changeset. Select `@signozhq/components` when prompted for which packages to include, then write a summary.

7. Commit and push:

   ```sh
   git add .
   git commit -m "Add new component: my-component"
   git push origin feature/new-component-name
   ```

8. Open a pull request.
