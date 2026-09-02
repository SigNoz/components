import { describe, expect, it } from 'vitest';
import { getComponentDirs, getIndexExports } from './utils.js';

describe('src/index.ts exports', () => {
	it('all component directories with index.ts are exported in src/index.ts', () => {
		const componentDirs = getComponentDirs();
		const indexExports = new Set(getIndexExports());

		const missing = componentDirs.filter((dir) => !indexExports.has(dir));

		expect(
			missing,
			`Missing src/index.ts exports for: ${missing.join(', ')}. Add "export * from './<dir>/index.js';".`,
		).toEqual([]);
	});

	it('all src/index.ts exports have corresponding component directories', () => {
		const componentDirs = new Set(getComponentDirs());
		const indexExports = getIndexExports();

		const orphaned = indexExports.filter((entry) => !componentDirs.has(entry));

		expect(orphaned, `Orphaned src/index.ts exports: ${orphaned.join(', ')}`).toEqual([]);
	});
});
