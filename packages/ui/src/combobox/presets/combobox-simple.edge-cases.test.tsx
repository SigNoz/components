import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ComboboxSimple } from './combobox-simple.js';
import {
	defaultItems,
	renderWithProviders,
	setupMocks,
	setupVirtualMocks,
} from './combobox-simple.test-utils.js';

setupMocks();

describe('ComboboxSimple edge cases - pills', () => {
	it('handles maxDisplayedPills=0 showing overflow badge for all', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				defaultValue={['react', 'vue']}
				maxDisplayedPills={0}
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		expect(trigger).toHaveTextContent('+2');
		expect(trigger.querySelector('[data-slot="combobox-pill"]')).not.toBeInTheDocument();
	});

	it('handles maxDisplayedPills greater than values count', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				defaultValue={['react']}
				maxDisplayedPills={10}
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		expect(trigger).toHaveTextContent('React');
		expect(trigger.querySelector('[data-slot="combobox-pill-overflow"]')).not.toBeInTheDocument();
	});

	it('renders ReactNode labels in pills without crashing', () => {
		const items = [{ value: 'icon-item', label: <span data-testid="icon-label">With Icon</span> }];
		renderWithProviders(
			<ComboboxSimple
				items={items}
				multiple
				defaultValue={['icon-item']}
				testId="combo"
				withPortal={false}
			/>
		);

		expect(screen.getByTestId('icon-label')).toBeInTheDocument();
	});
});

describe('ComboboxSimple edge cases - displayValueFn', () => {
	it('calls displayValueFn with undefined when no selection', () => {
		const displayValueFn = vi.fn(() => 'Choose...');
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				displayValue={displayValueFn}
				testId="combo"
				withPortal={false}
			/>
		);

		expect(displayValueFn).toHaveBeenCalledWith(undefined);
		expect(screen.getByTestId('combo')).toHaveTextContent('Choose...');
	});

	it('displayValueFn receives undefined for custom values not in items', () => {
		const displayValueFn = vi.fn((item) => (item ? item.label : 'Custom selected'));
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				defaultValue="not-in-list"
				displayValue={displayValueFn}
				testId="combo"
				withPortal={false}
			/>
		);

		expect(displayValueFn).toHaveBeenCalledWith(undefined);
		expect(screen.getByTestId('combo')).toHaveTextContent('Custom selected');
	});
});

describe('ComboboxSimple edge cases - custom values filtering', () => {
	it('custom values filter like normal items', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				allowCreate
				multiple
				defaultValue={['my-custom-tag']}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));

		// Custom value visible initially
		expect(screen.getByRole('option', { name: 'my-custom-tag' })).toBeInTheDocument();

		// Type something that doesn't match
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'xyz' } });

		// Custom value filtered out (cmdk may keep group heading but hides option)
		expect(screen.queryByRole('option', { name: 'my-custom-tag' })).not.toBeInTheDocument();
	});

	it('custom values appear when filter matches', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				allowCreate
				multiple
				defaultValue={['my-tag']}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'my' } });

		// Custom value visible because it matches
		expect(screen.getByRole('option', { name: 'my-tag' })).toBeInTheDocument();
	});

	it('can deselect custom value when visible', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				allowCreate
				multiple
				defaultValue={['my-tag']}
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));

		// Click custom value to deselect
		fireEvent.click(screen.getByRole('option', { name: 'my-tag' }));

		expect(onChange).toHaveBeenCalledWith([]);
	});
});

describe('ComboboxSimple edge cases - create option visibility', () => {
	it('create option visible with trailing space in input', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} allowCreate multiple testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'newtag ' } });

		// Create option still visible with trailing space
		expect(screen.getByText('Create "newtag"')).toBeInTheDocument();
	});

	it('create option visible when no items match', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} allowCreate multiple testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'completely-unrelated' } });

		expect(screen.getByText('Create "completely-unrelated"')).toBeInTheDocument();
	});

	it('create option positioned first when input partially matches items', async () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} allowCreate multiple testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'u' } });

		await waitFor(() => {
			expect(screen.getByText('Create "u"')).toBeInTheDocument();
		});

		// All visible items in cmdk list in DOM order
		const items = document.querySelectorAll('[cmdk-list] [cmdk-item]');
		const itemTexts = Array.from(items).map((el) => el.textContent ?? '');

		// First item must be create option, NOT Vue (which also matches "u")
		expect(itemTexts[0]).toContain('Create "u"');
		expect(itemTexts[0]).not.toContain('Vue');
	});

	it('create option positioned first with custom values present', async () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				allowCreate
				multiple
				defaultValue={['custom-existing']}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'rea' } });

		await waitFor(() => {
			expect(screen.getByText('Create "rea"')).toBeInTheDocument();
		});

		const items = document.querySelectorAll('[cmdk-list] [cmdk-item]');
		const itemTexts = Array.from(items).map((el) => el.textContent ?? '');

		// First item must be create option
		expect(itemTexts[0]).toContain('Create "rea"');
	});

	it('separators visible between groups while filtering', async () => {
		const groups = [
			{ heading: 'Group A', items: [{ value: 'apple', label: 'Apple' }] },
			{ heading: 'Group B', items: [{ value: 'apricot', label: 'Apricot' }] },
		];

		renderWithProviders(<ComboboxSimple groups={groups} testId="combo" withPortal={false} />);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'ap' } });

		await waitFor(() => {
			expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
			expect(screen.getByRole('option', { name: 'Apricot' })).toBeInTheDocument();
		});

		// Separator between groups must be visible
		const separators = document.querySelectorAll('[cmdk-separator]');
		expect(separators.length).toBeGreaterThan(0);
	});

	it('separator visible between create option and custom values', async () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				allowCreate
				multiple
				defaultValue={['existing-custom']}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'existing' } });

		await waitFor(() => {
			expect(screen.getByText('Create "existing"')).toBeInTheDocument();
			expect(screen.getByRole('option', { name: 'existing-custom' })).toBeInTheDocument();
		});

		const separators = document.querySelectorAll('[cmdk-separator]');
		expect(separators.length).toBeGreaterThan(0);
	});

	it('create option positioned first with groups', async () => {
		const groups = [
			{
				heading: 'Group A',
				items: [{ value: 'apple', label: 'Apple' }],
			},
		];

		renderWithProviders(
			<ComboboxSimple groups={groups} allowCreate multiple testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'app' } });

		await waitFor(() => {
			expect(screen.getByText('Create "app"')).toBeInTheDocument();
		});

		const items = document.querySelectorAll('[cmdk-list] [cmdk-item]');
		const itemTexts = Array.from(items).map((el) => el.textContent ?? '');

		// First item must be create option, even with groups
		expect(itemTexts[0]).toContain('Create "app"');
		expect(itemTexts[itemTexts.length - 1]).toContain('Apple');
	});
});

describe('ComboboxSimple edge cases - create/whitespace', () => {
	it('ignores whitespace-only input for create option', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} allowCreate multiple testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: '   ' } });

		expect(screen.queryByText(/Create/)).not.toBeInTheDocument();
	});

	it('clears input without creating when value already selected', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				allowCreate
				multiple
				defaultValue={['existing']}
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'existing' } });

		expect(screen.queryByText('Create "existing"')).not.toBeInTheDocument();
	});
});

describe('ComboboxSimple edge cases - empty states', () => {
	it('does not render empty placeholder when items are visible', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				emptyPlaceholder="Nothing found"
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));

		// Items are visible
		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
		// Empty placeholder should NOT be in DOM at all (not just hidden)
		expect(screen.queryByText('Nothing found')).not.toBeInTheDocument();
	});

	it('does not render empty placeholder when filtered items exist', () => {
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
		fireEvent.change(input, { target: { value: 'rea' } }); // matches "React"

		// React is visible
		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
		// Empty placeholder should NOT be in DOM
		expect(screen.queryByText('Nothing found')).not.toBeInTheDocument();
	});

	it('shows empty placeholder when all items filtered out', () => {
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
		fireEvent.change(input, { target: { value: 'xyz-no-match' } });

		expect(screen.getByText('Nothing found')).toBeInTheDocument();
	});

	it('shows empty state with groups when all filtered out', () => {
		const groups = [
			{ heading: 'Fruits', items: [{ value: 'apple', label: 'Apple' }] },
			{ heading: 'Vegetables', items: [{ value: 'carrot', label: 'Carrot' }] },
		];
		renderWithProviders(
			<ComboboxSimple
				groups={groups}
				emptyPlaceholder="No matches"
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'xyz' } });

		expect(screen.getByText('No matches')).toBeInTheDocument();
	});

	it('handles empty items array', () => {
		renderWithProviders(
			<ComboboxSimple items={[]} emptyPlaceholder="No options" testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByText('No options')).toBeInTheDocument();
	});

	it('handles empty groups array', () => {
		renderWithProviders(
			<ComboboxSimple groups={[]} emptyPlaceholder="No groups" testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByText('No groups')).toBeInTheDocument();
	});
});

describe('ComboboxSimple edge cases - controlled mode', () => {
	it('works with controlled value in single-select', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				value="react"
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		expect(screen.getByTestId('combo')).toHaveTextContent('React');

		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'Vue' }));

		expect(onChange).toHaveBeenCalledWith('vue');
	});

	it('works with controlled value in multiple-select', () => {
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

	it('controlled mode remove works without crashing', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				value={['react', 'vue']}
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		const removeButtons = screen.getAllByRole('button', { name: /remove/i });
		fireEvent.click(removeButtons[0]);

		expect(onChange).toHaveBeenCalledWith(['vue']);
	});
});

describe('ComboboxSimple edge cases - normalizeValue', () => {
	it('handles empty string defaultValue', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} defaultValue="" testId="combo" withPortal={false} />
		);

		expect(screen.getByTestId('combo')).toHaveTextContent('Select an option...');
	});

	it('handles array with empty strings in defaultValue', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				defaultValue={['', 'react', '']}
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		expect(trigger).toHaveTextContent('React');
		expect(trigger.querySelectorAll('[data-slot="combobox-pill"]')).toHaveLength(1);
	});
});

describe('ComboboxSimple edge cases - virtualized', () => {
	setupVirtualMocks();

	it('handles virtualized with custom height config', () => {
		const manyItems = Array.from({ length: 100 }, (_, i) => ({
			value: `item-${i}`,
			label: `Item ${i}`,
		}));

		renderWithProviders(
			<ComboboxSimple
				items={manyItems}
				virtualized={{ virtualizedHeight: 400, estimatedItemHeight: 40 }}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByRole('option', { name: 'Item 0' })).toBeInTheDocument();
	});

	it('handles virtualized with allowCreate function', () => {
		const manyItems = Array.from({ length: 100 }, (_, i) => ({
			value: `item-${i}`,
			label: `Item ${i}`,
		}));

		renderWithProviders(
			<ComboboxSimple
				items={manyItems}
				virtualized
				allowCreate={(val) => <span>Add new: {val}</span>}
				multiple
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'brand-new' } });

		expect(screen.getByText(/Add new: brand-new/)).toBeInTheDocument();
	});

	it('shows empty state in virtualized mode', () => {
		const manyItems = Array.from({ length: 100 }, (_, i) => ({
			value: `item-${i}`,
			label: `Item ${i}`,
		}));

		renderWithProviders(
			<ComboboxSimple
				items={manyItems}
				virtualized
				emptyPlaceholder="Nothing here"
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'xyz-nomatch-999' } });

		expect(screen.getByText('Nothing here')).toBeInTheDocument();
	});
});

describe('ComboboxSimple edge cases - ref forwarding', () => {
	it('forwards ref as object', () => {
		const ref = { current: null };
		renderWithProviders(
			<ComboboxSimple items={defaultItems} ref={ref} testId="combo" withPortal={false} />
		);

		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('forwards ref as callback', () => {
		const refCallback = vi.fn();
		renderWithProviders(
			<ComboboxSimple items={defaultItems} ref={refCallback} testId="combo" withPortal={false} />
		);

		expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
	});

	it('forwards ref in multiple mode', () => {
		const ref = { current: null };
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple ref={ref} testId="combo" withPortal={false} />
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});

describe('ComboboxSimple edge cases - items with special values', () => {
	it('handles item with empty string value', () => {
		const items = [
			{ value: '', label: 'None' },
			{ value: 'other', label: 'Other' },
		];
		renderWithProviders(<ComboboxSimple items={items} testId="combo" withPortal={false} />);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByRole('option', { name: 'None' })).toBeInTheDocument();
	});

	it('handles item value with special characters', () => {
		const items = [
			{ value: 'key:value', label: 'Key Value' },
			{ value: 'path/to/thing', label: 'Path Thing' },
			{ value: 'item with spaces', label: 'Spaced' },
		];
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple items={items} onChange={onChange} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'Key Value' }));

		expect(onChange).toHaveBeenCalledWith('key:value');
	});
});
