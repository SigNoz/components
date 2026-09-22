import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown } from '../index.js';
import type { DropdownItemType } from '../types.js';
import { openDropdown } from './dropdown.test-utils.js';

const ITEMS: DropdownItemType[] = [
	{ type: 'item', value: 'rename', label: 'Rename' },
	{ type: 'item', value: 'duplicate', label: 'Duplicate' },
	{ type: 'item', value: 'delete', label: 'Delete' },
];

function renderDropdown(props: Partial<Parameters<typeof Dropdown>[0]> = {}) {
	return render(
		<Dropdown side="bottom" align="start" items={ITEMS} testId="menu" {...props}>
			<button type="button">Actions</button>
		</Dropdown>,
	);
}

describe('Dropdown keyboard', () => {
	it('walks the rows with the arrow keys and wraps at both ends', async () => {
		renderDropdown();
		await openDropdown();

		await userEvent.keyboard('{ArrowDown}');
		await waitFor(() => {
			expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
		});

		await userEvent.keyboard('{ArrowUp}');
		await waitFor(() => {
			expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
		});

		await userEvent.keyboard('{ArrowDown}');
		await waitFor(() => {
			expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
		});
	});

	it('picks the highlighted row with Enter', async () => {
		const onClick = vi.fn();
		render(
			<Dropdown
				side="bottom"
				align="start"
				testId="menu"
				items={[{ type: 'item', value: 'rename', label: 'Rename', onClick }]}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);
		await openDropdown();

		await userEvent.keyboard('{ArrowDown}{Enter}');

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('closes one level at a time with Escape', async () => {
		render(
			<Dropdown
				side="bottom"
				align="start"
				testId="menu"
				items={[
					{
						type: 'submenu',
						value: 'export',
						label: 'Export',
						items: [{ type: 'item', value: 'csv', label: 'As CSV' }],
					},
				]}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Export' }));
		await screen.findByRole('menuitem', { name: 'As CSV' });

		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(screen.queryByRole('menuitem', { name: 'As CSV' })).toBeNull();
		});
		expect(screen.getByRole('menuitem', { name: 'Export' })).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(screen.queryByRole('menu')).toBeNull();
		});
	});

	it('keeps typed characters in the search field instead of running typeahead', async () => {
		renderDropdown({ searchInputProps: {} });
		await openDropdown();

		const field = screen.getByTestId('menu-search');
		await userEvent.click(field);
		await userEvent.keyboard('d');

		expect(field).toHaveValue('d');
		expect(field).toHaveFocus();
	});

	it('does nothing on Enter in the search field', async () => {
		const onClick = vi.fn();
		render(
			<Dropdown
				side="bottom"
				align="start"
				testId="menu"
				searchInputProps={{}}
				items={[{ type: 'item', value: 'rename', label: 'Rename', onClick }]}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);
		await openDropdown();

		await userEvent.click(screen.getByTestId('menu-search'));
		await userEvent.keyboard('{Enter}');

		expect(onClick).not.toHaveBeenCalled();
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('moves to the first row on ArrowDown and back to the field on ArrowUp', async () => {
		renderDropdown({ searchInputProps: {} });
		await openDropdown();

		const field = screen.getByTestId('menu-search');
		await userEvent.click(field);
		await userEvent.keyboard('{ArrowDown}');

		await waitFor(() => {
			expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
		});

		await userEvent.keyboard('{ArrowUp}');

		await waitFor(() => {
			expect(field).toHaveFocus();
		});
	});

	it('closes from the search field on Escape', async () => {
		renderDropdown({ searchInputProps: {} });
		await openDropdown();

		await userEvent.click(screen.getByTestId('menu-search'));
		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(screen.queryByRole('menu')).toBeNull();
		});
	});
});
