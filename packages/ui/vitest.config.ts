import path from 'node:path';
import { fileURLToPath } from 'node:url';
import getViteLibConfig from '@repo/typescript-config/vite.config.extend';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import { reactCompilerOptions } from './react-compiler.config.js';
import { entries } from './vite.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// These assert on files on disk (built output, package.json exports, tsc
// diagnostics) and need `node:fs`, which the browser bundler externalizes.
const nodeOnlyTests = ['src/__tests__/*.test.ts', 'src/**/*.types.messages.test.ts'];

const shared = {
	...getViteLibConfig(entries, { plugins: [react({ compiler: reactCompilerOptions })] }),
	resolve: {
		alias: {
			'@signozhq/icons': path.resolve(__dirname, 'src/__mocks__/signozhq-icons.tsx'),
		},
		// The library build marks react and @base-ui/react external. Serving those
		// same entries to a browser lets Vite pre-bundle a second React copy, whose
		// dispatcher is null, so any @base-ui hook throws on useRef.
		dedupe: ['react', 'react-dom'],
	},
};

export default defineConfig({
	test: {
		projects: [
			{
				...shared,
				test: {
					name: 'browser',
					include: ['src/**/*.test.{ts,tsx}'],
					exclude: nodeOnlyTests,
					setupFiles: ['./vitest.setup.ts'],
					globals: true,
					browser: {
						enabled: true,
						provider: playwright({}),
						headless: true,
						instances: [{ browser: 'chromium' }],
					},
				},
			},
			{
				...shared,
				test: {
					name: 'node',
					environment: 'node',
					include: nodeOnlyTests,
					globals: true,
					typecheck: {
						enabled: true,
						include: ['src/**/*.test-d.{ts,tsx}'],
						tsconfig: './tsconfig.json',
					},
				},
			},
		],
	},
});
