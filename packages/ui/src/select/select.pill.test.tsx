import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Select } from './components/select.js';
import { SelectContent } from './components/select-content.js';
import { SelectItem } from './components/select-item.js';
import { SelectTrigger } from './components/select-trigger.js';
import { renderMultiSelect } from './select.test-utils.js';

/**
 * The type tokens live in `@signozhq/design-tokens` and are not loaded here, so they are declared
 * in the test to keep the subject on the rules in `select.module.scss`.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--periscope-font-size-base: 13px;
		--line-height-18: 18px;
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

describe('Select multi pills type', () => {
	it('keeps the descenders inside the text clip', () => {
		renderMultiSelect({ defaultValue: ['green'] });

		const text = screen.getByText('green');
		const range = document.createRange();
		range.selectNodeContents(text);
		const glyphs = range.getBoundingClientRect();
		const box = text.getBoundingClientRect();

		// Guards the comparison below: an empty range would sit inside any box.
		expect(glyphs.height).toBeGreaterThan(0);
		expect(glyphs.top).toBeGreaterThanOrEqual(box.top);
		expect(glyphs.bottom).toBeLessThanOrEqual(box.bottom);
	});

	it('sets the overflow count at the size of the pills beside it', () => {
		render(
			<Select multiple defaultValue={['red', 'green', 'blue']}>
				<SelectTrigger placeholder="Pick options" maxDisplayedPills={1} />
				<SelectContent withPortal={false}>
					<SelectItem value="red">Red</SelectItem>
					<SelectItem value="green">Green</SelectItem>
					<SelectItem value="blue">Blue</SelectItem>
				</SelectContent>
			</Select>,
		);

		expect(getComputedStyle(screen.getByText('+2')).fontSize).toBe(
			getComputedStyle(screen.getByText('red')).fontSize,
		);
	});
});
