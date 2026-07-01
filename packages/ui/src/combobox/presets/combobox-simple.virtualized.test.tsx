import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ComboboxSimple } from './combobox-simple.js';
import {
	renderWithProviders,
	setupMocks,
	setupVirtualMocks,
} from './combobox-simple.test-utils.js';

setupMocks();
setupVirtualMocks();

const largeItems = Array.from({ length: 100 }, (_, i) => ({
	value: `item-${i}`,
	label: `Item ${i}`,
}));

const largeItemsWithHints = [
	{ value: 'hint:status', label: 'status:', insertValue: 'status:' },
	{ value: 'hint:priority', label: 'priority:', insertValue: 'priority:' },
	...largeItems,
];

describe('ComboboxSimple virtualized container', () => {
	it('renders virtual scroll container with virtualized={true}', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItems} virtualized testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));

		const scrollContainer = document.querySelector('[data-slot="combobox-virtual-scroll"]');
		expect(scrollContainer).toBeInTheDocument();
		expect(scrollContainer).toHaveStyle({ height: '300px' });
	});

	it('renders with virtualized config object', () => {
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized={{ estimatedItemHeight: 40, virtualizedHeight: 400 }}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const scrollContainer = document.querySelector('[data-slot="combobox-virtual-scroll"]');
		expect(scrollContainer).toHaveStyle({ height: '400px' });
	});

	it('renders virtual list container', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItems} virtualized testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));

		const listContainer = document.querySelector('[data-slot="combobox-virtual-list"]');
		expect(listContainer).toBeInTheDocument();
	});

	it('uses default height (300px) when virtualized={true}', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItems} virtualized={true} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const scrollContainer = document.querySelector('[data-slot="combobox-virtual-scroll"]');
		expect(scrollContainer).toHaveStyle({ height: '300px' });
	});

	it('applies custom virtualizedHeight from config', () => {
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized={{ virtualizedHeight: 500 }}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const scrollContainer = document.querySelector('[data-slot="combobox-virtual-scroll"]');
		expect(scrollContainer).toHaveStyle({ height: '500px' });
	});
});

describe('ComboboxSimple virtualized rendering', () => {
	it('renders items inside virtual list', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItems} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByRole('option', { name: 'Item 0' })).toBeInTheDocument();
	});

	it('renders group heading in virtual list', () => {
		const groups = [
			{
				heading: 'Frontend',
				items: [
					{ value: 'react', label: 'React' },
					{ value: 'vue', label: 'Vue' },
				],
			},
		];

		renderWithProviders(
			<ComboboxSimple groups={groups} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));

		expect(document.querySelector('[data-slot="combobox-virtual-heading"]')).toHaveTextContent(
			'Frontend'
		);
	});

	it('renders ReactNode group heading in virtual list', () => {
		const groups = [
			{
				heading: (
					<span data-testid="custom-heading">
						Custom <strong>Header</strong>
					</span>
				),
				items: [
					{ value: 'react', label: 'React' },
					{ value: 'vue', label: 'Vue' },
				],
			},
		];

		renderWithProviders(
			<ComboboxSimple groups={groups} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByTestId('custom-heading')).toBeInTheDocument();
		expect(screen.getByTestId('custom-heading')).toHaveTextContent('Custom Header');
	});

	it('renders ReactNode group heading in multi-select virtual list', () => {
		const groups = [
			{
				heading: (
					<span data-testid="custom-heading-multi">
						Multi <strong>Header</strong>
					</span>
				),
				items: [
					{ value: 'react', label: 'React' },
					{ value: 'vue', label: 'Vue' },
				],
			},
		];

		renderWithProviders(
			<ComboboxSimple groups={groups} virtualized multiple testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByTestId('custom-heading-multi')).toBeInTheDocument();
		expect(screen.getByTestId('custom-heading-multi')).toHaveTextContent('Multi Header');
	});

	it('renders separator between groups in virtual list', () => {
		const groups = [
			{ heading: 'A', items: [{ value: 'a1', label: 'A1' }] },
			{ heading: 'B', items: [{ value: 'b1', label: 'B1' }] },
		];

		renderWithProviders(
			<ComboboxSimple groups={groups} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));

		const list = document.querySelector('[data-slot="combobox-virtual-list"]');
		const separators = list?.querySelectorAll('[data-slot="combobox-separator"]');
		expect(separators?.length ?? 0).toBeGreaterThanOrEqual(1);
	});

	it('renders custom value row when value not in items list', () => {
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				allowCreate
				multiple
				defaultValue={['custom-tag']}
				testId="combo"
				withPortal={false}
			/>
		);
		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByRole('option', { name: 'custom-tag' })).toBeInTheDocument();
	});

	it('renders Custom group heading for custom values in virtual list', () => {
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				allowCreate
				multiple
				defaultValue={['my-custom-tag']}
				testId="combo"
				withPortal={false}
			/>
		);
		fireEvent.click(screen.getByTestId('combo'));

		const headings = document.querySelectorAll('[data-slot="combobox-virtual-heading"]');
		expect(headings.length).toBeGreaterThanOrEqual(1);
		expect(headings[0]).toHaveTextContent('Custom');
	});

	it('renders separator between create option and custom values in virtual list', () => {
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				allowCreate
				multiple
				defaultValue={['existing-tag']}
				testId="combo"
				withPortal={false}
			/>
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		// Type prefix of existing-tag to keep it visible while triggering create
		fireEvent.change(input, { target: { value: 'existing' } });

		// Should have create option, separator, then custom heading
		const list = document.querySelector('[data-slot="combobox-virtual-list"]');
		const separators = list?.querySelectorAll('[data-slot="combobox-separator"]');
		expect(separators?.length ?? 0).toBeGreaterThanOrEqual(1);
	});

	it('renders create option row in virtual list', () => {
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				allowCreate
				multiple
				testId="combo"
				withPortal={false}
			/>
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'brand-new' } });

		expect(screen.getByText('Create "brand-new"')).toBeInTheDocument();
	});

	it('renders hint items in virtual list', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItemsWithHints} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByText('status:')).toBeInTheDocument();
		expect(screen.getByText('priority:')).toBeInTheDocument();
	});
});

describe('ComboboxSimple virtualized selection', () => {
	it('calls onChange when virtual item clicked', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);
		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'Item 0' }));

		expect(onChange).toHaveBeenCalledWith('item-0');
	});

	it('toggles multi-select selection in virtual mode', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				multiple
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);
		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'Item 0' }));

		expect(onChange).toHaveBeenCalledWith(['item-0']);
	});

	it('creates custom value via virtual create row', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				allowCreate
				multiple
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'fresh' } });
		fireEvent.click(screen.getByText('Create "fresh"'));

		expect(onChange).toHaveBeenCalledWith(['fresh']);
	});

	it('inserts hint value into input when clicked in virtual mode', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItemsWithHints} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByText('status:'));

		const input = screen.getByPlaceholderText('Select an option...');
		expect(input).toHaveValue('status:');
	});

	it('reflects defaultValue selection in virtual mode', () => {
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				defaultValue="item-0"
				testId="combo"
				withPortal={false}
			/>
		);
		expect(screen.getByTestId('combo')).toHaveTextContent('Item 0');
	});

	it('uses controlled value in multi-select virtual mode', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				multiple
				value={['item-0']}
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);
		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'Item 0' }));

		expect(onChange).toHaveBeenCalledWith([]);
	});
});

describe('ComboboxSimple virtualized filtering', () => {
	it('filters items by label in virtual mode', () => {
		const items = [
			{ value: 'react', label: 'React' },
			{ value: 'vue', label: 'Vue' },
			{ value: 'angular', label: 'Angular' },
		];
		renderWithProviders(
			<ComboboxSimple items={items} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'React' } });

		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
		expect(screen.queryByRole('option', { name: 'Vue' })).not.toBeInTheDocument();
		expect(screen.queryByRole('option', { name: 'Angular' })).not.toBeInTheDocument();
	});

	it('filters by keywords in virtual mode', () => {
		const items = [
			{ value: '15m', label: '15 minutes', keywords: ['quarter hour'] },
			{ value: '30m', label: '30 minutes', keywords: ['half hour'] },
		];
		renderWithProviders(
			<ComboboxSimple items={items} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'quarter' } });

		expect(screen.getByRole('option', { name: '15 minutes' })).toBeInTheDocument();
		expect(screen.queryByRole('option', { name: '30 minutes' })).not.toBeInTheDocument();
	});

	it('filters by displayValue in virtual mode', () => {
		const items = [
			{ value: 'us-east-1', label: 'US East (N. Virginia)', displayValue: 'US East' },
			{ value: 'eu-west-1', label: 'EU West (Ireland)', displayValue: 'EU West' },
		];
		renderWithProviders(
			<ComboboxSimple items={items} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'US East' } });

		expect(screen.getByRole('option', { name: 'US East (N. Virginia)' })).toBeInTheDocument();
		expect(screen.queryByRole('option', { name: 'EU West (Ireland)' })).not.toBeInTheDocument();
	});

	it('fuzzy-matches in virtual mode (same as non-virtualized)', () => {
		const items = [
			{ value: 'react', label: 'React' },
			{ value: 'vue', label: 'Vue' },
		];
		renderWithProviders(
			<ComboboxSimple items={items} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'rct' } });

		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
		expect(screen.queryByRole('option', { name: 'Vue' })).not.toBeInTheDocument();
	});

	it('hides hints in virtual mode when input matches insertValue prefix', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItemsWithHints} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'status:' } });

		expect(screen.queryByText('priority:')).not.toBeInTheDocument();
	});

	it('shows empty placeholder in virtual mode when no matches', () => {
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				emptyPlaceholder="No items found"
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'nonexistent-xyz' } });

		expect(screen.getByText('No items found')).toBeInTheDocument();
	});
});

describe('ComboboxSimple virtualized keyboard navigation', () => {
	it('selects highlighted virtual item with Enter (single-select)', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(onChange).toHaveBeenCalledWith('item-1');
	});

	it('toggles highlighted virtual item with Enter (multi-select)', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				multiple
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(onChange).toHaveBeenCalledWith(['item-1']);
	});

	it('closes virtual dropdown on Escape', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItems} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));
		expect(document.querySelector('[data-slot="combobox-virtual-scroll"]')).toBeInTheDocument();

		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.keyDown(input, { key: 'Escape' });

		expect(document.querySelector('[data-slot="combobox-virtual-scroll"]')).not.toBeInTheDocument();
	});

	it('closes virtual dropdown and focuses trigger on Shift+Tab', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItems} virtualized testId="combo" withPortal={false} />
		);
		const trigger = screen.getByTestId('combo');
		fireEvent.click(trigger);

		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.keyDown(input, { key: 'Tab', shiftKey: true });

		expect(document.querySelector('[data-slot="combobox-virtual-scroll"]')).not.toBeInTheDocument();
		expect(document.activeElement).toBe(trigger);
	});

	it('opens virtual dropdown on Enter on multi-select trigger', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItems} virtualized multiple testId="combo" withPortal={false} />
		);
		const trigger = screen.getByTestId('combo');
		fireEvent.keyDown(trigger, { key: 'Enter' });

		expect(document.querySelector('[data-slot="combobox-virtual-scroll"]')).toBeInTheDocument();
	});

	it('opens virtual dropdown on Space on multi-select trigger', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItems} virtualized multiple testId="combo" withPortal={false} />
		);
		const trigger = screen.getByTestId('combo');
		fireEvent.keyDown(trigger, { key: ' ' });

		expect(document.querySelector('[data-slot="combobox-virtual-scroll"]')).toBeInTheDocument();
	});

	it('does not open virtual dropdown on Enter when disabled', () => {
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				disabled
				multiple
				testId="combo"
				withPortal={false}
			/>
		);
		const trigger = screen.getByTestId('combo');
		fireEvent.keyDown(trigger, { key: 'Enter' });

		expect(document.querySelector('[data-slot="combobox-virtual-scroll"]')).not.toBeInTheDocument();
	});

	it('keeps virtual dropdown open after Enter in multi-select mode', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItems} virtualized multiple testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(document.querySelector('[data-slot="combobox-virtual-scroll"]')).toBeInTheDocument();
	});

	it('closes virtual dropdown after Enter selection in single mode', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItems} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(document.querySelector('[data-slot="combobox-virtual-scroll"]')).not.toBeInTheDocument();
	});

	it('inserts hint via Enter on highlighted hint row in virtual mode', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItemsWithHints} virtualized testId="combo" withPortal={false} />
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');

		fireEvent.keyDown(input, { key: 'Enter' });

		expect(input).toHaveValue('status:');
	});

	it('triggers create via Enter when create row highlighted in virtual mode', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				allowCreate
				multiple
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);
		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'zzz-unique' } });

		fireEvent.keyDown(input, { key: 'ArrowUp' });
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(onChange).toHaveBeenCalledWith(['zzz-unique']);
	});
});

describe('ComboboxSimple virtualized disabled / loading', () => {
	it('does not open when disabled in virtualized mode', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItems} virtualized disabled testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		expect(document.querySelector('[data-slot="combobox-virtual-scroll"]')).not.toBeInTheDocument();
	});

	it('applies disabled attribute in virtualized mode', () => {
		renderWithProviders(
			<ComboboxSimple items={largeItems} virtualized disabled testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		expect(trigger).toBeDisabled();
		expect(trigger).toHaveAttribute('data-disabled', 'true');
	});

	it('shows loading rather than virtual list when loading in virtual mode', () => {
		renderWithProviders(
			<ComboboxSimple
				items={largeItems}
				virtualized
				loading
				loadingPlaceholder="Loading..."
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByText('Loading...')).toBeInTheDocument();
		expect(document.querySelector('[data-slot="combobox-virtual-scroll"]')).not.toBeInTheDocument();
	});
});
