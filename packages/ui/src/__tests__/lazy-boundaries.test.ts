import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STATIC_IMPORT = /^(?:import|export)\s+(?!type\s)[^;]*?from\s+'([^']+)';/gms;

function resolveSource(from: string, specifier: string): string | undefined {
	const base = join(dirname(from), specifier.replace(/\.js$/, ''));

	return ['.tsx', '.ts'].map((extension) => base + extension).find((file) => existsSync(file));
}

/**
 * Every source file and every package a module reaches through static imports, the modules it
 * imports with `import()` left out.
 */
function staticGraph(entry: string): { files: Set<string>; packages: Set<string> } {
	const files = new Set<string>();
	const packages = new Set<string>();
	const queue = [join(SRC, entry)];

	while (queue.length > 0) {
		const file = queue.pop() as string;

		if (files.has(file)) {
			continue;
		}
		files.add(file);

		for (const [, specifier = ''] of readFileSync(file, 'utf8').matchAll(STATIC_IMPORT)) {
			if (!specifier.startsWith('.')) {
				packages.add(specifier);
				continue;
			}

			const next = resolveSource(file, specifier);

			if (next !== undefined) {
				queue.push(next);
			}
		}
	}

	return { files, packages };
}

const TOOLTIP_CARRIERS = [
	'button/button.tsx',
	'badge/badge.tsx',
	'checkbox/checkbox.tsx',
	'input/input.tsx',
	'switch/switch.tsx',
	'typography/typography.tsx',
	'tooltip/presets/tooltip.tsx',
];

describe('lazy boundaries', () => {
	it.each(TOOLTIP_CARRIERS)('%s loads the Base UI tooltip only when one opens', (entry) => {
		expect(staticGraph(entry).packages).not.toContain('@base-ui/react/tooltip');
	});

	it('Drawer loads the Breadcrumb of its trail only with the first trail', () => {
		const { files } = staticGraph('drawer/drawer.tsx');

		expect([...files].some((file) => file.endsWith('breadcrumb/breadcrumb.tsx'))).toBe(false);
	});
});
