import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Tooltip } from '../presets/tooltip.js';

/**
 * The design tokens are not loaded here, so the values the popup reads are declared in the test,
 * with the numbers `@signozhq/design-tokens` ships. The popup is portalled into the body, so they
 * go on the root.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-1: 2px;
		--spacing-4: 8px;
		--line-height-18: 18px;
		--periscope-font-size-base: 13px;
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function popupHeight(): number {
	return screen.getByRole('tooltip').getBoundingClientRect().height;
}

describe('Tooltip sizing', () => {
	it('still takes --tooltip-padding and --tooltip-line-height from the call site', () => {
		tokens.textContent += `:root {
			--tooltip-padding: 4px 8px;
			--tooltip-line-height: 20px;
		}`;

		render(
			<Tooltip open title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(popupHeight()).toBe(30);
	});
});
