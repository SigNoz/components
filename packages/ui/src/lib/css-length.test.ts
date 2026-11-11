import { describe, expect, it } from 'vitest';
import { readPx, toCssLength, toOptionalCssLength } from './css-length.js';

describe('toOptionalCssLength', () => {
	it.each<[unknown, string | undefined]>([
		[0, '0px'],
		[240, '240px'],
		['100%', '100%'],
		['fit-content', 'fit-content'],
		[undefined, undefined],
		[null, undefined],
		[{}, undefined],
	])('writes %j as %j', (value, expected) => {
		expect(toOptionalCssLength(value)).toBe(expected);
	});
});

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

describe('toCssLength', () => {
	it.each([
		[240, '240px'],
		[0, '0px'],
		[-4, '-4px'],
		[1.5, '1.5px'],
	])('writes the number %s as %s', (value, expected) => {
		expect(toCssLength(value)).toBe(expected);
	});

	it.each([
		['240', '240px'],
		['0', '0px'],
		['-4', '-4px'],
		['1.5', '1.5px'],
		['.5', '0.5px'],
		[' 240 ', '240px'],
		['240.', '240px'],
		['+240', '240px'],
		['1e3', '1000px'],
	])('writes the unitless string %j as %s', (value, expected) => {
		expect(toCssLength(value)).toBe(expected);
	});

	it.each(['50%', '24rem', '240px', 'auto', 'fit-content', 'calc(100% - 8px)', 'var(--x)', ''])(
		'keeps %j as it is',
		(value) => {
			expect(toCssLength(value)).toBe(value);
		},
	);
});
