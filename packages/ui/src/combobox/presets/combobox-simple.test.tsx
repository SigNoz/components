import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../tooltip/index.js';
import { ComboboxSimple } from './combobox-simple.js';

// Mock ResizeObserver and scrollIntoView for cmdk
class ResizeObserverMock {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
}

beforeAll(() => {
	global.ResizeObserver = ResizeObserverMock;
	Element.prototype.scrollIntoView = vi.fn();
});

// Wrapper with providers
function renderWithProviders(ui: React.ReactElement) {
	return render(<TooltipProvider>{ui}</TooltipProvider>);
}

const defaultItems = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

describe('ComboboxSimple', () => {
	describe('rendering', () => {
		it('renders trigger button', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />
			);
			expect(screen.getByTestId('combo')).toBeInTheDocument();
		});

		it('renders trigger with placeholder text when no value selected', () => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					placeholder="Choose..."
					testId="combo"
					withPortal={false}
				/>
			);
			expect(screen.getByTestId('combo')).toHaveTextContent('Choose...');
		});

		it('applies testId to trigger', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} testId="my-combobox" withPortal={false} />
			);
			expect(screen.getByTestId('my-combobox')).toBeInTheDocument();
		});

		it('applies id to trigger', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} id="combo-id" testId="combo" withPortal={false} />
			);
			expect(screen.getByTestId('combo')).toHaveAttribute('id', 'combo-id');
		});

		it('applies className to trigger', () => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					className="custom-class"
					testId="combo"
					withPortal={false}
				/>
			);
			expect(screen.getByTestId('combo')).toHaveClass('custom-class');
		});

		it('applies style to trigger', () => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					style={{ width: '200px' }}
					testId="combo"
					withPortal={false}
				/>
			);
			expect(screen.getByTestId('combo')).toHaveStyle({ width: '200px' });
		});
	});

	describe('single-select mode', () => {
		it('shows items when dropdown is opened', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />
			);
			fireEvent.click(screen.getByTestId('combo'));

			expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
			expect(screen.getByRole('option', { name: 'Vue' })).toBeInTheDocument();
			expect(screen.getByRole('option', { name: 'Angular' })).toBeInTheDocument();
		});

		it('calls onChange when item is selected', () => {
			const onChange = vi.fn();
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					onChange={onChange}
					testId="combo"
					withPortal={false}
				/>
			);

			fireEvent.click(screen.getByTestId('combo'));
			fireEvent.click(screen.getByRole('option', { name: 'Vue' }));

			expect(onChange).toHaveBeenCalledWith('vue');
		});

		it('closes dropdown after selection in single mode', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();

			fireEvent.click(screen.getByRole('option', { name: 'React' }));
			expect(screen.queryByRole('option')).not.toBeInTheDocument();
		});

		it('displays selected value in trigger via defaultValue', () => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					defaultValue="react"
					testId="combo"
					withPortal={false}
				/>
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
	});

	describe('multi-select mode', () => {
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
			// Pills are shown inside the trigger
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
			// Angular should be hidden (only in overflow tooltip)
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
	});

	describe('groups', () => {
		const groups = [
			{
				heading: 'Frontend',
				items: [
					{ value: 'react', label: 'React' },
					{ value: 'vue', label: 'Vue' },
				],
			},
			{
				heading: 'Backend',
				items: [{ value: 'express', label: 'Express' }],
			},
		];

		it('renders groups with headings', () => {
			renderWithProviders(<ComboboxSimple groups={groups} testId="combo" withPortal={false} />);

			fireEvent.click(screen.getByTestId('combo'));
			expect(screen.getByText('Frontend')).toBeInTheDocument();
			expect(screen.getByText('Backend')).toBeInTheDocument();
			expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
			expect(screen.getByRole('option', { name: 'Express' })).toBeInTheDocument();
		});

		it('renders groups without headings when heading is omitted', () => {
			const noHeadingGroups = [
				{ items: [{ value: 'a', label: 'Alpha' }] },
				{ items: [{ value: 'b', label: 'Beta' }] },
			];

			renderWithProviders(
				<ComboboxSimple groups={noHeadingGroups} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument();
			expect(screen.getByRole('option', { name: 'Beta' })).toBeInTheDocument();
		});

		it('selects item from group correctly', () => {
			const onChange = vi.fn();
			renderWithProviders(
				<ComboboxSimple groups={groups} onChange={onChange} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			fireEvent.click(screen.getByRole('option', { name: 'Express' }));

			expect(onChange).toHaveBeenCalledWith('express');
		});
	});

	describe('allowCreate', () => {
		it('shows create option when typing new value', () => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					allowCreate
					multiple
					testId="combo"
					withPortal={false}
				/>
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');
			fireEvent.change(input, { target: { value: 'new-tag' } });

			expect(screen.getByText('Create "new-tag"')).toBeInTheDocument();
		});

		it('does not show create option for existing values', () => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					allowCreate
					multiple
					testId="combo"
					withPortal={false}
				/>
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');
			fireEvent.change(input, { target: { value: 'react' } });

			expect(screen.queryByText('Create "react"')).not.toBeInTheDocument();
		});

		it('creates new item when clicking create option', () => {
			const onChange = vi.fn();
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					allowCreate
					multiple
					onChange={onChange}
					testId="combo"
					withPortal={false}
				/>
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');
			fireEvent.change(input, { target: { value: 'custom' } });
			fireEvent.click(screen.getByText('Create "custom"'));

			expect(onChange).toHaveBeenCalledWith(['custom']);
		});

		it('supports custom create option render', () => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					allowCreate={(inputVal) => <span>Add "{inputVal}" as tag</span>}
					multiple
					testId="combo"
					withPortal={false}
				/>
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');
			fireEvent.change(input, { target: { value: 'mytag' } });

			expect(screen.getByText('Add "mytag" as tag')).toBeInTheDocument();
		});

		it('does not allow duplicate custom values', () => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					allowCreate
					multiple
					defaultValue={['existing']}
					testId="combo"
					withPortal={false}
				/>
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');
			fireEvent.change(input, { target: { value: 'existing' } });

			expect(screen.queryByText('Create "existing"')).not.toBeInTheDocument();
		});

		it('shows custom values in Custom group', () => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					allowCreate
					multiple
					defaultValue={['custom-tag']}
					testId="combo"
					withPortal={false}
				/>
			);

			fireEvent.click(screen.getByTestId('combo'));
			expect(screen.getByText('Custom')).toBeInTheDocument();
			expect(screen.getByRole('option', { name: 'custom-tag' })).toBeInTheDocument();
		});

		// Note: allowCreate in single-select mode doesn't work currently
		// because inputValue state is not tracked in single-select mode.
		// This would need to be fixed in the component itself.
	});

	describe('empty state', () => {
		it('shows empty placeholder when no results', () => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					emptyPlaceholder="Nothing found"
					testId="combo"
					withPortal={false}
				/>
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');
			fireEvent.change(input, { target: { value: 'nonexistent' } });

			expect(screen.getByText('Nothing found')).toBeInTheDocument();
		});

		it('uses default empty placeholder', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');
			fireEvent.change(input, { target: { value: 'xyz' } });

			expect(screen.getByText('No results found.')).toBeInTheDocument();
		});
	});

	describe('controlled mode multi-select', () => {
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

			// Should add vue to existing react
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

			// External change to ['vue', 'angular']
			fireEvent.click(screen.getByText('External Change'));

			// Toggle 'vue' off - should use controlled value ['vue', 'angular']
			fireEvent.click(screen.getByTestId('combo'));
			fireEvent.click(screen.getByRole('option', { name: 'Vue' }));

			// Should be ['angular'], not based on any stale state
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

			// Initial: ['react', 'vue'], clear externally
			fireEvent.click(screen.getByText('Clear'));

			// Now select angular - should use current controlled value (empty)
			fireEvent.click(screen.getByTestId('combo'));
			fireEvent.click(screen.getByRole('option', { name: 'Angular' }));
			expect(onChange).toHaveBeenLastCalledWith(['angular']);
		});
	});

	describe('DOM structure', () => {
		it('does not nest button inside button in multi-select mode', () => {
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
			// Trigger should not be a button when it contains pill buttons
			// OR pills should not contain buttons
			const nestedButtons = trigger.querySelectorAll('button');

			// If trigger is a button, it should not have nested buttons
			if (trigger.tagName === 'BUTTON') {
				expect(nestedButtons.length).toBe(0);
			}
		});
	});

	describe('uncontrolled mode', () => {
		it('manages state internally when no value prop', () => {
			const onChange = vi.fn();
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					onChange={onChange}
					testId="combo"
					withPortal={false}
				/>
			);

			fireEvent.click(screen.getByTestId('combo'));
			fireEvent.click(screen.getByRole('option', { name: 'Vue' }));

			// After selection, trigger should show the selected value
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

			// Pills should be visible - look for pill elements specifically
			const pills = screen.getAllByRole('button', { name: /Remove/ });
			expect(pills).toHaveLength(2);
		});
	});
});
