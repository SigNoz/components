import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC_PATH = join(__dirname, '..');
const TOKENS_CSS_PATH = join(
	__dirname,
	'..',
	'..',
	'..',
	'..',
	'node_modules',
	'@signozhq',
	'design-tokens',
	'dist',
	'style.css',
);

const TEXT_STYLE_TOKEN =
	/(?<![\w-])--(?:label|paragraph|uppercase|code)-[a-z]+-\d{3}-[a-z-]+[a-z]/g;
const REMOVED_TOKEN =
	/var\(\s*(--(?:periscope|font-family|font-size|font-weight|line-height|letter-spacing)-[\w-]+|--font-(?:sans|serif|mono)\b|--text-(?:xs|sm|base|lg|\d?xl)\b)/g;
const TEXT_STYLE_WITH_FALLBACK =
	/var\(\s*(--(?:label|paragraph|uppercase|code)-[a-z]+-\d{3}-[a-z-]+[a-z])\s*,/g;
const FONT_DECLARATION =
	/^\s*(font|font-family|font-size|font-weight|line-height|letter-spacing|text-transform)\s*:\s*([^;]+);/gm;
const ALLOWED_FONT_VALUE = /^(?:var\(|inherit$|initial$|unset$)/;

function listStyleSheets(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) return listStyleSheets(fullPath);
		return entry.name.endsWith('.module.scss') ? [fullPath] : [];
	});
}

function lineOf(content: string, index: number): number {
	return content.slice(0, index).split('\n').length;
}

function findAll(pattern: RegExp, onMatch: (match: RegExpExecArray, at: string) => string | null) {
	return styleSheets.flatMap(({ path, content }) =>
		[...content.matchAll(pattern)].flatMap((match) => {
			const offender = onMatch(match, `${path}:${lineOf(content, match.index ?? 0)}`);
			return offender ? [offender] : [];
		}),
	);
}

const styleSheets = listStyleSheets(SRC_PATH).map((path) => ({
	path: relative(SRC_PATH, path),
	content: readFileSync(path, 'utf-8'),
}));

const textStyleTokens = new Set(readFileSync(TOKENS_CSS_PATH, 'utf-8').match(TEXT_STYLE_TOKEN));

describe('typography tokens in component styles', () => {
	it('finds the style sheets and the text styles', () => {
		expect(styleSheets.length).toBeGreaterThan(30);
		expect(textStyleTokens.size).toBeGreaterThanOrEqual(33 * 6);
	});

	it('reads no typography token other than the text styles', () => {
		expect(findAll(REMOVED_TOKEN, (match, at) => `${at} ${match[1]}`)).toEqual([]);
	});

	it('reads only text styles that exist', () => {
		expect(
			findAll(TEXT_STYLE_TOKEN, (match, at) =>
				textStyleTokens.has(match[0]) ? null : `${at} ${match[0]}`,
			),
		).toEqual([]);
	});

	it('gives a text style no fallback', () => {
		expect(findAll(TEXT_STYLE_WITH_FALLBACK, (match, at) => `${at} ${match[1]}`)).toEqual([]);
	});

	it('sets every font property through a variable', () => {
		expect(
			findAll(FONT_DECLARATION, (match, at) =>
				ALLOWED_FONT_VALUE.test(match[2].trim()) ? null : `${at} ${match[1]}: ${match[2].trim()}`,
			),
		).toEqual([]);
	});
});
