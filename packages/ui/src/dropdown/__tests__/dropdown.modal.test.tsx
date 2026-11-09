import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser } from 'vitest/browser';
import { Drawer } from '../../drawer/index.js';
import { Dropdown } from '../index.js';
import type { DropdownItemType } from '../types.js';
import { openDropdown } from './dropdown.test-utils.js';

function noop(): void {}

function renderInDrawer(items: DropdownItemType[], container?: HTMLElement) {
	return render(
		<Drawer type="task" stack="overlay" open onClose={noop} title="Settings">
			{/* Out of the panel's flex row: a stretched trigger would widen the menu with it. */}
			<div>
				<Dropdown nativeButton items={items} container={container}>
					<button type="button">Actions</button>
				</Dropdown>
			</div>
		</Drawer>,
	);
}

function drawerPanel(): HTMLElement {
	return document.querySelector('[data-slot="drawer-popup"]') as HTMLElement;
}

describe('Dropdown inside a modal', () => {
	// A modal drawer makes the page outside its panel inert and traps focus in the panel, so
	// the menu goes into the panel. Outside it no row could be clicked, and the drawer would pull
	// the focus back to the trigger on every arrow key.
	it('portals into the drawer and keeps the rows clickable', async () => {
		const onClick = vi.fn();
		renderInDrawer([{ type: 'item', value: 'rename', label: 'Rename', onClick }]);

		const menu = await openDropdown();
		const row = screen.getByRole('menuitem', { name: 'Rename' });

		expect(drawerPanel().contains(menu)).toBe(true);

		const { left, top, width, height } = row.getBoundingClientRect();
		const hit = document.elementFromPoint(left + width / 2, top + height / 2);

		expect(row.contains(hit)).toBe(true);

		await userEvent.click(row);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	// A real press, not a synthetic one: the drawer starts a swipe on a press outside its content
	// and captures the pointer, and the row would then never get its click.
	it('takes a real mouse click on a row', async () => {
		const onClick = vi.fn();
		renderInDrawer([{ type: 'item', value: 'rename', label: 'Rename', onClick }]);
		await openDropdown();

		await browserUser.click(screen.getByRole('menuitem', { name: 'Rename' }));

		await waitFor(() => {
			expect(onClick).toHaveBeenCalledTimes(1);
		});
	});

	it('takes a real mouse click on a row of a menu in a container outside the drawer', async () => {
		const onClick = vi.fn();
		const outside = document.createElement('div');
		document.body.append(outside);
		renderInDrawer([{ type: 'item', value: 'rename', label: 'Rename', onClick }], outside);
		await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
		const row = await waitFor(() => {
			const item = outside.querySelector<HTMLElement>('[role="menuitem"]');
			expect(item).not.toBeNull();

			return item as HTMLElement;
		});

		await browserUser.click(row);

		await waitFor(() => {
			expect(onClick).toHaveBeenCalledTimes(1);
		});
		outside.remove();
	});

	it('lets the keyboard reach the rows', async () => {
		const onClick = vi.fn();
		renderInDrawer([
			{ type: 'item', value: 'rename', label: 'Rename' },
			{ type: 'item', value: 'copy', label: 'Copy', onClick },
		]);
		await openDropdown();

		await userEvent.keyboard('{ArrowDown}{ArrowDown}');

		await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus());

		await userEvent.keyboard('{Enter}');

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	// The layer the menu goes into has no size, so a menu sized by what is left of its
	// containing block would wrap its rows down to its minimum width.
	it('grows a menu with wrapping rows up to its maximum width', async () => {
		const wrapping = document.createElement('style');
		wrapping.textContent = `:root {
			--dropdown-item-white-space: normal;
			--dropdown-item-label-white-space: normal;
		}`;
		document.head.append(wrapping);
		renderInDrawer([
			{ type: 'item', value: 'long', label: 'A row label far longer than any menu is wide' },
		]);

		const menu = await openDropdown();

		// The drawer is still sliding in, and a rect measured through a fractional translate
		// comes back a float32 step short of the layout width.
		expect(menu.getBoundingClientRect().width).toBeCloseTo(
			Number.parseFloat(getComputedStyle(menu).maxInlineSize),
			2,
		);
		wrapping.remove();
	});

	it('keeps a container passed on the dropdown', async () => {
		const outside = document.createElement('div');
		document.body.append(outside);
		renderInDrawer([{ type: 'item', value: 'rename', label: 'Rename' }], outside);

		await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

		// The drawer hides everything outside it from the accessibility tree, so no role query.
		await waitFor(() => expect(outside.querySelector('[role="menu"]')).not.toBeNull());
		outside.remove();
	});
});

function isOnTop(element: HTMLElement): boolean {
	const { left, top, width, height } = element.getBoundingClientRect();

	return element.contains(document.elementFromPoint(left + width / 2, top + height / 2));
}

// A modal from another library, such as antd's, has no panel to portal into. The menu goes to the
// body and has to stack above the layer its trigger sits in, and each submenu above the menu.
describe('Dropdown inside a layer from another library', () => {
	it('stacks the menu and its submenu above the layer', async () => {
		render(
			<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
				<Dropdown
					nativeButton
					items={[
						{
							type: 'submenu',
							value: 'export',
							label: 'Export',
							items: [{ type: 'item', value: 'csv', label: 'As CSV' }],
						},
					]}
				>
					<button type="button">Actions</button>
				</Dropdown>
			</div>,
		);
		await openDropdown();
		const submenuRow = screen.getByRole('menuitem', { name: 'Export' });

		expect(isOnTop(submenuRow)).toBe(true);

		await userEvent.click(submenuRow);

		expect(isOnTop(await screen.findByRole('menuitem', { name: 'As CSV' }))).toBe(true);
	});
});
