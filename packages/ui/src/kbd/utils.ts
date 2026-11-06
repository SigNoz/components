import { KBD_MODIFIERS, KbdNamedKey } from './constants.js';
import type { KbdKey, KbdNamedKeyType } from './types.js';

const GLYPHS: Record<Exclude<KbdNamedKeyType, 'Mod'>, string> = {
	Escape: '⎋',
	Enter: '↵',
	Backspace: '⌫',
	Tab: '⇥',
	Shift: '⇧',
	Meta: '⌘',
	Alt: '⌥',
	Control: '⌃',
	ArrowUp: '↑',
	ArrowDown: '↓',
	ArrowLeft: '←',
	ArrowRight: '→',
};

const WORDS: Record<Exclude<KbdNamedKeyType, 'Mod' | 'Alt' | 'Meta'>, string> = {
	Escape: 'Escape',
	Enter: 'Enter',
	Backspace: 'Backspace',
	Tab: 'Tab',
	Shift: 'Shift',
	Control: 'Control',
	ArrowUp: 'Up arrow',
	ArrowDown: 'Down arrow',
	ArrowLeft: 'Left arrow',
	ArrowRight: 'Right arrow',
};

// Screen readers skip most punctuation at their default verbosity, so a symbol reads as its name.
const SYMBOL_WORDS: Readonly<Record<string, string>> = {
	'`': 'Backtick',
	'~': 'Tilde',
	'!': 'Exclamation mark',
	'@': 'At sign',
	'#': 'Hash',
	$: 'Dollar',
	'%': 'Percent',
	'^': 'Caret',
	'&': 'Ampersand',
	'*': 'Asterisk',
	'(': 'Left parenthesis',
	')': 'Right parenthesis',
	'-': 'Minus',
	_: 'Underscore',
	'=': 'Equals',
	'+': 'Plus',
	'[': 'Left bracket',
	']': 'Right bracket',
	'{': 'Left brace',
	'}': 'Right brace',
	'\\': 'Backslash',
	'|': 'Vertical bar',
	';': 'Semicolon',
	':': 'Colon',
	"'": 'Apostrophe',
	'"': 'Quote',
	',': 'Comma',
	'.': 'Period',
	'<': 'Less than',
	'>': 'Greater than',
	'/': 'Slash',
	'?': 'Question mark',
};

const NAMED_KEYS: ReadonlySet<string> = new Set(Object.values(KbdNamedKey));

const CHARACTER = /^[^\p{C}\p{Z}]$/u;

/**
 * Whether the platform calls its main modifier `⌘`. Read on the client only, the server and the
 * first render assume it does not.
 *
 * @access private
 */
export function isMacPlatform(): boolean {
	if (typeof navigator === 'undefined') {
		return false;
	}

	const platform =
		(navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
		navigator.platform;

	return /mac|iphone|ipad|ipod/i.test(platform);
}

/**
 * Whether `value` names a key `Kbd` can draw: a named key, or one visible character. A space, a
 * control character or anything longer than one character is not a key.
 *
 * @access private
 */
export function isKbdKey(value: unknown): value is KbdKey {
	if (typeof value !== 'string') {
		return false;
	}

	return NAMED_KEYS.has(value) || CHARACTER.test(value);
}

// `ß` uppercases to `SS`, and a key holds one character, so such a letter keeps its own case.
function toUpperCaseKey(key: string): string {
	const upper = key.toUpperCase();

	return [...upper].length === 1 ? upper : key;
}

function resolveMod(value: KbdKey, isMac: boolean): KbdKey {
	if (value !== KbdNamedKey.Mod) {
		return value;
	}

	return isMac ? KbdNamedKey.Meta : KbdNamedKey.Control;
}

/**
 * The one glyph a key draws.
 *
 * @access private
 */
export function kbdGlyph(value: KbdKey, isMac: boolean): string {
	const key = resolveMod(value, isMac);

	return GLYPHS[key as keyof typeof GLYPHS] ?? toUpperCaseKey(key);
}

/**
 * The word a screen reader reads for a key, never its glyph.
 *
 * @access private
 */
export function kbdWord(value: KbdKey, isMac: boolean): string {
	const key = resolveMod(value, isMac);

	if (key === KbdNamedKey.Alt) {
		return isMac ? 'Option' : 'Alt';
	}

	if (key === KbdNamedKey.Meta) {
		return isMac ? 'Command' : 'Meta';
	}

	return WORDS[key as keyof typeof WORDS] ?? SYMBOL_WORDS[key] ?? toUpperCaseKey(key);
}

/**
 * The keys in the order a shortcut draws them: modifiers first, each group in the given order.
 *
 * @access private
 */
export function orderKbdKeys(keys: ReadonlyArray<KbdKey>): KbdKey[] {
	const modifiers = keys.filter((key) => KBD_MODIFIERS.has(key));
	const rest = keys.filter((key) => !KBD_MODIFIERS.has(key));

	return [...modifiers, ...rest];
}
