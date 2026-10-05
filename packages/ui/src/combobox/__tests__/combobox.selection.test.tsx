import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Combobox } from '../index.js';
import type { ComboboxItemType } from '../types.js';
import { FRAMEWORKS, openCombobox } from './combobox.test-utils.js';

function trigger(): HTMLElement {
	return screen.getByRole('combobox', { name: 'Framework' });
}

describe('Combobox single selection', () => {
	it('reports the picked value and closes', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				onChange={onChange}
			/>,
		);
		await openCombobox();

		await userEvent.click(screen.getByRole('option', { name: 'Vue' }));

		expect(onChange).toHaveBeenCalledWith('vue');
		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		expect(trigger()).toHaveTextContent('Vue');
	});

	it('shows the placeholder while nothing is selected', () => {
		render(
			<Combobox
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				placeholder="Pick one"
			/>,
		);

		expect(trigger()).toHaveTextContent('Pick one');
		expect(trigger().querySelector('[data-slot="combobox-placeholder"]')).not.toBeNull();
	});

	it('starts from defaultValue and keeps its own state', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue="svelte"
			/>,
		);

		expect(trigger()).toHaveTextContent('Svelte');

		await openCombobox();
		await userEvent.click(screen.getByRole('option', { name: 'React' }));

		await waitFor(() => {
			expect(trigger()).toHaveTextContent('React');
		});
	});

	it('follows a controlled value, even when it is undefined', async () => {
		const onChange = vi.fn();
		const { rerender } = render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				value={undefined}
				onChange={onChange}
			/>,
		);
		await openCombobox();
		await userEvent.click(screen.getByRole('option', { name: 'Vue' }));

		expect(onChange).toHaveBeenCalledWith('vue');
		expect(trigger()).not.toHaveTextContent('Vue');

		rerender(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				value="angular"
				onChange={onChange}
			/>,
		);
		expect(trigger()).toHaveTextContent('Angular');
	});

	it('marks the selected row', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue="vue"
			/>,
		);
		await openCombobox();

		expect(screen.getByRole('option', { name: 'Vue' })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('option', { name: 'React' })).toHaveAttribute('aria-selected', 'false');
	});

	it('shows the displayValue of the row in the trigger', () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[{ type: 'item', value: '25', label: 'Auto (25)', displayValue: '25' }]}
				defaultValue="25"
			/>,
		);

		expect(trigger()).toHaveTextContent(/^25$/);
	});

	it('hands the selected row to the displayValue prop, and undefined when nothing is selected', () => {
		const displayValue = vi.fn((item?: { value: string }) => (item ? `#${item.value}` : 'None'));
		const { rerender } = render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				displayValue={displayValue}
			/>,
		);

		expect(trigger()).toHaveTextContent('None');
		expect(displayValue).toHaveBeenLastCalledWith(undefined);

		rerender(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				displayValue={displayValue}
				value="vue"
			/>,
		);

		expect(trigger()).toHaveTextContent('#vue');
	});

	it('shows the prefix of the selected row before the value, and none while nothing is selected', () => {
		const items: ComboboxItemType[] = [
			{ type: 'item', value: 'react', label: 'React', prefix: <svg data-testid="react-icon" /> },
			{ type: 'item', value: 'vue', label: 'Vue' },
		];
		const { rerender } = render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={items}
				value="react"
			/>,
		);

		const prefix = trigger().querySelector('[data-slot="combobox-value-prefix"]');
		expect(prefix).toContainElement(screen.getByTestId('react-icon'));
		expect(prefix?.nextElementSibling).toHaveAttribute('data-slot', 'combobox-value');

		for (const value of ['vue', undefined]) {
			rerender(
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Framework"
					items={items}
					value={value}
				/>,
			);

			expect(trigger().querySelector('[data-slot="combobox-value-prefix"]')).toBeNull();
		}
	});

	it('drops the row prefix when the displayValue prop decides the trigger', () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[{ type: 'item', value: 'react', label: 'React', prefix: <svg /> }]}
				defaultValue="react"
				displayValue={(item) => item?.value}
			/>,
		);

		expect(trigger().querySelector('[data-slot="combobox-value-prefix"]')).toBeNull();
		expect(trigger()).toHaveTextContent(/^react$/);
	});

	it('shows a selected value that is not in items, and lists it under Custom', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue="solid"
				testId="cb"
			/>,
		);

		expect(trigger()).toHaveTextContent('solid');

		await openCombobox();
		const custom = screen.getByTestId('cb-custom-solid');

		expect(custom).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByText('Custom')).toBeInTheDocument();
	});

	it('falls back to <No label> for a row whose label renders nothing', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[{ type: 'item', value: 'blank', label: '' }]}
			/>,
		);
		await openCombobox();

		const label = screen.getByText('<No label>');

		expect(label).toHaveAttribute('data-empty-label');
	});

	it('does not pick a disabled row', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[
					{
						type: 'item',
						value: 'react',
						label: 'React',
						disabled: true,
						disabledTooltip: 'Not available',
					},
				]}
				onChange={onChange}
			/>,
		);
		await openCombobox();

		const row = screen.getByRole('option', { name: 'React' });
		await userEvent.click(row);

		expect(onChange).not.toHaveBeenCalled();
		expect(row).toHaveAttribute('aria-disabled', 'true');
	});

	it.each([false, true])(
		'picks a row from a letter typed on the closed trigger (virtualized: %s)',
		async (virtualized) => {
			const onChange = vi.fn();
			render(
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Framework"
					items={FRAMEWORKS}
					virtualized={virtualized}
					onChange={onChange}
				/>,
			);
			trigger().focus();

			await userEvent.keyboard('v');

			expect(onChange).toHaveBeenCalledWith('vue');
		},
	);

	it.each([false, true])(
		'does not pick a disabled row from a letter typed on the closed trigger (virtualized: %s)',
		async (virtualized) => {
			const onChange = vi.fn();
			render(
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Framework"
					items={[
						{ type: 'item', value: 'react', label: 'React' },
						{
							type: 'item',
							value: 'vue',
							label: 'Vue',
							disabled: true,
							disabledTooltip: 'Not available',
						},
					]}
					virtualized={virtualized}
					onChange={onChange}
				/>,
			);
			trigger().focus();

			await userEvent.keyboard('v');

			expect(onChange).not.toHaveBeenCalled();
			expect(trigger()).not.toHaveTextContent('Vue');
		},
	);
});

describe('Combobox multiple selection', () => {
	function Controlled({ initial = [] }: { initial?: string[] }) {
		const [values, setValues] = useState(initial);

		return (
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={FRAMEWORKS}
				value={values}
				onChange={setValues}
				testId="cb"
			/>
		);
	}

	it('keeps row prefixes out of the chips', () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={[{ type: 'item', value: 'react', label: 'React', prefix: <svg /> }]}
				defaultValue={['react']}
			/>,
		);

		expect(screen.getByText('React')).toBeInTheDocument();
		expect(trigger().querySelector('[data-slot="combobox-value-prefix"]')).toBeNull();
	});

	it('toggles values and stays open', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={FRAMEWORKS}
				onChange={onChange}
			/>,
		);
		await openCombobox();

		await userEvent.click(screen.getByRole('option', { name: 'React' }));
		await userEvent.click(screen.getByRole('option', { name: 'Vue' }));

		expect(onChange).toHaveBeenLastCalledWith(['react', 'vue']);
		expect(screen.getByRole('listbox')).toBeInTheDocument();

		await userEvent.click(screen.getByRole('option', { name: 'React' }));

		expect(onChange).toHaveBeenLastCalledWith(['vue']);
	});

	it('shows one chip per value, in the order they were picked', () => {
		render(<Controlled initial={['vue', 'react']} />);

		const chips = within(trigger()).getAllByText(/Vue|React/);

		expect(chips.map((chip) => chip.textContent)).toEqual(['Vue', 'React']);
	});

	it('removes a value from its chip without opening the popup', async () => {
		render(<Controlled initial={['vue', 'react']} />);

		await userEvent.click(screen.getByTestId('cb-chip-vue-remove'));

		expect(screen.queryByTestId('cb-chip-vue')).toBeNull();
		expect(screen.getByTestId('cb-chip-react')).toBeInTheDocument();
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('names the chip remove button after the value', () => {
		render(<Controlled initial={['vue']} />);

		expect(screen.getByRole('button', { name: 'Remove Vue' })).toHaveAttribute('tabindex', '-1');
	});

	it('collapses the chips past maxDisplayedPills into a +N chip', () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue={['react', 'vue', 'angular']}
				maxDisplayedPills={1}
				testId="cb"
			/>,
		);

		expect(screen.getByTestId('cb-chip-react')).toBeInTheDocument();
		expect(screen.queryByTestId('cb-chip-vue')).toBeNull();
		expect(screen.getByTestId('cb-chip-overflow')).toHaveTextContent('+2');
	});

	it('does not nest a button inside a button', () => {
		render(<Controlled initial={['vue']} />);

		expect(trigger().tagName).toBe('DIV');
		expect(trigger().querySelector('button')).not.toBeNull();
	});

	it('ticks the checkbox of every selected row', async () => {
		render(<Controlled initial={['vue']} />);
		await openCombobox();

		expect(screen.getByRole('option', { name: 'Vue' })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
	});

	it('clears the query after a pick and keeps the popup open', async () => {
		render(<Controlled />);
		await openCombobox();

		await userEvent.keyboard('vu');
		await userEvent.click(screen.getByRole('option', { name: 'Vue' }));

		await waitFor(() => {
			expect(screen.getByRole('combobox', { name: 'Search' })).toHaveValue('');
		});
		expect(screen.getAllByRole('option')).toHaveLength(FRAMEWORKS.length);
	});
});

describe('Combobox groups and separators', () => {
	const GROUPED: ComboboxItemType[] = [
		{
			type: 'group',
			value: 'frontend',
			label: 'Frontend',
			items: [
				{ type: 'item', value: 'react', label: 'React' },
				{ type: 'item', value: 'vue', label: 'Vue' },
			],
		},
		{ type: 'separator', value: 'between' },
		{
			type: 'group',
			value: 'backend',
			label: 'Backend',
			items: [{ type: 'item', value: 'go', label: 'Go' }],
		},
	];

	it('renders each group with its heading, named by it', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={GROUPED}
				testId="cb"
			/>,
		);
		await openCombobox();

		const frontend = screen.getByRole('group', { name: 'Frontend' });

		expect(within(frontend).getAllByRole('option')).toHaveLength(2);
		expect(screen.getByTestId('cb-group-frontend')).toBe(frontend);
		// Base UI gives a separator inside a listbox `role="presentation"`.
		expect(document.querySelectorAll('[data-slot="combobox-separator"]')).toHaveLength(1);
	});

	it('drops a group whose rows are all filtered out, and the separator next to it', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={GROUPED}
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('go');

		expect(screen.queryByRole('group', { name: 'Frontend' })).toBeNull();
		expect(screen.getByRole('group', { name: 'Backend' })).toBeInTheDocument();
		expect(document.querySelector('[data-slot="combobox-separator"]')).toBeNull();
	});
});
