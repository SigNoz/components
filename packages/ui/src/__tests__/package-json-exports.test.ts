import { describe, expect, it } from 'vitest';
import { getComponentDirs, getPackageJsonExports, getViteConfigEntries } from './utils.js';

describe('package.json exports', () => {
	it('all component directories with index.ts are exported in package.json', () => {
		const componentDirs = getComponentDirs();
		const pkgExports = getPackageJsonExports();

		const missing = componentDirs.filter((dir) => !pkgExports.includes(dir));

		expect(missing, `Missing package.json exports for: ${missing.join(', ')}`).toEqual([]);
	});

	it('all package.json exports have corresponding component directories', () => {
		const componentDirs = new Set(getComponentDirs());
		const pkgExports = getPackageJsonExports();

		const orphaned = pkgExports.filter((entry) => !componentDirs.has(entry));

		expect(orphaned, `Orphaned package.json exports: ${orphaned.join(', ')}`).toEqual([]);
	});

	it('vite.config.ts entries match package.json exports', () => {
		const viteEntries = new Set(getViteConfigEntries());
		const pkgExports = new Set(getPackageJsonExports());

		const inViteNotPkg = [...viteEntries].filter((e) => !pkgExports.has(e));
		const inPkgNotVite = [...pkgExports].filter((e) => !viteEntries.has(e));

		expect(
			inViteNotPkg,
			`In vite.config.ts but not package.json: ${inViteNotPkg.join(', ')}`
		).toEqual([]);
		expect(
			inPkgNotVite,
			`In package.json but not vite.config.ts: ${inPkgNotVite.join(', ')}`
		).toEqual([]);
	});
});
