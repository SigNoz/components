import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Combobox } from '../index.js';
import { FRAMEWORKS, openCombobox } from './combobox.test-utils.js';

/**
 * The text style tokens live in `@signozhq/design-tokens` and are not loaded here, so they are
 * declared in the test to keep the subject on the rules in `combobox.module.scss`.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--label-small-400-font-size: 11px;
		--label-small-400-line-height: 1;
		--label-base-400-font-size: 13px;
		--label-base-400-line-height: 1;
		--uppercase-small-600-font-size: 11px;
		--uppercase-small-600-line-height: 1;
		--paragraph-base-400-line-height: 20px;
		--spacing-10: 20px;
	}`;
	document.head.append(tokens);
});

/**
 * The spacing steps the row padding and the row floors are built from.
 */
const ROW_SPACING = `:root {
	--spacing-1: 2px;
	--spacing-3: 6px;
	--spacing-4: 8px;
	--spacing-5: 10px;
	--spacing-6: 12px;
	--spacing-12: 24px;
	--spacing-16: 32px;
}`;

afterEach(() => {
	tokens.remove();
});

function required<T>(element: T | null): T {
	if (element === null) {
		throw new Error('Not rendered');
	}

	return element;
}

function centerY(element: Element): number {
	const { top, height } = element.getBoundingClientRect();

	return top + height / 2;
}

describe('Combobox chips layout', () => {
	it('keeps the chips as far from the left edge as from the top and bottom ones', () => {
		render(
			<div style={{ width: 300 }}>
				<Combobox
					multiple
					placeholder="Select frameworks..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Frameworks"
					items={FRAMEWORKS}
					defaultValue={['react']}
				/>
			</div>,
		);
		const trigger = screen.getByRole('combobox', { name: 'Frameworks' }).getBoundingClientRect();
		const chip = required(
			document.querySelector('[data-slot="combobox-chip"]'),
		).getBoundingClientRect();

		expect(trigger.height).toBe(32);
		expect(chip.top - trigger.top).toBe(6);
		expect(trigger.bottom - chip.bottom).toBe(6);
		expect(chip.left - trigger.left).toBe(6);
	});

	it('keeps the chevron and the clear button on the first row while the chips wrap', () => {
		render(
			<div style={{ width: 160 }}>
				<Combobox
					multiple
					allowClear
					placeholder="Select frameworks..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Frameworks"
					items={FRAMEWORKS}
					defaultValue={['react', 'vue', 'angular', 'svelte']}
				/>
			</div>,
		);
		const trigger = screen.getByRole('combobox', { name: 'Frameworks' }).getBoundingClientRect();
		const firstChip = required(document.querySelector('[data-slot="combobox-chip"]'));
		const icon = required(document.querySelector('[data-slot="combobox-icon"] svg'));
		const clear = required(document.querySelector('[data-slot="combobox-clear"] svg'));

		// Guards the subject: one row of chips would centre the icon either way.
		expect(trigger.height).toBeGreaterThan(32);
		expect(centerY(icon)).toBe(centerY(firstChip));
		expect(centerY(clear)).toBe(centerY(firstChip));
		expect(firstChip.getBoundingClientRect().top - trigger.top).toBe(6);
	});
});

describe('Combobox rows type', () => {
	beforeEach(() => {
		tokens.textContent += ROW_SPACING;
	});

	it('keeps a row at 34px on the label line', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
			/>,
		);
		const listbox = await openCombobox();
		const row = required(listbox.querySelector('[data-slot="combobox-item"]'));

		expect(row.getBoundingClientRect().height).toBe(34);
	});

	it('keeps the search row at 41px on the label line', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
			/>,
		);
		await openCombobox();
		const search = required(document.querySelector('[data-slot="combobox-search"]'));

		expect(search.getBoundingClientRect().height).toBe(41);
	});

	it('keeps a group label at 30px on the uppercase line', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[
					{
						type: 'group',
						value: 'web',
						label: 'Web',
						items: [{ type: 'item', value: 'react', label: 'React' }],
					},
				]}
			/>,
		);
		const listbox = await openCombobox();
		const label = required(listbox.querySelector('[data-slot="combobox-group-label"]'));

		expect(label.getBoundingClientRect().height).toBe(30);
	});

	it('keeps the empty row on its paragraph line when the rows take another', async () => {
		tokens.textContent += `:root { --combobox-item-line-height: 16px; }`;
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[]}
			/>,
		);
		await openCombobox();
		const empty = required(document.querySelector('[data-slot="combobox-empty"]'));

		expect(getComputedStyle(empty).lineHeight).toBe('20px');
		expect(empty.getBoundingClientRect().height).toBe(36);
	});
});

describe('Combobox list scroll', () => {
	it('scrolls the row the keyboard reaches clear of the bottom fade', async () => {
		render(
			<Combobox
				placeholder="Select a row..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				contentMaxHeight={120}
				items={Array.from({ length: 20 }, (_, index) => ({
					type: 'item' as const,
					value: `row-${index}`,
					label: `Row ${index}`,
				}))}
			/>,
		);
		const listbox = await openCombobox();
		const viewport = required(
			document.querySelector<HTMLElement>('[data-slot="combobox-viewport"]'),
		);

		for (let step = 0; step < 8; step += 1) {
			await userEvent.keyboard('{ArrowDown}');
		}

		const row = required(listbox.querySelector('[data-slot="combobox-item"][data-highlighted]'));

		// Guards the subject: a row that fits from the start needs no scroll at all.
		expect(viewport.scrollTop).toBeGreaterThan(0);
		expect(viewport).toHaveAttribute('data-scroll-end');
		expect(
			viewport.getBoundingClientRect().bottom - row.getBoundingClientRect().bottom,
		).toBeGreaterThanOrEqual(20);
	});
});
