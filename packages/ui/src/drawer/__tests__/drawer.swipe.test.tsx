import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser } from 'vitest/browser';
import type { DrawerTypeType } from '../types.js';
import {
	DrawerHarness,
	drawerPanel,
	openFromButton,
	opener,
	renderOpenDrawer,
	slot,
	waitForClosed,
} from './drawer.test-utils.js';

const TYPES: DrawerTypeType[] = ['task', 'inspector'];

const TEXT = 'Started 2 minutes ago on checkout-service';

/**
 * Puts a finger on `element`, near its left edge. Base UI reads a swipe from touch events, and
 * ignores a pointer event whose `pointerType` is `touch`, so these are touch events.
 */
function touch(element: Element) {
	const { left, top, height } = element.getBoundingClientRect();
	const origin = { x: left + 4, y: top + height / 2 };
	let offset = 0;

	function fire(type: 'touchstart' | 'touchmove' | 'touchend'): void {
		const point = new Touch({
			identifier: 1,
			target: element,
			clientX: origin.x + offset,
			clientY: origin.y,
		});
		const down = type === 'touchend' ? [] : [point];

		act(() => {
			element.dispatchEvent(
				new TouchEvent(type, {
					touches: down,
					targetTouches: down,
					changedTouches: [point],
					bubbles: true,
					cancelable: true,
				}),
			);
		});
	}

	fire('touchstart');

	return {
		async moveBy(distance: number, pause: number): Promise<void> {
			await new Promise((resolve) => setTimeout(resolve, pause));
			offset += distance;
			fire('touchmove');
		},
		lift(): void {
			fire('touchend');
		},
	};
}

/**
 * Swipes to the right over `element` in four moves a frame apart. Base UI restarts the drag from
 * the first move, so the drag is 300px, past half of the 414px panel: it closes at any speed.
 */
async function swipe(element: Element): Promise<void> {
	const finger = touch(element);

	for (let step = 0; step < 4; step += 1) {
		await finger.moveBy(100, 16);
	}
	finger.lift();
}

function bodyText(): HTMLElement {
	return screen.getByText(TEXT);
}

function swipeMovement(): string {
	return drawerPanel().style.getPropertyValue('--drawer-swipe-movement-x');
}

describe('Drawer swipe', () => {
	it.each(TYPES)(
		'calls onClose with swipe on a swipe towards the right edge of a %s, once',
		async (type) => {
			const onClose = vi.fn();
			await renderOpenDrawer({ type, onClose, closes: false, children: <p>{TEXT}</p> });

			await swipe(bodyText());

			await waitFor(() => {
				expect(onClose).toHaveBeenCalledExactlyOnceWith('swipe');
			});
		},
	);

	it('drags the panel and lifts the backdrop with the finger', async () => {
		await renderOpenDrawer({ children: <p>{TEXT}</p> });
		const finger = touch(bodyText());

		await finger.moveBy(4, 16);
		await finger.moveBy(80, 16);

		expect(drawerPanel()).toHaveAttribute('data-swiping');
		expect(Number.parseFloat(swipeMovement())).toBeGreaterThan(0);
		expect(new DOMMatrix(getComputedStyle(drawerPanel()).transform).m41).toBeGreaterThan(0);
		expect(slot('drawer-backdrop')).toHaveAttribute('data-swiping');
		expect(Number(getComputedStyle(slot('drawer-backdrop') as Element).opacity)).toBeLessThan(1);

		finger.lift();
	});

	it('closes and gives the focus back to the opener when the consumer sets open to false', async () => {
		render(<DrawerHarness>{<p>{TEXT}</p>}</DrawerHarness>);
		await openFromButton();

		await swipe(bodyText());
		await waitForClosed();

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(opener()).toHaveFocus();
	});

	it('stays open, back where it rests, until open is false', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({ onClose, closes: false, children: <p>{TEXT}</p> });

		await swipe(bodyText());

		await waitFor(() => {
			expect(onClose).toHaveBeenCalledExactlyOnceWith('swipe');
		});
		await waitFor(() => {
			expect(drawerPanel()).not.toHaveAttribute('data-ending-style');
			expect(swipeMovement()).toBe('0px');
		});
		expect(drawerPanel()).toHaveAttribute('data-open');
		expect(drawerPanel()).not.toHaveAttribute('data-swiping');
	});

	it('does not close on a short, slow drag, and settles back', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({ onClose, closes: false, children: <p>{TEXT}</p> });
		const finger = touch(bodyText());

		for (let step = 0; step < 4; step += 1) {
			await finger.moveBy(10, 80);
		}

		expect(drawerPanel()).toHaveAttribute('data-swiping');
		expect(Number.parseFloat(swipeMovement())).toBeGreaterThan(0);

		finger.lift();

		await waitFor(() => {
			expect(swipeMovement()).toBe('0px');
		});
		expect(onClose).not.toHaveBeenCalled();
		expect(drawerPanel()).not.toHaveAttribute('data-swiping');
		expect(drawerPanel()).toHaveAttribute('data-open');
	});

	it('does not close on a swipe towards the left', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({ onClose, closes: false, children: <p>{TEXT}</p> });
		const finger = touch(bodyText());

		for (let step = 0; step < 4; step += 1) {
			await finger.moveBy(-60, 16);
		}

		expect(drawerPanel()).toHaveAttribute('data-swiping');

		finger.lift();

		await waitFor(() => {
			expect(drawerPanel()).not.toHaveAttribute('data-swiping');
		});
		expect(onClose).not.toHaveBeenCalled();
		expect(drawerPanel()).toHaveAttribute('data-open');
	});

	// A mouse press inside `Drawer.Content` never starts a swipe in Base UI, so the drag selects
	// the text the way it does on the page.
	it('does not swipe on a mouse drag over the content, which selects the text instead', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({
			onClose,
			closes: false,
			children: (
				<p>
					<span>Started</span> 2 minutes ago on <span>checkout-service</span>
				</p>
			),
		});
		const swiped: boolean[] = [];
		const observer = new MutationObserver(() => {
			swiped.push(drawerPanel().hasAttribute('data-swiping'));
		});
		observer.observe(drawerPanel(), { attributes: true });

		try {
			await browserUser.dragAndDrop(
				screen.getByText('Started'),
				screen.getByText('checkout-service'),
			);
		} finally {
			observer.disconnect();
		}

		expect(document.getSelection()?.toString()).toContain('2 minutes ago on');
		expect(swiped).not.toContain(true);
		expect(swipeMovement()).toBe('0px');
		expect(onClose).not.toHaveBeenCalled();
		expect(drawerPanel()).toHaveAttribute('data-open');
	});
});
