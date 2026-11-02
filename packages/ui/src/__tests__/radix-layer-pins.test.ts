import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function dependencies(pkgPath: string): Record<string, string> {
	return JSON.parse(readFileSync(pkgPath, 'utf-8')).dependencies ?? {};
}

// DialogLayer opens a dialog over the Radix Drawer by joining the layer and focus-scope stacks
// that `@radix-ui/react-dialog` keeps in module-level context. A second copy of either package
// has its own context, and the interop then fails with no error, so all three stay pinned to
// the versions `@radix-ui/react-dialog` itself pins.
describe('radix layer pins', () => {
	const ours = dependencies(join(__dirname, '..', '..', 'package.json'));
	const radixDialog = dependencies(
		join(__dirname, '..', '..', 'node_modules', '@radix-ui', 'react-dialog', 'package.json'),
	);

	it('pins @radix-ui/react-dialog to an exact version', () => {
		expect(ours['@radix-ui/react-dialog']).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it.each(['@radix-ui/react-dismissable-layer', '@radix-ui/react-focus-scope'])(
		'pins %s to the version @radix-ui/react-dialog uses',
		(name) => {
			expect(ours[name]).toBe(radixDialog[name]);
		},
	);
});
