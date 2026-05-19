import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const IGNORED_DIRS = new Set(['lib', '__mocks__', '__tests__']);

export function getComponentDirs(): string[] {
	const srcPath = join(__dirname, '..');
	return readdirSync(srcPath).filter((name) => {
		if (IGNORED_DIRS.has(name)) return false;
		const fullPath = join(srcPath, name);
		if (!statSync(fullPath).isDirectory()) return false;
		return existsSync(join(fullPath, 'index.ts'));
	});
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
