import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from '../index.js';
import { FRAMEWORKS, openSelect } from './select.test-utils.js';

describe('Select selection', () => {
	it('picks a row, reports a string and closes', async () => {
		const onChange = vi.fn();
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				onChange={onChange}
			/>,
		);
		const listbox = await openSelect();

		await userEvent.click(within(listbox).getByRole('option', { name: 'Vue' }));

		expect(onChange).toHaveBeenCalledWith('vue');
		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		expect(document.querySelector('[data-slot="select-value"]')).toHaveTextContent('Vue');
	});

	it('marks the selected row', async () => {
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue="vue"
			/>,
		);
		const listbox = await openSelect();

		expect(within(listbox).getByRole('option', { name: 'Vue' })).toHaveAttribute(
			'aria-selected',
			'true',
		);
		expect(within(listbox).getByRole('option', { name: 'React' })).toHaveAttribute(
			'aria-selected',
			'false',
		);
	});

	it('follows a controlled value and leaves it to the parent', async () => {
		const onChange = vi.fn();
		const { rerender } = render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value="react"
				onChange={onChange}
			/>,
		);
		const listbox = await openSelect();

		await userEvent.click(within(listbox).getByRole('option', { name: 'Vue' }));

		expect(onChange).toHaveBeenCalledWith('vue');
		expect(document.querySelector('[data-slot="select-value"]')).toHaveTextContent('React');

		rerender(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value="angular"
				onChange={onChange}
			/>,
		);

		expect(document.querySelector('[data-slot="select-value"]')).toHaveTextContent('Angular');

		rerender(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value={undefined}
				onChange={onChange}
			/>,
		);

		expect(document.querySelector('[data-slot="select-placeholder"]')).toHaveTextContent(
			'Select a framework...',
		);
	});

	it('closes and shows the pick when the parent stores it', async () => {
		function Controlled() {
			const [value, setValue] = useState<string | undefined>(undefined);

			return (
				<Select
					placeholder="Select a framework..."
					aria-label="Framework"
					items={FRAMEWORKS}
					value={value}
					onChange={setValue}
				/>
			);
		}
		render(<Controlled />);
		const listbox = await openSelect();

		await userEvent.click(within(listbox).getByRole('option', { name: 'Vue' }));

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		expect(document.querySelector('[data-slot="select-value"]')).toHaveTextContent('Vue');
	});

	it('reads an empty string as no value', async () => {
		const { unmount } = render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value=""
			/>,
		);

		expect(document.querySelector('[data-slot="select-placeholder"]')).toHaveTextContent(
			'Select a framework...',
		);
		const listbox = await openSelect();

		expect(within(listbox).queryAllByRole('option', { selected: true })).toHaveLength(0);
		unmount();

		render(
			<Select
				multiple
				placeholder="Select frameworks..."
				aria-label="Frameworks"
				items={FRAMEWORKS}
				value={['', 'react']}
			/>,
		);

		expect(document.querySelectorAll('[data-slot="select-chip"]')).toHaveLength(1);
	});

	it('toggles rows of a multiple select and stays open', async () => {
		const onChange = vi.fn();
		render(
			<Select
				multiple
				placeholder="Select frameworks..."
				aria-label="Frameworks"
				items={FRAMEWORKS}
				defaultValue={['react']}
				onChange={onChange}
				testId="select"
			/>,
		);
		const listbox = await openSelect('Frameworks');

		expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
		expect(within(listbox).getByRole('option', { name: 'React' })).toHaveAttribute(
			'aria-selected',
			'true',
		);

		await userEvent.click(within(listbox).getByRole('option', { name: 'Vue' }));

		expect(onChange).toHaveBeenLastCalledWith(['react', 'vue']);
		expect(screen.getByRole('listbox')).toBeInTheDocument();

		await userEvent.click(within(listbox).getByRole('option', { name: 'React' }));

		expect(onChange).toHaveBeenLastCalledWith(['vue']);
		expect(within(listbox).getAllByRole('option', { selected: true })).toEqual([
			within(listbox).getByRole('option', { name: 'Vue' }),
		]);
		expect(screen.getByTestId('select-chip-vue')).toBeInTheDocument();
		expect(screen.queryByTestId('select-chip-react')).toBeNull();
	});

	it('removes a value from its chip without opening the popup', async () => {
		function Controlled() {
			const [value, setValue] = useState(['react', 'vue']);

			return (
				<Select
					multiple
					placeholder="Select frameworks..."
					aria-label="Frameworks"
					items={FRAMEWORKS}
					value={value}
					onChange={setValue}
					testId="select"
				/>
			);
		}
		render(<Controlled />);

		await userEvent.click(screen.getByTestId('select-chip-react-remove'));

		expect(screen.queryByTestId('select-chip-react')).toBeNull();
		expect(screen.getByTestId('select-chip-vue')).toBeInTheDocument();
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('reports [] once every chip is removed', async () => {
		const onChange = vi.fn();
		render(
			<Select
				multiple
				placeholder="Select frameworks..."
				aria-label="Frameworks"
				items={FRAMEWORKS}
				defaultValue={['react']}
				onChange={onChange}
				testId="select"
			/>,
		);

		await userEvent.click(screen.getByTestId('select-chip-react-remove'));

		expect(onChange).toHaveBeenCalledWith([]);
		expect(document.querySelector('[data-slot="select-placeholder"]')).toHaveTextContent(
			'Select frameworks...',
		);
	});

	it('does not pick a disabled row', async () => {
		const onChange = vi.fn();
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={[
					{ type: 'item', value: 'react', label: 'React' },
					{
						type: 'item',
						value: 'vue',
						label: 'Vue',
						disabled: true,
						disabledTooltip: 'Not supported yet',
					},
				]}
				onChange={onChange}
			/>,
		);
		const listbox = await openSelect();
		const row = within(listbox).getByRole('option', { name: 'Vue' });

		expect(row).toHaveAttribute('aria-disabled', 'true');

		await userEvent.click(row);

		expect(onChange).not.toHaveBeenCalled();
	});
});
