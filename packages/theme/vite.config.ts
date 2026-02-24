import getViteLibConfig from '@repo/typescript-config/vite.config.extend';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(
	getViteLibConfig('src/index.tsx', {
		plugins: [react()],
		build: {
			lib: {
				fileName: (format) => `theme.${format === 'es' ? 'js' : 'cjs'}`,
			},
			rollupOptions: {
				output: {
					globals: {
						react: 'React',
						'react-dom': 'ReactDOM',
					},
				},
			},
		},
	})
);
