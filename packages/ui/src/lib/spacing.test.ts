import { describe, expect, it } from 'vitest';
import {
	splitMarginProps,
	splitProps,
	toMarginShorthand,
	toSpacingShorthand,
	toSpacingValue,
} from './spacing.js';

describe('toMarginShorthand', () => {
	it('is undefined with no margin prop', () => {
		expect(toMarginShorthand({})).toBeUndefined();
	});

	it('reads a step as its spacing token and 0 as 0', () => {
		expect(toMarginShorthand({ margin: 4 })).toBe('var(--spacing-4)');
		expect(toMarginShorthand({ margin: 0 })).toBe('0');
		expect(toMarginShorthand({ margin: 'auto' })).toBe('auto');
	});

	it('lets a side win over its axis, and the axis win over margin', () => {
		expect(toMarginShorthand({ margin: 2, marginBottom: 6 })).toBe(
			'var(--spacing-2) var(--spacing-2) var(--spacing-6)',
		);
		expect(toMarginShorthand({ margin: 2, marginX: 4 })).toBe('var(--spacing-2) var(--spacing-4)');
		expect(toMarginShorthand({ marginY: 4, marginTop: 0 })).toBe('0 0 var(--spacing-4)');
		expect(toMarginShorthand({ marginLeft: 'auto' })).toBe('0 0 0 auto');
	});

	it('ignores a value that is not a step or auto', () => {
		expect(toMarginShorthand({ margin: '8px', marginTop: null })).toBeUndefined();
	});
});

describe('splitMarginProps', () => {
	it('moves only the margin props out', () => {
		const [margin, rest] = splitMarginProps({
			id: 'k',
			margin: 2,
			marginX: 4,
			'aria-hidden': true,
		});

		expect(margin).toEqual({ margin: 2, marginX: 4 });
		expect(rest).toEqual({ id: 'k', 'aria-hidden': true });
	});
});

describe('toSpacingShorthand', () => {
	it('writes the padding shorthand with the sides that win', () => {
		expect(toSpacingShorthand({ padding: 4 }, 'padding')).toBe('var(--spacing-4)');
		expect(toSpacingShorthand({ paddingY: 2, paddingLeft: 4 }, 'padding')).toBe(
			'var(--spacing-2) 0 var(--spacing-2) var(--spacing-4)',
		);
	});

	it('reads only the props of the shorthand it writes', () => {
		expect(toSpacingShorthand({ margin: 4 }, 'padding')).toBeUndefined();
	});
});

describe('toSpacingValue', () => {
	it.each<[unknown, string | undefined]>([
		[0, '0'],
		[4, 'var(--spacing-4)'],
		[64, 'var(--spacing-64)'],
		['auto', 'auto'],
		['8px', undefined],
		[9, undefined],
		[-1, undefined],
		[3.5, undefined],
		[Number.NaN, undefined],
		[undefined, undefined],
		[null, undefined],
	])('writes %j as %j', (value, expected) => {
		expect(toSpacingValue(value)).toBe(expected);
	});
});

describe('splitProps', () => {
	it('splits the named props from the rest, keeping undefined values on their side', () => {
		const [picked, rest] = splitProps(
			{ padding: 4, marginTop: undefined, id: 'card', 'aria-label': 'Card' },
			new Set(['padding', 'marginTop']),
		);

		expect(picked).toEqual({ padding: 4, marginTop: undefined });
		expect(Object.keys(picked)).toEqual(['padding', 'marginTop']);
		expect(rest).toEqual({ id: 'card', 'aria-label': 'Card' });
	});
});
