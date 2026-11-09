import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type MouseEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from '../breadcrumb.js';
import type { BreadcrumbItemType } from '../types.js';
import {
	expectEllipsisPopupClosed,
	openEllipsisPopup,
	RouterLink,
	TRAIL,
} from './breadcrumb.test-utils.js';

/** A click on a real anchor would navigate the page the tests run in. */
function stay(event: MouseEvent): void {
	event.preventDefault();
}

async function expectMenuClosed(): Promise<void> {
	await waitFor(() => {
		expect(screen.queryByRole('menu')).toBeNull();
	});
}

describe('Breadcrumb crumbs', () => {
	it('calls the onClick of a link crumb, with the event', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn(stay);

		render(<Breadcrumb items={[{ title: 'Home', href: '/home', onClick }, { title: 'Now' }]} />);
		await user.click(screen.getByRole('link', { name: 'Home' }));

		expect(onClick).toHaveBeenCalledOnce();
		expect(onClick.mock.calls[0]?.[0]).toMatchObject({ type: 'click' });
	});

	it('calls the onClick of a button crumb', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(<Breadcrumb items={[{ title: 'Reports', onClick }, { title: 'Now' }]} />);
		await user.click(screen.getByRole('button', { name: 'Reports' }));

		expect(onClick).toHaveBeenCalledOnce();
	});

	it('calls only the onClick of the crumb that was pressed', async () => {
		const user = userEvent.setup();
		const onFirst = vi.fn();
		const onSecond = vi.fn();

		render(
			<Breadcrumb
				items={[
					{ title: 'First', onClick: onFirst },
					{ title: 'Second', onClick: onSecond },
					{ title: 'Now' },
				]}
			/>,
		);
		await user.click(screen.getByRole('button', { name: 'Second' }));

		expect(onSecond).toHaveBeenCalledOnce();
		expect(onFirst).not.toHaveBeenCalled();
	});

	it('activates a button crumb with Enter and with Space', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(<Breadcrumb items={[{ title: 'Reports', onClick }, { title: 'Now' }]} />);
		await user.tab();
		expect(screen.getByRole('button', { name: 'Reports' })).toHaveFocus();

		await user.keyboard('{Enter}');
		expect(onClick).toHaveBeenCalledTimes(1);

		await user.keyboard(' ');
		expect(onClick).toHaveBeenCalledTimes(2);
	});

	it('activates a link crumb with Enter', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn(stay);

		render(<Breadcrumb items={[{ title: 'Home', href: '/home', onClick }, { title: 'Now' }]} />);
		await user.tab();
		await user.keyboard('{Enter}');

		expect(onClick).toHaveBeenCalledOnce();
	});

	it('does nothing when a plain crumb is pressed, and keeps it out of the tab order', async () => {
		const user = userEvent.setup();

		render(<Breadcrumb items={[{ title: 'Reports' }, { title: 'Now' }]} />);
		await user.click(screen.getByText('Reports'));
		await user.tab();

		expect(document.body).toHaveFocus();
	});

	it('walks the crumbs that do something with Tab, in order', async () => {
		const user = userEvent.setup();

		render(
			<Breadcrumb
				items={[
					{ title: 'Home', href: '/home' },
					{ title: 'Plain' },
					{ title: 'Reports', onClick: vi.fn() },
					{ title: 'Services', menu: [{ title: 'Checkout' }] },
					{ title: 'Now' },
				]}
			/>,
		);

		const focused: (string | null | undefined)[] = [];

		for (let step = 0; step < 4; step++) {
			await user.tab();
			focused.push(document.activeElement?.textContent);
		}

		// Three stops, then the focus leaves the trail.
		expect(focused.slice(0, 3)).toEqual(['Home', 'Reports', 'Services']);
		expect(screen.getByRole('button', { name: 'Services' }).contains(document.activeElement)).toBe(
			false,
		);
	});

	describe('with a render element', () => {
		it('calls the onClick of the element, with the event', async () => {
			const user = userEvent.setup();
			const onGo = vi.fn();

			render(
				<Breadcrumb
					items={[
						{ title: 'Home', render: <RouterLink to="/home" onClick={onGo} /> },
						{ title: 'Now' },
					]}
				/>,
			);
			await user.click(screen.getByRole('link', { name: 'Home' }));

			expect(onGo).toHaveBeenCalledOnce();
			expect(onGo.mock.calls[0]?.[0]).toMatchObject({ type: 'click' });
		});

		it('calls the onClick of the crumb for a crumb that is only a render', async () => {
			const user = userEvent.setup();
			const onClick = vi.fn();

			render(
				<Breadcrumb
					items={[{ title: 'Home', render: <RouterLink to="/home" />, onClick }, { title: 'Now' }]}
				/>,
			);
			await user.click(screen.getByRole('link', { name: 'Home' }));

			expect(onClick).toHaveBeenCalledOnce();
		});

		it('calls the onClick of the element first, then the one of the crumb', async () => {
			const user = userEvent.setup();
			const order: string[] = [];

			render(
				<Breadcrumb
					items={[
						{
							title: 'Home',
							render: <RouterLink to="/home" onClick={() => order.push('element')} />,
							onClick: () => order.push('crumb'),
						},
						{ title: 'Now' },
					]}
				/>,
			);
			await user.click(screen.getByRole('link', { name: 'Home' }));

			expect(order).toEqual(['element', 'crumb']);
		});

		it('activates the element with Enter', async () => {
			const user = userEvent.setup();
			const onClick = vi.fn();

			render(
				<Breadcrumb
					items={[{ title: 'Home', render: <RouterLink to="/home" />, onClick }, { title: 'Now' }]}
				/>,
			);
			await user.tab();
			expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();

			await user.keyboard('{Enter}');

			expect(onClick).toHaveBeenCalledOnce();
		});
	});
});

describe('Breadcrumb crumb menu', () => {
	const MENU_ITEMS = (onRename = vi.fn(), onLogs = vi.fn(stay)): BreadcrumbItemType[] => [
		{ title: 'Home', href: '/home' },
		{
			title: 'Services',
			menu: [
				{ title: 'Checkout', href: '/services/checkout', onClick: onLogs },
				{ title: 'Payments', href: '/services/payments' },
				{ title: 'Rename', onClick: onRename },
			],
		},
		{ title: 'Now' },
	];

	it('opens a menu of its entries from the crumb', async () => {
		const user = userEvent.setup();
		render(<Breadcrumb items={MENU_ITEMS()} testId="bc" />);

		const trigger = screen.getByRole('button', { name: 'Services' });
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();

		await user.click(trigger);

		const menu = await screen.findByRole('menu');
		expect(
			within(menu)
				.getAllByRole('menuitem')
				.map((row) => row.textContent),
		).toEqual(['Checkout', 'Payments', 'Rename']);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		expect(trigger).toHaveAttribute('data-popup-open');
	});

	it('renders an entry with an href as a link, and one without as an action', async () => {
		const user = userEvent.setup();
		render(<Breadcrumb items={MENU_ITEMS()} testId="bc" />);

		await user.click(screen.getByRole('button', { name: 'Services' }));
		await screen.findByRole('menu');

		const checkout = screen.getByRole('menuitem', { name: 'Checkout' });
		const rename = screen.getByRole('menuitem', { name: 'Rename' });

		expect(checkout.tagName).toBe('A');
		expect(checkout).toHaveAttribute('href', '/services/checkout');
		expect(screen.getByRole('menuitem', { name: 'Payments' })).toHaveAttribute(
			'href',
			'/services/payments',
		);
		expect(rename.tagName).not.toBe('A');
		expect(rename).not.toHaveAttribute('href');
	});

	it('names the rows after the menu of the crumb', async () => {
		const user = userEvent.setup();
		render(<Breadcrumb items={MENU_ITEMS()} testId="bc" />);

		expect(screen.getByTestId('bc-item-1-menu')).toBe(
			screen.getByRole('button', { name: 'Services' }),
		);

		await user.click(screen.getByTestId('bc-item-1-menu'));
		await screen.findByRole('menu');

		expect(screen.getByTestId('bc-item-1-menu-item-0')).toHaveTextContent('Checkout');
		expect(screen.getByTestId('bc-item-1-menu-item-2')).toHaveTextContent('Rename');
	});

	it('calls the onClick of an action entry and closes the menu', async () => {
		const user = userEvent.setup();
		const onRename = vi.fn();
		render(<Breadcrumb items={MENU_ITEMS(onRename)} />);

		await user.click(screen.getByRole('button', { name: 'Services' }));
		await user.click(await screen.findByRole('menuitem', { name: 'Rename' }));

		expect(onRename).toHaveBeenCalledOnce();
		await expectMenuClosed();
	});

	it('calls the onClick of a link entry and closes the menu', async () => {
		const user = userEvent.setup();
		const onCheckout = vi.fn(stay);
		render(<Breadcrumb items={MENU_ITEMS(vi.fn(), onCheckout)} />);

		await user.click(screen.getByRole('button', { name: 'Services' }));
		await user.click(await screen.findByRole('menuitem', { name: 'Checkout' }));

		expect(onCheckout).toHaveBeenCalledOnce();
		await expectMenuClosed();
	});

	it('closes without calling anything when a link entry has no onClick', async () => {
		const user = userEvent.setup();
		const onRename = vi.fn();
		render(<Breadcrumb items={MENU_ITEMS(onRename)} />);

		await user.click(screen.getByRole('button', { name: 'Services' }));
		const payments = await screen.findByRole('menuitem', { name: 'Payments' });
		payments.addEventListener('click', (event) => event.preventDefault());
		await user.click(payments);

		expect(onRename).not.toHaveBeenCalled();
		await expectMenuClosed();
	});

	it('opens with Enter and with Space, and closes with Escape, giving the focus back', async () => {
		const user = userEvent.setup();
		render(<Breadcrumb items={MENU_ITEMS()} />);

		const trigger = screen.getByRole('button', { name: 'Services' });
		trigger.focus();

		await user.keyboard('{Enter}');
		await screen.findByRole('menu');
		await user.keyboard('{Escape}');
		await expectMenuClosed();
		expect(trigger).toHaveFocus();

		await user.keyboard(' ');
		await screen.findByRole('menu');
		await user.keyboard('{Escape}');
		await expectMenuClosed();
		expect(trigger).toHaveFocus();
	});

	it('walks the entries with the arrow keys and picks one with Enter', async () => {
		const user = userEvent.setup();
		const onRename = vi.fn();
		render(<Breadcrumb items={MENU_ITEMS(onRename)} />);

		screen.getByRole('button', { name: 'Services' }).focus();
		await user.keyboard('{Enter}');
		await screen.findByRole('menu');

		// Opening from the keyboard lands on the first entry.
		await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Checkout' })).toHaveFocus());
		await user.keyboard('{ArrowDown}{ArrowDown}');
		await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus());

		await user.keyboard('{Enter}');

		expect(onRename).toHaveBeenCalledOnce();
		await expectMenuClosed();
	});

	it('opens the menu of a crumb that has a render too, and never follows the render', async () => {
		const user = userEvent.setup();
		const onGo = vi.fn();
		render(
			<Breadcrumb
				items={[
					{ title: 'Home', href: '/home' },
					{
						title: 'Services',
						render: <RouterLink to="/services" onClick={onGo} />,
						menu: [{ title: 'Checkout', href: '/services/checkout' }],
					},
					{ title: 'Now' },
				]}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Services' }));

		expect(await screen.findByRole('menuitem', { name: 'Checkout' })).toBeInTheDocument();
		expect(document.querySelector('a[href="/services"]')).toBeNull();
		expect(onGo).not.toHaveBeenCalled();
	});

	describe('an entry with a render element', () => {
		function renderWithEntries(menu: BreadcrumbItemType['menu']) {
			return render(
				<Breadcrumb
					items={[{ title: 'Home', href: '/home' }, { title: 'Services', menu }, { title: 'Now' }]}
					testId="bc"
				/>,
			);
		}

		it('is a link row that renders the element, with the title as its label', async () => {
			const user = userEvent.setup();
			renderWithEntries([
				{ title: 'Checkout', render: <RouterLink to="/services/checkout" data-router="link" /> },
				{ title: 'Rename', onClick: vi.fn() },
			]);

			await user.click(screen.getByRole('button', { name: 'Services' }));
			await screen.findByRole('menu');

			const checkout = screen.getByRole('menuitem', { name: 'Checkout' });
			expect(checkout.tagName).toBe('A');
			expect(checkout).toHaveAttribute('href', '/services/checkout');
			expect(checkout).toHaveAttribute('data-router', 'link');
			expect(screen.getByRole('menuitem', { name: 'Rename' }).tagName).not.toBe('A');
		});

		it('keeps the label of the entry, not the children of the element', async () => {
			const user = userEvent.setup();
			renderWithEntries([
				{
					title: 'Checkout',
					render: <RouterLink to="/services/checkout">Not the label</RouterLink>,
				},
			]);

			await user.click(screen.getByRole('button', { name: 'Services' }));

			const menu = await screen.findByRole('menu');
			expect(within(menu).queryByText('Not the label')).not.toBeInTheDocument();
			expect(within(menu).getByRole('menuitem', { name: 'Checkout' })).toBeInTheDocument();
		});

		it('takes the href and the target of the entry the element leaves unset', async () => {
			const user = userEvent.setup();
			renderWithEntries([
				{
					title: 'Docs',
					href: '/docs',
					target: '_blank',
					render: <RouterLink href={undefined} rel="nofollow" />,
				},
			]);

			await user.click(screen.getByRole('button', { name: 'Services' }));

			const docs = await screen.findByRole('menuitem', { name: 'Docs' });
			expect(docs).toHaveAttribute('href', '/docs');
			expect(docs).toHaveAttribute('target', '_blank');
			expect(docs).toHaveAttribute('rel', 'nofollow noopener noreferrer');
		});

		it('calls the onClick of the element first, then the one of the entry, and closes the menu', async () => {
			const user = userEvent.setup();
			const order: string[] = [];
			renderWithEntries([
				{
					title: 'Checkout',
					render: <RouterLink to="/services/checkout" onClick={() => order.push('element')} />,
					onClick: () => order.push('entry'),
				},
			]);

			await user.click(screen.getByRole('button', { name: 'Services' }));
			await user.click(await screen.findByRole('menuitem', { name: 'Checkout' }));

			expect(order).toEqual(['element', 'entry']);
			await expectMenuClosed();
		});

		it('names the row after the menu of the crumb', async () => {
			const user = userEvent.setup();
			renderWithEntries([{ title: 'Checkout', render: <RouterLink to="/services/checkout" /> }]);

			await user.click(screen.getByTestId('bc-item-1-menu'));
			await screen.findByRole('menu');

			expect(screen.getByTestId('bc-item-1-menu-item-0')).toBe(
				screen.getByRole('menuitem', { name: 'Checkout' }),
			);
		});
	});

	it('opens the menu of the last crumb as well, which is the current page', async () => {
		const user = userEvent.setup();
		render(
			<Breadcrumb
				items={[
					{ title: 'Home', href: '/home' },
					{ title: 'Checkout', menu: [{ title: 'Payments', href: '/payments' }] },
				]}
			/>,
		);

		const trigger = screen.getByRole('button', { name: 'Checkout' });
		expect(trigger).toHaveAttribute('aria-current', 'page');

		await user.click(trigger);

		expect(await screen.findByRole('menuitem', { name: 'Payments' })).toBeInTheDocument();
	});
});

describe('Breadcrumb ellipsis popup', () => {
	function renderCollapsed(items: BreadcrumbItemType[] = TRAIL) {
		return render(<Breadcrumb items={items} maxVisible={2} testId="bc" />);
	}

	function rowNames(popup: HTMLElement): (string | null)[] {
		return within(popup)
			.getAllByRole('listitem')
			.map((row) => row.textContent);
	}

	it('is a button that says how many crumbs it hides', () => {
		renderCollapsed();

		const trigger = screen.getByTestId('bc-ellipsis');
		expect(trigger).toBe(screen.getByRole('button', { name: 'Show 3 hidden items' }));
		expect(trigger).toHaveTextContent('...');
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(trigger).toHaveAttribute('data-slot', 'breadcrumb-ellipsis-trigger');
		expect(trigger.closest('li')).toHaveAttribute('data-slot', 'breadcrumb-ellipsis');
	});

	it('opens a popup of the collapsed crumbs in path order, with no icons', async () => {
		renderCollapsed();

		const popup = await openEllipsisPopup();

		expect(rowNames(popup)).toEqual(['Payments', 'Services', 'Checkout']);
		expect(screen.getByTestId('bc-ellipsis')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('bc-ellipsis')).toHaveAttribute('data-popup-open');
		expect(popup.querySelector('svg')).toBeNull();
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('renders every row with an href as a link to that crumb', async () => {
		renderCollapsed();

		const popup = await openEllipsisPopup();

		const rows = within(popup).getAllByRole('link');
		expect(rows.map((row) => row.tagName)).toEqual(['A', 'A', 'A']);
		expect(rows.map((row) => row.getAttribute('href'))).toEqual([
			'/dashboards/payments',
			'/dashboards/payments/services',
			'/dashboards/payments/services/checkout',
		]);
	});

	it('calls the onClick of a collapsed link crumb from its row, and closes the popup', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn(stay);
		const items = TRAIL.map((item, index) => (index === 2 ? { ...item, onClick } : item));

		renderCollapsed(items);
		const popup = await openEllipsisPopup();
		await user.click(within(popup).getByRole('link', { name: 'Services' }));

		expect(onClick).toHaveBeenCalledOnce();
		await expectEllipsisPopupClosed();
	});

	it('renders a collapsed crumb with only an onClick as a button row', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const items: BreadcrumbItemType[] = [
			{ title: 'Home', href: '/home' },
			{ title: 'Reports', onClick },
			{ title: 'Plain' },
			{ title: 'Now' },
		];

		renderCollapsed(items);
		const popup = await openEllipsisPopup();

		const reports = within(popup).getByRole('button', { name: 'Reports' });
		expect(reports).toHaveAttribute('data-kind', 'button');
		expect(reports.tagName).toBe('BUTTON');
		expect(within(popup).queryByRole('button', { name: 'Plain' })).not.toBeInTheDocument();
		expect(within(popup).queryByRole('link', { name: 'Plain' })).not.toBeInTheDocument();

		await user.click(reports);

		expect(onClick).toHaveBeenCalledOnce();
		await expectEllipsisPopupClosed();
	});

	it('calls nothing and keeps the popup open when a row of a plain crumb is pressed', async () => {
		const user = userEvent.setup();
		const onOther = vi.fn();
		const items: BreadcrumbItemType[] = [
			{ title: 'Home', href: '/home', onClick: onOther },
			{ title: 'Plain' },
			{ title: 'Now', onClick: onOther },
		];

		renderCollapsed(items);
		const popup = await openEllipsisPopup();
		const plain = within(popup).getByText('Plain').closest('[data-slot="breadcrumb-ellipsis-row"]');

		expect(plain).toHaveAttribute('data-kind', 'text');
		await user.click(plain as HTMLElement);

		expect(onOther).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Hidden items' })).toBe(popup);
	});

	describe('for a collapsed crumb with a menu', () => {
		const onRename = vi.fn();
		const onCheckout = vi.fn(stay);
		const onCrumb = vi.fn(stay);
		const MENU_TRAIL: BreadcrumbItemType[] = [
			{ title: 'Home', href: '/home' },
			{
				title: 'Services',
				href: '/services',
				onClick: onCrumb,
				menu: [
					{ title: 'Checkout', href: '/services/checkout', onClick: onCheckout },
					{ title: 'Rename', onClick: onRename },
				],
			},
			{ title: 'Now' },
		];

		beforeEach(() => {
			onRename.mockClear();
			onCheckout.mockClear();
			onCrumb.mockClear();
		});

		async function openMenu(): Promise<HTMLElement> {
			const popup = await openEllipsisPopup();
			await userEvent.setup().click(within(popup).getByRole('button', { name: 'Services' }));
			await screen.findByRole('menuitem', { name: 'Checkout' });

			return popup;
		}

		it('lists it as one row, its entries behind a menu', async () => {
			renderCollapsed(MENU_TRAIL);

			const popup = await openEllipsisPopup();

			const row = within(popup).getByRole('button', { name: 'Services' });
			expect(within(popup).getAllByRole('listitem')).toHaveLength(1);
			expect(row).toHaveAttribute('data-kind', 'menu');
			expect(row).toHaveAttribute('aria-haspopup', 'menu');
			expect(row).not.toHaveAttribute('href');
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
			expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
		});

		it('opens a menu with the entries of the crumb, links and actions alike', async () => {
			renderCollapsed(MENU_TRAIL);

			const popup = await openMenu();

			const checkout = screen.getByRole('menuitem', { name: 'Checkout' });
			expect(checkout.tagName).toBe('A');
			expect(checkout).toHaveAttribute('href', '/services/checkout');
			expect(screen.getByRole('menuitem', { name: 'Rename' }).tagName).not.toBe('A');
			expect(within(popup).getByRole('button', { name: 'Services' })).toHaveAttribute(
				'aria-expanded',
				'true',
			);
			expect(screen.getByRole('dialog', { name: 'Hidden items' })).toBe(popup);
		});

		it('reaches an entry: its onClick runs and the menu and the popup close', async () => {
			renderCollapsed(MENU_TRAIL);

			await openMenu();
			await userEvent.setup().click(screen.getByRole('menuitem', { name: 'Rename' }));

			expect(onRename).toHaveBeenCalledOnce();
			await expectMenuClosed();
			await expectEllipsisPopupClosed();
		});

		it('follows a link entry, and closes the menu and the popup', async () => {
			renderCollapsed(MENU_TRAIL);

			await openMenu();
			await userEvent.setup().click(screen.getByRole('menuitem', { name: 'Checkout' }));

			expect(onCheckout).toHaveBeenCalledOnce();
			await expectMenuClosed();
			await expectEllipsisPopupClosed();
		});

		it('never reaches the href or the onClick of the crumb, the menu wins as it does while visible', async () => {
			renderCollapsed(MENU_TRAIL);

			await openMenu();

			expect(document.querySelector('a[href="/services"]')).toBeNull();
			expect(onCrumb).not.toHaveBeenCalled();
		});

		it('names the row after the crumb and the entries after its menu', async () => {
			renderCollapsed(MENU_TRAIL);

			const popup = await openMenu();

			expect(screen.getByTestId('bc-item-1')).toBe(
				within(popup).getByRole('button', { name: 'Services' }),
			);
			expect(screen.getByTestId('bc-item-1-menu-item-0')).toHaveTextContent('Checkout');
			expect(screen.getByTestId('bc-item-1-menu-item-1')).toHaveTextContent('Rename');
		});

		it('opens the menu from the keyboard, and picks an entry with Enter', async () => {
			renderCollapsed(MENU_TRAIL);

			const user = userEvent.setup();
			screen.getByTestId('bc-ellipsis').focus();
			await user.keyboard('{Enter}');
			const popup = await screen.findByRole('dialog', { name: 'Hidden items' });
			await waitFor(() =>
				expect(within(popup).getByRole('button', { name: 'Services' })).toHaveFocus(),
			);
			await user.keyboard('{Enter}');

			await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Checkout' })).toHaveFocus());
			await user.keyboard('{ArrowDown}{Enter}');

			expect(onRename).toHaveBeenCalledOnce();
			await expectMenuClosed();
			await expectEllipsisPopupClosed();
		});

		it('falls back to the href while the menu is empty, as the visible crumb does', async () => {
			renderCollapsed([
				{ title: 'Home', href: '/home' },
				{ title: 'Services', href: '/services', menu: [] },
				{ title: 'Now' },
			]);

			const popup = await openEllipsisPopup();

			expect(within(popup).getByRole('link', { name: 'Services' })).toHaveAttribute(
				'href',
				'/services',
			);
			expect(within(popup).queryByRole('button', { name: 'Services' })).not.toBeInTheDocument();
		});
	});

	describe('for a collapsed crumb with a render element', () => {
		const ROUTED_TRAIL: BreadcrumbItemType[] = [
			{ title: 'Dashboards', render: <RouterLink to="/app/dashboards" /> },
			{ title: 'Payments', render: <RouterLink to="/app/payments" data-router="link" /> },
			{ title: 'Services', render: <RouterLink to="/app/services" data-router="link" /> },
			{ title: 'Now' },
		];

		it('renders every row with its element, a link row without an href of the crumb', async () => {
			renderCollapsed(ROUTED_TRAIL);

			const popup = await openEllipsisPopup();

			const rows = within(popup).getAllByRole('link');
			expect(rows.map((row) => row.tagName)).toEqual(['A', 'A']);
			expect(rows.map((row) => row.textContent)).toEqual(['Payments', 'Services']);
			expect(rows.map((row) => row.getAttribute('href'))).toEqual([
				'/app/payments',
				'/app/services',
			]);
			expect(rows.map((row) => row.getAttribute('data-router'))).toEqual(['link', 'link']);
			expect(rows.map((row) => row.getAttribute('data-slot'))).toEqual([
				'breadcrumb-ellipsis-row',
				'breadcrumb-ellipsis-row',
			]);
		});

		it('keeps the label of the crumb, not the children of the element', async () => {
			renderCollapsed([
				{ title: 'Home', href: '/home' },
				{ title: 'Payments', render: <RouterLink to="/payments">Not the label</RouterLink> },
				{ title: 'Services', href: '/services' },
				{ title: 'Now' },
			]);

			const popup = await openEllipsisPopup();

			expect(within(popup).queryByText('Not the label')).not.toBeInTheDocument();
			expect(within(popup).getByRole('link', { name: 'Payments' })).toHaveAttribute(
				'href',
				'/payments',
			);
		});

		it('leaves the ref of the element on the collapsed crumb, before and after the popup opens', async () => {
			const ref = createRef<HTMLAnchorElement>();
			renderCollapsed([
				{ title: 'Home', href: '/home' },
				{ title: 'Payments', render: <RouterLink ref={ref} to="/payments" /> },
				{ title: 'Services', href: '/services' },
				{ title: 'Now' },
			]);

			// A collapsed crumb gives its test id to its row, so the collapsed link is found by its slot.
			const crumbLink = document.querySelector('[data-collapsed] a[href="/payments"]');
			expect(crumbLink).not.toBeNull();
			expect(ref.current).toBe(crumbLink);

			const popup = await openEllipsisPopup();
			const row = within(popup).getByRole('link', { name: 'Payments' });
			expect(ref.current).toBe(crumbLink);
			expect(ref.current).not.toBe(row);

			await userEvent.setup().keyboard('{Escape}');
			await expectEllipsisPopupClosed();
			expect(ref.current).toBe(crumbLink);
			expect(crumbLink).toBeInTheDocument();
		});

		it('takes the href and the target of the crumb the element leaves unset', async () => {
			renderCollapsed([
				{ title: 'Home', href: '/home' },
				{
					title: 'Docs',
					href: '/docs',
					target: '_blank',
					render: <RouterLink href={undefined} rel="nofollow" />,
				},
				{ title: 'Services', href: '/services' },
				{ title: 'Now' },
			]);

			const popup = await openEllipsisPopup();

			const docs = within(popup).getByRole('link', { name: 'Docs' });
			expect(docs).toHaveAttribute('href', '/docs');
			expect(docs).toHaveAttribute('target', '_blank');
			expect(docs).toHaveAttribute('rel', 'nofollow noopener noreferrer');
		});

		it('calls the onClick of the element first, then the one of the crumb, and closes the popup', async () => {
			const order: string[] = [];
			const items = ROUTED_TRAIL.map((item, index) =>
				index === 1
					? {
							...item,
							render: <RouterLink to="/app/payments" onClick={() => order.push('element')} />,
							onClick: () => order.push('crumb'),
						}
					: item,
			);

			renderCollapsed(items);
			const popup = await openEllipsisPopup();
			await userEvent.setup().click(within(popup).getByRole('link', { name: 'Payments' }));

			expect(order).toEqual(['element', 'crumb']);
			await expectEllipsisPopupClosed();
		});

		it('names the row after the crumb, as the crumb is named while it shows', async () => {
			renderCollapsed(ROUTED_TRAIL);

			const popup = await openEllipsisPopup();

			expect(screen.getByTestId('bc-item-1')).toBe(
				within(popup).getByRole('link', { name: 'Payments' }),
			);
		});

		it('keeps the menu of a crumb that has a menu over its render', async () => {
			renderCollapsed([
				{ title: 'Home', href: '/home' },
				{
					title: 'Services',
					render: <RouterLink to="/app/services" />,
					menu: [{ title: 'Checkout', render: <RouterLink to="/app/services/checkout" /> }],
				},
				{ title: 'Now' },
			]);

			const popup = await openEllipsisPopup();
			await userEvent.setup().click(within(popup).getByRole('button', { name: 'Services' }));

			const checkout = await screen.findByRole('menuitem', { name: 'Checkout' });
			expect(checkout).toHaveAttribute('href', '/app/services/checkout');
			expect(document.querySelector('a[href="/app/services"]')).toBeNull();
		});
	});

	it('opens with Enter and with Space, and closes with Escape, giving the focus back', async () => {
		const user = userEvent.setup();
		renderCollapsed();

		const trigger = screen.getByTestId('bc-ellipsis');
		trigger.focus();

		await user.keyboard('{Enter}');
		expect(await screen.findByRole('dialog', { name: 'Hidden items' })).toBeInTheDocument();
		await user.keyboard('{Escape}');
		await expectEllipsisPopupClosed();
		expect(trigger).toHaveFocus();

		await user.keyboard(' ');
		expect(await screen.findByRole('dialog', { name: 'Hidden items' })).toBeInTheDocument();
		await user.keyboard('{Escape}');
		await expectEllipsisPopupClosed();
		expect(trigger).toHaveFocus();
	});

	it('walks the rows with the arrow keys, in path order', async () => {
		const user = userEvent.setup();
		renderCollapsed();

		screen.getByTestId('bc-ellipsis').focus();
		await user.keyboard('{Enter}');
		const popup = await screen.findByRole('dialog', { name: 'Hidden items' });

		// Opening from the keyboard lands on the first row.
		await waitFor(() =>
			expect(within(popup).getByRole('link', { name: 'Payments' })).toHaveFocus(),
		);
		await user.keyboard('{ArrowDown}');
		expect(within(popup).getByRole('link', { name: 'Services' })).toHaveFocus();
		await user.keyboard('{ArrowDown}');
		expect(within(popup).getByRole('link', { name: 'Checkout' })).toHaveFocus();
	});

	it('picks the focused row with Enter', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn(stay);
		const items = TRAIL.map((item, index) => (index === 1 ? { ...item, onClick } : item));

		renderCollapsed(items);
		screen.getByTestId('bc-ellipsis').focus();
		await user.keyboard('{Enter}');
		const popup = await screen.findByRole('dialog', { name: 'Hidden items' });
		await waitFor(() =>
			expect(within(popup).getByRole('link', { name: 'Payments' })).toHaveFocus(),
		);
		await user.keyboard('{Enter}');

		expect(onClick).toHaveBeenCalledOnce();
		await expectEllipsisPopupClosed();
	});

	it('closes when another crumb is clicked', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn(stay);
		const items = TRAIL.map((item, index) => (index === 0 ? { ...item, onClick } : item));

		renderCollapsed(items);
		await openEllipsisPopup();
		await user.click(screen.getByRole('link', { name: 'Dashboards' }));

		expect(onClick).toHaveBeenCalledOnce();
		await expectEllipsisPopupClosed();
	});

	it('says one hidden item in the singular', () => {
		render(<Breadcrumb items={TRAIL.slice(0, 3)} maxVisible={2} testId="bc" />);

		expect(screen.getByTestId('bc-ellipsis')).toHaveAccessibleName('Show 1 hidden item');
	});

	it('keeps its popup apart from the crumbs that have a menu of their own', async () => {
		const user = userEvent.setup();
		const items: BreadcrumbItemType[] = [
			{ title: 'Home', href: '/home', menu: [{ title: 'Sibling', href: '/sibling' }] },
			{ title: 'Middle', href: '/middle' },
			{ title: 'Now' },
		];

		renderCollapsed(items);
		const popup = await openEllipsisPopup();

		expect(rowNames(popup)).toEqual(['Middle']);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		await user.keyboard('{Escape}');
		await expectEllipsisPopupClosed();

		await user.click(screen.getByTestId('bc-item-0-menu'));
		expect(await screen.findByRole('menuitem', { name: 'Sibling' })).toBeInTheDocument();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});
});
