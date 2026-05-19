import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const IGNORED_DIRS = new Set(['lib', '__mocks__']);

function getComponentDirs(): string[] {
	const srcPath = join(__dirname);
	return readdirSync(srcPath).filter((name) => {
		if (IGNORED_DIRS.has(name)) return false;
		const fullPath = join(srcPath, name);
		if (!statSync(fullPath).isDirectory()) return false;
		return existsSync(join(fullPath, 'index.ts'));
	});
}

function getViteConfigEntries(): string[] {
	const viteConfigPath = join(__dirname, '..', 'vite.config.ts');
	const content = require('fs').readFileSync(viteConfigPath, 'utf-8');
	const matches = content.match(/'([^']+)\/index':/g) || [];
	return matches.map((m: string) => m.replace(/'|\/index':/g, ''));
}

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
