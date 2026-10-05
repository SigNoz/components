import { describe, expect, it } from 'vitest';
import { getEntryDirs, getViteConfigEntries } from './utils.js';

describe('vite config exports', () => {
	it('all component directories with index.ts are exported in vite.config.ts', () => {
		const entryDirs = getEntryDirs();
		const viteEntries = getViteConfigEntries();

		const missing = entryDirs.filter((dir) => !viteEntries.includes(dir));

		expect(missing, `Missing vite.config.ts entries for: ${missing.join(', ')}`).toEqual([]);
	});

	it('all vite.config.ts entries have corresponding component directories', () => {
		const entryDirs = new Set(getEntryDirs());
		const viteEntries = getViteConfigEntries();

		const orphaned = viteEntries.filter((entry) => !entryDirs.has(entry));

		expect(orphaned, `Orphaned vite.config.ts entries: ${orphaned.join(', ')}`).toEqual([]);
	});
});
