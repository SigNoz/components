import { render as renderUnwrapped, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser, cdp } from 'vitest/browser';
import { queryOpenTooltip } from '../../__tests__/test-utils.js';
import { PopupContainer } from '../../lib/popup-container.js';
import { POPOVER_HOVER_DELAY } from '../../popover/constants.js';
import { Breadcrumb } from '../breadcrumb.js';
import { BREADCRUMB_PREVIEW_CLOSE_DELAY } from '../constants.js';
import type { BreadcrumbItemType } from '../types.js';
import {
	ellipsis,
	FULL_WIDTH,
	noop,
	RouterLink,
	renderInFrame,
	TRAIL,
} from './breadcrumb.test-utils.js';

const CARD = '[data-slot="popover-popup"][data-preview]';

/** The one popup of the trail, whatever it shows now: a card, or the list of the `...` crumb. */
const POPUP = '[data-slot="popover-popup"]';

/** The slack a timer and a poll need, so a delay is not asserted to the millisecond. */
const TIMER_SLACK = 30;

/** A click on a link follows its `href` unless something cancels it, and it must not leave the page. */
const stay = (event: { preventDefault: () => void }): void => event.preventDefault();

/**
 * Wide enough for every crumb, so no crumb collapses into the `...` crumb. The browser the tests
 * run in is narrower than the trail.
 */
function render(ui: ReactElement): ReturnType<typeof renderUnwrapped> {
	return renderUnwrapped(<div style={{ width: 900 }}>{ui}</div>);
}

const ITEMS: BreadcrumbItemType[] = [
	{ title: 'prod-eu-west1', href: '/clusters/prod', preview: <p>Cluster summary</p> },
	{ title: 'payments-7c9d5b6f4-xk2lp', href: '/pods/payments', preview: <p>Pod summary</p> },
	{ title: 'OOMKilled' },
];

function card(): HTMLElement | null {
	return document.querySelector<HTMLElement>(CARD);
}

function crumb(name: string): HTMLElement {
	return screen.getByRole('link', { name });
}

function popup(): HTMLElement | null {
	return document.querySelector<HTMLElement>(POPUP);
}

/**
 * Records whether any of the nodes leaves the document, so a close followed by an open cannot pass
 * for a move.
 */
function watchRemoval(...nodes: Node[]): { wasRemoved: () => boolean; stop: () => void } {
	let removed = false;
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of Array.from(mutation.removedNodes)) {
				if (nodes.includes(node)) {
					removed = true;
				}
			}
		}
	});
	observer.observe(document.body, { childList: true, subtree: true });

	return { wasRemoved: () => removed, stop: () => observer.disconnect() };
}

function expectNoCard(): void {
	expect(card()).toBeNull();
}

async function waitForCard(): Promise<HTMLElement> {
	await expect.poll(card, { timeout: 2000 }).not.toBeNull();

	return card() as HTMLElement;
}

async function waitForCardToClose(): Promise<void> {
	await expect.poll(card, { timeout: 2000 }).toBeNull();
}

/** Long enough for the card, or the tooltip, to open if it was going to. */
async function waitPastTheDelay(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, POPOVER_HOVER_DELAY + 150));
}

// A real pointer stays where the last test left it, over whatever renders there next. While the safe
// polygon of a hover popup is active Base UI sets `pointer-events: none` on the body, so the move
// has to be forced.
beforeEach(async () => {
	await browserUser.unhover(document.body, { force: true });
});

describe('Breadcrumb preview', () => {
	describe('opening', () => {
		it('opens a card below the crumb once the pointer has rested on it for the delay', async () => {
			render(<Breadcrumb items={ITEMS} testId="bc" />);

			const started = performance.now();
			await browserUser.hover(crumb('payments-7c9d5b6f4-xk2lp'));
			const popup = await waitForCard();

			expect(performance.now() - started).toBeGreaterThanOrEqual(POPOVER_HOVER_DELAY - TIMER_SLACK);
			expect(popup).toHaveTextContent('Pod summary');
			expect(popup.closest('nav')).toBeNull();
			expect(popup.getBoundingClientRect().top).toBeGreaterThanOrEqual(
				crumb('payments-7c9d5b6f4-xk2lp').getBoundingClientRect().bottom,
			);
		});

		it('names the card after the trail, and gives it a data-slot', async () => {
			render(<Breadcrumb items={ITEMS} testId="bc" />);

			await browserUser.hover(crumb('payments-7c9d5b6f4-xk2lp'));
			const popup = await waitForCard();

			expect(popup).toHaveAttribute('data-testid', 'bc-popup');
			expect(popup.parentElement).toHaveAttribute('data-slot', 'popover-positioner');
		});

		it('leaves the card without a test id when the trail has none', async () => {
			render(<Breadcrumb items={ITEMS} />);

			await browserUser.hover(crumb('prod-eu-west1'));

			expect(await waitForCard()).not.toHaveAttribute('data-testid');
		});

		it('keeps a crumb without a preview as it was', async () => {
			render(<Breadcrumb items={ITEMS} testId="bc" />);

			await browserUser.hover(screen.getByText('OOMKilled'));
			await waitPastTheDelay();

			expectNoCard();
		});

		it('opens when the keyboard focus reaches the crumb', async () => {
			render(<Breadcrumb items={ITEMS} testId="bc" />);

			await browserUser.tab();

			expect(crumb('prod-eu-west1')).toHaveFocus();
			expect(await waitForCard()).toHaveTextContent('Cluster summary');
		});

		it('never takes the focus: the crumb keeps it while the card is open', async () => {
			render(<Breadcrumb items={ITEMS} testId="bc" />);
			await browserUser.tab();
			const box = await waitForCard();
			await new Promise((resolve) => setTimeout(resolve, 100));

			expect(crumb('prod-eu-west1')).toHaveFocus();
			expect(box).not.toContainElement(document.activeElement as HTMLElement);
		});

		it('has no role and no accessible name, since it is a hover card and not a dialog', async () => {
			render(<Breadcrumb items={ITEMS} testId="bc" />);

			await browserUser.hover(crumb('prod-eu-west1'));
			const box = await waitForCard();

			expect(box).not.toHaveAttribute('role');
			expect(box).not.toHaveAttribute('aria-label');
			expect(box).not.toHaveAttribute('aria-labelledby');
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});

		it('closes on Escape, and the crumb keeps its focus', async () => {
			render(<Breadcrumb items={ITEMS} testId="bc" />);
			await browserUser.tab();
			await waitForCard();

			await browserUser.keyboard('{Escape}');

			await waitForCardToClose();
			expect(crumb('prod-eu-west1')).toHaveFocus();
		});

		it('opens for a crumb that is a button, and for a crumb that is plain text', async () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'Reports', onClick: noop, preview: <p>Button card</p> },
						{ title: 'Current page', preview: <p>Text card</p> },
					]}
				/>,
			);

			await browserUser.hover(screen.getByRole('button', { name: 'Reports' }));
			expect(await waitForCard()).toHaveTextContent('Button card');
			await browserUser.unhover(document.body);
			await waitForCardToClose();

			await browserUser.hover(screen.getByText('Current page'));
			expect(await waitForCard()).toHaveTextContent('Text card');
		});

		it('keeps the fill of the crumb while the card is open', async () => {
			render(<Breadcrumb items={ITEMS} />);
			const link = crumb('prod-eu-west1');

			expect(link).not.toHaveAttribute('data-popup-open');
			await browserUser.hover(link);
			await waitForCard();

			expect(link).toHaveAttribute('data-popup-open');
		});

		it('does not open the card of a crumb that has a menu', async () => {
			render(
				<Breadcrumb
					items={[
						{
							title: 'Payments',
							menu: [{ title: 'Billing', href: '/billing' }],
							preview: <p>Never shown</p>,
						},
						{ title: 'Current page' },
					]}
				/>,
			);

			await browserUser.hover(screen.getByRole('button', { name: 'Payments' }));
			await waitPastTheDelay();

			expectNoCard();
		});

		it.each([
			['null', null],
			['an empty string', ''],
			['false', false],
			['a fragment of nothing', <></>],
		])('opens no card when the preview is %s', async (_name, preview) => {
			render(
				<Breadcrumb
					items={[{ title: 'Services', href: '/services', preview }, { title: 'Current page' }]}
				/>,
			);

			await browserUser.hover(crumb('Services'));
			await waitPastTheDelay();

			expectNoCard();
		});
	});

	describe('moving from one crumb to another', () => {
		it('moves the same card to the next crumb and swaps its content, with no close between', async () => {
			render(<Breadcrumb items={ITEMS} testId="bc" />);
			const first = crumb('prod-eu-west1');
			const second = crumb('payments-7c9d5b6f4-xk2lp');
			await browserUser.hover(first);
			const popup = await waitForCard();
			const positioner = popup.parentElement as HTMLElement;
			expect(first).toHaveAttribute('data-popup-open');

			let removed = false;
			const observer = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					for (const node of Array.from(mutation.removedNodes)) {
						if (node === positioner || node === popup) {
							removed = true;
						}
					}
				}
			});
			observer.observe(document.body, { childList: true, subtree: true });

			try {
				await browserUser.hover(second);
				await expect
					.poll(() => popup.querySelector('[data-current]')?.textContent, { timeout: 2000 })
					.toBe('Pod summary');
				await expect
					.poll(
						() =>
							Math.abs(popup.getBoundingClientRect().left - second.getBoundingClientRect().left),
						{
							timeout: 2000,
						},
					)
					.toBeLessThan(2);
				await new Promise((resolve) => setTimeout(resolve, 400));
			} finally {
				observer.disconnect();
			}

			expect(removed).toBe(false);
			expect(card()).toBe(popup);
			expect(document.querySelectorAll(CARD)).toHaveLength(1);
			expect(popup).toHaveTextContent('Pod summary');
			expect(popup).not.toHaveTextContent('Cluster summary');
			expect(second).toHaveAttribute('data-popup-open');
			expect(first).not.toHaveAttribute('data-popup-open');
		});

		it('goes back to the first crumb the same way', async () => {
			render(<Breadcrumb items={ITEMS} testId="bc" />);
			await browserUser.hover(crumb('prod-eu-west1'));
			const popup = await waitForCard();
			await browserUser.hover(crumb('payments-7c9d5b6f4-xk2lp'));
			await expect
				.poll(() => popup.querySelector('[data-current]')?.textContent, { timeout: 2000 })
				.toBe('Pod summary');

			await browserUser.hover(crumb('prod-eu-west1'));

			await expect
				.poll(() => popup.querySelector('[data-current]')?.textContent, { timeout: 2000 })
				.toBe('Cluster summary');
			expect(card()).toBe(popup);
		});

		it('closes once the pointer leaves the last crumb it visited', async () => {
			render(<Breadcrumb items={ITEMS} testId="bc" />);
			await browserUser.hover(crumb('prod-eu-west1'));
			await waitForCard();
			const second = crumb('payments-7c9d5b6f4-xk2lp');
			await browserUser.hover(second);
			await expect
				.poll(() => card()?.querySelector('[data-current]')?.textContent, { timeout: 2000 })
				.toBe('Pod summary');

			await browserUser.unhover(second);

			await waitForCardToClose();
		});

		it('moves with the focus from a crumb to the next one', async () => {
			render(<Breadcrumb items={ITEMS} testId="bc" />);
			await browserUser.tab();
			const popup = await waitForCard();
			expect(popup).toHaveTextContent('Cluster summary');

			await browserUser.tab();

			await expect
				.poll(() => popup.querySelector('[data-current]')?.textContent, { timeout: 2000 })
				.toBe('Pod summary');
			expect(card()).toBe(popup);
		});
	});

	describe('closing', () => {
		it('stays open while the pointer moves onto the card', async () => {
			render(<Breadcrumb items={ITEMS} />);
			await browserUser.hover(crumb('payments-7c9d5b6f4-xk2lp'));
			const popup = await waitForCard();

			await browserUser.hover(popup);
			await new Promise((resolve) => setTimeout(resolve, 500));

			expect(card()).toBe(popup);
			expect(popup).toBeVisible();
		});

		it('lets the pointer reach a link inside the card', async () => {
			const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
			render(
				<Breadcrumb
					items={[
						{
							title: 'Pod',
							href: '/pods/1',
							preview: (
								<a href="/pods/1/logs" onClick={onClick}>
									Open the logs
								</a>
							),
						},
						{ title: 'Current page' },
					]}
				/>,
			);
			await browserUser.hover(crumb('Pod'));
			await waitForCard();

			await browserUser.click(screen.getByRole('link', { name: 'Open the logs' }));

			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it.each([
			['link', 'Open the logs'],
			['button', 'Restart'],
		] as const)(
			'stays open for a click on a %s in the card that the keyboard focus opened',
			async (role, name) => {
				const onClick = vi.fn(stay);
				render(
					<Breadcrumb
						items={[
							{
								title: 'Pod',
								href: '/pods/1',
								preview: (
									<>
										<a href="/pods/1/logs" onClick={onClick}>
											Open the logs
										</a>
										<button type="button" onClick={onClick}>
											Restart
										</button>
									</>
								),
							},
							{ title: 'Current page' },
						]}
					/>,
				);
				await browserUser.tab();
				expect(crumb('Pod')).toHaveFocus();
				const box = await waitForCard();

				await browserUser.click(screen.getByRole(role, { name }));
				await new Promise((resolve) => setTimeout(resolve, 200));

				expect(onClick).toHaveBeenCalledTimes(1);
				expect(card()).toBe(box);
			},
		);

		it('stays open for a click on the text of a card that the keyboard focus opened', async () => {
			render(<Breadcrumb items={ITEMS} />);
			await browserUser.tab();
			const box = await waitForCard();

			await browserUser.click(screen.getByText('Cluster summary'));
			await new Promise((resolve) => setTimeout(resolve, 200));

			expect(card()).toBe(box);
		});

		it('closes once the pointer leaves the crumb and does not go onto the card', async () => {
			render(<Breadcrumb items={ITEMS} />);
			const link = crumb('payments-7c9d5b6f4-xk2lp');
			await browserUser.hover(link);
			await waitForCard();

			await browserUser.unhover(link);

			await waitForCardToClose();
		});

		it('closes again after the pointer leaves the card', async () => {
			render(<Breadcrumb items={ITEMS} />);
			await browserUser.hover(crumb('payments-7c9d5b6f4-xk2lp'));
			const popup = await waitForCard();
			await browserUser.hover(popup);

			await browserUser.unhover(popup);

			await waitForCardToClose();
		});

		it('closes when the focus leaves the trail', async () => {
			render(
				<>
					<Breadcrumb items={ITEMS} testId="bc" />
					<button type="button">Elsewhere</button>
				</>,
			);
			await browserUser.tab();
			await waitForCard();
			await browserUser.tab();
			await browserUser.tab();

			expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus();
			await waitForCardToClose();
		});
	});

	describe('the crumb', () => {
		it('is still a link with its href', async () => {
			render(<Breadcrumb items={ITEMS} />);
			const link = crumb('payments-7c9d5b6f4-xk2lp');

			await browserUser.hover(link);
			await waitForCard();

			expect(link).toHaveAttribute('href', '/pods/payments');
			expect(link.tagName).toBe('A');
		});

		it('still runs its click, and the click on the card does not', async () => {
			const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
			render(
				<Breadcrumb
					items={[
						{ title: 'Pod', href: '/pods/1', onClick, preview: <p>Pod summary</p> },
						{ title: 'Current page' },
					]}
				/>,
			);
			const link = crumb('Pod');

			await browserUser.hover(link);
			const popup = await waitForCard();
			await browserUser.click(popup);
			expect(onClick).not.toHaveBeenCalled();

			await browserUser.click(link);
			expect(onClick).toHaveBeenCalledTimes(1);
			expect(link).toHaveAttribute('href', '/pods/1');
		});

		it('keeps the element of a router link, with its own click', async () => {
			const onClick = vi.fn();
			render(
				<Breadcrumb
					items={[
						{
							title: 'Services',
							render: <RouterLink to="/services" onClick={onClick} />,
							preview: <p>Services summary</p>,
						},
						{ title: 'Current page' },
					]}
				/>,
			);
			const link = crumb('Services');

			await browserUser.hover(link);
			expect(await waitForCard()).toHaveTextContent('Services summary');
			await browserUser.click(link);

			expect(link).toHaveAttribute('href', '/services');
			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it('keeps its ref, and the element does not remount as the card opens and closes', async () => {
			const ref = vi.fn();
			render(
				<Breadcrumb
					items={[
						{
							title: 'Services',
							render: (
								<a ref={ref} href="/services">
									Services
								</a>
							),
							preview: <p>Services summary</p>,
						},
						{ title: 'Current page' },
					]}
				/>,
			);
			const link = crumb('Services');

			await browserUser.hover(link);
			await waitForCard();
			await browserUser.unhover(link);
			await waitForCardToClose();

			expect(crumb('Services')).toBe(link);
			expect(ref).toHaveBeenLastCalledWith(link);
		});

		it('stays the link, the button or the text it was, with nothing of a popup trigger on it', async () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'Services', href: '/services', onClick: stay, preview: <p>Link card</p> },
						{ title: 'Reports', onClick: noop, preview: <p>Button card</p> },
						{ title: 'Current page', preview: <p>Text card</p> },
					]}
				/>,
			);
			const crumbs = [
				crumb('Services'),
				screen.getByRole('button', { name: 'Reports' }),
				screen.getByText('Current page').closest('[data-kind="text"]') as HTMLElement,
			];

			for (const element of crumbs) {
				await browserUser.hover(element);
				await waitForCard();

				expect(element).toHaveAttribute('data-popup-open');
				for (const name of [
					'role',
					'tabindex',
					'aria-haspopup',
					'aria-expanded',
					'aria-controls',
				]) {
					expect(element, name).not.toHaveAttribute(name);
				}
				await browserUser.unhover(element);
				await waitForCardToClose();
			}
			expect(crumbs[2]?.tabIndex).toBe(-1);
		});

		it('is followed by Enter and not by Space, as a link is', async () => {
			const onClick = vi.fn(stay);
			render(
				<Breadcrumb
					items={[
						{ title: 'Pod', href: '/pods/1', onClick, preview: <p>Pod summary</p> },
						{ title: 'Current page' },
					]}
				/>,
			);
			crumb('Pod').focus();

			await browserUser.keyboard(' ');
			expect(onClick).not.toHaveBeenCalled();

			await browserUser.keyboard('{Enter}');
			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it('does not toggle the card with a click, however long the pointer has been on the crumb', async () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'Pod', href: '/pods/1', onClick: stay, preview: <p>Pod summary</p> },
						{ title: 'Current page' },
					]}
				/>,
			);
			const link = crumb('Pod');
			await browserUser.hover(link);
			const box = await waitForCard();
			await new Promise((resolve) => setTimeout(resolve, 600));

			await browserUser.click(link);
			await new Promise((resolve) => setTimeout(resolve, 200));

			expect(card()).toBe(box);
			expect(link).toHaveAttribute('data-popup-open');
		});

		it('keeps the id of its render element', async () => {
			render(
				<Breadcrumb
					items={[
						{
							title: 'Services',
							render: (
								<a id="services-crumb" href="/services">
									Services
								</a>
							),
							preview: <p>Services summary</p>,
						},
						{ title: 'Current page' },
					]}
				/>,
			);

			await browserUser.hover(crumb('Services'));
			await waitForCard();

			expect(crumb('Services')).toHaveAttribute('id', 'services-crumb');
		});
	});

	describe('the tooltip of a cut label', () => {
		const LONG_TITLE = 'checkout-service-prod-us-east-1b-7f9c-with-a-name-that-runs-long';

		/** Narrow enough for the last crumb to cut its label, which a real layout decides. */
		function renderCut(last: BreadcrumbItemType): void {
			renderUnwrapped(
				<div style={{ width: 160 }}>
					<Breadcrumb items={[{ title: 'Services', href: '/services' }, last]} testId="bc" />
				</div>,
			);
		}

		async function cutCrumb(): Promise<HTMLElement> {
			await expect
				.poll(() => document.querySelector('[data-truncated="true"]'), { timeout: 2000 })
				.not.toBeNull();

			return document.querySelector('[data-truncated="true"]') as HTMLElement;
		}

		it('is replaced by the card on a crumb that has a preview', async () => {
			renderCut({
				title: LONG_TITLE,
				href: '/services/checkout',
				preview: <p>Checkout summary</p>,
			});

			await browserUser.hover(await cutCrumb());
			expect(await waitForCard()).toHaveTextContent('Checkout summary');
			await waitPastTheDelay();

			expect(queryOpenTooltip()).toBeNull();
			expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		});

		it('stays on a crumb that has none', async () => {
			renderCut({ title: LONG_TITLE });

			await browserUser.hover(await cutCrumb());

			await expect.poll(queryOpenTooltip, { timeout: 2000 }).toHaveTextContent(LONG_TITLE);
			expectNoCard();
		});

		it('comes back when the preview renders nothing', async () => {
			renderCut({ title: LONG_TITLE, href: '/services/checkout', preview: null });

			await browserUser.hover(await cutCrumb());

			await expect.poll(queryOpenTooltip, { timeout: 2000 }).toHaveTextContent(LONG_TITLE);
			expectNoCard();
		});
	});

	describe('a collapsed crumb', () => {
		const PREVIEWED = TRAIL.map((item) => ({ ...item, preview: <p>{item.title} summary</p> }));

		it('shows no card, in the trail or in the popup of the `...` crumb', async () => {
			renderInFrame(<Breadcrumb items={PREVIEWED} collapseFrom="start" testId="bc" />, 250);
			await expect.poll(ellipsis).not.toBeNull();

			await browserUser.click(ellipsis() as HTMLElement);
			const row = await screen.findByRole('link', { name: 'Services' });
			await browserUser.hover(row);
			await waitPastTheDelay();

			expect(screen.getByRole('dialog', { name: 'Hidden items' })).toContainElement(row);
			expectNoCard();
		});

		it('closes the card of a crumb that collapses as the trail narrows', async () => {
			const { resize } = renderInFrame(<Breadcrumb items={PREVIEWED} />, 540);
			const link = screen.getByRole('link', { name: 'Checkout' });
			await browserUser.hover(link);
			await waitForCard();

			await resize(250);

			expect(ellipsis()).not.toBeNull();
			await waitForCardToClose();
		});

		it('does not open the card again when the crumb comes back', async () => {
			const { resize } = renderInFrame(<Breadcrumb items={PREVIEWED} />, 540);
			await browserUser.hover(screen.getByRole('link', { name: 'Checkout' }));
			await waitForCard();
			await resize(250);
			await waitForCardToClose();
			await browserUser.unhover(document.body);

			await resize(FULL_WIDTH + 60);
			await waitPastTheDelay();

			expect(ellipsis()).toBeNull();
			expectNoCard();
		});

		it('keeps the focus when it collapses a focused crumb with a preview into the `...` crumb', async () => {
			const { resize } = renderInFrame(<Breadcrumb items={PREVIEWED} />, 540);
			const link = screen.getByRole('link', { name: 'Checkout' });
			link.focus();
			expect(link).toHaveFocus();

			await resize(250);

			expect(ellipsis()).toHaveFocus();
		});
	});

	describe('where it goes', () => {
		it('goes into the popup container of the panel around the trail', async () => {
			render(
				<div data-testid="panel">
					<PopupContainer>
						<Breadcrumb items={ITEMS} />
					</PopupContainer>
				</div>,
			);

			await browserUser.hover(crumb('payments-7c9d5b6f4-xk2lp'));
			const popup = await waitForCard();

			expect(popup.closest('[data-slot="popup-container"]')).not.toBeNull();
			expect(screen.getByTestId('panel')).toContainElement(popup);
		});

		it('goes into the body when there is no panel around the trail', async () => {
			render(
				<div data-testid="panel">
					<Breadcrumb items={ITEMS} />
				</div>,
			);

			await browserUser.hover(crumb('payments-7c9d5b6f4-xk2lp'));
			const popup = await waitForCard();

			expect(screen.getByTestId('panel')).not.toContainElement(popup);
			expect(document.body).toContainElement(popup);
		});
	});

	describe('its look', () => {
		function transitionDurations(popup: HTMLElement): string[] {
			return [popup, popup.parentElement as HTMLElement].map(
				(element) => getComputedStyle(element).transitionDuration,
			);
		}

		it('slides to the next crumb, and stops once Base UI marks the move settled', async () => {
			render(<Breadcrumb items={ITEMS} />);
			await browserUser.hover(crumb('prod-eu-west1'));
			const popup = await waitForCard();
			expect(popup).not.toHaveAttribute('data-instant');
			expect(transitionDurations(popup)).toEqual(['0.2s', '0.2s']);

			await browserUser.hover(crumb('payments-7c9d5b6f4-xk2lp'));

			await expect
				.poll(() => popup.parentElement?.getAttribute('data-instant'), { timeout: 2000 })
				.toBe('trigger-change');
			expect(popup).toHaveAttribute('data-instant', 'trigger-change');
			expect(transitionDurations(popup)).toEqual(['0s', '0s']);
		});

		it('does not move or resize a popup the keyboard opened', async () => {
			renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, 250);
			(ellipsis() as HTMLElement).focus();

			await browserUser.keyboard('{Enter}');
			const popup = await screen.findByTestId('bc-popup');

			expect(popup).toHaveAttribute('data-instant', 'click');
			expect(transitionDurations(popup)).toEqual(['0s', '0s']);
		});

		it('does not move, resize or fade under prefers-reduced-motion', async () => {
			await cdp().send('Emulation.setEmulatedMedia', {
				features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
			});
			try {
				render(<Breadcrumb items={ITEMS} />);
				await browserUser.hover(crumb('prod-eu-west1'));
				const popup = await waitForCard();
				const content = popup.querySelector('[data-slot="popover-viewport"] > [data-current]');

				expect(content).not.toBeNull();
				expect(transitionDurations(popup)).toEqual(['0s', '0s']);
				expect(getComputedStyle(content as HTMLElement).transitionDuration).toBe('0s');
			} finally {
				await cdp().send('Emulation.setEmulatedMedia', {
					features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
				});
			}
		});

		it('is as wide as its content, up to the 25rem of a Popover', async () => {
			const long = 'word '.repeat(200);
			render(
				<Breadcrumb
					items={[
						{ title: 'Pod', href: '/pods/1', preview: <p>{long}</p> },
						{ title: 'Current page' },
					]}
				/>,
			);

			await browserUser.hover(crumb('Pod'));
			const popup = await waitForCard();
			const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

			expect(getComputedStyle(popup).maxInlineSize).toBe(`${25 * rem}px`);
			expect(popup.getBoundingClientRect().width).toBe(25 * rem);
		});

		it('takes its cap from the page, where the portalled card inherits from', async () => {
			document.documentElement.style.setProperty('--popover-max-inline-size', '12rem');
			try {
				render(
					<Breadcrumb
						items={[
							{ title: 'Pod', href: '/pods/1', preview: <p>{'word '.repeat(200)}</p> },
							{ title: 'Current page' },
						]}
					/>,
				);

				await browserUser.hover(crumb('Pod'));
				const popup = await waitForCard();
				const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

				expect(popup.getBoundingClientRect().width).toBe(12 * rem);
			} finally {
				document.documentElement.style.removeProperty('--popover-max-inline-size');
			}
		});

		it('is no wider than its content when that is short', async () => {
			render(<Breadcrumb items={ITEMS} />);

			await browserUser.hover(crumb('prod-eu-west1'));
			const popup = await waitForCard();

			expect(popup.getBoundingClientRect().width).toBeLessThan(200);
		});

		it('clips its content to its radius and carries a border', async () => {
			render(<Breadcrumb items={ITEMS} />);

			await browserUser.hover(crumb('prod-eu-west1'));
			const style = getComputedStyle(await waitForCard());

			expect(style.overflow).toBe('hidden');
			expect(style.borderTopWidth).toBe('1px');
			expect(style.borderTopStyle).toBe('solid');
		});

		it('is not clipped to zero by the layer it is portalled into', async () => {
			render(
				<div style={{ position: 'relative', width: 0, height: 0 }}>
					<PopupContainer>
						<div style={{ width: 200 }}>
							<Breadcrumb items={ITEMS} />
						</div>
					</PopupContainer>
				</div>,
			);

			await browserUser.hover(crumb('prod-eu-west1'));
			const popup = await waitForCard();

			expect(popup.getBoundingClientRect().width).toBeGreaterThan(50);
			expect(popup).toHaveTextContent('Cluster summary');
		});
	});

	describe('moving between a card and the `...` crumb', () => {
		const COLLAPSING: BreadcrumbItemType[] = [
			{ title: 'Dashboards', href: '/dashboards', preview: <p>Dashboards summary</p> },
			{ title: 'Payments', href: '/payments', preview: <p>Payments summary</p> },
			{ title: 'Services', href: '/services', preview: <p>Services summary</p> },
			{ title: 'Checkout', href: '/checkout', preview: <p>Checkout summary</p> },
			{ title: 'prod-east' },
		];

		function ellipsisPopup(): HTMLElement | null {
			return screen.queryByRole('dialog', { name: 'Hidden items' });
		}

		function renderCollapsing(): void {
			render(<Breadcrumb items={COLLAPSING} maxVisible={3} testId="bc" />);
		}

		/** Resolves with how long the condition took to hold, in milliseconds. */
		async function timeUntil(condition: () => boolean): Promise<number> {
			const start = performance.now();
			await expect.poll(condition, { timeout: 2000, interval: 5 }).toBe(true);

			return performance.now() - start;
		}

		it('opens the `...` popover at once from an open card, and closes the card', async () => {
			renderCollapsing();
			await browserUser.hover(crumb('Dashboards'));
			await waitForCard();

			const from = crumb('Dashboards');

			await browserUser.hover(ellipsis() as HTMLElement);
			const opened = await timeUntil(() => ellipsisPopup() !== null);
			const closed = await timeUntil(() => !from.hasAttribute('data-popup-open'));

			expect(opened).toBeLessThan(POPOVER_HOVER_DELAY - TIMER_SLACK);
			// Before the card would have closed on its own.
			expect(opened + closed).toBeLessThan(BREADCRUMB_PREVIEW_CLOSE_DELAY - TIMER_SLACK);
			await waitForCardToClose();
			expect(ellipsisPopup()).not.toBeNull();
		});

		it('opens the card of a crumb at once from a `...` popover opened by a hover, and closes the popover', async () => {
			renderCollapsing();
			await browserUser.hover(ellipsis() as HTMLElement);
			await expect.poll(ellipsisPopup, { timeout: 2000 }).not.toBeNull();

			const from = ellipsis() as HTMLElement;

			await browserUser.hover(crumb('Checkout'));
			const opened = await timeUntil(() => card() !== null);
			const closed = await timeUntil(() => !from.hasAttribute('data-popup-open'));

			expect(opened).toBeLessThan(POPOVER_HOVER_DELAY - TIMER_SLACK);
			// Before the popover would have closed on its own.
			expect(opened + closed).toBeLessThan(BREADCRUMB_PREVIEW_CLOSE_DELAY - TIMER_SLACK);
			expect(card()).toHaveTextContent('Checkout summary');
			await expect.poll(ellipsisPopup, { timeout: 2000 }).toBeNull();
		});

		it('goes back to the card of the crumb it came from the same way', async () => {
			renderCollapsing();
			await browserUser.hover(crumb('Dashboards'));
			await waitForCard();
			await browserUser.hover(ellipsis() as HTMLElement);
			await expect.poll(ellipsisPopup, { timeout: 2000 }).not.toBeNull();

			await browserUser.hover(crumb('Dashboards'));
			const elapsed = await timeUntil(
				() => card()?.querySelector('[data-current]')?.textContent === 'Dashboards summary',
			);

			expect(elapsed).toBeLessThan(POPOVER_HOVER_DELAY - TIMER_SLACK);
			await expect.poll(ellipsisPopup, { timeout: 2000 }).toBeNull();
		});

		it('waits for the delay again once the card has closed', async () => {
			renderCollapsing();
			await browserUser.hover(crumb('Dashboards'));
			await waitForCard();
			await browserUser.unhover(document.body, { force: true });
			await waitForCardToClose();

			await browserUser.hover(ellipsis() as HTMLElement);
			await new Promise((resolve) => setTimeout(resolve, POPOVER_HOVER_DELAY / 2));

			expect(ellipsisPopup()).toBeNull();
		});

		it('leaves a `...` popover opened by a press where it is while the pointer rests on a crumb', async () => {
			renderCollapsing();
			await browserUser.click(ellipsis() as HTMLElement, { force: true });
			const list = await screen.findByRole('dialog', { name: 'Hidden items' });

			await browserUser.hover(crumb('Checkout'));
			await waitPastTheDelay();

			expectNoCard();
			expect(ellipsisPopup()).toBe(list);
			expect(crumb('Checkout')).not.toHaveAttribute('data-popup-open');
		});

		it('closes a `...` popover opened by a press once a crumb with a card is clicked', async () => {
			render(
				<Breadcrumb
					items={COLLAPSING.map((item) => ({ ...item, onClick: stay }))}
					maxVisible={3}
					testId="bc"
				/>,
			);
			await browserUser.click(ellipsis() as HTMLElement, { force: true });
			await expect.poll(ellipsisPopup, { timeout: 2000 }).not.toBeNull();

			await browserUser.click(crumb('Checkout'));

			await expect.poll(ellipsisPopup, { timeout: 2000 }).toBeNull();
		});

		it('moves the same popup from a crumb to the `...` crumb and swaps its content, with no close between', async () => {
			renderCollapsing();
			const from = crumb('Dashboards');
			const target = ellipsis() as HTMLElement;
			await browserUser.hover(from);
			const box = await waitForCard();
			const positioner = box.parentElement as HTMLElement;
			expect(from).toHaveAttribute('data-popup-open');
			const watch = watchRemoval(box, positioner);

			try {
				await browserUser.hover(target);
				await expect
					.poll(() => box.querySelector('[data-current] [data-slot="breadcrumb-ellipsis-list"]'), {
						timeout: 2000,
					})
					.not.toBeNull();
				await expect
					.poll(
						() => Math.abs(box.getBoundingClientRect().left - target.getBoundingClientRect().left),
						{ timeout: 2000 },
					)
					.toBeLessThan(2);
				await new Promise((resolve) => setTimeout(resolve, 400));
			} finally {
				watch.stop();
			}

			expect(watch.wasRemoved()).toBe(false);
			expect(popup()).toBe(box);
			expect(document.querySelectorAll(POPUP)).toHaveLength(1);
			expect(box.parentElement).toBe(positioner);
			expect(box).toHaveTextContent('Payments');
			expect(box).not.toHaveTextContent('Dashboards summary');
			expect(box).toHaveAttribute('role', 'dialog');
			expect(box).toHaveAttribute('aria-label', 'Hidden items');
			expect(box).toHaveAttribute('data-testid', 'bc-popup');
			expect(box).toHaveAttribute('data-slot', 'popover-popup');
			expect(target).toHaveAttribute('data-popup-open');
			expect(from).not.toHaveAttribute('data-popup-open');
		});

		it('moves the same popup from the `...` crumb to a crumb and swaps its content, with no close between', async () => {
			renderCollapsing();
			const from = ellipsis() as HTMLElement;
			const target = crumb('Checkout');
			await browserUser.hover(from);
			const box = await screen.findByRole('dialog', { name: 'Hidden items' });
			const positioner = box.parentElement as HTMLElement;
			expect(from).toHaveAttribute('data-popup-open');
			const watch = watchRemoval(box, positioner);

			try {
				await browserUser.hover(target);
				await expect
					.poll(() => box.querySelector('[data-current]')?.textContent, { timeout: 2000 })
					.toBe('Checkout summary');
				await expect
					.poll(
						() => Math.abs(box.getBoundingClientRect().left - target.getBoundingClientRect().left),
						{ timeout: 2000 },
					)
					.toBeLessThan(2);
				await new Promise((resolve) => setTimeout(resolve, 400));
			} finally {
				watch.stop();
			}

			expect(watch.wasRemoved()).toBe(false);
			expect(popup()).toBe(box);
			expect(document.querySelectorAll(POPUP)).toHaveLength(1);
			expect(box.parentElement).toBe(positioner);
			expect(box).toHaveTextContent('Checkout summary');
			expect(box.querySelector('[data-slot="breadcrumb-ellipsis-list"]')).toBeNull();
			expect(box).not.toHaveAttribute('role');
			expect(box).not.toHaveAttribute('aria-label');
			expect(box).toHaveAttribute('data-testid', 'bc-popup');
			expect(box).toHaveAttribute('data-slot', 'popover-popup');
			expect(target).toHaveAttribute('data-popup-open');
			expect(from).not.toHaveAttribute('data-popup-open');
		});

		it('moves the same popup through a crumb, the `...` crumb and another crumb in a row', async () => {
			renderCollapsing();
			await browserUser.hover(crumb('Dashboards'));
			const box = await waitForCard();
			const watch = watchRemoval(box, box.parentElement as Node);

			try {
				await browserUser.hover(ellipsis() as HTMLElement);
				await expect
					.poll(() => box.querySelector('[data-current] [data-slot="breadcrumb-ellipsis-list"]'), {
						timeout: 2000,
					})
					.not.toBeNull();
				await browserUser.hover(crumb('Checkout'));
				await expect
					.poll(() => box.querySelector('[data-current]')?.textContent, { timeout: 2000 })
					.toBe('Checkout summary');
				await new Promise((resolve) => setTimeout(resolve, 400));
			} finally {
				watch.stop();
			}

			expect(watch.wasRemoved()).toBe(false);
			expect(popup()).toBe(box);
			expect(document.querySelectorAll(POPUP)).toHaveLength(1);
		});

		it('moves the same popup to the list when a press on the `...` crumb lands on an open card, and gives it the focus', async () => {
			renderCollapsing();
			await browserUser.hover(crumb('Dashboards'));
			const box = await waitForCard();
			const watch = watchRemoval(box, box.parentElement as Node);

			try {
				await browserUser.click(ellipsis() as HTMLElement, { force: true });
				await expect
					.poll(() => box.querySelector('[data-current] [data-slot="breadcrumb-ellipsis-list"]'), {
						timeout: 2000,
					})
					.not.toBeNull();
				await new Promise((resolve) => setTimeout(resolve, 400));
			} finally {
				watch.stop();
			}

			expect(watch.wasRemoved()).toBe(false);
			expect(popup()).toBe(box);
			expect(box).toHaveAttribute('role', 'dialog');
			await expect.poll(() => box.contains(document.activeElement), { timeout: 2000 }).toBe(true);
		});

		it('keeps the focus where it is while the pointer moves the popup between the card and the list', async () => {
			render(
				<>
					<Breadcrumb items={COLLAPSING} maxVisible={3} testId="bc" />
					<button type="button">Elsewhere</button>
				</>,
			);
			const elsewhere = screen.getByRole('button', { name: 'Elsewhere' });
			elsewhere.focus();

			await browserUser.hover(crumb('Dashboards'));
			await waitForCard();
			await browserUser.hover(ellipsis() as HTMLElement);
			await expect.poll(ellipsisPopup, { timeout: 2000 }).not.toBeNull();
			await browserUser.hover(crumb('Checkout'));
			await expect
				.poll(() => card()?.querySelector('[data-current]')?.textContent, { timeout: 2000 })
				.toBe('Checkout summary');

			expect(elsewhere).toHaveFocus();
		});

		it('closes the card as the keyboard focus moves from its crumb to the `...` crumb, which opens nothing', async () => {
			render(<Breadcrumb items={COLLAPSING} maxVisible={3} testId="bc" />);
			await browserUser.tab();
			await waitForCard();

			await browserUser.tab();

			expect(ellipsis()).toHaveFocus();
			await waitForCardToClose();
			expect(ellipsisPopup()).toBeNull();
		});

		it('closes the popup once the pointer leaves the `...` crumb it moved to from a card', async () => {
			renderCollapsing();
			await browserUser.hover(crumb('Dashboards'));
			await waitForCard();
			await browserUser.hover(ellipsis() as HTMLElement);
			await expect.poll(ellipsisPopup, { timeout: 2000 }).not.toBeNull();

			await browserUser.unhover(document.body, { force: true });

			await expect.poll(popup, { timeout: 2000 }).toBeNull();
		});
	});
});
