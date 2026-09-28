import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
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

describe('Dropdown interaction', () => {
	it('calls onClick and closes the menu', async () => {
		const onClick = vi.fn();
		renderDropdown([{ type: 'item', value: 'rename', label: 'Rename', onClick }]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));

		expect(onClick).toHaveBeenCalledTimes(1);
		await waitFor(() => {
			expect(screen.queryByRole('menu')).toBeNull();
		});
	});

	it('closes a menu whose row has no handler at all', async () => {
		renderDropdown([{ type: 'item', value: 'rename', label: 'Rename' }]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));

		await waitFor(() => {
			expect(screen.queryByRole('menu')).toBeNull();
		});
	});

	it('blocks a disabled row and keeps it reachable', async () => {
		const onClick = vi.fn();
		renderDropdown([
			{
				type: 'item',
				value: 'rename',
				label: 'Rename',
				onClick,
				disabled: true,
				disabledTooltip: 'Ask an admin',
			},
		]);
		await openDropdown();

		const row = screen.getByRole('menuitem', { name: 'Rename' });
		await userEvent.click(row);

		expect(onClick).not.toHaveBeenCalled();
		expect(row).toHaveAttribute('aria-disabled', 'true');
		expect(row).toHaveAttribute('data-disabled', 'true');
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('blocks a loading row, and loading outranks disabled', async () => {
		const onClick = vi.fn();
		renderDropdown([
			{
				type: 'item',
				value: 'rename',
				label: 'Rename',
				onClick,
				loading: true,
				loadingTooltip: 'Saving',
			},
		]);
		await openDropdown();

		const row = screen.getByRole('menuitem', { name: 'Rename' });
		await userEvent.click(row);

		expect(onClick).not.toHaveBeenCalled();
		expect(row).toHaveAttribute('data-loading', 'true');
		expect(row).not.toHaveAttribute('data-disabled');
	});

	it('reports a checkbox change and leaves the menu open', async () => {
		const onChange = vi.fn();
		renderDropdown([{ type: 'checkbox', name: 'pinned', label: 'Pinned', onChange }]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Pinned' }));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('reports a radio change as the picked value', async () => {
		const onChange = vi.fn();
		renderDropdown([
			{
				type: 'radio-group',
				name: 'sort',
				defaultValue: 'name',
				onChange,
				items: [
					{ label: 'By name', value: 'name' },
					{ label: 'By date', value: 'date' },
				],
			},
		]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitemradio', { name: 'By date' }));

		expect(onChange).toHaveBeenCalledWith('date');
	});

	it('blocks every option of a disabled radio group', async () => {
		const onChange = vi.fn();
		renderDropdown([
			{
				type: 'radio-group',
				name: 'sort',
				onChange,
				disabled: true,
				disabledTooltip: 'Sorting is locked',
				items: [{ label: 'By name', value: 'name' }],
			},
		]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitemradio', { name: 'By name' }));

		expect(onChange).not.toHaveBeenCalled();
	});

	it('opens a submenu and picks a row inside it', async () => {
		const onClick = vi.fn();
		renderDropdown([
			{
				type: 'submenu',
				value: 'export',
				label: 'Export',
				items: [{ type: 'item', value: 'csv', label: 'As CSV', onClick }],
			},
		]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Export' }));

		const row = await screen.findByRole('menuitem', { name: 'As CSV' });
		await userEvent.click(row);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('opens the empty row and warns for a submenu with no items', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		renderDropdown([{ type: 'submenu', value: 'export', label: 'Export', items: [] }]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Export' }));

		expect(await screen.findByTestId('menu-empty')).toBeInTheDocument();
		expect(warn).toHaveBeenCalledWith(
			'Dropdown: the submenu "export" has no items, showing the empty row.',
		);
		warn.mockRestore();
	});

	it('does not open a disabled submenu', async () => {
		renderDropdown([
			{
				type: 'submenu',
				value: 'export',
				label: 'Export',
				disabled: true,
				disabledTooltip: 'Nothing to export',
				items: [{ type: 'item', value: 'csv', label: 'As CSV' }],
			},
		]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Export' }));

		expect(screen.queryByRole('menuitem', { name: 'As CSV' })).toBeNull();
	});

	it('filters by label and by searchMetadata, and clears the query on close', async () => {
		render(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				testId="menu"
				searchInputProps={{ placeholder: 'Find' }}
				items={[
					{ type: 'item', value: 'rename', label: 'Rename' },
					{ type: 'item', value: 'delete', label: 'Delete' },
					{ type: 'item', value: 'pin', label: 'Pin', searchMetadata: 'rename bookmark' },
				]}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);
		await openDropdown();

		await userEvent.type(screen.getByTestId('menu-search'), 'rena');

		expect(screen.getAllByRole('menuitem')).toHaveLength(2);
		expect(screen.getByRole('menuitem', { name: 'Pin' })).toBeInTheDocument();
		expect(screen.queryByRole('menuitem', { name: 'Delete' })).toBeNull();

		await userEvent.keyboard('{Escape}');
		await openDropdown();

		expect(screen.getByTestId('menu-search')).toHaveValue('');
		expect(screen.getAllByRole('menuitem')).toHaveLength(3);
	});

	it('shows the empty row without warning when nothing matches', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				testId="menu"
				searchInputProps={{}}
				items={[{ type: 'item', value: 'rename', label: 'Rename' }]}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);
		await openDropdown();

		await userEvent.type(screen.getByTestId('menu-search'), 'zzz');

		expect(screen.getByTestId('menu-empty')).toBeInTheDocument();
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it('stops filtering when filter is false, and still reports the query', async () => {
		const onChange = vi.fn();
		render(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				testId="menu"
				searchInputProps={{ filter: false, onChange }}
				items={[
					{ type: 'item', value: 'rename', label: 'Rename' },
					{ type: 'item', value: 'delete', label: 'Delete' },
				]}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);
		await openDropdown();

		await userEvent.type(screen.getByTestId('menu-search'), 'ren');

		expect(screen.getAllByRole('menuitem')).toHaveLength(2);
		expect(onChange).toHaveBeenLastCalledWith('ren');
	});

	it('keeps a group whose rows match, and drops one whose rows do not', async () => {
		render(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				testId="menu"
				searchInputProps={{}}
				items={[
					{
						type: 'group',
						value: 'edit',
						label: 'Edit',
						items: [{ type: 'item', value: 'rename', label: 'Rename' }],
					},
					{
						type: 'group',
						value: 'danger',
						label: 'Danger',
						items: [{ type: 'item', value: 'delete', label: 'Delete' }],
					},
				]}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);
		await openDropdown();

		await userEvent.type(screen.getByTestId('menu-search'), 'rename');

		expect(screen.getByTestId('menu-group-edit')).toBeInTheDocument();
		expect(screen.queryByTestId('menu-group-danger')).toBeNull();
	});

	it('keeps every row of a submenu the query matched', async () => {
		render(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				testId="menu"
				searchInputProps={{}}
				items={[
					{
						type: 'submenu',
						value: 'export',
						label: 'Export',
						items: [
							{ type: 'item', value: 'csv', label: 'As CSV' },
							{ type: 'item', value: 'json', label: 'As JSON' },
						],
					},
				]}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);
		await openDropdown();

		await userEvent.type(screen.getByTestId('menu-search'), 'csv');
		await userEvent.click(screen.getByRole('menuitem', { name: 'Export' }));

		expect(await screen.findByRole('menuitem', { name: 'As CSV' })).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: 'As JSON' })).toBeInTheDocument();
	});

	it('closes the menu when a link row is picked', async () => {
		const onClick = vi.fn((event: MouseEvent) => {
			event.preventDefault();
		});
		renderDropdown([
			{
				type: 'link',
				value: 'docs',
				label: 'Documentation',
				render: <a href="/docs" onClick={onClick} />,
			},
		]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Documentation' }));

		expect(onClick).toHaveBeenCalledTimes(1);
		await waitFor(() => {
			expect(screen.queryByRole('menu')).toBeNull();
		});
	});

	it('reports opening and closing through onOpenChange', async () => {
		const onOpenChange = vi.fn();
		render(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				testId="menu"
				onOpenChange={onOpenChange}
				items={[{ type: 'item', value: 'rename', label: 'Rename' }]}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);

		await openDropdown();
		expect(onOpenChange).toHaveBeenLastCalledWith(true);

		await userEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));

		await waitFor(() => {
			expect(onOpenChange).toHaveBeenLastCalledWith(false);
		});
		expect(onOpenChange).toHaveBeenCalledTimes(2);
	});

	it('keeps a controlled checkbox in step with its prop', async () => {
		function Controlled() {
			const [pinned, setPinned] = useState(false);

			return (
				<Dropdown
					nativeButton
					side="bottom"
					align="start"
					testId="menu"
					items={[
						{
							type: 'checkbox',
							name: 'pinned',
							label: 'Pinned',
							value: pinned,
							onChange: setPinned,
						},
					]}
				>
					<button type="button">Actions</button>
				</Dropdown>
			);
		}

		render(<Controlled />);
		await openDropdown();

		const row = screen.getByRole('menuitemcheckbox', { name: 'Pinned' });
		expect(row).not.toBeChecked();

		await userEvent.click(row);

		expect(screen.getByRole('menuitemcheckbox', { name: 'Pinned' })).toBeChecked();
	});
	it('blocks a disabled or loading option of a radio group', async () => {
		const onChange = vi.fn();
		renderDropdown([
			{
				type: 'radio-group',
				name: 'sort',
				defaultValue: 'name',
				onChange,
				items: [
					{ label: 'By name', value: 'name' },
					{ label: 'By date', value: 'date', disabled: true, disabledTooltip: 'No dates' },
					{ label: 'By size', value: 'size', loading: true, loadingTooltip: 'Counting' },
				],
			},
		]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitemradio', { name: 'By date' }));
		await userEvent.click(screen.getByRole('menuitemradio', { name: 'By size' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('menuitemradio', { name: 'By name' })).toBeChecked();
	});

	it('keeps an uncontrolled checkbox and radio group across a close and a filter', async () => {
		render(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				testId="menu"
				searchInputProps={{}}
				items={[
					{ type: 'checkbox', name: 'pinned', label: 'Pinned', defaultValue: false },
					{
						type: 'radio-group',
						name: 'sort',
						defaultValue: 'name',
						items: [
							{ label: 'By name', value: 'name' },
							{ label: 'By date', value: 'date' },
						],
					},
				]}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Pinned' }));
		await userEvent.click(screen.getByRole('menuitemradio', { name: 'By date' }));
		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByRole('menu')).toBeNull();
		});
		await openDropdown();

		expect(screen.getByRole('menuitemcheckbox', { name: 'Pinned' })).toBeChecked();
		expect(screen.getByRole('menuitemradio', { name: 'By date' })).toBeChecked();

		await userEvent.type(screen.getByRole('textbox'), 'by');
		expect(screen.queryByRole('menuitemcheckbox', { name: 'Pinned' })).toBeNull();
		await userEvent.clear(screen.getByRole('textbox'));

		expect(screen.getByRole('menuitemcheckbox', { name: 'Pinned' })).toBeChecked();
	});

	it('reports the cleared query when the menu closes', async () => {
		const onChange = vi.fn();
		render(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				testId="menu"
				searchInputProps={{ filter: false, onChange }}
				items={[{ type: 'item', value: 'alpha', label: 'Alpha' }]}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);
		await openDropdown();

		await userEvent.type(screen.getByRole('textbox'), 'al');
		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(screen.queryByRole('menu')).toBeNull();
		});
		expect(onChange).toHaveBeenLastCalledWith('');
	});

	it('matches a label built from interpolated text as it reads on screen', async () => {
		const count = 5;
		render(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				testId="menu"
				searchInputProps={{}}
				items={[
					{ type: 'item', value: 'delete', label: <>Delete {count} rows</> },
					{ type: 'item', value: 'rename', label: 'Rename' },
				]}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);
		await openDropdown();

		await userEvent.type(screen.getByRole('textbox'), 'delete 5');

		expect(screen.getByRole('menuitem', { name: 'Delete 5 rows' })).toBeInTheDocument();
		expect(screen.queryByRole('menuitem', { name: 'Rename' })).toBeNull();
	});
});
