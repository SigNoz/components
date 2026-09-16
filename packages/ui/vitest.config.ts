import path from 'node:path';
import { fileURLToPath } from 'node:url';
import getViteLibConfig from '@repo/typescript-config/vite.config.extend';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { preview } from '@vitest/browser-preview';
import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';
import { reactCompilerOptions } from './react-compiler.config.js';
import { entries } from './vite.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Benchmark switch. Unset behaves like `playwright`; `jsdom` restores the old
// single-project setup so CI can time every option on the same runner.
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

// The Playwright container ships Chrome under /ms-playwright rather than on
// PATH, so webdriverio has to be pointed at it explicitly.
const chromeBinary = process.env['CHROME_BIN'];

// `preview` drives a visible window and rejects `headless: true` outright, so CI
// runs it under xvfb instead. webdriverio names the browser `chrome`, not
// `chromium`.
const browserOptions = {
	webdriverio: {
		provider: webdriverio({
			capabilities: {
				'goog:chromeOptions': {
					...(chromeBinary ? { binary: chromeBinary } : {}),
					args: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
				},
			},
		}),
		headless: true,
		browser: 'chrome',
	},
	preview: { provider: preview(), headless: false, browser: 'chromium' },
	playwright: { provider: playwright({}), headless: true, browser: 'chromium' },
} as const;

const selected = browserOptions[mode as keyof typeof browserOptions] ?? browserOptions.playwright;

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
						provider: selected.provider,
						headless: selected.headless,
						instances: [{ browser: selected.browser }],
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
