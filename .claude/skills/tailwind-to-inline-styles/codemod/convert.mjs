#!/usr/bin/env node
/**
 * Codemod: convert Tailwind utility classNames in .tsx files to inline React
 * `style={{...}}` objects. Deterministically handles layout / spacing / sizing
 * / typography / border / radius / semantic-token colors / single-palette
 * colors. FLAGS (leaves in className + reports) anything that needs human
 * judgment: dark:/hover:/focus:/responsive/group/peer variants, arbitrary
 * values it can't parse, `className={cn(...)}` / interpolated classNames, and
 * elements that already have a `style=` prop (manual merge).
 *
 * Usage:
 *   node convert.mjs <file...>            # dry run, prints report
 *   node convert.mjs --write <file...>    # writes changes
 */
import { readFileSync, writeFileSync } from 'node:fs';

const WRITE = process.argv.includes('--write');
const files = process.argv.slice(2).filter((a) => a !== '--write');

// --- Tailwind spacing scale (rem) ---
const SPACE = {
	'0': '0', px: '1px', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem', '2': '0.5rem',
	'2.5': '0.625rem', '3': '0.75rem', '3.5': '0.875rem', '4': '1rem', '5': '1.25rem',
	'6': '1.5rem', '7': '1.75rem', '8': '2rem', '9': '2.25rem', '10': '2.5rem', '11': '2.75rem',
	'12': '3rem', '14': '3.5rem', '16': '4rem', '20': '5rem', '24': '6rem', '28': '7rem',
	'32': '8rem', '36': '9rem', '40': '10rem', '48': '12rem', '56': '14rem', '64': '16rem',
};
const MAXW = {
	xs: '20rem', sm: '24rem', md: '28rem', lg: '32rem', xl: '36rem', '2xl': '42rem',
	'3xl': '48rem', '4xl': '56rem', '5xl': '64rem', '6xl': '72rem', '7xl': '80rem',
	full: '100%', none: 'none', prose: '65ch', min: 'min-content', max: 'max-content', fit: 'fit-content',
};
const FONT_SIZE = {
	xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem',
	'2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem', '6xl': '3.75rem',
};
const LEADING = { none: 1, tight: 1.25, snug: 1.375, normal: 1.5, relaxed: 1.625, loose: 2 };

// Static (non-parametric) class -> [ [jsKey, serializedValue], ... ]
const STATIC = {
	flex: [['display', "'flex'"]], 'inline-flex': [['display', "'inline-flex'"]],
	grid: [['display', "'grid'"]], block: [['display', "'block'"]],
	'inline-block': [['display', "'inline-block'"]], inline: [['display', "'inline'"]],
	hidden: [['display', "'none'"]], contents: [['display', "'contents'"]],
	'flex-col': [['flexDirection', "'column'"]], 'flex-row': [['flexDirection', "'row'"]],
	'flex-col-reverse': [['flexDirection', "'column-reverse'"]], 'flex-wrap': [['flexWrap', "'wrap'"]],
	'flex-nowrap': [['flexWrap', "'nowrap'"]],
	'items-center': [['alignItems', "'center'"]], 'items-start': [['alignItems', "'flex-start'"]],
	'items-end': [['alignItems', "'flex-end'"]], 'items-stretch': [['alignItems', "'stretch'"]],
	'items-baseline': [['alignItems', "'baseline'"]],
	'justify-center': [['justifyContent', "'center'"]], 'justify-between': [['justifyContent', "'space-between'"]],
	'justify-around': [['justifyContent', "'space-around'"]], 'justify-evenly': [['justifyContent', "'space-evenly'"]],
	'justify-start': [['justifyContent', "'flex-start'"]], 'justify-end': [['justifyContent', "'flex-end'"]],
	'self-center': [['alignSelf', "'center'"]], 'self-start': [['alignSelf', "'flex-start'"]],
	'self-end': [['alignSelf', "'flex-end'"]], 'self-stretch': [['alignSelf', "'stretch'"]],
	'flex-1': [['flex', "'1 1 0%'"]], 'flex-auto': [['flex', "'1 1 auto'"]], 'flex-none': [['flex', "'none'"]],
	'flex-initial': [['flex', "'0 1 auto'"]], 'flex-grow': [['flexGrow', '1']], grow: [['flexGrow', '1']],
	'grow-0': [['flexGrow', '0']], 'flex-shrink-0': [['flexShrink', '0']], 'shrink-0': [['flexShrink', '0']],
	relative: [['position', "'relative'"]], absolute: [['position', "'absolute'"]],
	fixed: [['position', "'fixed'"]], sticky: [['position', "'sticky'"]], static: [['position', "'static'"]],
	'text-center': [['textAlign', "'center'"]], 'text-left': [['textAlign', "'left'"]],
	'text-right': [['textAlign', "'right'"]], 'text-justify': [['textAlign', "'justify'"]],
	'font-thin': [['fontWeight', '100']], 'font-light': [['fontWeight', '300']],
	'font-normal': [['fontWeight', '400']], 'font-medium': [['fontWeight', '500']],
	'font-semibold': [['fontWeight', '600']], 'font-bold': [['fontWeight', '700']],
	'font-extrabold': [['fontWeight', '800']], 'font-mono': [['fontFamily', "'monospace'"]],
	'font-regular': [['fontWeight', '400']], 'font-inter': [['fontFamily', "'Inter, sans-serif'"]],
	uppercase: [['textTransform', "'uppercase'"]], lowercase: [['textTransform', "'lowercase'"]],
	capitalize: [['textTransform', "'capitalize'"]], 'normal-case': [['textTransform', "'none'"]],
	italic: [['fontStyle', "'italic'"]],
	truncate: [['overflow', "'hidden'"], ['textOverflow', "'ellipsis'"], ['whiteSpace', "'nowrap'"]],
	'overflow-hidden': [['overflow', "'hidden'"]], 'overflow-auto': [['overflow', "'auto'"]],
	'overflow-scroll': [['overflow', "'scroll'"]], 'overflow-visible': [['overflow', "'visible'"]],
	'overflow-x-auto': [['overflowX', "'auto'"]], 'overflow-y-auto': [['overflowY', "'auto'"]],
	'overflow-x-hidden': [['overflowX', "'hidden'"]], 'overflow-y-hidden': [['overflowY', "'hidden'"]],
	'cursor-pointer': [['cursor', "'pointer'"]], 'cursor-default': [['cursor', "'default'"]],
	'cursor-not-allowed': [['cursor', "'not-allowed'"]], 'select-none': [['userSelect', "'none'"]],
	'w-full': [['width', "'100%'"]], 'h-full': [['height', "'100%'"]], 'w-screen': [['width', "'100vw'"]],
	'h-screen': [['height', "'100vh'"]], 'min-h-screen': [['minHeight', "'100vh'"]],
	'w-auto': [['width', "'auto'"]], 'h-auto': [['height', "'auto'"]], 'w-fit': [['width', "'fit-content'"]],
	'h-fit': [['height', "'fit-content'"]], 'w-min': [['width', "'min-content'"]], 'w-max': [['width', "'max-content'"]],
	'mx-auto': [['marginLeft', "'auto'"], ['marginRight', "'auto'"]], 'ml-auto': [['marginLeft', "'auto'"]],
	'mr-auto': [['marginRight', "'auto'"]],
	rounded: [['borderRadius', "'0.25rem'"]], 'rounded-sm': [['borderRadius', "'0.125rem'"]],
	'rounded-md': [['borderRadius', "'0.375rem'"]], 'rounded-lg': [['borderRadius', "'0.5rem'"]],
	'rounded-xl': [['borderRadius', "'0.75rem'"]], 'rounded-2xl': [['borderRadius', "'1rem'"]],
	'rounded-3xl': [['borderRadius', "'1.5rem'"]], 'rounded-full': [['borderRadius', "'9999px'"]],
	'rounded-none': [['borderRadius', "'0'"]],
	border: [['border', "'1px solid var(--border)'"]], 'border-t': [['borderTop', "'1px solid var(--border)'"]],
	'border-b': [['borderBottom', "'1px solid var(--border)'"]], 'border-l': [['borderLeft', "'1px solid var(--border)'"]],
	'border-r': [['borderRight', "'1px solid var(--border)'"]], 'border-0': [['border', "'none'"]],
	'no-underline': [['textDecoration', "'none'"]], underline: [['textDecoration', "'underline'"]],
	'line-through': [['textDecoration', "'line-through'"]],
	'shadow-sm': [['boxShadow', "'0 1px 2px 0 rgb(0 0 0 / 0.05)'"]],
	shadow: [['boxShadow', "'0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'"]],
	'shadow-md': [['boxShadow', "'0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'"]],
	'shadow-lg': [['boxShadow', "'0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'"]],
	'shadow-xl': [['boxShadow', "'0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'"]],
	'shadow-none': [['boxShadow', "'none'"]],
	'whitespace-nowrap': [['whiteSpace', "'nowrap'"]], 'whitespace-pre': [['whiteSpace', "'pre'"]],
	'whitespace-pre-wrap': [['whiteSpace', "'pre-wrap'"]],
};

// Semantic design-token colour utilities -> CSS var (auto light/dark).
const SEMANTIC_COLOR = {
	foreground: '--foreground', 'muted-foreground': '--muted-foreground', background: '--background',
	muted: '--muted', card: '--card', 'card-foreground': '--card-foreground', popover: '--popover',
	'popover-foreground': '--popover-foreground', primary: '--primary', 'primary-foreground': '--primary-foreground',
	secondary: '--secondary', 'secondary-foreground': '--secondary-foreground', accent: '--accent',
	'accent-foreground': '--accent-foreground', destructive: '--destructive',
	'destructive-foreground': '--destructive-foreground', border: '--border', input: '--input', ring: '--ring',
};
const KNOWN_PALETTES = new Set([
	'vanilla', 'ink', 'slate', 'robin', 'forest', 'amber', 'cherry', 'aqua', 'sienna', 'sakura', 'neutral',
]);

function num(v) {
	// serialize a CSS value: keep var()/percent/units quoted; plain integers stay numeric only for known props
	return `'${v}'`;
}

// Map a single class -> array of [jsKey, serialized] or null (unmapped). `flags` collects notes.
function mapClass(cls, flags) {
	if (cls.startsWith('!')) cls = cls.slice(1); // important modifier — inline wins anyway
	if (STATIC[cls]) return STATIC[cls];

	// variant prefixes we can't express inline
	if (/^(dark|hover|focus|focus-visible|active|disabled|group-hover|peer|sm|md|lg|xl|2xl|first|last|odd|even|aria-|data-):/.test(cls)) {
		flags.add(cls);
		return null;
	}

	let m;
	// padding / margin
	if ((m = cls.match(/^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml)-(.+)$/))) {
		const [, dir, raw] = m;
		const val = sizeVal(raw);
		if (!val) { flags.add(cls); return null; }
		const prop = dir[0] === 'p' ? 'padding' : 'margin';
		const map = { x: ['Left', 'Right'], y: ['Top', 'Bottom'], t: ['Top'], r: ['Right'], b: ['Bottom'], l: ['Left'] };
		const suffix = dir[1];
		if (!suffix) return [[prop, num(val)]];
		return map[suffix].map((s) => [prop + s, num(val)]);
	}
	// width / height / min / max
	if ((m = cls.match(/^(w|h|min-w|max-w|min-h|max-h|size)-(.+)$/))) {
		const [, dim, raw] = m;
		let val;
		if (dim === 'max-w' && MAXW[raw]) val = MAXW[raw];
		else val = sizeVal(raw);
		if (!val) { flags.add(cls); return null; }
		const keyMap = { w: ['width'], h: ['height'], 'min-w': ['minWidth'], 'max-w': ['maxWidth'], 'min-h': ['minHeight'], 'max-h': ['maxHeight'], size: ['width', 'height'] };
		return keyMap[dim].map((k) => [k, num(val)]);
	}
	// gap
	if ((m = cls.match(/^gap(-x|-y)?-(.+)$/))) {
		const val = sizeVal(m[2]);
		if (!val) { flags.add(cls); return null; }
		const k = m[1] === '-x' ? 'columnGap' : m[1] === '-y' ? 'rowGap' : 'gap';
		return [[k, num(val)]];
	}
	// space-x / space-y -> turn parent into flex + gap (approximation)
	if ((m = cls.match(/^space-(x|y)-(.+)$/))) {
		const val = sizeVal(m[2]);
		if (!val) { flags.add(cls); return null; }
		const dir = m[1] === 'y' ? "'column'" : "'row'";
		return [['display', "'flex'"], ['flexDirection', dir], ['gap', num(val)]];
	}
	// font-size
	if ((m = cls.match(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/))) return [['fontSize', num(FONT_SIZE[m[1]])]];
	// leading
	if ((m = cls.match(/^leading-(.+)$/))) {
		if (LEADING[m[1]] != null) return [['lineHeight', String(LEADING[m[1]])]];
		const v = sizeVal(m[1]);
		if (v) return [['lineHeight', num(v)]];
		flags.add(cls); return null;
	}
	// z-index / opacity / order
	if ((m = cls.match(/^z-(\d+)$/))) return [['zIndex', m[1]]];
	if ((m = cls.match(/^opacity-(\d+)$/))) return [['opacity', String(Number(m[1]) / 100)]];
	// rounded arbitrary
	if ((m = cls.match(/^rounded-\[(.+)\]$/))) return [['borderRadius', num(m[1])]];
	// grid columns / spans
	if ((m = cls.match(/^grid-cols-(\d+)$/))) return [['gridTemplateColumns', num(`repeat(${m[1]}, minmax(0, 1fr))`)]];
	if ((m = cls.match(/^grid-cols-\[(.+)\]$/))) return [['gridTemplateColumns', num(m[1])]];
	if ((m = cls.match(/^grid-rows-(\d+)$/))) return [['gridTemplateRows', num(`repeat(${m[1]}, minmax(0, 1fr))`)]];
	if ((m = cls.match(/^col-span-(\d+)$/))) return [['gridColumn', num(`span ${m[1]} / span ${m[1]}`)]];
	if (cls === 'col-span-full') return [['gridColumn', "'1 / -1'"]];
	if ((m = cls.match(/^row-span-(\d+)$/))) return [['gridRow', num(`span ${m[1]} / span ${m[1]}`)]];

	// colours: text-/bg-/border- {semantic|palette-shade|[arbitrary]}
	if ((m = cls.match(/^(text|bg|border)-(.+)$/))) {
		const [, kind, rest] = m;
		const prop = kind === 'text' ? 'color' : kind === 'bg' ? 'backgroundColor' : 'borderColor';
		if (rest === 'white') return [[prop, "'#ffffff'"]];
		if (rest === 'black') return [[prop, "'#000000'"]];
		if (rest === 'transparent') return [[prop, "'transparent'"]];
		if (rest === 'current') return [[prop, "'currentColor'"]];
		if (SEMANTIC_COLOR[rest]) return [[prop, num(`var(${SEMANTIC_COLOR[rest]})`)]];
		const arb = rest.match(/^\[(.+)\]$/);
		if (arb) return [[prop, num(arb[1])]];
		const pal = rest.match(/^([a-z]+)-(\d{2,3})$/);
		if (pal && KNOWN_PALETTES.has(pal[1])) {
			const tokenPrefix = kind === 'text' ? '--text-' : '--bg-';
			return [[prop, num(`var(${tokenPrefix}${pal[1]}-${pal[2]})`)]];
		}
		flags.add(cls);
		return null;
	}

	flags.add(cls);
	return null;
}

// Resolve a Tailwind size token to a CSS value.
function sizeVal(raw) {
	if (raw === 'full') return '100%';
	if (raw === 'screen') return '100vw';
	if (raw === 'auto') return 'auto';
	if (raw === 'px') return '1px';
	if (raw === 'fit') return 'fit-content';
	if (raw === 'min') return 'min-content';
	if (raw === 'max') return 'max-content';
	const arb = raw.match(/^\[(.+)\]$/);
	if (arb) return arb[1];
	const frac = raw.match(/^(\d+)\/(\d+)$/);
	if (frac) return `${((Number(frac[1]) / Number(frac[2])) * 100).toFixed(6).replace(/\.?0+$/, '')}%`;
	if (SPACE[raw] != null) return SPACE[raw];
	if (/^\d+(\.\d+)?$/.test(raw)) return `${Number(raw) * 0.25}rem`;
	return null;
}

// Find enclosing JSX tag bounds for the className at `idx`.
function tagBounds(src, idx) {
	let i = idx;
	while (i > 0 && !(src[i] === '<' && /[A-Za-z]/.test(src[i + 1]))) i--;
	const start = i;
	let depth = 0, str = null;
	let j = start;
	for (; j < src.length; j++) {
		const c = src[j];
		if (str) { if (c === str) str = null; continue; }
		if (c === '"' || c === "'" || c === '`') { str = c; continue; }
		if (c === '{') depth++;
		else if (c === '}') depth--;
		else if (c === '>' && depth === 0) break;
	}
	return { start, end: j };
}

function buildStyle(pairs) {
	const seen = new Map();
	for (const [k, v] of pairs) seen.set(k, v); // later wins (Tailwind source-order-ish)
	const body = [...seen.entries()].map(([k, v]) => `${k}: ${v}`).join(', ');
	return `style={{ ${body} }}`;
}

const CLASSNAME_RE = /className=("([^"]*)"|'([^']*)'|\{'([^']*)'\}|\{"([^"]*)"\})/g;
let totalConverted = 0;
const report = [];

for (const file of files) {
	let src = readFileSync(file, 'utf8');
	const edits = [];
	const flaggedClasses = new Set();
	let convertedInFile = 0, skipped = 0;
	let match;
	CLASSNAME_RE.lastIndex = 0;
	while ((match = CLASSNAME_RE.exec(src)) !== null) {
		const full = match[0];
		const classStr = match[2] ?? match[3] ?? match[4] ?? match[5] ?? '';
		const classes = classStr.split(/\s+/).filter(Boolean);
		if (classes.length === 0) continue;

		const { start, end } = tagBounds(src, match.index);
		const tag = src.slice(start, end);
		// only operate on lowercase HTML elements (skip <Component ...> props)
		const tagName = (tag.match(/^<([A-Za-z][\w.]*)/) || [])[1] || '';
		const isHtml = /^[a-z]/.test(tagName);
		const hasStyle = /[\s{]style=/.test(tag);

		// Component props (e.g. <Badge className="...">) are not our concern — skip
		// without flagging; Tailwind classes there are an intentional component API.
		if (!isHtml) continue;

		const flags = new Set();
		const pairs = [];
		const residual = [];
		for (const c of classes) {
			const mapped = mapClass(c, flags);
			if (mapped) pairs.push(...mapped);
			else residual.push(c);
		}
		for (const f of flags) flaggedClasses.add(f);

		if (hasStyle || pairs.length === 0) {
			// needs manual style-merge, or nothing mappable
			if (pairs.length > 0 && hasStyle) skipped++;
			continue;
		}
		let replacement = buildStyle(pairs);
		if (residual.length) replacement += ` className="${residual.join(' ')}"`;
		edits.push({ index: match.index, length: full.length, replacement });
		convertedInFile++;
	}

	// apply edits back-to-front
	edits.sort((a, b) => b.index - a.index);
	for (const e of edits) src = src.slice(0, e.index) + e.replacement + src.slice(e.index + e.length);

	totalConverted += convertedInFile;
	if (convertedInFile || flaggedClasses.size || skipped) {
		report.push({ file, convertedInFile, skipped, flagged: [...flaggedClasses].sort() });
	}
	if (WRITE && convertedInFile) writeFileSync(file, src);
}

console.log(WRITE ? 'WROTE changes.\n' : 'DRY RUN (use --write to apply).\n');
for (const r of report) {
	console.log(`${r.file}`);
	console.log(`  converted: ${r.convertedInFile}${r.skipped ? `  | skipped (has style=, merge manually): ${r.skipped}` : ''}`);
	if (r.flagged.length) console.log(`  FLAGGED (left in className, review): ${r.flagged.join(' ')}`);
}
console.log(`\nTotal className→style conversions: ${totalConverted} across ${report.length} file(s).`);
