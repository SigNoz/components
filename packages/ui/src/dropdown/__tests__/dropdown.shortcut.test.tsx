import { Info } from '@signozhq/icons';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { queryOpenTooltip } from '../../__tests__/test-utils.js';
import { Dropdown } from '../index.js';
import type { DropdownItemType } from '../types.js';
import { openDropdown } from './dropdown.test-utils.js';

function renderDropdown(items: DropdownItemType[]) {
	return render(
		<Dropdown nativeButton side="bottom" align="start" items={items} testId="menu">
			<button type="button">Actions</button>
		</Dropdown>,
	);
}

function describedByIds(row: HTMLElement): string[] {
	return (row.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
}

async function hoverUntilTooltip(row: HTMLElement, text: string): Promise<void> {
	await userEvent.hover(row);
	await waitFor(() => {
		expect(queryOpenTooltip()).toHaveTextContent(text);
	});
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Dropdown shortcut that is not a key', () => {
	it.each([
		['a word', ['Ctrl', 'K']],
		['a word among keys', ['Mod', 'esc']],
	])('draws nothing for %s and leaves the row with no description', async (_name, keys) => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});

		renderDropdown([{ type: 'item', value: 'open', label: 'Open', shortcut: keys }]);
		await openDropdown();

		const row = screen.getByTestId('menu-item-open');

		expect(row.querySelector('[data-slot="kbd-shortcut"]')).toBeNull();
		expect(error).toHaveBeenCalledWith(expect.stringContaining('is not a key'));
		expect(row).not.toHaveAttribute('aria-describedby');
	});

	it('keeps the reason as the only description, and points at nothing that is not in the page', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});

		renderDropdown([
			{
				type: 'item',
				value: 'blocked',
				label: 'Delete',
				shortcut: ['Ctrl', 'D'],
				disabled: true,
				disabledTooltip: 'Ask an admin',
			},
		]);
		await openDropdown();

		const row = screen.getByTestId('menu-item-blocked');

		await hoverUntilTooltip(row, 'Ask an admin');

		expect(describedByIds(row)).toEqual([queryOpenTooltip()?.id]);
		expect(row).toHaveAccessibleDescription('Ask an admin');
	});
});

describe('Dropdown row description', () => {
	it('reads the reason as the description of a row with no shortcut', async () => {
		renderDropdown([
			{
				type: 'item',
				value: 'blocked',
				label: 'Delete',
				disabled: true,
				disabledTooltip: 'Ask an admin',
			},
		]);
		await openDropdown();

		const row = screen.getByTestId('menu-item-blocked');

		await hoverUntilTooltip(row, 'Ask an admin');

		expect(describedByIds(row)).toEqual([queryOpenTooltip()?.id]);
		expect(row).toHaveAccessibleDescription('Ask an admin');
	});
});

describe('Dropdown shortcut on a blocked and on a waiting row', () => {
	it('dims the keys of a disabled row, and leaves those of a loading row alone', async () => {
		renderDropdown([
			{
				type: 'item',
				value: 'blocked',
				label: 'Delete',
				prefix: <Info />,
				shortcut: ['Shift', 'D'],
				disabled: true,
				disabledTooltip: 'Ask an admin',
			},
			{
				type: 'item',
				value: 'waiting',
				label: 'Export',
				prefix: <Info />,
				shortcut: ['Shift', 'E'],
				loading: true,
				loadingTooltip: 'Preparing the export',
			},
			{
				type: 'item',
				value: 'idle',
				label: 'Open',
				prefix: <Info />,
				shortcut: ['Shift', 'O'],
			},
		]);
		await openDropdown();

		for (const [value, disabled] of [
			['blocked', true],
			['waiting', false],
			['idle', false],
		] as const) {
			const row = screen.getByTestId(`menu-item-${value}`);
			const shortcut = row.querySelector('[data-slot="kbd-shortcut"]');
			const keys = Array.from(row.querySelectorAll('[data-slot="kbd"]'));
			const faces = keys.map((key) => key.firstElementChild as Element);

			expect(keys).toHaveLength(2);
			expect(shortcut?.hasAttribute('data-disabled')).toBe(disabled);

			for (const key of keys) {
				expect(key.hasAttribute('data-disabled')).toBe(disabled);
			}

			for (const face of faces) {
				expect(getComputedStyle(face).opacity).toBe(disabled ? '0.5' : '1');
			}
		}
	});
});
