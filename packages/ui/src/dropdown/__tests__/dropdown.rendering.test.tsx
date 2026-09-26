import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DROPDOWN_EMPTY_CONTENT, DROPDOWN_EMPTY_LABEL } from '../constants.js';
import { Badge } from '../../badge/index.js';
import { Dropdown } from '../index.js';
import type { DropdownItemType } from '../types.js';
import { openDropdown } from './dropdown.test-utils.js';

const ITEMS: DropdownItemType[] = [
	{ type: 'item', value: 'rename', label: 'Rename' },
	{ type: 'item', value: 'delete', label: 'Delete', danger: true },
];

function renderDropdown(props: Partial<Parameters<typeof Dropdown>[0]> = {}) {
	return render(
		<Dropdown nativeButton side="bottom" align="start" items={ITEMS} testId="menu" {...props}>
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

	it('puts a loading row spinner in place of its prefix', async () => {
		renderDropdown({
			items: [
				{
					type: 'item',
					value: 'rename',
					label: 'Rename',
					prefix: <svg data-testid="rename-icon" />,
					suffix: <svg data-testid="rename-suffix" />,
					loading: true,
					loadingTooltip: 'Saving',
				},
			],
		});
		await openDropdown();

		const row = screen.getByTestId('menu-item-rename');
		const prefix = row.querySelector('[data-slot="dropdown-item-prefix"]');
		const suffix = row.querySelector('[data-slot="dropdown-item-suffix"]');
		expect(prefix?.querySelector('[data-slot="spinner"]')).not.toBeNull();
		expect(screen.queryByTestId('rename-icon')).toBeNull();
		expect(suffix?.querySelector('[data-slot="spinner"]')).toBeNull();
		expect(screen.getByTestId('rename-suffix')).toBeInTheDocument();
	});

	it('puts a loading row spinner in the trailing slot when the row has no prefix', async () => {
		renderDropdown({
			items: [
				{
					type: 'item',
					value: 'rename',
					label: 'Rename',
					shortcut: 'R',
					loading: true,
					loadingTooltip: 'Saving',
				},
			],
		});
		await openDropdown();

		const row = screen.getByTestId('menu-item-rename');
		const suffix = row.querySelector('[data-slot="dropdown-item-suffix"]');
		expect(row.querySelector('[data-slot="dropdown-item-prefix"]')).toBeNull();
		expect(suffix?.querySelector('[data-slot="spinner"]')).not.toBeNull();
		expect(suffix).not.toHaveTextContent('R');
	});

	it('marks a danger row', async () => {
		renderDropdown();
		await openDropdown();

		expect(screen.getByTestId('menu-item-delete')).toHaveAttribute('data-danger', 'true');
		expect(screen.getByTestId('menu-item-rename')).not.toHaveAttribute('data-danger');
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

	it('renders noContent in the empty row without warning', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		renderDropdown({ items: [], noContent: <span>No dashboards yet</span> });
		await openDropdown();

		expect(screen.getByTestId('menu-empty')).toHaveTextContent('No dashboards yet');
		expect(warn).not.toHaveBeenCalled();
	});

	it('keeps the default text and the warning on an empty submenu', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		renderDropdown({
			noContent: 'Nothing here',
			items: [{ type: 'submenu', value: 'move', label: 'Move to', items: [] }],
		});
		await openDropdown();

		expect(warn).toHaveBeenCalledWith(
			'Dropdown: the submenu "move" has no items, showing the empty row.',
		);
	});

	it('renders each kind of row', async () => {
		renderDropdown({
			items: [
				{ type: 'item', value: 'rename', label: 'Rename' },
				{ type: 'separator', value: 'rule' },
				{ type: 'checkbox', name: 'pinned', label: 'Pinned', defaultValue: true },
				{
					type: 'radio-group',
					name: 'sort',
					defaultValue: 'name',
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

	it('puts aria-* and data-* on the popup, and the testId on the trigger', async () => {
		renderDropdown({ 'aria-label': 'Row actions', 'data-analytics': 'row-menu' });
		const popup = await openDropdown();

		expect(popup).toHaveAttribute('aria-label', 'Row actions');
		expect(popup).toHaveAttribute('data-analytics', 'row-menu');
		expect(screen.getByTestId('menu')).not.toHaveAttribute('data-analytics');
	});

	it('puts className and style on the popup, and on a submenu popup too', async () => {
		renderDropdown({
			className: 'above-the-panel',
			style: { zIndex: 1100 },
			items: [
				{
					type: 'submenu',
					value: 'download',
					label: 'Download',
					items: [{ type: 'item', value: 'csv', label: 'CSV' }],
				},
			],
		});
		const popup = await openDropdown();

		expect(popup).toHaveClass('above-the-panel');
		expect(popup.style.zIndex).toBe('1100');

		await userEvent.click(screen.getByTestId('menu-item-download'));

		const row = await screen.findByRole('menuitem', { name: 'CSV' });
		const submenu = row.closest<HTMLElement>('[data-slot="dropdown-popup"]');
		expect(submenu).toHaveAttribute('data-submenu');
		expect(submenu).toHaveClass('above-the-panel');
		expect(submenu?.style.zIndex).toBe('1100');
	});

	it('renders a link row as the element it was given', async () => {
		renderDropdown({
			items: [
				{
					type: 'link',
					value: 'docs',
					label: 'Documentation',
					render: <a href="/docs" />,
				},
			],
		});
		await openDropdown();

		const row = screen.getByTestId('menu-item-docs');
		expect(row.tagName).toBe('A');
		expect(row).toHaveAttribute('href', '/docs');
		expect(row).toHaveAttribute('data-slot', 'dropdown-link');
		expect(row).toHaveAttribute('role', 'menuitem');
	});

	it('drops render on an inert link row, so a middle click cannot walk around it', async () => {
		renderDropdown({
			items: [
				{
					type: 'link',
					value: 'docs',
					label: 'Documentation',
					render: <a href="/docs" />,
					disabled: true,
					disabledTooltip: 'Not for your role',
				},
			],
		});
		await openDropdown();

		const row = screen.getByTestId('menu-item-docs');
		expect(row.tagName).not.toBe('A');
		expect(row).not.toHaveAttribute('href');
		expect(row).toHaveAttribute('aria-disabled', 'true');
	});

	it('writes the size props as custom properties on the popup', async () => {
		renderDropdown({ contentMaxWidth: 480, contentMaxHeight: '30rem' });
		const popup = await openDropdown();

		expect(popup.style.getPropertyValue('--dropdown-internal-max-inline-size')).toBe('480px');
		expect(popup.style.getPropertyValue('--dropdown-internal-max-block-size')).toBe('30rem');
	});
	it('opens from a trigger that is not a native button', async () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		render(
			<Dropdown side="bottom" align="start" items={ITEMS} testId="menu" nativeButton={false}>
				<Badge>Status</Badge>
			</Dropdown>,
		);

		const trigger = screen.getByRole('button', { name: 'Status' });
		expect(trigger.tagName).toBe('SPAN');
		expect(trigger).not.toHaveAttribute('type');

		trigger.focus();
		await userEvent.keyboard('{Enter}');

		expect(await screen.findByRole('menu')).toBeInTheDocument();
		expect(error).not.toHaveBeenCalled();
	});

	it('does not warn about an empty items list while loading', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		renderDropdown({ items: [], loading: true });

		expect(warn).not.toHaveBeenCalled();
	});

	it('does not warn about an empty items list the server filtered down', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		renderDropdown({ items: [], searchInputProps: { filter: false } });

		expect(warn).not.toHaveBeenCalled();
	});

	it('drops the stray separators of a group and a submenu too', async () => {
		renderDropdown({
			items: [
				{
					type: 'group',
					value: 'edit',
					label: 'Edit',
					items: [
						{ type: 'separator', value: 'lead' },
						{ type: 'item', value: 'rename', label: 'Rename' },
					],
				},
				{
					type: 'submenu',
					value: 'more',
					label: 'More',
					items: [
						{ type: 'item', value: 'export', label: 'Export' },
						{ type: 'separator', value: 'one' },
						{ type: 'separator', value: 'two' },
						{ type: 'item', value: 'import', label: 'Import' },
						{ type: 'separator', value: 'trail' },
					],
				},
			],
		});
		await openDropdown();

		expect(screen.queryAllByRole('separator')).toHaveLength(0);

		await userEvent.click(screen.getByRole('menuitem', { name: 'More' }));
		await screen.findByRole('menuitem', { name: 'Export' });

		expect(screen.getAllByRole('separator')).toHaveLength(1);
	});
});
