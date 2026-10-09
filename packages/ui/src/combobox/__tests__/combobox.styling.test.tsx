import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Combobox } from '../index.js';
import { FRAMEWORKS, openCombobox } from './combobox.test-utils.js';

/**
 * The type tokens live in `@signozhq/design-tokens` and are not loaded here, so they are declared
 * in the test to keep the subject on the rules in `combobox.module.scss`.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--periscope-font-size-small: 11px;
		--periscope-font-size-base: 13px;
		--line-height-18: 18px;
		--spacing-10: 20px;
	}`;
	document.head.append(tokens);
});

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
