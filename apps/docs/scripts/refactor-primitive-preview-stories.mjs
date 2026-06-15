import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORIES_DIR = path.resolve(__dirname, '../stories');
const IMPORT_LINE = "import { createPreviewStory } from './shared/story-preview';";

const TITLE_PATTERNS = {
	primitive: /title:\s*['"]Primitive Components\//,
	composed: /title:\s*['"]Composed Components\//,
	old: /title:\s*['"]Old Components\//,
};

function matchesCategory(content, category) {
	const pattern = TITLE_PATTERNS[category];
	if (!pattern) {
		throw new Error(`Unknown category: ${category}`);
	}
	return pattern.test(content);
}

function getExportedStoryNames(content) {
	const names = [];
	const storyRegex = /export const (\w+): Story(?:Obj<[^>]+>)? =/g;
	let match;
	while ((match = storyRegex.exec(content)) !== null) {
		names.push(match[1]);
	}

	const storyFnRegex = /export const (\w+): StoryFn(?:<[^>]+>)? =/g;
	while ((match = storyFnRegex.exec(content)) !== null) {
		names.push(match[1]);
	}

	const boundRegex = /export const (\w+) = Template\.bind\(\{\}\)/g;
	while ((match = boundRegex.exec(content)) !== null) {
		names.push(match[1]);
	}

	return names;
}

function addImport(content) {
	if (content.includes('createPreviewStory')) {
		return content;
	}

	const importLines = content.match(/^import .+;$/gm);
	if (!importLines?.length) {
		return `${IMPORT_LINE}\n${content}`;
	}

	const lastImport = importLines[importLines.length - 1];
	return content.replace(lastImport, `${lastImport}\n${IMPORT_LINE}`);
}

function transformFile(filePath, category) {
	let content = fs.readFileSync(filePath, 'utf8');

	if (!matchesCategory(content, category)) {
		return { changed: false, reason: `not ${category}` };
	}

	if (content.includes('createPreviewStory')) {
		return { changed: false, reason: 'already migrated' };
	}

	let exports = getExportedStoryNames(content);
	if (exports.length === 0) {
		return { changed: false, reason: 'no stories' };
	}

	if (exports.includes('Playground') && !exports.includes('Default')) {
		content = content.replace(/export const Playground: Story/g, 'export const Default: Story');
		exports = exports.map((name) => (name === 'Playground' ? 'Default' : name));
	}

	const variantStories = exports.filter((name) => name !== 'Default' && name !== 'Preview');

	for (const name of variantStories) {
		content = content.replace(
			new RegExp(`export const ${name}: Story`, 'g'),
			`const ${name}: Story`,
		);
		content = content.replace(
			new RegExp(`export const ${name}: StoryFn`, 'g'),
			`const ${name}: StoryFn`,
		);
		content = content.replace(
			new RegExp(`export const ${name} = Template\\.bind\\(\\{\\}\\)`, 'g'),
			`const ${name} = Template.bind({})`,
		);
	}

	content = addImport(content);

	const previewSections =
		variantStories.length > 0
			? variantStories.map((name) => `\t${name},`).join('\n')
			: '\tDefault,';

	const previewExport = `\nexport const Preview: Story = createPreviewStory(meta, {\n${previewSections}\n});\n`;

	if (content.includes('export const Preview:')) {
		return { changed: false, reason: 'preview exists' };
	}

	content = `${content.trimEnd()}${previewExport}`;

	fs.writeFileSync(filePath, content);
	return {
		changed: true,
		variants: variantStories.length || 1,
	};
}

const category = process.argv[2] ?? 'primitive';
const fileFilter = process.argv[3];

const files = fs
	.readdirSync(STORIES_DIR)
	.filter((file) => file.endsWith('.stories.tsx'))
	.filter((file) => !fileFilter || file.includes(fileFilter))
	.map((file) => path.join(STORIES_DIR, file));

const results = { changed: [], skipped: [] };

for (const file of files) {
	const result = transformFile(file, category);
	if (result.changed) {
		results.changed.push({ file: path.basename(file), variants: result.variants });
	} else {
		results.skipped.push({ file: path.basename(file), reason: result.reason });
	}
}

console.log(`Category: ${category}`);
console.log(`Migrated ${results.changed.length} files`);
console.log(`Skipped ${results.skipped.length} files`);
if (results.changed.length) {
	console.log('\nChanged:');
	for (const entry of results.changed) {
		console.log(`  ${entry.file} (${entry.sections ?? entry.variants} sections)`);
	}
}
