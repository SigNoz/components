import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Select } from '../index.js';
import { FRAMEWORKS } from './select.test-utils.js';

/**
 * The type tokens live in `@signozhq/design-tokens` and are not loaded here, so they are declared
 * in the test to keep the subject on the rules in `select.module.scss`.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--periscope-font-size-small: 11px;
		--line-height-18: 18px;
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

describe('Select chips type', () => {
	it('keeps the descenders inside the label clip', () => {
		render(
			<Select
				multiple
				placeholder="Select frameworks..."
				aria-label="Frameworks"
				items={[{ type: 'item', value: 'go', label: 'Gyp' }]}
				defaultValue={['go']}
			/>,
		);

		const text = screen.getByText('Gyp');
		const range = document.createRange();
		range.selectNodeContents(text);
		const glyphs = range.getBoundingClientRect();
		const box = text.getBoundingClientRect();

		// Guards the comparison below: an empty range would sit inside any box.
		expect(glyphs.height).toBeGreaterThan(0);
		expect(glyphs.top).toBeGreaterThanOrEqual(box.top);
		expect(glyphs.bottom).toBeLessThanOrEqual(box.bottom);
	});

	it('sets the overflow count at the size of the chips beside it', () => {
		render(
			<Select
				multiple
				placeholder="Select frameworks..."
				aria-label="Frameworks"
				items={FRAMEWORKS}
				defaultValue={['react', 'vue', 'angular']}
				maxDisplayedPills={1}
			/>,
		);

		expect(getComputedStyle(screen.getByText('+2')).fontSize).toBe(
			getComputedStyle(screen.getByText('React')).fontSize,
		);
	});
});
