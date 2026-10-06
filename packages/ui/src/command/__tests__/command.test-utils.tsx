import { render, screen, waitFor } from '@testing-library/react';
import { type ReactNode, useState } from 'react';
import { expect, vi } from 'vitest';
import { Command } from '../command.js';
import type { CommandItemType, CommandSearchInputProps } from '../types.js';

export const ACTIONS = {
	home: vi.fn(),
	dashboards: vi.fn(),
	logs: vi.fn(),
	settings: vi.fn(),
	members: vi.fn(),
};

export const ITEMS: CommandItemType[] = [
	{
		type: 'group',
		value: 'navigation',
		label: 'Navigation',
		items: [
			{
				type: 'item',
				value: 'home',
				label: 'Go to Home',
				shortcut: 'Shift+H',
				onClick: () => ACTIONS.home(),
			},
			{
				type: 'item',
				value: 'go-dashboards',
				label: 'Go to Dashboards',
				onClick: () => ACTIONS.dashboards(),
			},
			{
				type: 'item',
				value: 'logs',
				label: 'Logs Explorer',
				searchMetadata: 'zebra',
				onClick: () => ACTIONS.logs(),
			},
		],
	},
	{
		type: 'group',
		value: 'settings',
		label: 'Settings',
		items: [
			{
				type: 'item',
				value: 'dashboards',
				label: 'Dashboards',
				onClick: () => ACTIONS.dashboards(),
			},
			{ type: 'item', value: 'members', label: 'Members', onClick: () => ACTIONS.members() },
		],
	},
];

export type CommandHarnessProps = {
	items?: CommandItemType[];
	searchInputProps?: Partial<CommandSearchInputProps>;
	noContent?: ReactNode;
	contentMaxWidth?: number | string;
	contentMaxHeight?: number | string;
	onOpenChange?: (open: boolean) => void;
	defaultOpen?: boolean;
};

/**
 * The palette as an app holds it: `open` in state, a button that opens it, and `onOpenChange`
 * writing back.
 */
export function CommandHarness({
	items = ITEMS,
	searchInputProps,
	noContent,
	contentMaxWidth,
	contentMaxHeight,
	onOpenChange,
	defaultOpen = false,
}: CommandHarnessProps): ReactNode {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<>
			<button type="button" onClick={() => setOpen(true)}>
				Open palette
			</button>
			<button type="button" onClick={() => setOpen(false)}>
				Close from the app
			</button>
			<Command
				label="Command palette"
				open={open}
				onOpenChange={(next) => {
					onOpenChange?.(next);
					setOpen(next);
				}}
				searchInputProps={{ placeholder: 'Search…', ...searchInputProps }}
				items={items}
				noContent={noContent}
				contentMaxWidth={contentMaxWidth}
				contentMaxHeight={contentMaxHeight}
				testId="command"
			/>
		</>
	);
}

export function searchField(): HTMLElement {
	return screen.getByRole('combobox', { name: 'Command palette' });
}

export function optionNames(): string[] {
	return screen
		.queryAllByRole('option')
		.map((option) => option.querySelector('[data-slot="command-item-label"]')?.textContent ?? '');
}

export function highlightedOption(): HTMLElement | null {
	return document.querySelector('[data-slot="command-item"][data-highlighted]');
}

/**
 * Renders the palette already open and waits for the field to take the focus.
 */
export async function renderOpenCommand(props: Omit<CommandHarnessProps, 'defaultOpen'> = {}) {
	const result = render(<CommandHarness defaultOpen {...props} />);

	await waitFor(() => {
		expect(searchField()).toHaveFocus();
	});

	return result;
}
