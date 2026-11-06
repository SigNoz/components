import { Info } from '@signozhq/icons';
import { screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { queryOpenTooltip } from '../../__tests__/test-utils.js';
import { renderOpenCommand } from './command.test-utils.js';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Command shortcut that is not a key', () => {
	it.each([
		['a word', ['Ctrl', 'K']],
		['a word among keys', ['Mod', 'esc']],
	])('draws nothing for %s and leaves the row with no description', async (_name, keys) => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});

		await renderOpenCommand({
			items: [{ type: 'item', value: 'open', label: 'Open', shortcut: keys, onClick: () => {} }],
		});

		const row = screen.getByTestId('command-item-open');

		expect(row.querySelector('[data-slot="kbd-shortcut"]')).toBeNull();
		expect(error).toHaveBeenCalledWith(expect.stringContaining('is not a key'));
		expect(row).not.toHaveAttribute('aria-describedby');
	});

	it('keeps the reason as the description and does not point at the empty suffix', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});

		await renderOpenCommand({
			items: [
				{
					type: 'item',
					value: 'blocked',
					label: 'Delete dashboard',
					shortcut: ['Ctrl', 'D'],
					disabled: true,
					disabledTooltip: 'Only the owner can delete it',
					onClick: () => {},
				},
			],
		});
		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Only the owner can delete it');
		});

		const row = screen.getByTestId('command-item-blocked');
		const suffix = screen.getByTestId('command-item-blocked-suffix');

		expect(row.getAttribute('aria-describedby')).toBe(queryOpenTooltip()?.id);
		expect(row.getAttribute('aria-describedby')).not.toContain(suffix.id);
		expect(row).toHaveAccessibleDescription('Only the owner can delete it');
	});
});

describe('Command shortcut on a blocked and on a waiting row', () => {
	it('dims the keys of a disabled row, and leaves those of a loading row alone', async () => {
		await renderOpenCommand({
			items: [
				{
					type: 'item',
					value: 'blocked',
					label: 'Delete',
					prefix: <Info />,
					shortcut: ['Shift', 'D'],
					disabled: true,
					disabledTooltip: 'Ask an admin',
					onClick: () => {},
				},
				{
					type: 'item',
					value: 'waiting',
					label: 'Export',
					prefix: <Info />,
					shortcut: ['Shift', 'E'],
					loading: true,
					loadingTooltip: 'Preparing the export',
					onClick: () => {},
				},
				{
					type: 'item',
					value: 'idle',
					label: 'Open',
					prefix: <Info />,
					shortcut: ['Shift', 'O'],
					onClick: () => {},
				},
			],
		});

		for (const [value, disabled] of [
			['blocked', true],
			['waiting', false],
			['idle', false],
		] as const) {
			const row = screen.getByTestId(`command-item-${value}`);
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
