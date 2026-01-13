import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/combobox.tsx'],
	format: ['esm'],
	dts: true,
	splitting: true,
	sourcemap: false,
	clean: true,
	treeshake: true,
	external: ['react'],
	injectStyle: true,
});
