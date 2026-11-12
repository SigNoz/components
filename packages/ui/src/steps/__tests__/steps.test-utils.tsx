import { screen } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';
import type { StepsItem } from '../types.js';

export const ONBOARDING: StepsItem[] = [
	{ label: 'Select data source', description: 'Kubernetes' },
	{ label: 'Configure', description: 'my-cluster' },
	{ label: 'Send data' },
];

export const PLAIN: StepsItem[] = [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }];

export const LONG_LABEL = 'Configure the collector for the production east cluster';
export const LONG_DESCRIPTION = 'my-production-east-cluster-in-the-us-east-1-region';

export function stepElements(testId: string): HTMLElement[] {
	return Array.from(screen.getByTestId(testId).querySelectorAll<HTMLElement>(':scope > li'));
}

export function statusesOf(testId: string): (string | null)[] {
	return stepElements(testId).map((step) => step.getAttribute('data-status'));
}

/**
 * The step that carries `aria-current`, as its number, or `null` when none does.
 */
export function ariaCurrentStep(testId: string): number | null {
	const index = stepElements(testId).findIndex((step) => step.hasAttribute('aria-current'));

	return index === -1 ? null : index + 1;
}

export function widthOf(element: Element): number {
	return element.getBoundingClientRect().width;
}

export function heightOf(element: Element): number {
	return element.getBoundingClientRect().height;
}

/**
 * The design tokens are not loaded in the browser tests, so the ones the steps read are declared
 * here with the numbers `@signozhq/design-tokens` ships. The colors are made up, to tell them
 * apart. Call it from the top of a test file that measures or paints the steps.
 */
export function declareDesignTokens(): void {
	let tokens: HTMLStyleElement;

	beforeEach(() => {
		tokens = document.createElement('style');
		tokens.textContent = `:root {
			--spacing-2: 4px;
			--spacing-4: 8px;
			--spacing-6: 12px;
			--spacing-8: 16px;
			--spacing-12: 24px;
			--spacing-24: 48px;
			--radius-1: 2px;
			--radius-round: 999999px;
			--label-base-500-font-family: Inter, sans-serif;
			--label-base-500-font-size: 13px;
			--label-base-500-font-weight: 500;
			--label-base-500-line-height: 1;
			--label-base-500-letter-spacing: -0.005em;
			--label-base-500-text-transform: none;
			--label-small-500-font-family: Inter, sans-serif;
			--label-small-500-font-size: 11px;
			--label-small-500-font-weight: 500;
			--label-small-500-line-height: 1;
			--label-small-500-letter-spacing: 0px;
			--label-small-500-text-transform: none;
			--label-small-400-font-family: Inter, sans-serif;
			--label-small-400-font-size: 11px;
			--label-small-400-font-weight: 400;
			--label-small-400-line-height: 1;
			--label-small-400-letter-spacing: 0px;
			--label-small-400-text-transform: none;
			--paragraph-base-500-font-family: Inter, sans-serif;
			--paragraph-base-500-font-size: 13px;
			--paragraph-base-500-font-weight: 500;
			--paragraph-base-500-line-height: 20px;
			--paragraph-base-500-letter-spacing: -0.005em;
			--paragraph-base-500-text-transform: none;
			--paragraph-base-400-font-family: Inter, sans-serif;
			--paragraph-base-400-font-size: 13px;
			--paragraph-base-400-font-weight: 400;
			--paragraph-base-400-line-height: 20px;
			--paragraph-base-400-letter-spacing: -0.005em;
			--paragraph-base-400-text-transform: none;
			--l1-foreground: rgb(236, 238, 242);
			--l2-foreground: rgb(192, 193, 195);
			--l3-foreground: rgb(160, 162, 168);
			--l1-background: rgb(11, 12, 14);
			--l2-background: rgb(18, 20, 24);
			--l2-border: rgb(35, 38, 46);
			--primary-background: rgb(78, 116, 248);
			--primary-foreground: rgb(255, 255, 255);
			--ring: rgb(120, 200, 80);
			--steps-marker-waiting-background: var(--l2-background);
			--steps-marker-waiting-border: var(--l2-border);
			--steps-marker-waiting-foreground: var(--l2-foreground);
			--steps-marker-current-background: var(--primary-background);
			--steps-marker-current-border: var(--primary-background);
			--steps-marker-current-foreground: var(--primary-foreground);
			--steps-marker-done-background: var(--l1-background);
			--steps-marker-done-border: var(--primary-background);
			--steps-marker-done-foreground: var(--primary-background);
			--steps-label-waiting-foreground: var(--l2-foreground);
			--steps-label-current-foreground: var(--l1-foreground);
			--steps-label-done-foreground: var(--l1-foreground);
			--steps-description-foreground: var(--l3-foreground);
			--steps-connector: var(--l2-border);
			--steps-connector-done: var(--primary-background);
			--steps-text-focus-ring: var(--ring);
			--steps-list-marker-background: var(--l2-background);
			--steps-list-marker-border: var(--l2-border);
			--steps-list-marker-foreground: var(--l1-foreground);
			--steps-list-connector: var(--l2-border);
			--steps-list-label-foreground: var(--l1-foreground);
			--steps-list-content-foreground: var(--l1-foreground);
			--steps-list-footer-marker-background: var(--l2-border);
		}`;
		document.head.append(tokens);
	});

	afterEach(() => {
		tokens.remove();
	});
}
