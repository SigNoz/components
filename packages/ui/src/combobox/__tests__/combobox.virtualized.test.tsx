import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Combobox } from '../index.js';
import type { ComboboxItemType } from '../types.js';
import { openCombobox, searchInput } from './combobox.test-utils.js';

const HOSTS: ComboboxItemType[] = Array.from({ length: 500 }, (_, index) => {
	const name = `host-${String(index + 1).padStart(3, '0')}`;

	return { type: 'item', value: name, label: name };
});

const GROUPED: ComboboxItemType[] = [
	{
		type: 'group',
		value: 'east',
		label: 'us-east-1',
		items: HOSTS.slice(0, 250) as Extract<ComboboxItemType, { type: 'item' }>[],
	},
	{
		type: 'group',
		value: 'west',
		label: 'eu-west-1',
		items: HOSTS.slice(250) as Extract<ComboboxItemType, { type: 'item' }>[],
	},
];

describe('Combobox virtualized', () => {
	it('mounts only the rows in view', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={HOSTS}
				virtualized
			/>,
		);
		await openCombobox();

		const mounted = screen.getAllByRole('option');

		expect(mounted.length).toBeGreaterThan(0);
		expect(mounted.length).toBeLessThan(50);
		expect(mounted[0]).toHaveAttribute('aria-setsize', '500');
		expect(mounted[0]).toHaveAttribute('aria-posinset', '1');
	});

	it('picks a row with the mouse', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={HOSTS}
				virtualized
				onChange={onChange}
			/>,
		);
		await openCombobox();

		await userEvent.click(screen.getByRole('option', { name: 'host-003' }));

		expect(onChange).toHaveBeenCalledWith('host-003');
	});

	it('scrolls the highlighted row into view from the keyboard', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={HOSTS}
				virtualized
				onChange={onChange}
			/>,
		);
		await openCombobox();

		// `ArrowUp` from the first row wraps to the last one, far outside the mounted slice.
		await userEvent.keyboard('{ArrowDown}{ArrowUp}');

		const last = await screen.findByRole('option', { name: 'host-500' });

		await waitFor(() => {
			expect(last).toHaveAttribute('data-highlighted');
		});

		await userEvent.keyboard('{Enter}');

		expect(onChange).toHaveBeenCalledWith('host-500');
	});

	it('filters, and picks the first match with Enter', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={HOSTS}
				virtualized
				onChange={onChange}
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('host-42');

		expect(screen.getAllByRole('option')).toHaveLength(10);

		await userEvent.keyboard('{Enter}');

		expect(onChange).toHaveBeenCalledWith(['host-420']);
		expect(searchInput()).toHaveValue('');
	});

	it('marks only the last row, which carries no gap after it', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={HOSTS}
				virtualized
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('host-42');

		const rows = screen.getAllByRole('option').map((option) => option.closest('[data-index]'));

		expect(rows.at(-1)).toHaveAttribute('data-last');
		expect(rows.filter((row) => row?.hasAttribute('data-last'))).toHaveLength(1);
	});

	it('renders group headings as rows of the list', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={GROUPED}
				virtualized
			/>,
		);
		await openCombobox();

		expect(screen.getByText('us-east-1')).toHaveAttribute('data-slot', 'combobox-group-label');
	});

	it('shows the loading row in place of the list', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={HOSTS}
				virtualized
				loading
				testId="cb"
			/>,
		);
		await openCombobox();

		expect(screen.getByTestId('cb-loading')).toBeInTheDocument();
		expect(screen.queryAllByRole('option')).toHaveLength(0);
	});
});
