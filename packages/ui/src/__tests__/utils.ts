import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const IGNORED_DIRS = new Set(['lib', '__mocks__', '__tests__']);

// Entries that ship as a subpath only: no component, no `src/index.ts` export, no docs entry.
// `testing` holds the helpers for stories and tests.
const SUBPATH_ONLY_ENTRIES = new Set(['testing']);

/**
 * Every directory with an `index.ts`, each one a package entry.
 */
export function getEntryDirs(): string[] {
	const srcPath = join(__dirname, '..');
	return readdirSync(srcPath).filter((name) => {
		if (IGNORED_DIRS.has(name)) return false;
		const fullPath = join(srcPath, name);
		if (!statSync(fullPath).isDirectory()) return false;
		return existsSync(join(fullPath, 'index.ts'));
	});
}

/**
 * The entries that hold a component, which the root `src/index.ts` and the docs list.
 */
export function getComponentDirs(): string[] {
	return getEntryDirs().filter((name) => !SUBPATH_ONLY_ENTRIES.has(name));
}

export function getViteConfigEntries(): string[] {
	const viteConfigPath = join(__dirname, '..', '..', 'vite.config.ts');
	const content = readFileSync(viteConfigPath, 'utf-8');
	const matches = content.match(/'([^']+)\/index':/g) || [];
	return matches.map((m: string) => m.replace(/'|\/index':/g, ''));
}

export function getPackageJsonExports(): string[] {
	const pkgPath = join(__dirname, '..', '..', 'package.json');
	const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
	const exports = Object.keys(pkg.exports || {});
	return exports.filter((key) => key !== '.').map((key) => key.replace(/^\.\//, ''));
}

export function getPackageJsonDeps(): string[] {
	const pkgPath = join(__dirname, '..', '..', 'package.json');
	const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
	return [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]
		.filter((dep) => !dep.startsWith('@types/'))
		.sort();
}

export function getIndexExports(): string[] {
	const indexPath = join(__dirname, '..', 'index.ts');
	const content = readFileSync(indexPath, 'utf-8');
	const matches = content.matchAll(/export\s+\*\s+from\s+'\.\/([^/']+)\/index\.js'/g);
	return [...matches].map((m) => m[1]);
}
