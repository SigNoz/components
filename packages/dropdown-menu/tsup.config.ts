import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/dropdown-menu.tsx'],
	format: ['esm'],
	dts: true,
	splitting: true,
	sourcemap: false,
	clean: true,
	treeshake: true,
	external: ['react'],
	injectStyle: true,
});
