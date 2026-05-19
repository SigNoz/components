import { externalPatterns } from '@repo/typescript-config/vite.config.extend';
import { describe, expect, it } from 'vitest';
import { getPackageJsonDeps } from './utils.js';

function isExternalized(dep: string): boolean {
	return externalPatterns.some((pattern) => {
		if (typeof pattern === 'string') {
			// Check if dep matches pattern or pattern is subpath of dep (e.g., motion/react for motion)
			return dep === pattern || dep.startsWith(pattern + '/') || pattern.startsWith(dep + '/');
		}
		return pattern.test(dep);
	});
}

describe('vite externals', () => {
	it('non-externalized dependencies (bundled into output)', () => {
		const deps = getPackageJsonDeps();
		const nonExternalized = deps.filter((dep) => !isExternalized(dep));

		// If this fails, either add dep to externalPatterns in vite.config.extend.ts
		// or update snapshot if bundling is intentional
		expect(nonExternalized).toMatchInlineSnapshot(`[]`);
	});
});
