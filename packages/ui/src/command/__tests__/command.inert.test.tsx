import { Info } from '@signozhq/icons';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { queryOpenTooltip } from '../../__tests__/test-utils.js';
import type { CommandItemType } from '../types.js';
import { highlightedOption, renderOpenCommand, searchField } from './command.test-utils.js';

const run = {
	open: vi.fn(),
	blocked: vi.fn(),
	waiting: vi.fn(),
};

function inertItems(): CommandItemType[] {
	run.open.mockClear();
	run.blocked.mockClear();
	run.waiting.mockClear();

	return [
		{
			type: 'item',
			value: 'blocked',
			label: 'Delete dashboard',
			shortcut: 'D',
			disabled: true,
			disabledTooltip: 'Only the owner can delete it',
			onClick: () => run.blocked(),
		},
		{
			type: 'item',
			value: 'waiting',
			label: 'Export dashboard',
			loading: true,
			loadingTooltip: 'Preparing the export',
			onClick: () => run.waiting(),
		},
		{ type: 'item', value: 'open', label: 'Open dashboard', onClick: () => run.open() },
	];
}

async function waitForHighlight(name: string): Promise<void> {
	await waitFor(() => {
		expect(highlightedOption()).toHaveTextContent(name);
	});
}

describe('Command inert rows', () => {
	it('marks a disabled row and a loading row apart, without the native attribute', async () => {
		await renderOpenCommand({ items: inertItems() });

		const blocked = screen.getByTestId('command-item-blocked');
		const waiting = screen.getByTestId('command-item-waiting');

		expect(blocked).toHaveAttribute('aria-disabled', 'true');
		expect(blocked).toHaveAttribute('data-disabled');
		expect(blocked).not.toHaveAttribute('data-loading');
		expect(waiting).toHaveAttribute('aria-disabled', 'true');
		expect(waiting).toHaveAttribute('data-loading');
		expect(waiting).not.toHaveAttribute('data-disabled');
		expect(screen.getByTestId('command-item-open')).not.toHaveAttribute('aria-disabled');
	});

	it('runs nothing on a click and stays open with the query untouched', async () => {
		const onOpenChange = vi.fn();
		await renderOpenCommand({ items: inertItems(), onOpenChange });

		await userEvent.click(screen.getByTestId('command-item-blocked'));
		await userEvent.click(screen.getByTestId('command-item-waiting'));

		expect(run.blocked).not.toHaveBeenCalled();
		expect(run.waiting).not.toHaveBeenCalled();
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(searchField()).toHaveValue('');
	});

	it.each([
		['Enter', '{Enter}'],
		['Ctrl+Enter', '{Control>}{Enter}{/Control}'],
	])('runs nothing on %s and stays open', async (_key, keys) => {
		const onOpenChange = vi.fn();
		await renderOpenCommand({ items: inertItems(), onOpenChange });
		await waitForHighlight('Delete dashboard');

		await userEvent.keyboard(keys);
		await userEvent.keyboard(`{ArrowDown}${keys}`);

		expect(run.blocked).not.toHaveBeenCalled();
		expect(run.waiting).not.toHaveBeenCalled();
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(searchField()).toHaveValue('');
	});

	it('keeps inert rows in the arrow walk and runs the next usable one', async () => {
		await renderOpenCommand({ items: inertItems() });
		await waitForHighlight('Delete dashboard');

		await userEvent.keyboard('{ArrowDown}');
		await waitForHighlight('Export dashboard');

		await userEvent.keyboard('{ArrowDown}{Enter}');

		expect(run.open).toHaveBeenCalledOnce();
	});

	it('lets loading outrank disabled', async () => {
		await renderOpenCommand({
			items: [
				{
					type: 'item',
					value: 'both',
					label: 'Both',
					disabled: true,
					disabledTooltip: 'Disabled reason',
					loading: true,
					loadingTooltip: 'Loading reason',
					onClick: () => {},
				},
			],
		});

		const row = screen.getByTestId('command-item-both');

		expect(row).toHaveAttribute('data-loading');
		expect(row).not.toHaveAttribute('data-disabled');
		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Loading reason');
		});
		expect(queryOpenTooltip()).not.toHaveTextContent('Disabled reason');
	});
});

describe('Command inert row reasons', () => {
	it('shows the reason of the highlighted row and follows the highlight', async () => {
		await renderOpenCommand({ items: inertItems() });
		await waitForHighlight('Delete dashboard');

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Only the owner can delete it');
		});

		await userEvent.keyboard('{ArrowDown}');

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Preparing the export');
		});

		await userEvent.keyboard('{ArrowDown}');

		await waitFor(() => {
			expect(queryOpenTooltip()).toBeNull();
		});
	});

	it('shows the reason on hover', async () => {
		await renderOpenCommand({ items: inertItems() });

		await userEvent.hover(screen.getByTestId('command-item-waiting'));

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Preparing the export');
		});
	});

	it('reads the reason, then the shortcut, as the description', async () => {
		await renderOpenCommand({ items: inertItems() });
		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Only the owner can delete it');
		});

		const row = screen.getByTestId('command-item-blocked');

		expect(row).toHaveAccessibleDescription('Only the owner can delete it D');
		expect(row).toHaveAccessibleName('Delete dashboard');
	});

	it('shows no reason on a usable row, nor on a disabled row that is not disabled', async () => {
		await renderOpenCommand({
			items: [
				{
					type: 'item',
					value: 'idle',
					label: 'Idle',
					disabled: false,
					disabledTooltip: 'Never shown',
					onClick: () => {},
				},
			],
		});
		await waitForHighlight('Idle');

		const row = screen.getByTestId('command-item-idle');

		expect(row).not.toHaveAttribute('aria-disabled');
		expect(row).not.toHaveAttribute('aria-describedby');
		expect(queryOpenTooltip()).toBeNull();
	});
});

describe('Command loading row spinner', () => {
	it('puts the spinner in place of the prefix', async () => {
		await renderOpenCommand({
			items: [
				{
					type: 'item',
					value: 'export',
					label: 'Export',
					prefix: <Info data-testid="icon" />,
					shortcut: 'E',
					loading: true,
					loadingTooltip: undefined,
					onClick: () => {},
				},
			],
		});

		const prefix = screen.getByTestId('command-item-export-prefix');

		expect(prefix).toHaveAttribute('data-loading');
		expect(prefix.querySelector('[data-slot="spinner"]')).not.toBeNull();
		expect(screen.queryByTestId('icon')).toBeNull();
		expect(screen.getByTestId('command-item-export-suffix')).toHaveTextContent('E');
	});

	it('puts the spinner in the trailing slot of a row with no prefix, over the shortcut', async () => {
		await renderOpenCommand({
			items: [
				{
					type: 'item',
					value: 'export',
					label: 'Export',
					shortcut: 'E',
					loading: true,
					loadingTooltip: undefined,
					onClick: () => {},
				},
			],
		});

		const row = screen.getByTestId('command-item-export');
		const suffix = screen.getByTestId('command-item-export-suffix');

		expect(screen.queryByTestId('command-item-export-prefix')).toBeNull();
		expect(suffix).toHaveAttribute('data-loading');
		expect(suffix.querySelector('[data-slot="spinner"]')).not.toBeNull();
		expect(suffix).not.toHaveTextContent('E');
		expect(row).not.toHaveAttribute('aria-describedby');
	});
});

describe('Command inert row styles', () => {
	it('keeps the highlight fill on a disabled row and paints its label disabled', async () => {
		const root = document.documentElement.style;
		const tokens: Array<[string, string]> = [
			['--command-item-background-hover', 'rgb(10, 20, 30)'],
			['--command-item-label-hover', 'rgb(255, 255, 255)'],
			['--command-item-label-disabled', 'rgb(100, 100, 100)'],
		];

		for (const [property, value] of tokens) {
			root.setProperty(property, value);
		}

		try {
			await renderOpenCommand({ items: inertItems() });
			await waitForHighlight('Delete dashboard');

			const blocked = getComputedStyle(screen.getByTestId('command-item-blocked'));

			expect(blocked.backgroundColor).toBe('rgb(10, 20, 30)');
			expect(blocked.color).toBe('rgb(100, 100, 100)');
			expect(blocked.cursor).toBe('not-allowed');

			await userEvent.keyboard('{ArrowDown}');
			await waitForHighlight('Export dashboard');

			// A loading row keeps its own colours and dims instead.
			const waiting = getComputedStyle(screen.getByTestId('command-item-waiting'));

			expect(waiting.color).toBe('rgb(255, 255, 255)');
			expect(waiting.opacity).toBe('0.8');
			expect(waiting.cursor).toBe('not-allowed');
		} finally {
			for (const [property] of tokens) {
				root.removeProperty(property);
			}
		}
	});
});
