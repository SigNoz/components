import path from 'node:path';
import { fileURLToPath } from 'node:url';
import getViteLibConfig from '@repo/typescript-config/vite.config.extend';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { preview } from '@vitest/browser-preview';
import { defineConfig } from 'vitest/config';
import { reactCompilerOptions } from './react-compiler.config.js';
import { entries } from './vite.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Benchmark switch. Unset behaves like `playwright`; `jsdom` restores the old
// single-project setup so CI can time both on the same runner.
const mode = process.env['UI_TEST_MODE'] ?? 'playwright';

// Assertions about files on disk (built output, package.json exports, tsc
// diagnostics). They need `node:fs`, which the browser bundler externalizes.
const nodeOnlyTests = ['src/__tests__/*.test.ts', 'src/**/*.types.messages.test.ts'];

const shared = {
	...getViteLibConfig(entries, { plugins: [react({ compiler: reactCompilerOptions })] }),
	resolve: {
		alias: {
			'@signozhq/icons': path.resolve(__dirname, 'src/__mocks__/signozhq-icons.tsx'),
		},
	},
};

const typecheck = {
	enabled: true,
	include: ['src/**/*.test-d.{ts,tsx}'],
	tsconfig: './tsconfig.json',
};

const jsdomConfig = defineConfig({
	...shared,
	test: {
		environment: 'jsdom',
		include: ['src/**/*.test.{ts,tsx}'],
		setupFiles: ['./vitest.setup.ts'],
		globals: true,
		typecheck,
	},
});

const browserConfig = defineConfig({
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
						provider: mode === 'preview' ? preview() : playwright({}),
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
					typecheck,
				},
			},
		],
	},
});

export default mode === 'jsdom' ? jsdomConfig : browserConfig;
