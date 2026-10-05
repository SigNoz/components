import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { reactCompilerOptions } from '../../packages/ui/react-compiler.config.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// `storybook dev` (mode `development`) reads `packages/ui` source: the `vite build --watch` that
// kept `dist` fresh empties it on every rebuild, which left the dev server pointing at deleted
// modules. `storybook build` (mode `production`, what Chromatic uploads) and Vitest (mode `test`)
// still import the built `dist`.
const uiSource = {
	find: /^@signozhq\/ui$/,
	replacement: path.resolve(dirname, '../../packages/ui/src/index.ts'),
};
// The same source as `uiSource`, so the provider and the components share one context.
const uiTestingSource = {
	find: /^@signozhq\/ui\/testing$/,
	replacement: path.resolve(dirname, '../../packages/ui/src/testing/index.ts'),
};

export default defineConfig(({ mode }) => ({
	plugins: [
		react({
			compiler: reactCompilerOptions,
			// Storybook calls decorators, they are not React components. Compiled, a decorator caches
			// its `<Story />` element, and a Controls change never reaches the story: args travel
			// through Storybook's context store, not through props.
			exclude: [/\/node_modules\//, /\/\.storybook\//],
		}),
	],
	resolve: { alias: mode === 'development' ? [uiSource, uiTestingSource] : [] },
}));
