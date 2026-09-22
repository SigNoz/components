import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DROPDOWN_EMPTY_CONTENT, DROPDOWN_EMPTY_LABEL } from '../constants.js';
import { Dropdown } from '../index.js';
import type { DropdownItemType } from '../types.js';
import { openDropdown } from './dropdown.test-utils.js';

const ITEMS: DropdownItemType[] = [
	{ type: 'item', value: 'rename', label: 'Rename' },
	{ type: 'item', value: 'delete', label: 'Delete', destructive: true },
];

function renderDropdown(props: Partial<Parameters<typeof Dropdown>[0]> = {}) {
	return render(
		<Dropdown side="bottom" align="start" items={ITEMS} testId="menu" {...props}>
			<button type="button">Actions</button>
		</Dropdown>,
	);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Dropdown rendering', () => {
	it('renders the trigger as the element it was given, with the testId on it', () => {
		renderDropdown();

		const trigger = screen.getByRole('button', { name: 'Actions' });
		expect(trigger).toBe(screen.getByTestId('menu'));
		expect(trigger.tagName).toBe('BUTTON');
		expect(trigger.querySelector('button')).toBeNull();
	});

	it('renders one row per item, named by its label', async () => {
		renderDropdown();
		await openDropdown();

		expect(screen.getAllByRole('menuitem')).toHaveLength(2);
		expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
	});

	it('names every row from the menu testId', async () => {
		renderDropdown();
		await openDropdown();

		expect(screen.getByTestId('menu-item-rename')).toHaveAttribute('data-slot', 'dropdown-item');
	});

	it('lets a row name itself', async () => {
		renderDropdown({
			items: [{ type: 'item', value: 'rename', label: 'Rename', testId: 'the-rename-row' }],
		});
		await openDropdown();

		expect(screen.getByTestId('the-rename-row')).toBeInTheDocument();
		expect(screen.queryByTestId('menu-item-rename')).toBeNull();
	});

	it('marks a destructive row', async () => {
		renderDropdown();
		await openDropdown();

		expect(screen.getByTestId('menu-item-delete')).toHaveAttribute('data-destructive', 'true');
		expect(screen.getByTestId('menu-item-rename')).not.toHaveAttribute('data-destructive');
	});

	it('falls back to <No label> for a label that renders nothing', async () => {
		renderDropdown({ items: [{ type: 'item', value: 'blank', label: null }] });
		await openDropdown();

		const label = screen
			.getByTestId('menu-item-blank')
			.querySelector('[data-slot="dropdown-item-label"]');
		expect(label).toHaveTextContent(DROPDOWN_EMPTY_LABEL);
		expect(label).toHaveAttribute('data-empty-label', 'true');
	});

	it('renders the empty row and warns for an empty items list', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		renderDropdown({ items: [] });
		await openDropdown();

		expect(screen.getByTestId('menu-empty')).toHaveTextContent(DROPDOWN_EMPTY_CONTENT);
		expect(screen.getByTestId('menu-empty')).toHaveAttribute('data-empty-content');
		expect(warn).toHaveBeenCalledWith('Dropdown: `items` is empty, showing the empty row.');
	});

	it('renders each kind of row', async () => {
		renderDropdown({
			items: [
				{ type: 'item', value: 'rename', label: 'Rename' },
				{ type: 'separator', value: 'rule' },
				{ type: 'checkbox', value: 'pinned', label: 'Pinned', defaultChecked: true },
				{
					type: 'radio-group',
					value: 'sort',
					defaultSelectedValue: 'name',
					items: [
						{ label: 'By name', value: 'name' },
						{ label: 'By date', value: 'date' },
					],
				},
				{
					type: 'group',
					value: 'more',
					label: 'More',
					items: [{ type: 'item', value: 'export', label: 'Export' }],
				},
			],
		});
		await openDropdown();

		expect(screen.getByRole('menuitemcheckbox', { name: 'Pinned' })).toBeChecked();
		expect(screen.getAllByRole('menuitemradio')).toHaveLength(2);
		expect(screen.getByRole('menuitemradio', { name: 'By name' })).toBeChecked();
		expect(screen.getByRole('separator')).toHaveAttribute('data-slot', 'dropdown-separator');
		expect(screen.getByTestId('menu-group-more')).toHaveTextContent('More');
		expect(screen.getByTestId('menu-radio-group-sort')).toBeInTheDocument();
	});

	it('drops a separator that would land first, last or next to another', async () => {
		renderDropdown({
			items: [
				{ type: 'separator', value: 'lead' },
				{ type: 'item', value: 'rename', label: 'Rename' },
				{ type: 'separator', value: 'one' },
				{ type: 'separator', value: 'two' },
				{ type: 'item', value: 'delete', label: 'Delete' },
				{ type: 'separator', value: 'trail' },
			],
		});
		await openDropdown();

		expect(screen.getAllByRole('separator')).toHaveLength(1);
	});

	it('replaces the rows while loading, and keeps the search row', async () => {
		renderDropdown({ loading: true, searchInputProps: {} });
		await openDropdown();

		expect(screen.getByTestId('menu-loading')).toBeInTheDocument();
		expect(screen.queryAllByRole('menuitem')).toHaveLength(0);
		expect(screen.getByTestId('menu-search')).toBeInTheDocument();
	});

	it('shows loadingContent in place of the spinner', async () => {
		renderDropdown({ loading: true, loadingContent: 'Fetching actions' });
		await openDropdown();

		expect(screen.getByTestId('menu-loading')).toHaveTextContent('Fetching actions');
	});

	it('puts aria-* on the popup and data-* on the trigger', async () => {
		renderDropdown({ 'aria-label': 'Row actions', 'data-analytics': 'row-menu' });
		const popup = await openDropdown();

		expect(popup).toHaveAttribute('aria-label', 'Row actions');
		expect(screen.getByTestId('menu')).toHaveAttribute('data-analytics', 'row-menu');
		expect(screen.getByTestId('menu')).not.toHaveAttribute('aria-label', 'Row actions');
	});

	it('writes the size props as custom properties on the popup', async () => {
		renderDropdown({ contentMaxWidth: 480, contentMaxHeight: '30rem' });
		const popup = await openDropdown();

		expect(popup.style.getPropertyValue('--dropdown-internal-max-inline-size')).toBe('480px');
		expect(popup.style.getPropertyValue('--dropdown-internal-max-block-size')).toBe('30rem');
	});
});
