import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Combobox } from '../index.js';
import type { ComboboxItemType } from '../types.js';
import { openCombobox } from './combobox.test-utils.js';

// `vue` is selected and locked, `react` is selected and free.
const ITEMS: ComboboxItemType[] = [
	{ type: 'item', value: 'react', label: 'React' },
	{ type: 'item', value: 'vue', label: 'Vue', disabled: true, disabledTooltip: 'Owned by admin' },
	{ type: 'item', value: 'angular', label: 'Angular' },
];

function trigger(): HTMLElement {
	return screen.getByRole('combobox', { name: 'Framework' });
}

describe('Combobox locked values', () => {
	it('drops the remove button from the chip of a disabled row', () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={ITEMS}
				defaultValue={['vue', 'react']}
				testId="cb"
			/>,
		);

		expect(screen.getByTestId('cb-chip-vue')).toHaveAttribute('data-disabled');
		expect(screen.queryByTestId('cb-chip-vue-remove')).toBeNull();
		expect(screen.getByTestId('cb-chip-react')).not.toHaveAttribute('data-disabled');
		expect(screen.getByTestId('cb-chip-react-remove')).toBeInTheDocument();
	});

	it('shows the row reason on the locked chip, apart from the trigger reason', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={ITEMS}
				defaultValue={['vue', 'react']}
				disabled={false}
				disabledTooltip="Pick a project first"
				testId="cb"
			/>,
		);

		await userEvent.hover(screen.getByTestId('cb-chip-vue'));

		expect(await screen.findByText('Owned by admin')).toBeInTheDocument();
		expect(screen.queryByText('Pick a project first')).toBeNull();
	});

	it('shows only the trigger reason while the whole combobox is disabled', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={ITEMS}
				defaultValue={['vue', 'react']}
				disabled
				disabledTooltip="Pick a project first"
				testId="cb"
			/>,
		);

		await userEvent.hover(screen.getByTestId('cb-chip-vue'));

		expect(await screen.findByText('Pick a project first')).toBeInTheDocument();
		expect(screen.queryByText('Owned by admin')).toBeNull();
	});

	it('keeps locked values when the clear button is pressed', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={ITEMS}
				defaultValue={['react', 'vue', 'angular']}
				onChange={onChange}
				allowClear
				testId="cb"
			/>,
		);

		await userEvent.click(screen.getByTestId('cb-clear'));

		expect(onChange).toHaveBeenLastCalledWith(['vue']);
		expect(screen.getByTestId('cb-chip-vue')).toBeInTheDocument();
		expect(screen.queryByTestId('cb-chip-react')).toBeNull();
		expect(screen.queryByTestId('cb-clear')).toBeNull();
	});

	it('hides the clear button while every selected value is locked', () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={ITEMS}
				defaultValue={['vue']}
				allowClear
				testId="cb"
			/>,
		);

		expect(screen.queryByTestId('cb-clear')).toBeNull();
	});

	it('keeps locked values on Delete and Backspace', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={ITEMS}
				defaultValue={['react', 'vue']}
				onChange={onChange}
				allowClear
			/>,
		);
		trigger().focus();
		await userEvent.keyboard('{Backspace}');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenLastCalledWith(['vue']);

		await userEvent.keyboard('{Delete}');

		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('does not untick a locked row in the popup, and still adds other rows', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={ITEMS}
				defaultValue={['vue']}
				onChange={onChange}
			/>,
		);
		await openCombobox();

		await userEvent.click(screen.getByRole('option', { name: 'Vue' }));

		expect(onChange).not.toHaveBeenCalled();

		await userEvent.click(screen.getByRole('option', { name: 'Angular' }));

		expect(onChange).toHaveBeenLastCalledWith(['vue', 'angular']);
	});

	it('keeps a single locked value when another row is picked', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={ITEMS}
				defaultValue="vue"
				onChange={onChange}
				allowClear
				testId="cb"
			/>,
		);

		expect(screen.queryByTestId('cb-clear')).toBeNull();

		await openCombobox();
		await userEvent.click(screen.getByRole('option', { name: 'Angular' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(trigger()).toHaveTextContent('Vue');
	});

	it('lets a selected value with no row in items be removed', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={ITEMS}
				defaultValue={['vue', 'ember']}
				onChange={onChange}
				testId="cb"
			/>,
		);

		await userEvent.click(screen.getByTestId('cb-chip-ember-remove'));

		expect(onChange).toHaveBeenLastCalledWith(['vue']);
	});

	it('locks adding and removing apart when disabled follows the selection', async () => {
		const canAttach = new Set(['react']);
		const canDetach = new Set(['vue']);
		const rows = [
			{ value: 'react', label: 'React' },
			{ value: 'vue', label: 'Vue' },
			{ value: 'angular', label: 'Angular' },
		];

		function Roles(): ReactNode {
			const [value, setValue] = useState(['vue', 'angular']);

			return (
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					multiple
					aria-label="Framework"
					testId="cb"
					value={value}
					onChange={setValue}
					items={rows.map((row): ComboboxItemType => {
						const selected = value.includes(row.value);
						const denied = selected ? !canDetach.has(row.value) : !canAttach.has(row.value);

						return denied
							? {
									type: 'item',
									...row,
									disabled: true,
									disabledTooltip: selected ? 'Cannot detach' : 'Cannot attach',
								}
							: { type: 'item', ...row };
					})}
				/>
			);
		}

		render(<Roles />);

		expect(screen.getByTestId('cb-chip-vue-remove')).toBeInTheDocument();
		expect(screen.queryByTestId('cb-chip-angular-remove')).toBeNull();

		await userEvent.click(screen.getByTestId('cb-chip-vue-remove'));

		expect(screen.queryByTestId('cb-chip-vue')).toBeNull();

		await openCombobox();

		expect(screen.getByRole('option', { name: 'Vue' })).toHaveAttribute('aria-disabled', 'true');

		await userEvent.click(screen.getByRole('option', { name: 'Vue' }));
		await userEvent.click(screen.getByRole('option', { name: 'React' }));

		await waitFor(() => {
			expect(screen.getByTestId('cb-chip-react')).toBeInTheDocument();
		});
		expect(screen.queryByTestId('cb-chip-vue')).toBeNull();
		expect(screen.getByTestId('cb-chip-angular')).toBeInTheDocument();
	});
});
