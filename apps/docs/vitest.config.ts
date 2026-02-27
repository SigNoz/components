import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			projects: [
				{
					extends: true,
					plugins: [
						storybookTest({
							configDir: path.join(dirname, '.storybook'),
							storybookScript: 'pnpm dev --no-open',
						}),
					],
					test: {
						name: 'storybook',
						browser: {
							enabled: true,
							provider: playwright({}),
							headless: true,
							instances: [{ browser: 'chromium' }],
						},
						setupFiles: ['./.storybook/vitest.setup.ts'],
						onUnhandledError(
							error: (Error | { message?: string; name?: string }) & { type: string }
						) {
							if (
								error.name === 'SecurityError' &&
								typeof error.message === 'string' &&
								error.message.includes('Blocked a frame with origin') &&
								error.message.includes('from accessing a cross-origin frame')
							) {
								return false;
							}
						},
					},
				},
			],
		},
	})
);
