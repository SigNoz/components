import { describe, expect, it } from 'vitest';
import { readPx } from './css-length.js';

describe('readPx', () => {
	it.each<[string, number]>([
		['12px', 12],
		['0.5px', 0.5],
		['-3px', -3],
		['0px', 0],
		['299.5px', 299.5],
	])('reads %s as %f', (value, expected) => {
		expect(readPx(value)).toBe(expected);
	});

	it.each(['', 'normal', 'auto', 'none'])('reads %j as 0', (value) => {
		expect(readPx(value)).toBe(0);
	});

	it('reads what a computed style reports', () => {
		const element = document.createElement('div');
		element.style.paddingLeft = '7.5px';
		document.body.append(element);

		expect(readPx(getComputedStyle(element).paddingLeft)).toBe(7.5);
		expect(readPx(getComputedStyle(element).columnGap)).toBe(0);

		element.remove();
	});
});
