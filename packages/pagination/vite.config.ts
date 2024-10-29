import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format}.js`,
		},
		rollupOptions: {
			external: ['react', 'react/jsx-runtime'],
			output: {
				globals: {
					react: 'React',
					'react/jsx-runtime': 'jsx',
				},
			},
			treeshake: true,
		},
	},
	plugins: [
		dts({
			tsconfigPath: './tsconfig.json',
			outDir: 'dist',
			exclude: ['**/*.test.ts', '**/*.test.tsx'],
			rollupTypes: true,
			insertTypesEntry: true,
		}),
		react(),
		libInjectCss(),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
