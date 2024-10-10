# Signoz Components Library

This guide explains how to use Signoz components library powered by Turborepo, React, and Storybook.

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
- `pnpm turbo gen new-package` - Custom generator script to add new component/package to the component library

## Available Packages

- `@signozhq/theme`: Contains theme provider, theme switcher, ...
- `@signozhq/tailwind-config`: UI configuration, including Tailwind CSS setup
- `@signozhq/button`: Button component
- `@signozhq/input`: Input component

## Creating a New Package

To create a new package:

1. Create a new branch:

   ```sh
   git checkout -b feature/new-package-name
   ```

2. From the root of the project, run:

   ```sh
   pnpm turbo gen new-package
   ```

   During the package creation process, you'll be asked to input a name, description, and choose between creating a component from scratch or importing one from shadcn. Provide the requested information as prompted. Here's an example:

   - Package name: component/package name (if you want to get the component from shadcn, Enter a name that corresponds to a shadcn component e.g. dropdown-menu)
   - Description: Provide a brief explanation of the package's purpose
   - You can choose to either import a pre-built component from shadcn or create a new component from scratch

   e.g.

   ```sh
   ❯ pnpm turbo gen new-package
   turbo 2.1.2


   >>> Modify "design-system" using custom generators

   ? What is the name of the new package? dropdown-menu
   ? Provide a brief description of the package: dropdown menu package
   ? Do you want to import a shadcn component or create a component from scratch? (Use arrow keys)
   ❯ shadcn
   from_scratch
   ```

   Executing this generator will automatically set up and configure the new package with the necessary files and structure.

   ```
   ├── apps
   │   └── docs
   │       ├── package.json (modified)
   │       └── stories
   │           └── dropdown-menu.stories.tsx (new)
   ├── packages
   │   └── dropdown-menu
   │       ├── .eslintrc.js (new)
   │       ├── components.json (new)
   │       ├── package.json (new)
   │       ├── postcss.config.js (new)
   │       ├── src
   │       │   ├── dropdown-menu.tsx (new)
   │       │   ├── index.css (new)
   │       │   └── lib
   │       │       └── utils.ts (new)
   │       ├── tailwind.config.js (new)
   │       ├── tsconfig.app.json (new)
   │       ├── tsconfig.json (new)
   │       └── vite.config.ts (new)
   ```

3. Make the necessary changes:

   - Modify the component (e.g. `packages/dropdown-menu/src/dropdown-menu.tsx`)
   - Add a storybook story in `apps/docs/stories/dropdown-menu.stories.tsx`

4. From the root of the project, commit the changes to the new branch:

   ```sh
   git add .
   git commit -m "Add new package: dropdown-menu"
   ```

5. From the root of the project, run:

   ```sh
   pnpm changeset
   ```

   This will guide you through the process of creating a changeset, which is used to document changes and manage version bumps.

   #### It will prompt you with the following:

   - Which packages would you like to include? – This shows which packages and changed and which have remained the same. By default, no packages are included. Press space to select the packages you want to include in the changeset.
   - Which packages should have a major bump? – Press space to select the packages you want to bump versions for.
   - If doing the first major version, confirm you want to release.
   - Write a summary for the changes.
   - Confirm the changeset looks as expected.
   - A new Markdown file will be created in the changeset folder with the summary and a list of the packages included.

6. Push the changes to the remote repository:

   ```sh
   git push origin feature/new-package-name
   ```

7. Create a new PR
