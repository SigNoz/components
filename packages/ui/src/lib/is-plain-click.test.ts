import { describe, expect, it } from 'vitest';
import { isPlainClick } from './is-plain-click.js';

describe('isPlainClick', () => {
	const plain = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false };

	it('is true for the primary button with no modifier key', () => {
		expect(isPlainClick(plain)).toBe(true);
	});

	it.each(['metaKey', 'ctrlKey', 'shiftKey', 'altKey'] as const)('is false with %s held', (key) => {
		expect(isPlainClick({ ...plain, [key]: true })).toBe(false);
	});

	it.each([1, 2, 3, 4])('is false for the button %i, which is not the primary one', (button) => {
		expect(isPlainClick({ ...plain, button })).toBe(false);
	});

	it('reads a real click event', () => {
		expect(isPlainClick(new MouseEvent('click'))).toBe(true);
		expect(isPlainClick(new MouseEvent('click', { ctrlKey: true }))).toBe(false);
		expect(isPlainClick(new MouseEvent('click', { button: 1 }))).toBe(false);
	});
});
