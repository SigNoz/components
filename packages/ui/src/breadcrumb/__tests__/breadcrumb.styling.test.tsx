import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Breadcrumb } from '../breadcrumb.js';
import type { BreadcrumbItemType } from '../types.js';
import { noop } from './breadcrumb.test-utils.js';

/**
 * The design tokens are not loaded in the tests, so the text style the trail reads is declared
 * here with the values `@signozhq/design-tokens` ships, and the page around the trail gets a
 * deliberately wrong font, so a part that does not take the trail's style shows it.
 */
const TOKENS = `
	:root {
		--spacing-1: 2px;
		--spacing-2: 4px;
		--label-base-400-font-family: Arial, sans-serif;
		--label-base-400-font-size: 13px;
		--label-base-400-font-weight: 400;
		--label-base-400-line-height: 1;
		--label-base-400-letter-spacing: -0.005em;
		--label-base-400-text-transform: none;
	}

	[data-testid='page'] {
		font-family: 'Courier New', monospace;
		font-size: 20px;
		font-weight: 700;
		line-height: 40px;
		letter-spacing: 3px;
		text-transform: uppercase;
		font-variant-numeric: tabular-nums slashed-zero;
		font-feature-settings: 'ss01' 0;
	}
`;

const ITEMS: BreadcrumbItemType[] = [
	{ title: 'Dashboards', href: '/dashboards' },
	{ title: 'Payments', href: '/dashboards/payments' },
	{ title: 'Services', onClick: noop },
	{ title: 'Checkout', menu: [{ title: 'Orders', href: '/orders' }] },
	{ title: 'prod-east' },
];

const TEXT_PROPERTIES = [
	'font-family',
	'font-size',
	'font-weight',
	'line-height',
	'letter-spacing',
	'text-transform',
	'font-variant-numeric',
	'font-feature-settings',
] as const;

let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = TOKENS;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function renderTrail() {
	render(
		<div data-testid="page">
			<Breadcrumb items={ITEMS} maxVisible={4} testId="bc" />
		</div>,
	);
}

function textStyle(element: Element): Record<string, string> {
	const style = getComputedStyle(element);
	return Object.fromEntries(
		TEXT_PROPERTIES.map((property) => [property, style.getPropertyValue(property)]),
	);
}

describe('Breadcrumb text style', () => {
	it('draws the trail in Label / Base / 400 with open digits, whatever the page sets', () => {
		renderTrail();

		expect(textStyle(screen.getByTestId('bc'))).toEqual({
			'font-family': 'Arial, sans-serif',
			'font-size': '13px',
			'font-weight': '400',
			'line-height': '13px',
			'letter-spacing': '-0.065px',
			'text-transform': 'none',
			'font-variant-numeric': 'normal',
			'font-feature-settings': '"ss01"',
		});
	});

	it('gives every crumb, links, buttons, menus and the ellipsis included, the style of the trail', () => {
		renderTrail();

		const root = textStyle(screen.getByTestId('bc'));
		const parts = [
			...screen.getByTestId('bc').querySelectorAll('[data-slot="breadcrumb-item-content"]'),
			screen.getByTestId('bc-ellipsis'),
		];
		const tags = parts.map((part) => part.tagName);

		expect(tags).toEqual(expect.arrayContaining(['A', 'BUTTON', 'SPAN']));
		for (const part of parts) {
			expect(textStyle(part)).toEqual(root);
		}
	});

	it('keeps a crumb 21px tall, the line height of the text style aside', () => {
		renderTrail();

		const crumb = screen
			.getByTestId('bc')
			.querySelector('[data-slot="breadcrumb-item-content"]') as HTMLElement;

		expect(crumb.getBoundingClientRect().height).toBe(21);
	});
});
