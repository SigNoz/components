import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/switch.tsx'],
	format: ['esm'],
	dts: true,
	splitting: true,
	sourcemap: false,
	clean: true,
	treeshake: true,
	external: ['react'],
	injectStyle: true,
});
