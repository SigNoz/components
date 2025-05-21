import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/table.tsx', 'src/data-table.tsx'],
	format: ['esm'],
	dts: true,
	splitting: true,
	sourcemap: false,
	clean: true,
	treeshake: true,
	external: ['react', '@tanstack/react-table'],
	injectStyle: true,
});
