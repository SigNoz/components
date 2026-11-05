import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Kbd } from './index.js';

/**
 * The design tokens are not loaded here, so the values the key reads are declared in the test,
 * with the numbers `@signozhq/design-tokens` ships. There is no global `box-sizing` reset either.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-1: 2px;
		--spacing-2: 4px;
		--spacing-3: 6px;
		--spacing-4: 8px;
		--spacing-16: 32px;
		--l3-border: rgb(1, 2, 3);
		--code-small-500-font-size: 11px;
		--code-small-500-line-height: 1;
		--code-base-500-font-size: 13px;
		--code-base-500-line-height: 1;
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

describe('Kbd size', () => {
	it.each([
		['sm', 17],
		['default', 21],
		['lg', 32],
	] as const)('keeps %s at %ipx tall', (size, height) => {
		render(
			<Kbd size={size} testId="key">
				⌘K
			</Kbd>,
		);

		expect(screen.getByTestId('key').getBoundingClientRect().height).toBe(height);
	});
});
