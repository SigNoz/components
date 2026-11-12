import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import postcss from 'postcss';
import type { AtRule, Declaration, Rule } from 'postcss';
import valueParser from 'postcss-value-parser';
import type { Node as ValueNode } from 'postcss-value-parser';
import { describe, expect, it } from 'vitest';

// The rule lives in COMPONENT_GUIDELINES.md#css-custom-properties: a consumer can change every
// declaration through a `--{component}-*` variable, so no value is hardcoded.

const SRC_PATH = join(__dirname, '..');

// A declaration another public variable needs in order to work, where an override can only break
// it. Each entry names the variable it serves, and the stylesheet comment says the same.
const SERVES_A_VARIABLE = new Set([
	'skeleton/skeleton.module.scss .skeleton-input contain', // --skeleton-input-intrinsic-width
	// The shimmer keyframes slide the layer by 75% of its width, which only fits this shape.
	'skeleton/skeleton.module.scss ::after left',
	'skeleton/skeleton.module.scss ::after width',
]);

// Arithmetic inside these is not a value: `calc(-1 * var(--x))`, `calc(1 - var(--x))`.
const MATH_FUNCTIONS = new Set(['calc', 'min', 'max', 'clamp']);
const UNITLESS_NUMBER = /^[-+]?(?:\d+\.?\d*|\.\d+)$/;
const OPERATOR = /^[-+*/]$/;
// An `-internal-` variable may hold a sign or a rest state the rules swap, such as
// `--toast-internal-direction: -1` or `--progress-internal-stripe-rest-x: 0px`, or `initial`, which
// unsets it so the fallback where it is read applies.
const SIGN_OR_REST_STATE = /^(?:[-+]?(?:\d+\.?\d*|\.\d+)(?:px|%|deg|ms|s)?|initial)$/;

function listStyleSheets(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) return listStyleSheets(fullPath);
		return entry.name.endsWith('.module.scss') ? [fullPath] : [];
	});
}

// postcss reads CSS, not SCSS: a `//` line comment would parse as a declaration. A `//` after a
// colon or inside quotes is a URL, so it stays.
function stripLineComments(source: string): string {
	return source.replace(/(^|[^:'"])\/\/.*$/gm, '$1');
}

function bareWords(nodes: ValueNode[], inMath: boolean): string[] {
	return nodes.flatMap((node): string[] => {
		switch (node.type) {
			case 'function':
				if (node.value === 'var') return [];
				return bareWords(node.nodes, inMath || MATH_FUNCTIONS.has(node.value) || node.value === '');
			case 'space':
			case 'div':
			case 'comment':
				return [];
			case 'word':
				if (inMath && (OPERATOR.test(node.value) || UNITLESS_NUMBER.test(node.value))) return [];
				return [node.value];
			default:
				return [node.value];
		}
	});
}

function ancestors(decl: Declaration): Array<AtRule | Rule> {
	const chain: Array<AtRule | Rule> = [];
	for (let parent = decl.parent; parent && parent.type !== 'root'; parent = parent.parent) {
		chain.push(parent as AtRule | Rule);
	}
	return chain;
}

function selectorOf(decl: Declaration): string {
	return ancestors(decl)
		.filter((node): node is Rule => node.type === 'rule')
		.map((rule) => rule.selector.replace(/\s+/g, ' '))
		.reverse()
		.join(' ');
}

function isPromisedBare(decl: Declaration, path: string): boolean {
	const chain = ancestors(decl);
	if (
		chain.some(
			(node) =>
				(node.type === 'atrule' && /prefers-reduced-motion|forced-colors/.test(node.params)) ||
				(node.type === 'atrule' && node.name.endsWith('keyframes')),
		)
	) {
		return true;
	}
	if (decl.prop === 'content') return true;
	if (
		decl.prop === 'display' &&
		decl.value.trim() === 'none' &&
		chain.some((node) => node.type === 'rule' && node.selector.includes('[hidden]'))
	) {
		return true;
	}
	return SERVES_A_VARIABLE.has(`${path} ${selectorOf(decl).replace(/&/g, '')} ${decl.prop}`);
}

const styleSheets = listStyleSheets(SRC_PATH).map((path) => {
	const source = readFileSync(path, 'utf-8');
	const root = postcss.parse(stripLineComments(source));
	const keyframes = new Set<string>();
	root.walkAtRules(/keyframes$/, (rule) => keyframes.add(rule.params.trim()));
	return { path: relative(SRC_PATH, path), root, keyframes };
});

describe('every declaration reads a CSS variable', () => {
	it('finds the style sheets', () => {
		expect(styleSheets.length).toBeGreaterThan(30);
	});

	it('wraps every value in a --{component}-* variable', () => {
		const offenders = styleSheets.flatMap(({ path, root, keyframes }) => {
			const found: string[] = [];
			root.walkDecls((decl) => {
				if (decl.prop.startsWith('$')) {
					found.push(`${path}:${decl.source?.start?.line} Sass variable ${decl.prop}`);
					return;
				}
				if (isPromisedBare(decl, path)) return;
				const words = bareWords(valueParser(decl.value).nodes, false).filter(
					(word) => word !== '!important',
				);
				if (words.length === 0) return;
				if (decl.prop.startsWith('--')) {
					if (!decl.prop.includes('-internal-')) {
						found.push(
							`${path}:${decl.source?.start?.line} ${decl.prop} is public, read it with a fallback instead of setting it`,
						);
						return;
					}
					const value = decl.value.trim();
					if (SIGN_OR_REST_STATE.test(value) || keyframes.has(value)) return;
				}
				found.push(`${path}:${decl.source?.start?.line} ${decl.prop}: ${words.join(' ')}`);
			});
			return found;
		});

		expect(offenders).toEqual([]);
	});
});
