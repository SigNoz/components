import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/input.tsx'],
	format: ['esm'],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true,
	treeshake: true,
	external: ['react'],
	injectStyle: true,
	esbuildOptions(options) {
		options.banner = {
			js: '"use client";',
		};
	},
});
