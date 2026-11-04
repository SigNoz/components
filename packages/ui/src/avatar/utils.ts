import { isBlankText } from '../lib/blank-text.js';

const EMAIL = /^[^\s@]+@[^\s@]+$/;
const LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;

// A few letters upper-case to more than one, `ß` to `SS`, and an initial is one letter.
function upperCaseLetter(letter: string): string {
	return Array.from(letter.toUpperCase())[0] ?? '';
}

/**
 * The initials of `name`, in upper case, at most two letters: the first letter of the first word
 * and of the last, or the first letter of a single word. An email address is read as the part
 * before the `@`, which is one word, so the dots in it do not split it.
 *
 * @access private
 */
export function getInitials(name: string): string {
	if (isBlankText(name)) {
		return '';
	}

	const text = name.trim();
	const readable = EMAIL.test(text) ? text.slice(0, text.indexOf('@')) : text;
	const [first, ...others] = readable
		.split(/\s+/)
		.map((word) => LETTER_OR_DIGIT.exec(word)?.[0])
		.filter((letter): letter is string => letter !== undefined);

	if (first === undefined) {
		return upperCaseLetter(Array.from(text)[0] ?? '');
	}

	const last = others[others.length - 1];

	return upperCaseLetter(first) + (last === undefined ? '' : upperCaseLetter(last));
}
