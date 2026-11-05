import { screen } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

/**
 * The slots of the numbered list in document order, a page as its number and a separator as `-`.
 */
export function slotsOf(testId: string): string[] {
	return Array.from(
		screen
			.getByTestId(testId)
			.querySelectorAll<HTMLElement>(
				'[data-slot="pagination-page"], [data-slot="pagination-separator"]',
			),
	).map((slot) => (slot.dataset.slot === 'pagination-separator' ? '-' : (slot.textContent ?? '')));
}

/**
 * The text the position label shows, without the invisible copy that holds its width.
 */
export function positionOf(testId: string): string {
	const label = screen.getByTestId(testId);

	return label.querySelector(':scope > span:not([aria-hidden])')?.textContent ?? '';
}

export function widthOf(element: Element): number {
	return element.getBoundingClientRect().width;
}

/**
 * The design tokens are not loaded in the browser tests, so the ones the bar reads are declared
 * here with the numbers `@signozhq/design-tokens` ships. The colors are made up, to tell them
 * apart. Call it from the top of a test file that measures the bar.
 */
export function declareDesignTokens(): void {
	let tokens: HTMLStyleElement;

	beforeEach(() => {
		tokens = document.createElement('style');
		tokens.textContent = `:root {
			--spacing-2: 4px;
			--spacing-3: 6px;
			--spacing-4: 8px;
			--spacing-5: 10px;
			--spacing-6: 12px;
			--spacing-8: 16px;
			--radius-1: 2px;
			--radius-round: 999999px;
			--label-base-400-font-family: Inter, sans-serif;
			--label-base-400-font-size: 13px;
			--label-base-400-font-weight: 400;
			--label-base-400-line-height: 1;
			--label-base-400-letter-spacing: -0.005em;
			--label-base-400-text-transform: none;
			--l1-foreground: rgb(236, 238, 242);
			--l2-foreground: rgb(192, 193, 195);
			--primary-background: rgb(78, 116, 248);
			--primary-foreground: rgb(255, 255, 255);
			--secondary-border: rgb(35, 38, 46);
			--ring: rgb(78, 116, 248);
			--pagination-label: var(--l2-foreground);
			--pagination-label-hover: var(--l1-foreground);
			--pagination-page-current-background: var(--primary-background);
			--pagination-page-current-label: var(--primary-foreground);
			--pagination-separator: var(--l1-foreground);
			--pagination-divider: var(--secondary-border);
			--pagination-focus-ring: var(--ring);
		}`;
		document.head.append(tokens);
	});

	afterEach(() => {
		tokens.remove();
	});
}
