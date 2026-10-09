import { Filter, Pin } from '@signozhq/icons';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog, DialogContent, DialogTitle } from '../../dialog/index.js';
import { Select } from '../index.js';
import type { SelectItemType } from '../types.js';
import { FRAMEWORKS, openSelect } from './select.test-utils.js';

const TECHNOLOGIES: SelectItemType[] = [
	{ type: 'separator', value: 'leading' },
	{
		type: 'group',
		value: 'frameworks',
		label: 'Frameworks',
		items: [
			{ type: 'separator', value: 'group-leading' },
			{ type: 'item', value: 'react', label: 'React' },
			{ type: 'item', value: 'vue', label: 'Vue' },
			{ type: 'separator', value: 'group-trailing' },
		],
	},
	{ type: 'separator', value: 'middle' },
	{ type: 'separator', value: 'twice' },
	{ type: 'group', value: 'empty', label: 'Empty', items: [] },
	{
		type: 'group',
		value: 'rules',
		label: 'Rules only',
		items: [{ type: 'separator', value: 'lonely' }],
	},
	{
		type: 'group',
		value: 'languages',
		label: 'Languages',
		items: [{ type: 'item', value: 'go', label: 'Go' }],
	},
	{ type: 'separator', value: 'trailing' },
];

describe('Select rendering', () => {
	it('names the trigger with the placeholder when nothing else names it', () => {
		render(<Select items={FRAMEWORKS} placeholder="Select a framework" />);

		expect(screen.getByRole('combobox', { name: 'Select a framework' })).toBeInTheDocument();
	});

	it('forwards id, aria-* and data-* to the trigger', () => {
		render(
			<Select
				placeholder="Select a framework..."
				id="framework"
				aria-label="Framework"
				aria-describedby="hint"
				aria-invalid
				aria-required
				data-track="framework-select"
				items={FRAMEWORKS}
				testId="select"
			/>,
		);
		const trigger = screen.getByTestId('select');

		expect(trigger).toHaveAttribute('id', 'framework');
		expect(trigger).toHaveAttribute('aria-describedby', 'hint');
		expect(trigger).toHaveAttribute('aria-invalid', 'true');
		expect(trigger).toHaveAttribute('aria-required', 'true');
		expect(trigger).toHaveAttribute('data-track', 'framework-select');
		expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
		expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
	});

	it.each([false, true])(
		'is named by a label that points at its id, and so is its list (multiple: %s)',
		async (multiple) => {
			render(
				<>
					<label htmlFor="provider">Provider</label>
					<Select
						id="provider"
						placeholder="Select a provider..."
						items={FRAMEWORKS}
						multiple={multiple}
					/>
				</>,
			);

			expect(screen.getByRole('combobox', { name: 'Provider' })).toHaveAttribute('id', 'provider');
			expect(await openSelect('Provider')).toHaveAccessibleName('Provider');
		},
	);

	it('focuses a multiple trigger when its label is clicked', async () => {
		render(
			<>
				<label htmlFor="provider">Provider</label>
				<Select id="provider" placeholder="Select a provider..." items={FRAMEWORKS} multiple />
			</>,
		);

		await userEvent.click(screen.getByText('Provider'));

		expect(screen.getByRole('combobox', { name: 'Provider' })).toHaveFocus();
	});

	it('keeps an aria-label over a label that points at its id', () => {
		render(
			<>
				<label htmlFor="provider">Provider</label>
				<Select
					id="provider"
					aria-label="Cloud provider"
					placeholder="Select a provider..."
					items={FRAMEWORKS}
				/>
			</>,
		);

		expect(screen.getByRole('combobox', { name: 'Cloud provider' })).toBeInTheDocument();
	});

	it('drops className and style that get past the types', () => {
		const props = { className: 'stray', style: { color: 'red' } } as object;
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				testId="select"
				{...props}
			/>,
		);

		expect(document.querySelector('.stray')).toBeNull();
		expect(screen.getByTestId('select').style.color).toBe('');
	});

	it('writes width and maxWidth as custom properties on the root', () => {
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				width={240}
				maxWidth="50%"
			/>,
		);
		const root = document.querySelector<HTMLElement>('[data-slot="select"]');

		expect(root?.style.getPropertyValue('--select-internal-width')).toBe('240px');
		expect(root?.style.getPropertyValue('--select-internal-max-width')).toBe('50%');
	});

	it('writes contentMaxWidth and contentMaxHeight on the popup', async () => {
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				contentMaxWidth={280}
				contentMaxHeight="10rem"
			/>,
		);
		await openSelect();
		const popup = document.querySelector<HTMLElement>('[data-slot="select-popup"]');

		expect(popup?.style.getPropertyValue('--select-internal-max-inline-size')).toBe('280px');
		expect(popup?.style.getPropertyValue('--select-internal-max-block-size')).toBe('10rem');
	});

	it('marks the edge of the list that is clipping something, from the first open', async () => {
		render(
			<Select
				placeholder="Select a host..."
				aria-label="Framework"
				contentMaxHeight={120}
				items={Array.from({ length: 30 }, (_, index) => ({
					type: 'item' as const,
					value: `host-${index}`,
					label: `host-${index}`,
				}))}
			/>,
		);
		const listbox = await openSelect();

		await waitFor(() => {
			expect(listbox).toHaveAttribute('data-scroll-end');
		});
	});

	it('shows the placeholder while nothing is selected', () => {
		render(
			<Select placeholder="Select a framework..." aria-label="Framework" items={FRAMEWORKS} />,
		);
		const trigger = screen.getByRole('combobox', { name: 'Framework' });

		expect(trigger.querySelector('[data-slot="select-placeholder"]')).toHaveTextContent(
			'Select a framework...',
		);
		expect(trigger.querySelector('[data-slot="select-value"]')).toBeNull();
	});

	it("shows the selected row's prefix and displayValue in the trigger", () => {
		render(
			<Select
				placeholder="Select a database..."
				aria-label="Database"
				defaultValue="postgres"
				items={[
					{
						type: 'item',
						value: 'postgres',
						label: 'PostgreSQL (primary)',
						displayValue: 'PostgreSQL',
						prefix: <Pin data-testid="db-icon" />,
					},
				]}
			/>,
		);
		const trigger = screen.getByRole('combobox', { name: 'Database' });

		expect(trigger.querySelector('[data-slot="select-value"]')).toHaveTextContent('PostgreSQL');
		expect(
			within(trigger).getByTestId('db-icon').closest('[data-slot="select-value-prefix"]'),
		).not.toBeNull();
	});

	it('shows a value that is not in items as itself', () => {
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				defaultValue="solid"
				items={FRAMEWORKS}
			/>,
		);

		expect(document.querySelector('[data-slot="select-value"]')).toHaveTextContent('solid');
	});

	it('lets the displayValue prop decide a single trigger, prefix included', () => {
		const displayValue = vi.fn((item?: { value: string }) =>
			item ? `Framework: ${item.value}` : 'Any framework',
		);
		const { rerender } = render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={[{ type: 'item', value: 'react', label: 'React', prefix: <Filter /> }]}
				displayValue={displayValue}
			/>,
		);

		expect(document.querySelector('[data-slot="select-value"]')).toHaveTextContent('Any framework');

		rerender(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={[{ type: 'item', value: 'react', label: 'React', prefix: <Filter /> }]}
				displayValue={displayValue}
				value="react"
			/>,
		);

		expect(document.querySelector('[data-slot="select-value"]')).toHaveTextContent(
			'Framework: react',
		);
		expect(document.querySelector('[data-slot="select-value-prefix"]')).toBeNull();
	});

	it('lets the displayValue prop replace the chips of a multiple trigger', () => {
		render(
			<Select
				multiple
				placeholder="Select frameworks..."
				aria-label="Frameworks"
				items={FRAMEWORKS}
				defaultValue={['react', 'vue', 'solid']}
				displayValue={(items) => `${items.length} frameworks`}
			/>,
		);

		expect(document.querySelector('[data-slot="select-value"]')).toHaveTextContent('2 frameworks');
		expect(document.querySelector('[data-slot="select-chips"]')).toBeNull();
	});

	it('shows a chip per value and folds the rest past maxDisplayedPills', () => {
		render(
			<Select
				multiple
				placeholder="Select frameworks..."
				aria-label="Frameworks"
				items={FRAMEWORKS}
				defaultValue={['react', 'vue', 'angular']}
				maxDisplayedPills={2}
				testId="select"
			/>,
		);

		expect(screen.getByTestId('select-chip-react')).toHaveTextContent('React');
		expect(screen.getByTestId('select-chip-vue')).toHaveTextContent('Vue');
		expect(screen.queryByTestId('select-chip-angular')).toBeNull();
		expect(screen.getByTestId('select-chip-overflow')).toHaveTextContent('+1');
		expect(screen.getByTestId('select-chip-react-remove')).toHaveAccessibleName('Remove React');
	});

	it('swaps the chevron for a spinner and the rows for loadingContent while loading', async () => {
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				loading
				loadingContent="Fetching frameworks"
				testId="select"
			/>,
		);

		expect(document.querySelector('[data-slot="select-spinner"]')).not.toBeNull();
		expect(document.querySelector('[data-slot="select-icon"]')).toBeNull();

		await openSelect();

		expect(screen.getByTestId('select-loading')).toHaveTextContent('Fetching frameworks');
		expect(screen.queryAllByRole('option')).toHaveLength(0);
	});

	it('renders noContent for an empty items, and warns only without it', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { unmount } = render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={[]}
				testId="select"
			/>,
		);

		expect(warn).toHaveBeenCalledWith('Select: `items` is empty, showing the empty row.');
		await openSelect();
		expect(screen.getByTestId('select-empty')).toHaveTextContent('No results found :/');
		unmount();

		warn.mockClear();
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={[]}
				noContent="No frameworks yet"
				testId="select"
			/>,
		);

		expect(warn).not.toHaveBeenCalled();
		await openSelect();
		expect(screen.getByTestId('select-empty')).toHaveTextContent('No frameworks yet');
		warn.mockRestore();
	});

	it('renders groups and drops empty groups and stray separators, inside a group too', async () => {
		render(
			<Select
				placeholder="Select a technology..."
				aria-label="Framework"
				items={TECHNOLOGIES}
				testId="select"
			/>,
		);
		const listbox = await openSelect();

		expect(within(listbox).getAllByRole('group')).toHaveLength(2);
		expect(screen.getByTestId('select-group-frameworks')).toHaveTextContent('Frameworks');
		expect(screen.queryByTestId('select-group-empty')).toBeNull();
		expect(screen.queryByTestId('select-group-rules')).toBeNull();
		expect(listbox.querySelectorAll('[data-slot="select-separator"]')).toHaveLength(1);
		expect(within(listbox).getAllByRole('option')).toHaveLength(3);
	});

	it('names every row from the testId, and a row testId wins', async () => {
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={[
					{ type: 'item', value: 'react', label: 'React' },
					{ type: 'item', value: 'vue', label: 'Vue', testId: 'my-vue' },
				]}
				testId="select"
			/>,
		);
		await openSelect();

		expect(screen.getByTestId('select-item-react')).toHaveAttribute('data-slot', 'select-item');
		expect(screen.getByTestId('my-vue')).toHaveAttribute('data-slot', 'select-item');
	});

	it('shows <No label> for a row whose label renders nothing', async () => {
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={[{ type: 'item', value: 'blank', label: '' }]}
			/>,
		);
		const listbox = await openSelect();
		const label = listbox.querySelector('[data-slot="select-item-label"]');

		expect(label).toHaveTextContent('<No label>');
		expect(label).toHaveAttribute('data-empty-label');
	});

	it('marks the root with the state of its props', () => {
		render(
			<Select
				multiple
				placeholder="Select frameworks..."
				aria-label="Frameworks"
				items={FRAMEWORKS}
				disabled
				disabledTooltip="No access"
				readOnly
				readOnlyTooltip="Locked"
				loading
			/>,
		);
		const root = document.querySelector('[data-slot="select"]');

		expect(root).toHaveAttribute('data-multiple');
		expect(root).toHaveAttribute('data-disabled');
		expect(root).toHaveAttribute('data-readonly');
		expect(root).toHaveAttribute('data-loading');
	});

	it('marks the root and the trigger while the popup is open', async () => {
		render(
			<Select placeholder="Select a framework..." aria-label="Framework" items={FRAMEWORKS} />,
		);
		const root = document.querySelector('[data-slot="select"]');

		expect(root).not.toHaveAttribute('data-popup-open');

		await openSelect();

		expect(root).toHaveAttribute('data-popup-open');
		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveAttribute('data-popup-open');
	});

	it('names the listbox like the trigger', async () => {
		const { unmount } = render(
			<Select placeholder="Select a framework..." aria-label="Framework" items={FRAMEWORKS} />,
		);

		expect(await openSelect()).toHaveAccessibleName('Framework');
		unmount();

		render(
			<>
				<span id="framework-label">Framework</span>
				<Select
					placeholder="Select a framework..."
					aria-labelledby="framework-label"
					items={FRAMEWORKS}
				/>
			</>,
		);
		const trigger = screen.getByRole('combobox', { name: 'Framework' });

		expect(trigger).not.toHaveAttribute('aria-label');
		expect(await openSelect()).toHaveAccessibleName('Framework');
	});

	it('makes the popup at least as wide as the trigger', async () => {
		render(
			<div style={{ width: 400 }}>
				<Select placeholder="Select a framework..." aria-label="Framework" items={FRAMEWORKS} />
			</div>,
		);
		await openSelect();
		const trigger = screen.getByRole('combobox', { name: 'Framework' });
		const popup = document.querySelector('[data-slot="select-popup"]') as HTMLElement;

		expect(popup.getBoundingClientRect().width).toBeCloseTo(
			trigger.getBoundingClientRect().width,
			0,
		);
	});

	it('renders prefix and suffix around the row label', async () => {
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={[
					{
						type: 'item',
						value: 'react',
						label: 'React',
						prefix: <span>P</span>,
						suffix: <span>S</span>,
					},
				]}
				testId="select"
			/>,
		);
		await openSelect();

		expect(screen.getByTestId('select-item-react-prefix')).toHaveTextContent('P');
		expect(screen.getByTestId('select-item-react-suffix')).toHaveTextContent('S');
	});

	it('shows a spinner row and warns about nothing while loading with no items', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={[]}
				loading
				testId="select"
			/>,
		);

		expect(warn).not.toHaveBeenCalled();
		await openSelect();
		expect(
			screen.getByTestId('select-loading').querySelector('[data-slot="spinner"]'),
		).not.toBeNull();
		expect(screen.queryByTestId('select-empty')).toBeNull();
		warn.mockRestore();
	});

	it('portals the popup into the container it is given', async () => {
		const outside = document.createElement('div');
		document.body.append(outside);
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				container={outside}
			/>,
		);
		const listbox = await openSelect();

		expect(outside.contains(listbox)).toBe(true);
		outside.remove();
	});
});

describe('Select chips', () => {
	const ITEMS: SelectItemType[] = [
		{ type: 'item', value: 'react', label: 'React' },
		{
			type: 'item',
			value: 'postgres',
			label: 'PostgreSQL (primary)',
			displayValue: 'PostgreSQL',
			prefix: <Pin data-testid="db-icon" />,
		},
		{ type: 'item', value: 'filter', label: <Filter /> },
	];

	it('shows the displayValue of a row and keeps its prefix out', () => {
		render(
			<Select
				multiple
				placeholder="Select..."
				aria-label="Stack"
				items={ITEMS}
				defaultValue={['postgres']}
				testId="select"
			/>,
		);
		const chip = screen.getByTestId('select-chip-postgres');

		expect(chip).toHaveTextContent('PostgreSQL');
		expect(chip).not.toHaveTextContent('primary');
		expect(screen.queryByTestId('db-icon')).toBeNull();
	});

	it('shows a value that is not in items as itself', () => {
		render(
			<Select
				multiple
				placeholder="Select..."
				aria-label="Stack"
				items={ITEMS}
				defaultValue={['solid']}
				testId="select"
			/>,
		);

		expect(screen.getByTestId('select-chip-solid')).toHaveTextContent('solid');
		expect(screen.getByTestId('select-chip-solid-remove')).toHaveAccessibleName('Remove solid');
	});

	it('names the remove button after the value when the label has no text', () => {
		render(
			<Select
				multiple
				placeholder="Select..."
				aria-label="Stack"
				items={ITEMS}
				defaultValue={['filter']}
				testId="select"
			/>,
		);

		expect(screen.getByTestId('select-chip-filter-remove')).toHaveAccessibleName('Remove filter');
	});

	it('keeps the chips in the order of the value', () => {
		render(
			<Select
				multiple
				placeholder="Select..."
				aria-label="Stack"
				items={FRAMEWORKS}
				defaultValue={['vue', 'react']}
			/>,
		);
		const chips = document.querySelectorAll('[data-slot="select-chip"]');

		expect([...chips].map((chip) => chip.textContent)).toEqual(['Vue', 'React']);
	});

	it('folds every chip into +N with maxDisplayedPills at 0', () => {
		render(
			<Select
				multiple
				placeholder="Select..."
				aria-label="Stack"
				items={FRAMEWORKS}
				defaultValue={['react', 'vue']}
				maxDisplayedPills={0}
				testId="select"
			/>,
		);

		expect(document.querySelectorAll('[data-slot="select-chip"]')).toHaveLength(0);
		expect(screen.getByTestId('select-chip-overflow')).toHaveTextContent('+2');
	});
});

describe('Select inside a dialog', () => {
	function renderInDialog(onOpenChange = vi.fn()) {
		render(
			<Dialog open onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogTitle>Settings</DialogTitle>
					<Select placeholder="Select a framework..." aria-label="Framework" items={FRAMEWORKS} />
				</DialogContent>
			</Dialog>,
		);

		return onOpenChange;
	}

	it('portals into the dialog panel and keeps the rows clickable', async () => {
		renderInDialog();
		const listbox = await openSelect();
		const panel = document.querySelector('[data-slot="dialog-content"]') as HTMLElement;

		expect(panel.contains(listbox)).toBe(true);

		await userEvent.click(within(listbox).getByRole('option', { name: 'Vue' }));

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveTextContent('Vue');
	});

	it('closes only the popup on Escape', async () => {
		const onOpenChange = renderInDialog();
		await openSelect();

		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		expect(onOpenChange).not.toHaveBeenCalledWith(false, expect.anything());
		expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
	});
});

// A modal from another library, such as antd's, has no panel to portal into. The popup goes to the
// body and has to stack above the layer its trigger sits in.
describe('Select inside a layer from another library', () => {
	it('stacks the popup above the layer', async () => {
		render(
			<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
				<Select placeholder="Select a framework..." aria-label="Framework" items={FRAMEWORKS} />
			</div>,
		);
		const listbox = await openSelect();
		const row = within(listbox).getByRole('option', { name: 'Vue' });
		const { left, top, width, height } = row.getBoundingClientRect();

		expect(row.contains(document.elementFromPoint(left + width / 2, top + height / 2))).toBe(true);
	});
});
