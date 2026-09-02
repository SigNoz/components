import path from 'node:path';
import { fileURLToPath } from 'node:url';
import getViteLibConfig from '@repo/typescript-config/vite.config.extend';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { reactCompilerOptions } from './react-compiler.config.js';
import { entries } from './vite.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	...getViteLibConfig(entries, { plugins: [react({ compiler: reactCompilerOptions })] }),
	resolve: {
		alias: {
			'@signozhq/icons': path.resolve(__dirname, 'src/__mocks__/signozhq-icons.tsx'),
		},
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.test.{ts,tsx}'],
		setupFiles: ['./vitest.setup.ts'],
		globals: true,
	},
});
