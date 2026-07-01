import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../tooltip/index.js';
import { ComboboxSimple } from './combobox-simple.js';
import { defaultItems, renderWithProviders, setupMocks } from './combobox-simple.test-utils.js';

setupMocks();

describe('ComboboxSimple single-select mode', () => {
	it('shows items when dropdown is opened', () => {
		renderWithProviders(<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />);
		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Vue' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Angular' })).toBeInTheDocument();
	});

	it('calls onChange when item is selected', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple items={defaultItems} onChange={onChange} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'Vue' }));

		expect(onChange).toHaveBeenCalledWith('vue');
	});

	it('closes dropdown after selection in single mode', () => {
		renderWithProviders(<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();

		fireEvent.click(screen.getByRole('option', { name: 'React' }));
		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});

	it('clears input after selection in single mode', () => {
		renderWithProviders(<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'rea' } });
		expect(input).toHaveValue('rea');

		fireEvent.click(screen.getByRole('option', { name: 'React' }));

		fireEvent.click(screen.getByTestId('combo'));
		const inputAfter = screen.getByPlaceholderText('Select an option...');
		expect(inputAfter).toHaveValue('');
	});

	it('displays selected value in trigger via defaultValue', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} defaultValue="react" testId="combo" withPortal={false} />
		);
		expect(screen.getByTestId('combo')).toHaveTextContent('React');
	});

	it('displays selected value in trigger via controlled value', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} value="angular" testId="combo" withPortal={false} />
		);
		expect(screen.getByTestId('combo')).toHaveTextContent('Angular');
	});

	it('uses displayValue from item when provided', () => {
		const items = [{ value: 'node', label: <span>Node.js</span>, displayValue: 'Node.js' }];
		renderWithProviders(
			<ComboboxSimple items={items} defaultValue="node" testId="combo" withPortal={false} />
		);
		expect(screen.getByTestId('combo')).toHaveTextContent('Node.js');
	});

	it('supports custom displayValue callback', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				defaultValue="react"
				displayValue={(item) => (item ? `${item.value} ✓` : 'Choose...')}
				testId="combo"
				withPortal={false}
			/>
		);
		expect(screen.getByTestId('combo')).toHaveTextContent('react ✓');
	});

	it('displays single-select custom value when defaultValue not in items', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				defaultValue="not-in-items"
				testId="combo"
				withPortal={false}
			/>
		);
		expect(screen.getByTestId('combo')).toHaveTextContent('not-in-items');
	});

	it('passes undefined to displayValue when nothing selected', () => {
		const displayValue = vi.fn((item) => (item ? `${item.value}` : 'choose…'));
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				displayValue={displayValue}
				testId="combo"
				withPortal={false}
			/>
		);
		expect(displayValue).toHaveBeenCalledWith(undefined);
		expect(screen.getByTestId('combo')).toHaveTextContent('choose…');
	});

	it('updates when controlled value changes', () => {
		function Controlled() {
			const [value, setValue] = useState('react');
			return (
				<TooltipProvider>
					<ComboboxSimple items={defaultItems} value={value} testId="combo" withPortal={false} />
					<button onClick={() => setValue('vue')}>Change</button>
				</TooltipProvider>
			);
		}

		render(<Controlled />);
		expect(screen.getByTestId('combo')).toHaveTextContent('React');

		fireEvent.click(screen.getByText('Change'));
		expect(screen.getByTestId('combo')).toHaveTextContent('Vue');
	});

	it('closes dropdown and focuses trigger when pressing Shift+Tab on input', () => {
		renderWithProviders(<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />);

		const trigger = screen.getByTestId('combo');
		fireEvent.click(trigger);

		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.keyDown(input, { key: 'Tab', shiftKey: true });

		expect(screen.queryByRole('option')).not.toBeInTheDocument();
		expect(document.activeElement).toBe(trigger);
	});
});

describe('ComboboxSimple multi-select mode', () => {
	it('shows pills for selected values', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				defaultValue={['react', 'vue']}
				testId="combo"
				withPortal={false}
			/>
		);
		expect(screen.getByText('React')).toBeInTheDocument();
		expect(screen.getByText('Vue')).toBeInTheDocument();
	});

	it('calls onChange with array on selection', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'Angular' }));

		expect(onChange).toHaveBeenCalledWith(['angular']);
	});

	it('toggles selection when clicking already selected item', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				defaultValue={['react']}
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'React' }));

		expect(onChange).toHaveBeenCalledWith([]);
	});

	it('keeps dropdown open after selection in multi mode', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'React' }));

		expect(screen.getByRole('option', { name: 'Vue' })).toBeInTheDocument();
	});

	it('clears input after selection in multi mode', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'rea' } });
		expect(input).toHaveValue('rea');

		fireEvent.click(screen.getByRole('option', { name: 'React' }));

		expect(input).toHaveValue('');
		expect(screen.getByRole('option', { name: 'Vue' })).toBeInTheDocument();
	});

	it('removes item when clicking pill remove button', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				defaultValue={['react', 'vue']}
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		const reactPill = screen
			.getByText('React')
			.closest('[data-slot="combobox-pill"]') as HTMLElement;
		const removeButton = within(reactPill).getByRole('button');
		fireEvent.click(removeButton);

		expect(onChange).toHaveBeenCalledWith(['vue']);
	});

	it('respects maxDisplayedPills', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				defaultValue={['react', 'vue', 'angular']}
				maxDisplayedPills={2}
				testId="combo"
				withPortal={false}
			/>
		);

		expect(screen.getByText('React')).toBeInTheDocument();
		expect(screen.getByText('Vue')).toBeInTheDocument();
		expect(screen.getByText('+1')).toBeInTheDocument();
		expect(screen.queryAllByText('Angular')).toHaveLength(0);
	});

	it('shows all when maxDisplayedPills is undefined', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				defaultValue={['react', 'vue', 'angular']}
				testId="combo"
				withPortal={false}
			/>
		);

		expect(screen.getByText('React')).toBeInTheDocument();
		expect(screen.getByText('Vue')).toBeInTheDocument();
		expect(screen.getByText('Angular')).toBeInTheDocument();
		expect(screen.queryByText('+1')).not.toBeInTheDocument();
	});

	it('opens dropdown when pressing Enter on trigger', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				defaultValue={['react']}
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.keyDown(trigger, { key: 'Enter' });

		expect(screen.getByRole('option', { name: 'Vue' })).toBeInTheDocument();
	});

	it('opens dropdown when pressing Space on trigger', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				defaultValue={['react']}
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.keyDown(trigger, { key: ' ' });

		expect(screen.getByRole('option', { name: 'Vue' })).toBeInTheDocument();
	});

	it('closes dropdown and focuses trigger when pressing Shift+Tab on input', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.click(trigger);

		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.keyDown(input, { key: 'Tab', shiftKey: true });

		expect(screen.queryByRole('option')).not.toBeInTheDocument();
		expect(document.activeElement).toBe(trigger);
	});
});

describe('ComboboxSimple multi-select resolveLabel', () => {
	it('renders raw value in pill when selected value not in items', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				value={['react', 'rogue-value']}
				testId="combo"
				withPortal={false}
			/>
		);
		expect(screen.getByText('React')).toBeInTheDocument();
		expect(screen.getByText('rogue-value')).toBeInTheDocument();
	});

	it('falls back to label when displayValue is undefined', () => {
		const items = [
			{ value: 'a', label: 'Alpha' },
			{ value: 'b', label: 'Beta' },
		];
		renderWithProviders(
			<ComboboxSimple items={items} multiple value={['a']} testId="combo" withPortal={false} />
		);
		expect(screen.getByText('Alpha')).toBeInTheDocument();
	});

	it('prefers displayValue over label when both present', () => {
		const items = [{ value: 'a', label: <span>Alpha-icon</span>, displayValue: 'Alpha' }];
		renderWithProviders(
			<ComboboxSimple items={items} multiple value={['a']} testId="combo" withPortal={false} />
		);
		expect(screen.getByText('Alpha')).toBeInTheDocument();
		expect(screen.queryByText('Alpha-icon')).not.toBeInTheDocument();
	});

	it('renders ReactNode label in pill when no displayValue', () => {
		const items = [{ value: 'a', label: <span data-testid="rich-label">Rich</span> }];
		renderWithProviders(
			<ComboboxSimple items={items} multiple value={['a']} testId="combo" withPortal={false} />
		);
		expect(screen.getByTestId('rich-label')).toBeInTheDocument();
	});

	it('falls back to value when item has no displayValue and no label', () => {
		const items = [{ value: 'a', label: undefined as unknown as React.ReactNode }];
		renderWithProviders(
			<ComboboxSimple items={items} multiple value={['a']} testId="combo" withPortal={false} />
		);
		const pill = document.querySelector('[data-slot="combobox-pill"]');
		expect(pill).toHaveTextContent('a');
	});

	it('overflow tooltip uses resolved labels for hidden values', () => {
		const items = [
			{ value: 'a', label: 'Alpha' },
			{ value: 'b', label: 'Beta', displayValue: 'Beta-d' },
		];
		renderWithProviders(
			<ComboboxSimple
				items={items}
				multiple
				defaultValue={['a', 'b', 'custom-x']}
				maxDisplayedPills={1}
				testId="combo"
				withPortal={false}
			/>
		);
		expect(screen.getByText('+2')).toBeInTheDocument();
		const overflow = document.querySelector('[data-slot="combobox-pill-overflow"]');
		expect(overflow).toBeInTheDocument();
	});

	it('does not crash when value array contains undefined', () => {
		expect(() => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					multiple
					value={[undefined as unknown as string, 'react']}
					testId="combo"
					withPortal={false}
				/>
			);
		}).not.toThrow();
		expect(screen.getByText('React')).toBeInTheDocument();
	});

	it('filters empty string values from selectedValues', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				value={['', 'react']}
				testId="combo"
				withPortal={false}
			/>
		);
		const pills = document.querySelectorAll('[data-slot="combobox-pill"]');
		expect(pills).toHaveLength(1);
		expect(screen.getByText('React')).toBeInTheDocument();
	});

	it('filters non-string values (objects/numbers) from selectedValues', () => {
		expect(() => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					multiple
					value={[{ id: 'react' } as unknown as string, 42 as unknown as string, 'react']}
					testId="combo"
					withPortal={false}
				/>
			);
		}).not.toThrow();
		const pills = document.querySelectorAll('[data-slot="combobox-pill"]');
		expect(pills).toHaveLength(1);
	});

	it('removes pill for value not in items list', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				defaultValue={['react', 'unknown-tag']}
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);
		const unknownPill = screen
			.getByText('unknown-tag')
			.closest('[data-slot="combobox-pill"]') as HTMLElement;
		const removeButton = within(unknownPill).getByRole('button');
		fireEvent.click(removeButton);
		expect(onChange).toHaveBeenCalledWith(['react']);
	});

	it('updates pill label when items prop changes', () => {
		const initialItems = [{ value: 'x', label: 'Original' }];
		const updatedItems = [{ value: 'x', label: 'Updated' }];

		const { rerender } = renderWithProviders(
			<ComboboxSimple
				items={initialItems}
				multiple
				value={['x']}
				testId="combo"
				withPortal={false}
			/>
		);
		expect(screen.getByText('Original')).toBeInTheDocument();

		rerender(
			<TooltipProvider>
				<ComboboxSimple
					items={updatedItems}
					multiple
					value={['x']}
					testId="combo"
					withPortal={false}
				/>
			</TooltipProvider>
		);
		expect(screen.getByText('Updated')).toBeInTheDocument();
	});

	it('resolves labels from groups when value matches grouped item', () => {
		const groups = [
			{ heading: 'Front', items: [{ value: 'a', label: 'Alpha' }] },
			{ heading: 'Back', items: [{ value: 'b', label: 'Beta' }] },
		];
		renderWithProviders(
			<ComboboxSimple
				groups={groups}
				multiple
				value={['a', 'b']}
				testId="combo"
				withPortal={false}
			/>
		);
		expect(screen.getByText('Alpha')).toBeInTheDocument();
		expect(screen.getByText('Beta')).toBeInTheDocument();
	});
});

describe('ComboboxSimple controlled mode multi-select', () => {
	it('adds to existing controlled values', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				value={['react']}
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'Vue' }));

		expect(onChange).toHaveBeenCalledWith(['react', 'vue']);
	});

	it('uses controlled value for toggle, not stale internal state', () => {
		const onChange = vi.fn();
		function Controlled() {
			const [values, setValues] = useState<string[]>(['react']);
			return (
				<TooltipProvider>
					<ComboboxSimple
						items={defaultItems}
						multiple
						value={values}
						onChange={(v) => {
							onChange(v);
							setValues(v as string[]);
						}}
						testId="combo"
						withPortal={false}
					/>
					<button onClick={() => setValues(['vue', 'angular'])}>External Change</button>
				</TooltipProvider>
			);
		}

		render(<Controlled />);

		fireEvent.click(screen.getByText('External Change'));

		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'Vue' }));

		expect(onChange).toHaveBeenLastCalledWith(['angular']);
	});

	it('respects external value changes', () => {
		const onChange = vi.fn();
		function Controlled() {
			const [values, setValues] = useState<string[]>(['react', 'vue']);
			return (
				<TooltipProvider>
					<ComboboxSimple
						items={defaultItems}
						multiple
						value={values}
						onChange={(v) => {
							onChange(v);
							setValues(v as string[]);
						}}
						testId="combo"
						withPortal={false}
					/>
					<button onClick={() => setValues([])}>Clear</button>
				</TooltipProvider>
			);
		}

		render(<Controlled />);

		fireEvent.click(screen.getByText('Clear'));

		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'Angular' }));
		expect(onChange).toHaveBeenLastCalledWith(['angular']);
	});
});

describe('ComboboxSimple uncontrolled mode', () => {
	it('manages state internally when no value prop', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple items={defaultItems} onChange={onChange} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'Vue' }));

		expect(screen.getByTestId('combo')).toHaveTextContent('Vue');
		expect(onChange).toHaveBeenCalledWith('vue');
	});

	it('respects defaultValue in uncontrolled mode', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				defaultValue="angular"
				testId="combo"
				withPortal={false}
			/>
		);

		expect(screen.getByTestId('combo')).toHaveTextContent('Angular');
	});

	it('multi-select uncontrolled updates internally', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'React' }));
		fireEvent.click(screen.getByRole('option', { name: 'Vue' }));

		const pills = screen.getAllByRole('button', { name: /Remove/ });
		expect(pills).toHaveLength(2);
	});
});
