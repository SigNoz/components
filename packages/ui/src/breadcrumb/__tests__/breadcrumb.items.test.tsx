import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from '../breadcrumb.js';
import type { BreadcrumbItemType } from '../types.js';
import {
	collapsedCrumbs,
	ellipsis,
	FULL_WIDTH,
	noop,
	renderInFrame,
	TRAIL,
} from './breadcrumb.test-utils.js';

const ICON_SLOT = '[data-slot="breadcrumb-item-icon"]';

/**
 * The design tokens are not loaded in the tests, and the gap between the icon and the label reads
 * one of them, so the page declares it.
 */
const TOKENS = `:root { --spacing-1: 2px; --spacing-2: 4px; }`;

let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = TOKENS;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
	vi.restoreAllMocks();
});

function labelOffset(icon: ReactNode): number {
	const { unmount } = render(<Breadcrumb items={[{ title: 'Home', href: '/', icon }]} />);
	const link = screen.getByRole('link', { name: 'Home' });
	const label = link.querySelector('[data-slot="breadcrumb-item-label"]') as HTMLElement;
	const offset = label.getBoundingClientRect().left - link.getBoundingClientRect().left;

	unmount();

	return offset;
}

describe('Breadcrumb icon slot', () => {
	it.each([
		['false', false],
		['an empty string', ''],
		['null', null],
		['undefined', undefined],
		['true', true],
		['an empty array', []],
		['an array of nothing', [false, null, '']],
	] satisfies [string, ReactNode][])('draws no slot for %s', (_name, icon) => {
		render(<Breadcrumb items={[{ title: 'Home', href: '/', icon }]} />);

		expect(document.querySelector(ICON_SLOT)).toBeNull();
	});

	it('leaves the label where it sits with no icon, for the value `cond && <Icon />` gives', () => {
		const withoutIcon = labelOffset(undefined);

		expect(labelOffset(false)).toBe(withoutIcon);
		expect(labelOffset('')).toBe(withoutIcon);
	});

	it.each([
		['an element', <svg key="icon" data-testid="icon" />],
		['text', '!'],
	] satisfies [string, ReactNode][])('keeps the slot for %s', (_name, icon) => {
		render(<Breadcrumb items={[{ title: 'Home', href: '/', icon }]} />);

		expect(document.querySelector(ICON_SLOT)).not.toBeNull();
	});
});

describe('Breadcrumb collapsed crumbs', () => {
	it('are inert in the installed React, with no warning about the prop', () => {
		const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(<Breadcrumb items={TRAIL} maxVisible={3} />);

		const hidden = collapsedCrumbs();

		expect(hidden).toHaveLength(2);
		for (const crumb of hidden) {
			expect(crumb).toHaveAttribute('inert');
		}
		expect(errors).not.toHaveBeenCalled();
	});
});

/**
 * A browser drops the focus of an element that turns inert, and does it a moment after the layout
 * changes, so a check straight after the resize still sees the focus where it was.
 */
function afterFocusFixup(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, 100));
}

describe('Breadcrumb focus when a crumb collapses', () => {
	const BUTTON_TRAIL: BreadcrumbItemType[] = TRAIL.map((item, index) =>
		index === 2 ? { title: 'Services', onClick: noop } : item,
	);

	it.each([
		['a link', TRAIL, 'link'],
		['a button', BUTTON_TRAIL, 'button'],
	] as const)('hands the focus of %s to the `...` crumb', async (_name, items, role) => {
		const { resize } = renderInFrame(<Breadcrumb items={items} />, FULL_WIDTH);
		const crumb = screen.getByRole(role, { name: 'Services' });
		crumb.focus();
		expect(crumb).toHaveFocus();

		await resize(FULL_WIDTH - 1);
		await waitFor(() => expect(collapsedCrumbs()).toHaveLength(1));
		await afterFocusFixup();

		expect(collapsedCrumbs()[0]).toContainElement(crumb);
		expect(ellipsis()).toHaveFocus();
	});

	it('hands it over when the crumb is one of several that collapse at once', async () => {
		const { resize } = renderInFrame(<Breadcrumb items={TRAIL} />, FULL_WIDTH);
		const crumb = screen.getByRole('link', { name: 'Payments' });
		crumb.focus();

		await resize(360);
		await waitFor(() => expect(collapsedCrumbs()).toHaveLength(2));
		await afterFocusFixup();

		expect(ellipsis()).toHaveFocus();
	});

	it('leaves the focus on a crumb that stays in the trail', async () => {
		const { resize } = renderInFrame(<Breadcrumb items={TRAIL} />, FULL_WIDTH);
		const crumb = screen.getByRole('link', { name: 'Payments' });
		crumb.focus();

		await resize(FULL_WIDTH - 1);
		await waitFor(() => expect(collapsedCrumbs()).toHaveLength(1));
		await afterFocusFixup();

		expect(crumb).toHaveFocus();
	});

	it('does not take the focus from outside the trail', async () => {
		const { resize } = renderInFrame(
			<>
				<input aria-label="Search" />
				<Breadcrumb items={TRAIL} />
			</>,
			FULL_WIDTH,
		);
		const input = screen.getByRole('textbox', { name: 'Search' });
		input.focus();

		await resize(FULL_WIDTH - 1);
		await waitFor(() => expect(collapsedCrumbs()).toHaveLength(1));
		await afterFocusFixup();

		expect(input).toHaveFocus();
	});
});
