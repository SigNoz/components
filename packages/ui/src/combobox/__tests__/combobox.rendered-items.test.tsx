import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Combobox } from '../index.js';
import type { ComboboxItemType } from '../types.js';
import { FRAMEWORKS, openCombobox } from './combobox.test-utils.js';

const HOSTS: ComboboxItemType[] = Array.from({ length: 500 }, (_, index) => {
	const name = `host-${String(index + 1).padStart(3, '0')}`;

	return { type: 'item', value: name, label: name };
});

describe('Combobox onRenderedItemsChange', () => {
	it('reports every item row once the popup opens, and nothing before', async () => {
		const onRenderedItemsChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				onRenderedItemsChange={onRenderedItemsChange}
			/>,
		);

		expect(onRenderedItemsChange).not.toHaveBeenCalled();

		await openCombobox();

		expect(onRenderedItemsChange).toHaveBeenCalledTimes(1);
		expect(onRenderedItemsChange).toHaveBeenLastCalledWith(['react', 'vue', 'angular', 'svelte']);
	});

	it('reports the rows the search keeps, and leaves out hints, the create row and custom values', async () => {
		const onRenderedItemsChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				multiple
				allowCreate
				defaultValue={['ember']}
				items={[
					{ type: 'hint', value: 'scope', label: 'scope:', insertValue: 'scope:' },
					{
						type: 'group',
						value: 'popular',
						label: 'Popular',
						items: [
							{ type: 'item', value: 'react', label: 'React' },
							{ type: 'item', value: 'preact', label: 'Preact' },
						],
					},
					{ type: 'separator', value: 'sep' },
					{ type: 'item', value: 'vue', label: 'Vue' },
				]}
				onRenderedItemsChange={onRenderedItemsChange}
			/>,
		);
		await openCombobox();

		expect(onRenderedItemsChange).toHaveBeenLastCalledWith(['react', 'preact', 'vue']);

		await userEvent.keyboard('reac');

		expect(screen.getByRole('option', { name: 'Create "reac"' })).toBeInTheDocument();
		expect(onRenderedItemsChange).toHaveBeenLastCalledWith(['react', 'preact']);
	});

	it('does not report the same rows twice in a row', async () => {
		const onRenderedItemsChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				multiple
				items={FRAMEWORKS}
				onRenderedItemsChange={onRenderedItemsChange}
			/>,
		);
		await openCombobox();

		// A pick re-renders the list with the same rows.
		await userEvent.click(screen.getByRole('option', { name: 'Vue' }));

		expect(onRenderedItemsChange).toHaveBeenCalledTimes(1);
	});

	it('reports nothing while closed, and again when the popup opens again', async () => {
		const onRenderedItemsChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				onRenderedItemsChange={onRenderedItemsChange}
			/>,
		);
		await openCombobox();
		await userEvent.keyboard('vu');

		expect(onRenderedItemsChange).toHaveBeenCalledTimes(3);
		expect(onRenderedItemsChange).toHaveBeenLastCalledWith(['vue']);

		// Closing clears the query, which brings every row back into the list Base UI keeps mounted
		// after the popup closes. Nobody sees them, so nothing is reported.
		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
		});

		expect(onRenderedItemsChange).toHaveBeenCalledTimes(3);

		await openCombobox();

		expect(onRenderedItemsChange).toHaveBeenCalledTimes(4);
		expect(onRenderedItemsChange).toHaveBeenLastCalledWith(['react', 'vue', 'angular', 'svelte']);
	});

	it('does not report while loading', async () => {
		const onRenderedItemsChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				loading
				onRenderedItemsChange={onRenderedItemsChange}
			/>,
		);
		await openCombobox();

		expect(onRenderedItemsChange).not.toHaveBeenCalled();
	});

	describe('virtualized', () => {
		it('reports only the mounted slice', async () => {
			const onRenderedItemsChange = vi.fn();
			render(
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Framework"
					items={HOSTS}
					virtualized
					onRenderedItemsChange={onRenderedItemsChange}
				/>,
			);
			await openCombobox();

			await waitFor(() => {
				expect(onRenderedItemsChange).toHaveBeenCalled();
			});

			const reported: string[] = onRenderedItemsChange.mock.lastCall?.[0] ?? [];
			const mounted = screen.getAllByRole('option').map((option) => option.textContent);

			expect(reported[0]).toBe('host-001');
			expect(reported.length).toBeLessThan(50);
			expect(reported).toEqual(mounted);
		});

		it('reports the new slice when the list scrolls', async () => {
			const onRenderedItemsChange = vi.fn();
			render(
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Framework"
					items={HOSTS}
					virtualized
					onRenderedItemsChange={onRenderedItemsChange}
				/>,
			);
			await openCombobox();

			// `ArrowUp` from the first row wraps to the last one, which scrolls the list to its end.
			await userEvent.keyboard('{ArrowDown}{ArrowUp}');

			await waitFor(() => {
				expect(onRenderedItemsChange.mock.lastCall?.[0]).toContain('host-500');
			});
			expect(onRenderedItemsChange.mock.lastCall?.[0]).not.toContain('host-001');
		});
	});
});
