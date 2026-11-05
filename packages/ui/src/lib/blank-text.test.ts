import { describe, expect, it } from 'vitest';
import { isBlankText } from './blank-text.js';

describe('isBlankText', () => {
	it.each([
		['an empty string', '', true],
		['spaces', '   ', true],
		['tabs and new lines', '\t\n ', true],
		['a name', 'Alex', false],
		['a name with spaces around it', '  Alex ', false],
		['a symbol', '-', false],
		['undefined', undefined, true],
		['null', null, true],
		['a number', 0, true],
	])('%s', (_, value, blank) => {
		expect(isBlankText(value)).toBe(blank);
	});
});
