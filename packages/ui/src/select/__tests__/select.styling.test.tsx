import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Select } from '../index.js';
import { FRAMEWORKS, openSelect } from './select.test-utils.js';

/**
 * The type tokens live in `@signozhq/design-tokens` and are not loaded here, so they are declared
 * in the test to keep the subject on the rules in `select.module.scss`.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--periscope-font-size-small: 11px;
		--line-height-18: 18px;
		--spacing-10: 20px;
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

describe('Select chips type', () => {
	it('keeps the descenders inside the label clip', () => {
		render(
			<Select
				multiple
				placeholder="Select frameworks..."
				aria-label="Frameworks"
				items={[{ type: 'item', value: 'go', label: 'Gyp' }]}
				defaultValue={['go']}
			/>,
		);

		const text = screen.getByText('Gyp');
		const range = document.createRange();
		range.selectNodeContents(text);
		const glyphs = range.getBoundingClientRect();
		const box = text.getBoundingClientRect();

		// Guards the comparison below: an empty range would sit inside any box.
		expect(glyphs.height).toBeGreaterThan(0);
		expect(glyphs.top).toBeGreaterThanOrEqual(box.top);
		expect(glyphs.bottom).toBeLessThanOrEqual(box.bottom);
	});

	it('sets the overflow count at the size of the chips beside it', () => {
		render(
			<Select
				multiple
				placeholder="Select frameworks..."
				aria-label="Frameworks"
				items={FRAMEWORKS}
				defaultValue={['react', 'vue', 'angular']}
				maxDisplayedPills={1}
			/>,
		);

		expect(getComputedStyle(screen.getByText('+2')).fontSize).toBe(
			getComputedStyle(screen.getByText('React')).fontSize,
		);
	});
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

describe('Select chips layout', () => {
	it('keeps the chips as far from the left edge as from the top and bottom ones', () => {
		render(
			<div style={{ width: 300 }}>
				<Select
					multiple
					placeholder="Select frameworks..."
					aria-label="Frameworks"
					items={FRAMEWORKS}
					defaultValue={['react']}
				/>
			</div>,
		);
		const trigger = screen.getByRole('combobox', { name: 'Frameworks' }).getBoundingClientRect();
		const chip = required(
			document.querySelector('[data-slot="select-chip"]'),
		).getBoundingClientRect();

		expect(trigger.height).toBe(32);
		expect(chip.top - trigger.top).toBe(6);
		expect(trigger.bottom - chip.bottom).toBe(6);
		expect(chip.left - trigger.left).toBe(6);
	});

	it('keeps the chevron on the first row while the chips wrap', () => {
		render(
			<div style={{ width: 160 }}>
				<Select
					multiple
					placeholder="Select frameworks..."
					aria-label="Frameworks"
					items={FRAMEWORKS}
					defaultValue={['react', 'vue', 'angular', 'svelte']}
				/>
			</div>,
		);
		const trigger = screen.getByRole('combobox', { name: 'Frameworks' }).getBoundingClientRect();
		const firstChip = required(document.querySelector('[data-slot="select-chip"]'));
		const icon = required(document.querySelector('[data-slot="select-icon"] svg'));

		// Guards the subject: one row of chips would centre the icon either way.
		expect(trigger.height).toBeGreaterThan(32);
		expect(centerY(icon)).toBe(centerY(firstChip));
		expect(firstChip.getBoundingClientRect().top - trigger.top).toBe(6);
	});
});

describe('Select list scroll', () => {
	it('scrolls the row the keyboard reaches clear of the bottom fade', async () => {
		render(
			<Select
				placeholder="Select a row..."
				aria-label="Framework"
				contentMaxHeight={120}
				items={Array.from({ length: 20 }, (_, index) => ({
					type: 'item' as const,
					value: `row-${index}`,
					label: `Row ${index}`,
				}))}
			/>,
		);
		const listbox = await openSelect();
		const list = required(document.querySelector<HTMLElement>('[data-slot="select-list"]'));

		for (let step = 0; step < 8; step += 1) {
			await userEvent.keyboard('{ArrowDown}');
		}

		const row = required(listbox.querySelector('[data-slot="select-item"][data-highlighted]'));

		// Guards the subject: a row that fits from the start needs no scroll at all.
		expect(list.scrollTop).toBeGreaterThan(0);
		expect(list).toHaveAttribute('data-scroll-end');
		expect(
			list.getBoundingClientRect().bottom - row.getBoundingClientRect().bottom,
		).toBeGreaterThanOrEqual(20);
	});
});
