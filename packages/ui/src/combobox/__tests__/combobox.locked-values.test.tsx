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
	{
		type: 'item',
		value: 'vue',
		label: 'Vue',
		removeDisabled: true,
		removeDisabledTooltip: 'Owned by admin',
	},
	{ type: 'item', value: 'angular', label: 'Angular' },
];

function trigger(): HTMLElement {
	return screen.getByRole('combobox', { name: 'Framework' });
}

describe('Combobox locked values', () => {
	it('drops the remove button from the chip of a removeDisabled row', () => {
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

	it('keeps adding and removing apart on a row that does not change', async () => {
		// Editor: cannot be removed. Admin: cannot be added again. Viewer: free.
		const items: ComboboxItemType[] = [
			{ type: 'item', value: 'viewer', label: 'Viewer' },
			{
				type: 'item',
				value: 'editor',
				label: 'Editor',
				removeDisabled: true,
				removeDisabledTooltip: 'Cannot detach',
			},
			{
				type: 'item',
				value: 'admin',
				label: 'Admin',
				disabled: true,
				disabledTooltip: 'Cannot attach',
			},
		];

		function Roles(): ReactNode {
			const [value, setValue] = useState(['editor', 'admin']);

			return (
				<Combobox
					placeholder="Select a role..."
					searchInputProps={{ placeholder: 'Search' }}
					multiple
					aria-label="Framework"
					testId="cb"
					value={value}
					onChange={setValue}
					items={items}
				/>
			);
		}

		render(<Roles />);

		expect(screen.queryByTestId('cb-chip-editor-remove')).toBeNull();
		expect(screen.getByTestId('cb-chip-admin-remove')).toBeInTheDocument();

		await openCombobox();

		// Selected: removing is what counts, so Editor is locked and Admin is not.
		expect(screen.getByRole('option', { name: 'Editor' })).toHaveAttribute('aria-disabled', 'true');
		expect(screen.getByRole('option', { name: 'Admin' })).not.toHaveAttribute('aria-disabled');

		await userEvent.click(screen.getByRole('option', { name: 'Admin' }));

		await waitFor(() => {
			expect(screen.queryByTestId('cb-chip-admin')).toBeNull();
		});
		// Not selected any more: adding is what counts, so Admin is locked now.
		expect(screen.getByRole('option', { name: 'Admin' })).toHaveAttribute('aria-disabled', 'true');

		await userEvent.click(screen.getByRole('option', { name: 'Admin' }));
		await userEvent.click(screen.getByRole('option', { name: 'Editor' }));
		await userEvent.click(screen.getByRole('option', { name: 'Viewer' }));

		await waitFor(() => {
			expect(screen.getByTestId('cb-chip-viewer')).toBeInTheDocument();
		});
		expect(screen.queryByTestId('cb-chip-admin')).toBeNull();
		expect(screen.getByTestId('cb-chip-editor')).toBeInTheDocument();
	});

	it('locks the chip of a removeDisabled row once it is picked', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={ITEMS}
				testId="cb"
			/>,
		);
		await openCombobox();

		expect(screen.getByRole('option', { name: 'Vue' })).not.toHaveAttribute('aria-disabled');

		await userEvent.click(screen.getByRole('option', { name: 'Vue' }));

		await waitFor(() => {
			expect(screen.getByTestId('cb-chip-vue')).toHaveAttribute('data-disabled');
		});
		expect(screen.queryByTestId('cb-chip-vue-remove')).toBeNull();
		expect(screen.getByRole('option', { name: 'Vue' })).toHaveAttribute('aria-disabled', 'true');
	});

	it('ignores disabled on a selected row, which only stops it being picked', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={[
					{ type: 'item', value: 'react', label: 'React', disabled: true, disabledTooltip: 'No' },
					{ type: 'item', value: 'vue', label: 'Vue' },
				]}
				defaultValue={['react', 'vue']}
				onChange={onChange}
				allowClear
				testId="cb"
			/>,
		);

		expect(screen.getByTestId('cb-chip-react-remove')).toBeInTheDocument();

		await userEvent.click(screen.getByTestId('cb-clear'));

		expect(onChange).toHaveBeenLastCalledWith([]);
	});
});
