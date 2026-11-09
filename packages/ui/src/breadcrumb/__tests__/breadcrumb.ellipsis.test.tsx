import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser, page } from 'vitest/browser';
import { ForceOpenProvider } from '../../testing/index.js';
import { Breadcrumb } from '../breadcrumb.js';
import type { BreadcrumbEllipsisOptions, BreadcrumbItemType } from '../types.js';
import { ellipsis, RouterLink, renderInFrame, TRAIL } from './breadcrumb.test-utils.js';

const NARROW = 250;

const ROW_NAMES = ['Payments', 'Services', 'Checkout'];

function trigger(): HTMLElement {
	const element = ellipsis();

	if (element === null) {
		throw new Error('the trail did not collapse');
	}

	return element;
}

function renderTrail(
	options?: BreadcrumbEllipsisOptions,
	items: BreadcrumbItemType[] = TRAIL,
): ReturnType<typeof renderInFrame> {
	return renderInFrame(
		<Breadcrumb
			items={items}
			testId="bc"
			{...(options === undefined ? {} : { ellipsis: options })}
		/>,
		NARROW,
	);
}

/** The click of a link row follows its `href` unless something cancels it, and it must not leave the page. */
const cancel = (event: { preventDefault: () => void }): void => event.preventDefault();

/** Four collapsed crumbs of four kinds, whatever the width: a link, a button, plain text and a menu. */
function mixedItems(overrides: { link?: BreadcrumbItemType; button?: BreadcrumbItemType } = {}) {
	return [
		{ title: 'Dashboards', href: '/dashboards', onClick: cancel },
		overrides.link ?? { title: 'Payments', href: '/payments', onClick: cancel },
		overrides.button ?? { title: 'Retry', onClick: vi.fn() },
		{ title: 'Region' },
		{
			title: 'Environment',
			menu: [
				{ title: 'Staging', href: '/staging', onClick: cancel },
				{ title: 'Rename', onClick: vi.fn() },
			],
		},
		{ title: 'prod-east' },
	] satisfies BreadcrumbItemType[];
}

function renderMixed(
	options?: BreadcrumbEllipsisOptions,
	items: BreadcrumbItemType[] = mixedItems(),
): ReturnType<typeof renderInFrame> {
	return renderInFrame(
		<Breadcrumb
			items={items}
			maxVisible={2}
			testId="bc"
			{...(options === undefined ? {} : { ellipsis: options })}
		/>,
		700,
	);
}

/** Opens the popup with a press. It is named `Hidden items` unless an `ellipsis.heading` names it. */
async function openByClick(name = 'Hidden items'): Promise<HTMLElement> {
	await userEvent.setup().click(trigger());

	return screen.findByRole('dialog', { name });
}

async function openByHover(): Promise<HTMLElement> {
	await browserUser.hover(trigger());

	return screen.findByRole('dialog', { name: 'Hidden items' });
}

function rowNames(root: HTMLElement): string[] {
	return within(root)
		.getAllByRole('listitem')
		.map((row) => row.textContent ?? '');
}

function rows(popup: HTMLElement): HTMLElement[] {
	return Array.from(popup.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-ellipsis-row"]'));
}

async function expectClosed(): Promise<void> {
	await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
}

/** Long enough for a hover popover to open if it was going to. */
async function waitPastTheDelay(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 500));
}

// A real pointer stays where the last test left it, over whatever renders there next. While the safe
// polygon of a hover popup is active Base UI sets `pointer-events: none` on the body, so the move has
// to be forced.
beforeEach(async () => {
	await browserUser.unhover(document.body, { force: true });
});

/** Whether any pixel of the element is as red as the icon below paints. */
async function paintsRed(element: Element): Promise<boolean> {
	const image = new Image();
	image.src = `data:image/png;base64,${await page.screenshot({ element, save: false })}`;
	await image.decode();
	const canvas = document.createElement('canvas');
	canvas.width = image.width;
	canvas.height = image.height;
	const context = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
	context.drawImage(image, 0, 0);
	const { data } = context.getImageData(0, 0, canvas.width, canvas.height);

	for (let offset = 0; offset < data.length; offset += 4) {
		if (
			(data[offset] ?? 0) > 200 &&
			(data[offset + 1] ?? 255) < 80 &&
			(data[offset + 2] ?? 255) < 80
		) {
			return true;
		}
	}

	return false;
}

describe('Breadcrumb ellipsis', () => {
	describe('the icon of a collapsed crumb', () => {
		// The same svg is in the trail, hidden, and in the row. An icon that clips itself through an id
		// has one `clipPath` for both, and the copy in the trail comes first in the document.
		const icon = (
			<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="rgb(255, 0, 0)">
				<g clipPath="url(#breadcrumb-test-icon-clip)">
					<path d="M2 8h12M2 4h12M2 12h12" strokeWidth="2" />
				</g>
				<defs>
					<clipPath id="breadcrumb-test-icon-clip">
						<path fill="#fff" d="M0 0h16v16H0z" />
					</clipPath>
				</defs>
			</svg>
		);
		const items: BreadcrumbItemType[] = [
			{ title: 'Dashboards', href: '/dashboards', icon },
			{ title: 'Payments', href: '/payments', icon },
			{ title: 'Services', href: '/services', icon },
			{ title: 'Checkout', href: '/checkout', icon },
			{ title: 'prod-east' },
		];

		it('does not clip the icon of the row away, whatever the copy in the trail is', async () => {
			renderTrail({}, items);

			const popup = await openByClick();
			const row = within(popup).getByRole('link', { name: 'Payments' });
			const rowIcon = row.querySelector('svg') as SVGElement;

			expect(rowIcon).not.toBeNull();
			expect(await paintsRed(rowIcon)).toBe(true);
		});

		it('is invisible in the trail but keeps what it inherits, so its clip path still counts', async () => {
			renderTrail({}, items);

			const hidden = document.querySelector(
				'[data-slot="breadcrumb-item"][data-collapsed="true"] svg',
			) as SVGElement;

			expect(hidden).not.toBeNull();
			expect(
				getComputedStyle(hidden.closest('[data-slot="breadcrumb-item-icon"]') as Element).opacity,
			).toBe('0');
			expect(
				getComputedStyle(hidden.closest('[data-slot="breadcrumb-item-icon"]') as Element)
					.visibility,
			).toBe('visible');
		});

		it('shows an icon given as text in the row, as the trail does', async () => {
			renderTrail({}, [
				{ title: 'Dashboards', href: '/dashboards' },
				{ title: 'Payments', href: '/payments', icon: 'P' },
				{ title: 'Services', href: '/services' },
				{ title: 'Checkout', href: '/checkout' },
				{ title: 'prod-east' },
			]);

			const popup = await openByClick();

			expect(
				within(popup)
					.getByRole('link', { name: /Payments/ })
					.querySelector('[data-slot="breadcrumb-ellipsis-row-icon"]'),
			).toHaveTextContent('P');
		});
	});

	describe('the trigger and the popover', () => {
		it('keeps the trigger, its name and its data-slot, and opens a popover of the collapsed crumbs', async () => {
			renderTrail();

			expect(trigger()).toHaveAttribute('aria-label', 'Show 3 hidden items');
			expect(trigger()).toHaveAttribute('data-slot', 'breadcrumb-ellipsis-trigger');
			expect(trigger()).toHaveAttribute('data-kind', 'ellipsis');
			expect(trigger()).toHaveAttribute('data-testid', 'bc-ellipsis');
			expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog');
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

			const popup = await openByClick();

			expect(popup).toHaveAttribute('data-slot', 'breadcrumb-ellipsis-popup');
			expect(popup).toHaveAttribute('data-testid', 'bc-ellipsis-popup');
			expect(rowNames(popup)).toEqual(ROW_NAMES);
			expect(within(popup).queryByRole('group')).not.toBeInTheDocument();
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		});

		it('names the count in the singular for one crumb', () => {
			renderInFrame(<Breadcrumb items={TRAIL} maxVisible={4} />, 540);

			expect(trigger()).toHaveAttribute('aria-label', 'Show 1 hidden item');
		});

		it('lists the crumbs as links in a list, each with the test id the crumb has in the trail', async () => {
			renderTrail();

			const popup = await openByClick();
			const list = popup.querySelector('[data-slot="breadcrumb-ellipsis-list"]') as HTMLElement;

			expect(list.tagName).toBe('UL');
			expect(
				within(list)
					.getAllByRole('link')
					.map((link) => [link.textContent, link.getAttribute('href')]),
			).toEqual([
				['Payments', '/dashboards/payments'],
				['Services', '/dashboards/payments/services'],
				['Checkout', '/dashboards/payments/services/checkout'],
			]);
			expect(within(popup).getByRole('link', { name: 'Services' })).toHaveAttribute(
				'data-testid',
				'bc-item-2',
			);
			expect(within(popup).getByRole('link', { name: 'Services' })).toHaveAttribute(
				'data-kind',
				'link',
			);
		});

		it('opens below the crumb, lined up with its start edge', async () => {
			renderTrail();

			const popup = await openByClick();
			const anchor = trigger().getBoundingClientRect();
			const box = popup.getBoundingClientRect();

			expect(popup).toHaveAttribute('data-side', 'bottom');
			expect(popup).toHaveAttribute('data-align', 'start');
			expect(box.top).toBeGreaterThanOrEqual(anchor.bottom);
			expect(Math.abs(box.left - anchor.left)).toBeLessThan(2);
		});

		it('stays out of the way of a trail that has not collapsed', () => {
			renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, 540);

			expect(ellipsis()).toBeNull();
		});
	});

	describe('opening', () => {
		it('opens while the pointer rests on the trigger', async () => {
			renderTrail();

			const popup = await openByHover();

			expect(rowNames(popup)).toEqual(ROW_NAMES);
			expect(trigger()).toHaveAttribute('data-popup-open');
		});

		it('leaves the focus where it is when the pointer opens it, and takes it when a press does', async () => {
			renderTrail();
			const before = document.activeElement;

			const hovered = await openByHover();

			expect(document.activeElement).toBe(before);
			expect(hovered).not.toContainElement(document.activeElement as HTMLElement);

			await browserUser.unhover(document.body, { force: true });
			await expectClosed();
			await userEvent.setup().click(trigger());
			const pressed = await screen.findByRole('dialog', { name: 'Hidden items' });

			await waitFor(() =>
				expect(within(pressed).getByRole('link', { name: 'Payments' })).toHaveFocus(),
			);
		});

		it('does not open before the pointer has rested on it', async () => {
			renderTrail();

			await browserUser.hover(trigger());

			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});

		it('keeps the popup open when a click lands right after the hover opened it', async () => {
			renderTrail();
			const popup = await openByHover();

			await browserUser.click(trigger());
			await waitPastTheDelay();

			expect(popup).toBeInTheDocument();
			expect(screen.getByRole('dialog', { name: 'Hidden items' })).toBe(popup);
		});

		it('lets the pointer cross from the trigger onto the popup, and closes when it leaves both', async () => {
			renderTrail();
			await openByHover();
			const row = screen.getByRole('link', { name: 'Services' });

			await browserUser.hover(row);
			await waitPastTheDelay();

			expect(screen.getByRole('dialog', { name: 'Hidden items' })).toBeInTheDocument();

			await browserUser.unhover(document.body, { force: true });
			await expectClosed();
		});

		it('opens on a press and toggles on the next one', async () => {
			renderTrail();
			const user = userEvent.setup();

			await user.click(trigger());
			await screen.findByRole('dialog');
			await user.click(trigger());

			await expectClosed();
		});

		it.each(['{Enter}', ' '])(
			'opens from the keyboard with %j and focuses the first row',
			async (key) => {
				renderTrail();
				trigger().focus();

				await browserUser.keyboard(key);
				const popup = await screen.findByRole('dialog', { name: 'Hidden items' });

				await waitFor(() =>
					expect(within(popup).getByRole('link', { name: 'Payments' })).toHaveFocus(),
				);
			},
		);

		it('closes on Escape and gives the focus back to the trigger', async () => {
			renderTrail();
			trigger().focus();
			await browserUser.keyboard('{Enter}');
			await screen.findByRole('dialog');

			await browserUser.keyboard('{Escape}');

			await expectClosed();
			expect(trigger()).toHaveFocus();
		});

		it('closes on a press outside', async () => {
			renderTrail();
			await openByClick();

			await userEvent.setup().click(document.body);

			await expectClosed();
		});

		it('has no option to turn the hover off', async () => {
			renderTrail({});

			expect(await openByHover()).toBeInTheDocument();
		});
	});

	describe('keyboard', () => {
		it('moves through the rows with Tab', async () => {
			renderTrail();
			const popup = await openByClick();
			await waitFor(() =>
				expect(within(popup).getByRole('link', { name: 'Payments' })).toHaveFocus(),
			);

			await browserUser.tab();
			expect(within(popup).getByRole('link', { name: 'Services' })).toHaveFocus();

			await browserUser.tab();
			expect(within(popup).getByRole('link', { name: 'Checkout' })).toHaveFocus();
		});

		it('moves through the rows with the arrow keys, wrapping at the ends', async () => {
			renderTrail();
			const popup = await openByClick();
			const [payments, services, checkout] = ROW_NAMES.map((name) =>
				within(popup).getByRole('link', { name }),
			);
			await waitFor(() => expect(payments).toHaveFocus());

			await browserUser.keyboard('{ArrowDown}');
			expect(services).toHaveFocus();
			await browserUser.keyboard('{ArrowDown}');
			expect(checkout).toHaveFocus();
			await browserUser.keyboard('{ArrowDown}');
			expect(payments).toHaveFocus();
			await browserUser.keyboard('{ArrowUp}');
			expect(checkout).toHaveFocus();
			await browserUser.keyboard('{ArrowUp}');
			expect(services).toHaveFocus();
		});

		it('jumps to the first and the last row with Home and End', async () => {
			renderTrail();
			const popup = await openByClick();
			await waitFor(() =>
				expect(within(popup).getByRole('link', { name: 'Payments' })).toHaveFocus(),
			);

			await browserUser.keyboard('{End}');
			expect(within(popup).getByRole('link', { name: 'Checkout' })).toHaveFocus();

			await browserUser.keyboard('{Home}');
			expect(within(popup).getByRole('link', { name: 'Payments' })).toHaveFocus();
		});

		it('walks past a row of plain text, which takes no focus', async () => {
			renderMixed();
			const popup = await openByClick();
			const retry = within(popup).getByRole('button', { name: 'Retry' });

			retry.focus();
			await browserUser.keyboard('{ArrowDown}');

			expect(within(popup).getByRole('button', { name: 'Environment' })).toHaveFocus();
			expect(popup.querySelector('[data-kind="text"]')).not.toHaveFocus();
		});

		it('keeps the arrow keys on the rows, which the heading does not stop', async () => {
			renderTrail({ heading: 'Earlier steps' });
			const popup = await openByClick('Earlier steps');
			await waitFor(() =>
				expect(within(popup).getByRole('link', { name: 'Payments' })).toHaveFocus(),
			);

			await browserUser.keyboard('{ArrowDown}');

			expect(within(popup).getByRole('link', { name: 'Services' })).toHaveFocus();
		});

		it('leaves the arrow keys to the menu a row opened', async () => {
			renderMixed();
			const popup = await openByClick();
			within(popup).getByRole('button', { name: 'Environment' }).focus();
			await browserUser.keyboard('{Enter}');
			const menu = await screen.findByRole('menu');

			await browserUser.keyboard('{ArrowDown}');

			expect(menu).toContainElement(document.activeElement as HTMLElement);
		});
	});

	describe('pressing a row', () => {
		it('follows the link, runs the onClick of the crumb with the real click event, and closes the popup', async () => {
			const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
			renderMixed(
				undefined,
				mixedItems({ link: { title: 'Payments', href: '/payments', onClick } }),
			);
			const popup = await openByClick();

			await userEvent.setup().click(within(popup).getByRole('link', { name: 'Payments' }));

			expect(onClick).toHaveBeenCalledTimes(1);
			const [event] = onClick.mock.calls[0] as unknown as [MouseEvent];
			expect(event.type).toBe('click');
			expect((event.target as HTMLElement).closest('[data-slot="breadcrumb-ellipsis-row"]')).toBe(
				within(popup).getByRole('link', { name: 'Payments' }),
			);
			await expectClosed();
		});

		it('hands the click to a handler that reads its modifier keys, as the drawer trail does', async () => {
			const seen: boolean[] = [];
			const onClick = (event: ReactMouseEvent): void => {
				seen.push(event.ctrlKey);
				event.preventDefault();
			};
			renderMixed(
				undefined,
				mixedItems({ link: { title: 'Payments', href: '/payments', onClick } }),
			);
			const user = userEvent.setup();
			const popup = await openByClick();

			await user.keyboard('{Control>}');
			await user.click(within(popup).getByRole('link', { name: 'Payments' }));
			await user.keyboard('{/Control}');

			expect(seen).toEqual([true]);
		});

		it('leaves the popup open after a click with a modifier key, which opens the link elsewhere', async () => {
			renderMixed();
			const user = userEvent.setup();
			const popup = await openByClick();

			await user.keyboard('{Control>}');
			await user.click(within(popup).getByRole('link', { name: 'Payments' }));
			await user.keyboard('{/Control}');
			await waitPastTheDelay();

			expect(screen.getByRole('dialog', { name: 'Hidden items' })).toBeInTheDocument();
		});

		it('does not cancel a click the crumb left alone', async () => {
			const seen: boolean[] = [];
			renderMixed(
				undefined,
				mixedItems({
					link: {
						title: 'Payments',
						href: '/payments',
						onClick: (event) => {
							seen.push(event.defaultPrevented);
							event.preventDefault();
						},
					},
				}),
			);
			const popup = await openByClick();

			await userEvent.setup().click(within(popup).getByRole('link', { name: 'Payments' }));

			expect(seen).toEqual([false]);
		});

		it('keeps the target of a link row, and the rel that goes with it', async () => {
			renderMixed(
				undefined,
				mixedItems({ link: { title: 'Payments', href: '/payments', target: '_blank' } }),
			);
			const popup = await openByClick();
			const link = within(popup).getByRole('link', { name: 'Payments' });

			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		});

		it('runs the onClick of a button row and closes the popup', async () => {
			const onClick = vi.fn();
			renderMixed(undefined, mixedItems({ button: { title: 'Retry', onClick } }));
			const popup = await openByClick();
			const row = within(popup).getByRole('button', { name: 'Retry' });

			expect(row).toHaveAttribute('data-testid', 'bc-item-2');
			expect(row).toHaveAttribute('type', 'button');
			await userEvent.setup().click(row);

			expect(onClick).toHaveBeenCalledTimes(1);
			expect((onClick.mock.calls[0] as unknown as [Event])[0].type).toBe('click');
			await expectClosed();
		});

		it('runs a button row from the keyboard', async () => {
			const onClick = vi.fn();
			renderMixed(undefined, mixedItems({ button: { title: 'Retry', onClick } }));
			const popup = await openByClick();

			within(popup).getByRole('button', { name: 'Retry' }).focus();
			await browserUser.keyboard('{Enter}');

			expect(onClick).toHaveBeenCalledTimes(1);
			await expectClosed();
		});

		it('draws a crumb that does nothing as plain text, and a press on it changes nothing', async () => {
			renderMixed();
			const popup = await openByClick();
			const row = popup.querySelector('[data-kind="text"]') as HTMLElement;

			expect(row.tagName).toBe('SPAN');
			expect(row).toHaveTextContent('Region');
			expect(row).toHaveAttribute('data-testid', 'bc-item-3');
			expect(within(popup).queryByRole('link', { name: 'Region' })).not.toBeInTheDocument();
			expect(within(popup).queryByRole('button', { name: 'Region' })).not.toBeInTheDocument();

			await userEvent.setup().click(row);

			expect(screen.getByRole('dialog', { name: 'Hidden items' })).toBeInTheDocument();
		});

		it('renders the element of a crumb with `render`, with the title as its label', async () => {
			const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
			renderTrail({}, [
				{ title: 'Dashboards', href: '/dashboards' },
				{
					title: 'Payments',
					render: <RouterLink to="/payments" data-from-render="" onClick={onClick} />,
				},
				{ title: 'Services', href: '/services' },
				{ title: 'Checkout', href: '/checkout' },
				{ title: 'prod-east' },
			]);
			const popup = await openByClick();
			const link = within(popup).getByRole('link', { name: 'Payments' });

			expect(link).toHaveAttribute('data-from-render');
			expect(link).toHaveAttribute('data-slot', 'breadcrumb-ellipsis-row');
			await userEvent.setup().click(link);

			expect(onClick).toHaveBeenCalledTimes(1);
			await expectClosed();
		});

		it('keeps its own data-slot, data-kind and test id over the ones of the `render` element', async () => {
			renderTrail({}, [
				{ title: 'Dashboards', href: '/dashboards' },
				{
					title: 'Payments',
					render: (
						<RouterLink
							to="/payments"
							data-slot="router-link"
							data-kind="custom"
							data-testid="router-link"
						/>
					),
				},
				{ title: 'Services', href: '/services' },
				{ title: 'Checkout', href: '/checkout' },
				{ title: 'prod-east' },
			]);
			const popup = await openByClick();
			const link = within(popup).getByRole('link', { name: 'Payments' });

			expect(link).toHaveAttribute('data-slot', 'breadcrumb-ellipsis-row');
			expect(link).toHaveAttribute('data-kind', 'link');
			expect(link).toHaveAttribute('data-testid', 'bc-item-1');
		});
	});

	describe('a crumb with a menu', () => {
		it('is a row that opens its own menu, and ends in the chevron of it', async () => {
			renderMixed();
			const popup = await openByClick();
			const row = within(popup).getByRole('button', { name: 'Environment' });

			expect(row).toHaveAttribute('data-kind', 'menu');
			expect(row).toHaveAttribute('data-testid', 'bc-item-4');
			expect(row).toHaveAttribute('aria-haspopup', 'menu');
			expect(row.querySelector('[data-slot="breadcrumb-ellipsis-row-chevron"]')).not.toBeNull();

			await userEvent.setup().click(row);
			const menu = await screen.findByRole('menu');

			expect(
				within(menu)
					.getAllByRole('menuitem')
					.map((item) => item.textContent),
			).toEqual(['Staging', 'Rename']);
			expect(screen.getByRole('dialog', { name: 'Hidden items' })).toBeInTheDocument();
		});

		it('names the entries after the menu of the crumb', async () => {
			renderMixed();
			const popup = await openByClick();

			await userEvent.setup().click(within(popup).getByRole('button', { name: 'Environment' }));
			await screen.findByRole('menu');

			expect(screen.getByTestId('bc-item-4-menu-item-0')).toHaveTextContent('Staging');
			expect(screen.getByTestId('bc-item-4-menu-item-1')).toHaveTextContent('Rename');
		});

		it('runs the entry that is picked, and closes the menu and the popup', async () => {
			const rename = vi.fn();
			renderMixed(
				undefined,
				mixedItems().map((item) =>
					item.menu === undefined
						? item
						: { ...item, menu: [{ title: 'Rename', onClick: rename }] },
				),
			);
			const popup = await openByClick();

			await userEvent.setup().click(within(popup).getByRole('button', { name: 'Environment' }));
			await userEvent.setup().click(await screen.findByRole('menuitem', { name: 'Rename' }));

			expect(rename).toHaveBeenCalledTimes(1);
			await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
			await expectClosed();
		});

		it('follows a link entry', async () => {
			renderMixed();
			const popup = await openByClick();

			await userEvent.setup().click(within(popup).getByRole('button', { name: 'Environment' }));

			expect(await screen.findByRole('menuitem', { name: 'Staging' })).toHaveAttribute(
				'href',
				'/staging',
			);
		});

		it.each([
			[
				'the keyboard',
				async (row: HTMLElement) => {
					row.focus();
					await browserUser.keyboard('{Enter}');
				},
			],
			['a press', (row: HTMLElement) => userEvent.setup().click(row)],
		])(
			'closes only the menu on Escape once %s opened it, and gives the focus back to its row',
			async (_name, open) => {
				renderMixed();
				const popup = await openByClick();
				const row = within(popup).getByRole('button', { name: 'Environment' });
				await open(row);
				await screen.findByRole('menu');

				await browserUser.keyboard('{Escape}');

				await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
				await waitPastTheDelay();
				expect(screen.getByRole('dialog', { name: 'Hidden items' })).toBe(popup);
				expect(row).toHaveFocus();
			},
		);

		it('keeps the popup open while the menu is, though the focus is in the menu', async () => {
			renderMixed();
			const popup = await openByClick();

			await userEvent.setup().click(within(popup).getByRole('button', { name: 'Environment' }));
			await screen.findByRole('menu');
			await waitPastTheDelay();

			expect(screen.getByRole('dialog', { name: 'Hidden items' })).toBeInTheDocument();
		});

		it('opens no card, and its href and onClick stay out of reach', async () => {
			const onClick = vi.fn();
			renderMixed(
				undefined,
				mixedItems().map((item) =>
					item.menu === undefined ? item : { ...item, href: '/environment', onClick },
				),
			);
			const popup = await openByClick();
			const row = within(popup).getByRole('button', { name: 'Environment' });

			expect(row).not.toHaveAttribute('href');
			await userEvent.setup().click(row);
			await screen.findByRole('menu');

			expect(onClick).not.toHaveBeenCalled();
		});
	});

	describe('heading', () => {
		it('puts the heading above the rows, in a group that holds them', async () => {
			renderTrail({ heading: 'Earlier steps' });

			const popup = await openByClick('Earlier steps');
			const group = within(popup).getByRole('group', { name: 'Earlier steps' });

			expect(group).toHaveAttribute('data-testid', 'bc-ellipsis-group-collapsed');
			expect(within(group).getByText('Earlier steps')).toHaveAttribute(
				'data-slot',
				'breadcrumb-ellipsis-heading',
			);
			expect(rowNames(group)).toEqual(ROW_NAMES);
		});

		it('names the popup, so a screen reader hears the heading that shows', async () => {
			renderTrail({ heading: 'Earlier steps' });

			const popup = await openByClick('Earlier steps');
			const heading = within(popup).getByText('Earlier steps');

			expect(popup).toHaveAttribute('aria-labelledby', heading.id);
			expect(popup).not.toHaveAttribute('aria-label');
		});

		it('is no row, so it takes no focus and no link role', async () => {
			renderTrail({ heading: 'Earlier steps' });

			const popup = await openByClick('Earlier steps');

			expect(rows(popup)).toHaveLength(3);
			expect(within(popup).getAllByRole('link')).toHaveLength(3);
		});

		it('takes a node, not only text', async () => {
			renderTrail({ heading: <em>Earlier steps</em> });

			const popup = await openByClick('Earlier steps');

			expect(within(popup).getByRole('group', { name: 'Earlier steps' })).toBeInTheDocument();
		});

		it.each([
			['null', null],
			['an empty string', ''],
			['false', false],
		])('adds none when it is %s', async (_name, heading) => {
			renderTrail({ heading });

			const popup = await openByClick();

			expect(within(popup).queryByRole('group')).not.toBeInTheDocument();
			expect(popup).toHaveAttribute('aria-label', 'Hidden items');
			expect(popup).not.toHaveAttribute('aria-labelledby');
			expect(rowNames(popup)).toEqual(ROW_NAMES);
		});

		it('keeps the test ids of the rows', async () => {
			renderTrail({ heading: 'Earlier steps' });

			const popup = await openByClick('Earlier steps');

			expect(within(popup).getByRole('link', { name: 'Payments' })).toHaveAttribute(
				'data-testid',
				'bc-item-1',
			);
		});
	});

	describe('rowSuffix', () => {
		const rowSuffix = (_item: BreadcrumbItemType, index: number) => (
			<span data-testid={`step-${index}`}>{index + 1}</span>
		);

		it('puts the element at the end of each row, with the index of the crumb in items', async () => {
			renderTrail({ rowSuffix });

			const popup = await openByClick();

			expect(within(popup).getByTestId('step-1')).toHaveTextContent('2');
			expect(within(popup).getByTestId('step-2')).toHaveTextContent('3');
			expect(within(popup).getByTestId('step-3')).toHaveTextContent('4');
			expect(
				within(within(popup).getByRole('link', { name: /Services/ })).getByTestId('step-2'),
			).toBeInTheDocument();
		});

		it('ends the row with it, after the icon and the title', async () => {
			renderTrail({ rowSuffix });

			const popup = await openByClick();
			const row = within(popup).getByRole('link', { name: /Services/ });
			const slots = Array.from(row.children).map((child) => child.getAttribute('data-slot'));

			expect(slots).toEqual(['breadcrumb-ellipsis-row-label', 'breadcrumb-ellipsis-row-suffix']);
			expect(row.textContent).toBe('Services3');
		});

		it('hands the function the crumb as it was passed, and its index in items', async () => {
			const spy = vi.fn(rowSuffix);
			renderTrail({ rowSuffix: spy });

			await openByClick();

			expect(spy).toHaveBeenCalledWith(TRAIL[1], 1);
			expect(spy).toHaveBeenCalledWith(TRAIL[2], 2);
			expect(spy).toHaveBeenCalledWith(TRAIL[3], 3);
			expect(new Set(spy.mock.calls.map(([, index]) => index))).toEqual(new Set([1, 2, 3]));
		});

		it('counts the index before the crumbs with an empty title are left out', async () => {
			renderTrail({ rowSuffix }, [{ title: '', href: '/skipped' }, ...TRAIL]);

			const popup = await openByClick();

			expect(rowNames(popup)).toEqual(ROW_NAMES.map((name, position) => `${name}${position + 3}`));
			expect(within(popup).getByTestId('step-2')).toBeInTheDocument();
			expect(within(popup).queryByTestId('step-1')).not.toBeInTheDocument();
		});

		it('leaves a row without a suffix when the function returns undefined', async () => {
			renderTrail({
				rowSuffix: (item, index) => (index === 2 ? undefined : rowSuffix(item, index)),
			});

			const popup = await openByClick();

			expect(within(popup).queryByTestId('step-2')).not.toBeInTheDocument();
			expect(within(popup).getByTestId('step-1')).toBeInTheDocument();
			expect(within(popup).getByTestId('step-3')).toBeInTheDocument();
		});

		it('gives a crumb with a menu no suffix, and does not call the function for it', async () => {
			const spy = vi.fn(rowSuffix);
			renderMixed({ rowSuffix: spy });

			const popup = await openByClick();

			expect(within(popup).queryByTestId('step-4')).not.toBeInTheDocument();
			expect(within(popup).getByTestId('step-1')).toBeInTheDocument();
			expect(within(popup).getByTestId('step-2')).toBeInTheDocument();
			expect(within(popup).getByTestId('step-3')).toBeInTheDocument();
			expect(new Set(spy.mock.calls.map(([, index]) => index))).toEqual(new Set([1, 2, 3]));
		});

		it('gives a row of plain text one too', async () => {
			renderMixed({ rowSuffix });

			const popup = await openByClick();

			expect(
				within(popup.querySelector('[data-kind="text"]') as HTMLElement).getByTestId('step-3'),
			).toHaveTextContent('4');
		});

		it('works with the heading, the rows under it keeping their suffix', async () => {
			renderTrail({ heading: 'Earlier steps', rowSuffix });

			const popup = await openByClick('Earlier steps');
			const group = within(popup).getByRole('group', { name: 'Earlier steps' });

			expect(within(group).getByTestId('step-1')).toHaveTextContent('2');
		});
	});

	describe('render', () => {
		it('replaces the list with the content, in the popup the trigger opens', async () => {
			const render = vi.fn(() => <p>Your content</p>);
			renderTrail({ render });

			expect(trigger()).toHaveAttribute('aria-label', 'Show 3 hidden items');
			expect(trigger()).toHaveAttribute('data-slot', 'breadcrumb-ellipsis-trigger');
			expect(trigger()).toHaveAttribute('data-kind', 'ellipsis');
			expect(trigger()).toHaveAttribute('data-testid', 'bc-ellipsis');
			expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog');

			const popup = await openByClick();

			expect(popup).toHaveTextContent('Your content');
			expect(popup).toHaveAttribute('data-slot', 'breadcrumb-ellipsis-popup');
			expect(popup).toHaveAttribute('data-testid', 'bc-ellipsis-popup');
			expect(popup.querySelector('[data-slot="breadcrumb-ellipsis-list"]')).toBeNull();
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
			expect(trigger()).toHaveAttribute('aria-label', 'Show 3 hidden items');
		});

		it('opens on hover as well', async () => {
			renderTrail({ render: () => <p>Your content</p> });

			expect(await openByHover()).toHaveTextContent('Your content');
		});

		it('hands the collapsed crumbs over in path order, with their index in items', async () => {
			const render = vi.fn((_collapsed: unknown) => <p>Your content</p>);
			renderTrail({ render });

			await openByClick();

			const [collapsed] = render.mock.calls.at(-1) as [unknown];
			expect(collapsed).toEqual([
				{ item: TRAIL[1], index: 1 },
				{ item: TRAIL[2], index: 2 },
				{ item: TRAIL[3], index: 3 },
			]);
			expect((collapsed as { item: unknown }[])[0]?.item).toBe(TRAIL[1]);
		});

		it('hands them over in path order from the start as well', async () => {
			const render = vi.fn((_collapsed: unknown) => <p>Your content</p>);
			renderInFrame(
				<Breadcrumb items={TRAIL} collapseFrom="start" maxVisible={3} ellipsis={{ render }} />,
				540,
			);

			await openByClick();

			const [collapsed] = render.mock.calls.at(-1) as [{ index: number }[]];
			expect(collapsed.map(({ index }) => index)).toEqual([1, 2]);
		});

		it('counts the index before the crumbs with an empty title are left out', async () => {
			const render = vi.fn((_collapsed: unknown) => <p>Your content</p>);
			renderTrail({ render }, [{ title: '', href: '/skipped' }, ...TRAIL]);

			await openByClick();

			const [collapsed] = render.mock.calls.at(-1) as [{ index: number }[]];
			expect(collapsed.map(({ index }) => index)).toEqual([2, 3, 4]);
		});

		it('leaves the navigation to the content', async () => {
			const onClick = vi.fn(cancel);
			renderTrail({
				render: (collapsed) => (
					<ul>
						{collapsed.map(({ item, index }) => (
							<li key={index}>
								<a href={item.href} onClick={onClick}>
									{item.title}
								</a>
							</li>
						))}
					</ul>
				),
			});
			const popup = await openByClick();

			expect(
				within(popup)
					.getAllByRole('link')
					.map((link) => link.textContent),
			).toEqual(ROW_NAMES);
			await userEvent.setup().click(within(popup).getByRole('link', { name: 'Services' }));

			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it('does not use the heading and the row suffix', async () => {
			const rowSuffix = vi.fn(() => <span>suffix</span>);
			renderTrail({ heading: 'Earlier steps', rowSuffix, render: () => <p>Your content</p> });

			const popup = await openByClick();

			expect(popup).not.toHaveTextContent('Earlier steps');
			expect(popup).not.toHaveTextContent('suffix');
			expect(popup).toHaveAttribute('aria-label', 'Hidden items');
			expect(rowSuffix).not.toHaveBeenCalled();
		});

		it.each([
			['null', null],
			['false', false],
			['an empty string', ''],
		])(
			'draws the `...` crumb as text that opens nothing when the content is %s',
			async (_name, content) => {
				renderInFrame(
					<Breadcrumb items={TRAIL} testId="bc" ellipsis={{ render: () => content }} />,
					NARROW,
					{
						'--breadcrumb-background-hover': 'rgb(10, 10, 10)',
					},
				);
				const dots = trigger();

				expect(dots.tagName).toBe('SPAN');
				expect(dots).toHaveTextContent('...');
				expect(dots).toHaveAttribute('data-kind', 'ellipsis');
				expect(dots).toHaveAttribute('data-testid', 'bc-ellipsis');
				expect(dots).not.toHaveAttribute('aria-label');
				expect(dots).not.toHaveAttribute('aria-haspopup');
				expect(dots).not.toHaveAttribute('tabindex');
				expect(dots.closest('li')).toHaveAttribute('data-slot', 'breadcrumb-ellipsis');
				expect(screen.queryByRole('button', { name: /hidden item/ })).not.toBeInTheDocument();

				dots.focus();
				expect(dots).not.toHaveFocus();

				await userEvent.setup().click(dots);
				await browserUser.hover(dots);
				await waitPastTheDelay();

				expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
				expect(getComputedStyle(dots).cursor).toBe('default');
				expect(getComputedStyle(dots).backgroundColor).toBe('rgba(0, 0, 0, 0)');
			},
		);

		it('turns the `...` crumb back into a button once the content renders something', () => {
			const { rerender } = renderTrail({ render: () => null });
			const item = trigger().closest('li');

			rerender(
				<Breadcrumb items={TRAIL} testId="bc" ellipsis={{ render: () => <p>Your content</p> }} />,
			);

			expect(trigger().tagName).toBe('BUTTON');
			expect(trigger()).toHaveAttribute('aria-label', 'Show 3 hidden items');
			expect(trigger().closest('li')).toBe(item);
		});

		it('is no wider than the cap of the popup', async () => {
			renderTrail({ render: () => <p>{'word '.repeat(300)}</p> });

			const popup = await openByClick();
			const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

			expect(getComputedStyle(popup).maxInlineSize).toBe(`${20 * rem}px`);
		});

		it('is the list again once the option goes', async () => {
			const { rerender } = renderTrail({ render: () => <p>Your content</p> });

			rerender(<Breadcrumb items={TRAIL} testId="bc" />);

			const popup = await openByClick();
			expect(rowNames(popup)).toEqual(ROW_NAMES);
		});
	});

	describe('under a ForceOpenProvider', () => {
		it('holds the list open while crumbs are collapsed, and leaves the focus where it is', async () => {
			renderInFrame(
				<ForceOpenProvider>
					<Breadcrumb items={TRAIL} testId="bc" />
				</ForceOpenProvider>,
				NARROW,
			);

			const popup = await screen.findByRole('dialog', { name: 'Hidden items' });

			expect(rowNames(popup)).toEqual(ROW_NAMES);
			expect(trigger()).toHaveAttribute('data-popup-open');
			expect(popup).not.toContainElement(document.activeElement as HTMLElement);
		});

		it('keeps it open through a press, Escape, a press outside and a row', async () => {
			renderInFrame(
				<ForceOpenProvider>
					<Breadcrumb items={TRAIL.map((item) => ({ ...item, onClick: cancel }))} testId="bc" />
				</ForceOpenProvider>,
				NARROW,
			);
			const popup = await screen.findByRole('dialog', { name: 'Hidden items' });
			const user = userEvent.setup();

			await user.click(trigger());
			await browserUser.keyboard('{Escape}');
			await user.click(document.body);
			await user.click(within(popup).getByRole('link', { name: 'Services' }));
			await waitPastTheDelay();

			expect(screen.getByRole('dialog', { name: 'Hidden items' })).toBe(popup);
		});

		it('holds nothing open while no crumb is collapsed', async () => {
			renderInFrame(
				<ForceOpenProvider>
					<Breadcrumb items={TRAIL} testId="bc" />
				</ForceOpenProvider>,
				540,
			);
			await waitPastTheDelay();

			expect(ellipsis()).toBeNull();
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});
});
