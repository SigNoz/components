import { describe, expect, it } from 'vitest';
import { getComponentDirs, getViteConfigEntries } from './utils.js';

describe('vite config exports', () => {
	it('all component directories with index.ts are exported in vite.config.ts', () => {
		const componentDirs = getComponentDirs();
		const viteEntries = getViteConfigEntries();

		const missing = componentDirs.filter((dir) => !viteEntries.includes(dir));

		expect(missing, `Missing vite.config.ts entries for: ${missing.join(', ')}`).toEqual([]);
	});

	it('all vite.config.ts entries have corresponding component directories', () => {
		const componentDirs = new Set(getComponentDirs());
		const viteEntries = getViteConfigEntries();

		const orphaned = viteEntries.filter((entry) => !componentDirs.has(entry));

		expect(orphaned, `Orphaned vite.config.ts entries: ${orphaned.join(', ')}`).toEqual([]);
	});
});
