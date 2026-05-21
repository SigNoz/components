import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getComponentDirs } from './utils.js';

const README_PATH = join(__dirname, '..', '..', '..', '..', 'README.md');
const INTRO_MDX_PATH = join(
	__dirname,
	'..',
	'..',
	'..',
	'..',
	'apps',
	'docs',
	'stories',
	'intro.mdx'
);

// Components with non-standard export names
const DIR_TO_EXPORT_MAP: Record<string, string> = {
	resizable: 'ResizablePanelGroup',
	sonner: 'Toaster',
};

function kebabToPascal(str: string): string {
	return str
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}

function getExpectedExportName(dir: string): string {
	return DIR_TO_EXPORT_MAP[dir] || kebabToPascal(dir);
}

function getDocumentedComponents(filePath: string): Set<string> {
	const content = readFileSync(filePath, 'utf-8');
	const importRegex = /import\s*{\s*(\w+)\s*}\s*from\s*['"]@signozhq\/ui['"]/g;
	const components = new Set<string>();

	let match: any;
	// biome-ignore lint/suspicious/noAssignInExpressions: Used in tests
	while ((match = importRegex.exec(content)) !== null) {
		components.add(match[1]);
	}

	return components;
}

describe('documentation', () => {
	it('all components are documented in README.md', () => {
		const componentDirs = getComponentDirs();
		const documentedComponents = getDocumentedComponents(README_PATH);

		const missing = componentDirs.filter((dir) => {
			const expectedExport = getExpectedExportName(dir);
			return !documentedComponents.has(expectedExport);
		});

		expect(
			missing,
			`Components missing from README.md: ${missing.join(', ')}. Add import example for each.`
		).toEqual([]);
	});

	it('all components are documented in intro.mdx', () => {
		const componentDirs = getComponentDirs();
		const documentedComponents = getDocumentedComponents(INTRO_MDX_PATH);

		const missing = componentDirs.filter((dir) => {
			const expectedExport = getExpectedExportName(dir);
			return !documentedComponents.has(expectedExport);
		});

		expect(
			missing,
			`Components missing from intro.mdx: ${missing.join(', ')}. Add import example for each.`
		).toEqual([]);
	});
});
