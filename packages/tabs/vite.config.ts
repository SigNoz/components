import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/tabs.tsx'),
			name: 'Button',
			fileName: 'tabs',
		},
		rollupOptions: {
			external: ['react'],
			output: {
				globals: {
					react: 'React',
				},
			},
			treeshake: true,
		},
	},
	plugins: [dts(), react(), libInjectCss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
