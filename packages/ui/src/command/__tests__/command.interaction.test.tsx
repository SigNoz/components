import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	ACTIONS,
	CommandHarness,
	highlightedOption,
	optionNames,
	renderOpenCommand,
	searchField,
} from './command.test-utils.js';

beforeEach(() => {
	for (const action of Object.values(ACTIONS)) {
		action.mockClear();
	}
});

describe('Command opening and closing', () => {
	it('moves the focus to the field on open and back to the opener on close', async () => {
		render(<CommandHarness />);
		const opener = screen.getByRole('button', { name: 'Open palette' });

		await userEvent.click(opener);
		await waitFor(() => {
			expect(searchField()).toHaveFocus();
		});

		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
		await waitFor(() => {
			expect(opener).toHaveFocus();
		});
	});

	it('calls onOpenChange(false) on Escape', async () => {
		const onOpenChange = vi.fn();
		await renderOpenCommand({ onOpenChange });

		await userEvent.keyboard('{Escape}');

		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});

	it('calls onOpenChange(false) on a click outside', async () => {
		const onOpenChange = vi.fn();
		await renderOpenCommand({ onOpenChange });

		const backdrop = document.querySelector('[data-slot="command-backdrop"]');

		if (backdrop === null) {
			throw new Error('No backdrop rendered');
		}

		await userEvent.click(backdrop);

		expect(onOpenChange).toHaveBeenCalledWith(false);
		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});
});

describe('Command keyboard', () => {
	it('highlights the first row on open', async () => {
		await renderOpenCommand();

		await waitFor(() => {
			expect(highlightedOption()).toHaveTextContent('Go to Home');
		});
		expect(searchField()).toHaveAttribute('aria-activedescendant', highlightedOption()?.id);
	});

	it('wraps the highlight at both ends', async () => {
		await renderOpenCommand();
		await waitFor(() => {
			expect(highlightedOption()).toHaveTextContent('Go to Home');
		});

		await userEvent.keyboard('{ArrowUp}');
		expect(highlightedOption()).toHaveTextContent('Members');

		await userEvent.keyboard('{ArrowDown}');
		expect(highlightedOption()).toHaveTextContent('Go to Home');

		await userEvent.keyboard('{ArrowDown}');
		expect(highlightedOption()).toHaveTextContent('Go to Dashboards');
	});

	it('runs the highlighted row on Enter, then closes', async () => {
		const onOpenChange = vi.fn();
		await renderOpenCommand({ onOpenChange });
		await waitFor(() => {
			expect(highlightedOption()).toHaveTextContent('Go to Home');
		});

		await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');

		expect(ACTIONS.logs).toHaveBeenCalledOnce();
		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});

	it.each([
		['Ctrl', '{Control>}{Enter}{/Control}'],
		['Shift', '{Shift>}{Enter}{/Shift}'],
		['Meta', '{Meta>}{Enter}{/Meta}'],
		['Alt', '{Alt>}{Enter}{/Alt}'],
	])('runs the highlighted row on %s+Enter, as cmdk does', async (_modifier, keys) => {
		const onOpenChange = vi.fn();
		await renderOpenCommand({ onOpenChange });
		await waitFor(() => {
			expect(highlightedOption()).toHaveTextContent('Go to Home');
		});

		await userEvent.keyboard(`{ArrowDown}${keys}`);

		expect(ACTIONS.dashboards).toHaveBeenCalledOnce();
		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
	});

	it('leaves Home and End with a modifier to the field, so Shift+Home selects the query', async () => {
		await renderOpenCommand();
		await userEvent.type(searchField(), 'go');
		await userEvent.keyboard('{ArrowDown}');
		expect(highlightedOption()).toHaveTextContent('Go to Dashboards');

		for (const init of [
			{ key: 'Home', shiftKey: true },
			{ key: 'End', shiftKey: true },
			{ key: 'Home', ctrlKey: true },
			{ key: 'End', metaKey: true },
		]) {
			// `fireEvent` returns false when a handler called `preventDefault()`.
			expect(fireEvent.keyDown(searchField(), init)).toBe(true);
			expect(highlightedOption()).toHaveTextContent('Go to Dashboards');
		}
	});

	it('goes to the first and the last row on Home and End, and leaves the caret', async () => {
		await renderOpenCommand();
		await userEvent.type(searchField(), 'go');
		const input = searchField() as HTMLInputElement;

		await userEvent.keyboard('{End}');
		expect(highlightedOption()).toHaveTextContent('Logs Explorer');
		expect(input.selectionStart).toBe(2);

		await userEvent.keyboard('{Home}');
		expect(highlightedOption()).toHaveTextContent('Go to Home');
		expect(input.selectionStart).toBe(2);

		await userEvent.keyboard('{Meta>}{ArrowDown}{/Meta}');
		expect(input.selectionStart).toBe(2);
	});

	it('moves one row on Ctrl+N and Ctrl+J, and back on Ctrl+P and Ctrl+K', async () => {
		await renderOpenCommand();
		await waitFor(() => {
			expect(highlightedOption()).toHaveTextContent('Go to Home');
		});

		await userEvent.keyboard('{Control>}n{/Control}');
		expect(highlightedOption()).toHaveTextContent('Go to Dashboards');

		await userEvent.keyboard('{Control>}j{/Control}');
		expect(highlightedOption()).toHaveTextContent('Logs Explorer');

		await userEvent.keyboard('{Control>}p{/Control}');
		expect(highlightedOption()).toHaveTextContent('Go to Dashboards');

		await userEvent.keyboard('{Control>}k{/Control}{Control>}k{/Control}');
		expect(highlightedOption()).toHaveTextContent('Members');
		expect(searchField()).toHaveValue('');
	});

	it('goes to the last and the first row on Meta with an arrow', async () => {
		await renderOpenCommand();
		await waitFor(() => {
			expect(highlightedOption()).toHaveTextContent('Go to Home');
		});

		await userEvent.keyboard('{Meta>}{ArrowDown}{/Meta}');
		expect(highlightedOption()).toHaveTextContent('Members');

		await userEvent.keyboard('{Meta>}{ArrowUp}{/Meta}');
		expect(highlightedOption()).toHaveTextContent('Go to Home');
	});

	it('goes to the first row of the next or the previous group on Alt with an arrow', async () => {
		await renderOpenCommand();
		await waitFor(() => {
			expect(highlightedOption()).toHaveTextContent('Go to Home');
		});

		await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
		expect(highlightedOption()).toHaveTextContent(/^Dashboards$/);

		// No group below Settings, so the key moves one row.
		await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
		expect(highlightedOption()).toHaveTextContent('Members');

		await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}');
		expect(highlightedOption()).toHaveTextContent('Go to Home');

		await userEvent.keyboard('{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{/Alt}');
		expect(highlightedOption()).toHaveTextContent('Go to Dashboards');
	});

	it('marks Ctrl+K as handled, so a listener that toggles the palette can skip it', async () => {
		const handled: boolean[] = [];
		const listener = (event: KeyboardEvent) => {
			if (event.key === 'k' && event.ctrlKey) {
				handled.push(event.defaultPrevented);
			}
		};
		document.addEventListener('keydown', listener);
		await renderOpenCommand();

		await userEvent.keyboard('{Control>}k{/Control}');
		document.removeEventListener('keydown', listener);

		expect(handled).toEqual([true]);
	});

	it('leaves the keys of an IME composition alone', async () => {
		await renderOpenCommand();
		await waitFor(() => {
			expect(highlightedOption()).toHaveTextContent('Go to Home');
		});

		fireEvent.keyDown(searchField(), { key: 'n', ctrlKey: true, isComposing: true });

		expect(highlightedOption()).toHaveTextContent('Go to Home');
	});
});

describe('Command picking', () => {
	it('runs a clicked row, then closes', async () => {
		const onOpenChange = vi.fn();
		await renderOpenCommand({ onOpenChange });

		await userEvent.click(screen.getByRole('option', { name: 'Members' }));

		expect(ACTIONS.members).toHaveBeenCalledOnce();
		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
	});

	it('closes when onClick throws', async () => {
		const onOpenChange = vi.fn();
		const failure = new Error('boom');
		const onError = vi.fn((event: ErrorEvent) => {
			if (event.error === failure) {
				event.preventDefault();
			}
		});
		window.addEventListener('error', onError);

		await renderOpenCommand({
			onOpenChange,
			items: [
				{
					type: 'item',
					value: 'broken',
					label: 'Broken',
					onClick: () => {
						throw failure;
					},
				},
			],
		});

		await userEvent.click(screen.getByRole('option', { name: 'Broken' }));
		window.removeEventListener('error', onError);

		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});
});

describe('Command search', () => {
	it('ranks a word start first and highlights it', async () => {
		await renderOpenCommand();

		await userEvent.type(searchField(), 'dshb');

		expect(optionNames()).toEqual(['Dashboards', 'Go to Dashboards']);
		await waitFor(() => {
			expect(highlightedOption()).toHaveTextContent('Dashboards');
		});
		expect(screen.getAllByRole('group').map((group) => group.getAttribute('data-testid'))).toEqual([
			'command-group-settings',
			'command-group-navigation',
		]);
	});

	it('matches searchMetadata', async () => {
		await renderOpenCommand();

		await userEvent.type(searchField(), 'zebra');

		expect(optionNames()).toEqual(['Logs Explorer']);
	});

	it('shows nothing when nothing matches and noContent is null', async () => {
		await renderOpenCommand({ noContent: null });

		await userEvent.type(searchField(), 'xyz');

		expect(screen.queryAllByRole('option')).toHaveLength(0);
		expect(screen.queryByTestId('command-empty')).not.toBeInTheDocument();
	});

	it('keeps a row outside any group mounted when a group before it fills', async () => {
		const loose = { type: 'item', value: 'alone', label: 'Alone', onClick: () => {} } as const;
		const { rerender } = await renderOpenCommand({
			items: [{ type: 'group', value: 'recent', label: 'Recent', items: [] }, loose],
		});
		const row = screen.getByRole('option', { name: 'Alone' });

		rerender(
			<CommandHarness
				defaultOpen
				items={[
					{
						type: 'group',
						value: 'recent',
						label: 'Recent',
						items: [{ type: 'item', value: 'home', label: 'Home', onClick: () => {} }],
					},
					loose,
				]}
			/>,
		);

		expect(screen.getByRole('option', { name: 'Alone' })).toBe(row);
	});

	it('shows noContent when nothing matches', async () => {
		await renderOpenCommand({ noContent: 'Nothing here' });

		await userEvent.type(searchField(), 'xyz');

		expect(screen.queryAllByRole('option')).toHaveLength(0);
		expect(screen.getByTestId('command-empty')).toHaveTextContent('Nothing here');
	});

	it('reports each query and clears it on close', async () => {
		const onChange = vi.fn();
		render(<CommandHarness defaultOpen searchInputProps={{ onChange }} />);
		await waitFor(() => {
			expect(searchField()).toHaveFocus();
		});

		await userEvent.type(searchField(), 'lo');
		expect(onChange.mock.calls).toEqual([['l'], ['lo']]);

		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(onChange).toHaveBeenLastCalledWith('');
		});

		await userEvent.click(screen.getByRole('button', { name: 'Open palette' }));
		await waitFor(() => {
			expect(searchField()).toHaveValue('');
		});
		expect(optionNames()).toEqual([
			'Go to Home',
			'Go to Dashboards',
			'Logs Explorer',
			'Dashboards',
			'Members',
		]);
	});

	it('reports the cleared query when the app closes the palette', async () => {
		const onChange = vi.fn();
		render(<CommandHarness defaultOpen searchInputProps={{ onChange }} />);
		await waitFor(() => {
			expect(searchField()).toHaveFocus();
		});
		await userEvent.type(searchField(), 'x');

		screen.getByRole('button', { name: 'Close from the app', hidden: true }).click();

		await waitFor(() => {
			expect(onChange).toHaveBeenLastCalledWith('');
		});
	});

	it('does not report a close over an empty query', async () => {
		const onChange = vi.fn();
		await renderOpenCommand({ searchInputProps: { onChange } });

		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});

		expect(onChange).not.toHaveBeenCalled();
	});

	it('keeps every row in order with filter: false', async () => {
		const onChange = vi.fn();
		await renderOpenCommand({ searchInputProps: { filter: false, onChange } });

		await userEvent.type(searchField(), 'xyz');

		expect(onChange).toHaveBeenLastCalledWith('xyz');
		expect(optionNames()).toHaveLength(5);
		expect(screen.queryByTestId('command-empty')).not.toBeInTheDocument();
	});

	it('shows noContent with filter: false only when items is empty and not loading', async () => {
		const { rerender } = await renderOpenCommand({
			items: [],
			searchInputProps: { filter: false, loading: true },
		});

		expect(screen.queryByTestId('command-empty')).not.toBeInTheDocument();

		rerender(
			<CommandHarness
				defaultOpen
				items={[]}
				searchInputProps={{ filter: false, loading: false }}
			/>,
		);

		expect(screen.getByTestId('command-empty')).toHaveTextContent('No results found :/');
	});
});
