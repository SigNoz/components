import { describe, expect, it } from 'vitest';
import { splitMarginProps, toMarginShorthand } from './spacing.js';

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
