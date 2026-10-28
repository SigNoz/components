import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
	Breadcrumb,
	BreadcrumbDropdown,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from './index.js';

/**
 * The design tokens are not loaded here, so the values the trail reads are declared in the test,
 * with the numbers `@signozhq/design-tokens` ships. There is no global `box-sizing` reset either,
 * as in signoz-v3, so every border-box a height relies on has to be the component's own.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-1: 2px;
		--spacing-2: 4px;
		--spacing-10: 20px;
		--spacing-12: 24px;
		--label-base-400-font-family: Inter, sans-serif;
		--label-base-400-font-size: 13px;
		--label-base-400-font-weight: 400;
		--label-base-400-line-height: 1;
		--label-base-400-letter-spacing: -0.005em;
	}

	[data-slot='breadcrumb-dropdown'] svg {
		width: 14px;
		height: 14px;
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function Trail() {
	return (
		<Breadcrumb testId="root">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#home" testId="link">
						Home
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbDropdown items={[{ title: 'Logs', href: '#logs' }]}>
						Explore
					</BreadcrumbDropdown>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbPage testId="page">Query</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}

/** The dropdown's `testId` names its menu, so the trigger is found by its slot. */
function part(name: string): HTMLElement {
	if (name === 'dropdown') {
		return document.querySelector('[data-slot="breadcrumb-dropdown"]') as HTMLElement;
	}
	return screen.getByTestId(name);
}

function height(name: string): number {
	return part(name).getBoundingClientRect().height;
}

describe('Breadcrumb text style', () => {
	it('has every part take the text style of the root, tracking included', () => {
		render(<Trail />);

		const root = getComputedStyle(part('root'));

		for (const name of ['link', 'dropdown', 'page']) {
			const style = getComputedStyle(part(name));

			expect(style.fontFamily).toBe(root.fontFamily);
			expect(style.fontSize).toBe(root.fontSize);
			expect(style.fontWeight).toBe(root.fontWeight);
			expect(style.lineHeight).toBe(root.lineHeight);
			expect(style.letterSpacing).toBe(root.letterSpacing);
		}
	});
});

describe('Breadcrumb height', () => {
	it('keeps a link and a dropdown trigger 28px tall, and the page 20px', () => {
		render(<Trail />);

		expect(height('link')).toBe(28);
		expect(height('dropdown')).toBe(28);
		expect(height('page')).toBe(20);
	});
});
