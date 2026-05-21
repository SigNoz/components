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

		it('uses inputPlaceholder for search input when provided', () => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					placeholder="Choose..."
					inputPlaceholder="Search items..."
					testId="combo"
					withPortal={false}
				/>
			);
			fireEvent.click(screen.getByTestId('combo'));
			expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
		});

		it('falls back to placeholder for search input when inputPlaceholder not provided', () => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					placeholder="Choose..."
					testId="combo"
					withPortal={false}
				/>
			);
			fireEvent.click(screen.getByTestId('combo'));
			expect(screen.getByPlaceholderText('Choose...')).toBeInTheDocument();
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

		it('clears input after selection in single mode', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');
			fireEvent.change(input, { target: { value: 'rea' } });
			expect(input).toHaveValue('rea');

			fireEvent.click(screen.getByRole('option', { name: 'React' }));

			// Reopen to check input is cleared
			fireEvent.click(screen.getByTestId('combo'));
			const inputAfter = screen.getByPlaceholderText('Select an option...');
			expect(inputAfter).toHaveValue('');
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

		it('closes dropdown and focuses trigger when pressing Shift+Tab on input', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />
			);

			const trigger = screen.getByTestId('combo');
			fireEvent.click(trigger);

			const input = screen.getByPlaceholderText('Select an option...');
			fireEvent.keyDown(input, { key: 'Tab', shiftKey: true });

			expect(screen.queryByRole('option')).not.toBeInTheDocument();
			expect(document.activeElement).toBe(trigger);
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

		it('clears input after selection in multi mode', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} multiple testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');
			fireEvent.change(input, { target: { value: 'rea' } });
			expect(input).toHaveValue('rea');

			fireEvent.click(screen.getByRole('option', { name: 'React' }));

			// Input should be cleared but dropdown stays open
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

		it('shows create option in single-select mode', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} allowCreate testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');
			fireEvent.change(input, { target: { value: 'new-value' } });

			expect(screen.getByText('Create "new-value"')).toBeInTheDocument();
		});

		it('creates and selects value in single-select mode', () => {
			const onChange = vi.fn();
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					allowCreate
					onChange={onChange}
					testId="combo"
					withPortal={false}
				/>
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');
			fireEvent.change(input, { target: { value: 'custom-item' } });
			fireEvent.click(screen.getByText('Create "custom-item"'));

			expect(onChange).toHaveBeenCalledWith('custom-item');
			// Popover closes after single-select
			expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
		});

		it('displays custom value in trigger after creation in single-select', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} allowCreate testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');
			fireEvent.change(input, { target: { value: 'my-custom' } });
			fireEvent.click(screen.getByText('Create "my-custom"'));

			expect(screen.getByTestId('combo')).toHaveTextContent('my-custom');
		});

		it('shows custom value in Custom group when reopened in single-select', () => {
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					allowCreate
					defaultValue="pre-existing-custom"
					testId="combo"
					withPortal={false}
				/>
			);

			fireEvent.click(screen.getByTestId('combo'));
			expect(screen.getByText('Custom')).toBeInTheDocument();
			expect(screen.getByRole('option', { name: 'pre-existing-custom' })).toBeInTheDocument();
		});
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

	describe('hint items (insertValue)', () => {
		const groupsWithHints = [
			{
				heading: 'Suggestions',
				items: [
					{ value: 'hint:status', label: 'status:', insertValue: 'status:' },
					{ value: 'hint:priority', label: 'priority:', insertValue: 'priority:' },
				],
			},
			{
				heading: 'Status',
				items: [
					{ value: 'status:active', label: 'Status: Active' },
					{ value: 'status:pending', label: 'Status: Pending' },
				],
			},
		];

		it('shows hint items when input is empty', () => {
			renderWithProviders(
				<ComboboxSimple groups={groupsWithHints} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));

			expect(screen.getByText('Suggestions')).toBeInTheDocument();
			expect(screen.getByText('status:')).toBeInTheDocument();
			expect(screen.getByText('priority:')).toBeInTheDocument();
		});

		it('hides hint items when input starts with hint insertValue', () => {
			renderWithProviders(
				<ComboboxSimple groups={groupsWithHints} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByRole('combobox');
			fireEvent.change(input, { target: { value: 'status:' } });

			// Hints should be hidden
			expect(screen.queryByText('Suggestions')).not.toBeInTheDocument();
			// But regular items should still show
			expect(screen.getByRole('option', { name: 'Status: Active' })).toBeInTheDocument();
		});

		it('inserts value into input when hint is clicked', () => {
			renderWithProviders(
				<ComboboxSimple groups={groupsWithHints} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			fireEvent.click(screen.getByText('status:'));

			const input = screen.getByRole('combobox');
			expect(input).toHaveValue('status:');
		});

		it('shows hints again after clearing input', () => {
			renderWithProviders(
				<ComboboxSimple groups={groupsWithHints} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByRole('combobox');

			// Type to hide hints
			fireEvent.change(input, { target: { value: 'status:' } });
			expect(screen.queryByText('Suggestions')).not.toBeInTheDocument();

			// Clear to show hints again
			fireEvent.change(input, { target: { value: '' } });
			expect(screen.getByText('Suggestions')).toBeInTheDocument();
		});

		it('shows hints after deleting colon from prefix', () => {
			renderWithProviders(
				<ComboboxSimple groups={groupsWithHints} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByRole('combobox');

			// Type full prefix - hints should hide
			fireEvent.change(input, { target: { value: 'status:' } });
			expect(screen.queryByText('Suggestions')).not.toBeInTheDocument();
			expect(screen.queryByText('status:')).not.toBeInTheDocument();

			// Delete colon - hints should reappear
			fireEvent.change(input, { target: { value: 'status' } });
			expect(screen.getByText('Suggestions')).toBeInTheDocument();
			expect(screen.getByText('status:')).toBeInTheDocument();
		});

		it('works with flat items containing hints', () => {
			const itemsWithHint = [
				{ value: 'hint:tag', label: 'tag:', insertValue: 'tag:' },
				{ value: 'tag:bug', label: 'tag:bug' },
				{ value: 'tag:feature', label: 'tag:feature' },
			];

			renderWithProviders(
				<ComboboxSimple items={itemsWithHint} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));

			// Hint should be visible
			expect(screen.getByText('tag:')).toBeInTheDocument();

			// Click hint
			fireEvent.click(screen.getByText('tag:'));

			const input = screen.getByRole('combobox');
			expect(input).toHaveValue('tag:');

			// Hint should now be hidden
			expect(screen.queryByText('tag:')).not.toBeInTheDocument();
		});

		it('works with multi-select mode', () => {
			renderWithProviders(
				<ComboboxSimple groups={groupsWithHints} multiple testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));

			// Click hint
			fireEvent.click(screen.getByText('priority:'));

			const input = screen.getByPlaceholderText('Select an option...');
			expect(input).toHaveValue('priority:');

			// Hints should be hidden after inserting
			expect(screen.queryByText('Suggestions')).not.toBeInTheDocument();
		});
	});

	describe('disabled state', () => {
		it('does not open dropdown when disabled', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} disabled testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			expect(screen.queryByRole('option')).not.toBeInTheDocument();
		});

		it('applies disabled attribute to single-select trigger', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} disabled testId="combo" withPortal={false} />
			);

			const trigger = screen.getByTestId('combo');
			expect(trigger).toBeDisabled();
			expect(trigger).toHaveAttribute('data-disabled', 'true');
		});

		it('applies disabled attributes to multi-select trigger', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} multiple disabled testId="combo" withPortal={false} />
			);

			const trigger = screen.getByTestId('combo');
			expect(trigger).toHaveAttribute('aria-disabled', 'true');
			expect(trigger).toHaveAttribute('data-disabled', 'true');
			expect(trigger).toHaveAttribute('tabIndex', '-1');
		});

		it('does not open on Enter key when disabled', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} multiple disabled testId="combo" withPortal={false} />
			);

			const trigger = screen.getByTestId('combo');
			fireEvent.keyDown(trigger, { key: 'Enter' });

			expect(screen.queryByRole('option')).not.toBeInTheDocument();
		});

		it('does not call onChange when disabled', () => {
			const onChange = vi.fn();
			renderWithProviders(
				<ComboboxSimple
					items={defaultItems}
					disabled
					onChange={onChange}
					testId="combo"
					withPortal={false}
				/>
			);

			fireEvent.click(screen.getByTestId('combo'));
			expect(onChange).not.toHaveBeenCalled();
		});
	});

	describe('filtering', () => {
		it('filters items with fuzzy matching', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');

			// "rct" should fuzzy match "React"
			fireEvent.change(input, { target: { value: 'rct' } });

			expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
			expect(screen.queryByRole('option', { name: 'Vue' })).not.toBeInTheDocument();
			expect(screen.queryByRole('option', { name: 'Angular' })).not.toBeInTheDocument();
		});

		it('filters items by keywords', () => {
			const itemsWithKeywords = [
				{ value: '15m', label: '15 minutes', keywords: ['quarter hour', 'fifteen'] },
				{ value: '30m', label: '30 minutes', keywords: ['half hour', 'thirty'] },
				{ value: '1h', label: '1 hour', keywords: ['sixty minutes'] },
			];

			renderWithProviders(
				<ComboboxSimple items={itemsWithKeywords} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');

			// Search by keyword
			fireEvent.change(input, { target: { value: 'quarter' } });

			expect(screen.getByRole('option', { name: '15 minutes' })).toBeInTheDocument();
			expect(screen.queryByRole('option', { name: '30 minutes' })).not.toBeInTheDocument();
			expect(screen.queryByRole('option', { name: '1 hour' })).not.toBeInTheDocument();
		});

		it('filters items by displayValue', () => {
			const itemsWithDisplayValue = [
				{ value: 'us-east-1', label: 'US East (N. Virginia)', displayValue: 'US East' },
				{ value: 'eu-west-1', label: 'EU West (Ireland)', displayValue: 'EU West' },
			];

			renderWithProviders(
				<ComboboxSimple items={itemsWithDisplayValue} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');

			// Search by displayValue
			fireEvent.change(input, { target: { value: 'US East' } });

			expect(screen.getByRole('option', { name: 'US East (N. Virginia)' })).toBeInTheDocument();
			expect(screen.queryByRole('option', { name: 'EU West (Ireland)' })).not.toBeInTheDocument();
		});

		it('filters items by label when label is string', () => {
			renderWithProviders(
				<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />
			);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');

			// Search by label
			fireEvent.change(input, { target: { value: 'Angular' } });

			expect(screen.getByRole('option', { name: 'Angular' })).toBeInTheDocument();
			expect(screen.queryByRole('option', { name: 'React' })).not.toBeInTheDocument();
			expect(screen.queryByRole('option', { name: 'Vue' })).not.toBeInTheDocument();
		});

		it('ranks exact matches higher than partial matches', () => {
			const items = [
				{ value: 'react-native', label: 'React Native' },
				{ value: 'react', label: 'React' },
				{ value: 'preact', label: 'Preact' },
			];

			renderWithProviders(<ComboboxSimple items={items} testId="combo" withPortal={false} />);

			fireEvent.click(screen.getByTestId('combo'));
			const input = screen.getByPlaceholderText('Select an option...');

			fireEvent.change(input, { target: { value: 'react' } });

			const options = screen.getAllByRole('option');
			// React should appear before React Native (shorter/more exact match)
			expect(options[0]).toHaveTextContent('React');
		});
	});
});
