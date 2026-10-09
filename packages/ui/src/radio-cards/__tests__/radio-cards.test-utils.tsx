import { afterEach, beforeEach } from 'vitest';
import type { RadioCardsItemType } from '../types.js';

export const ITEMS: RadioCardsItemType[] = [
	{ label: 'Logs', value: 'logs' },
	{ label: 'Traces', value: 'traces' },
	{ label: 'Metrics', value: 'metrics' },
];

/**
 * The design tokens are not loaded in the tests, so the steps the cards read are declared here, with
 * the numbers `@signozhq/design-tokens` ships. Without them the grid template and the card padding
 * resolve to nothing.
 */
export function installTokens(): void {
	let tokens: HTMLStyleElement;

	beforeEach(() => {
		tokens = document.createElement('style');
		tokens.textContent = `:root {
			--spacing-3: 6px;
			--spacing-4: 8px;
			--spacing-6: 12px;
			--radius-1: 2px;
			--periscope-font-size-base: 13px;
			--periscope-line-height-base: 20px;
			--font-weight-medium: 500;
		}`;
		document.head.append(tokens);
	});

	afterEach(() => {
		tokens.remove();
	});
}
