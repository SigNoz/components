import type { Transition, Variants } from 'motion/react';
import type { DrawerAnimation, DrawerDirection } from './types.js';

export const drawerTransition: Transition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] };

/**
 * Passing any `onUpdate` makes motion skip WAAPI and animate on the main thread.
 * On WAAPI, motion cancels the finished exit animation before it writes the final
 * value to inline style, so for a frame the element falls back to its open-state
 * style and the drawer flashes back to full opacity right before unmounting.
 */
export const syncMotionStyle = () => {};

type OutsideEvent = { target: EventTarget | null; preventDefault(): void };

/**
 * A toast sits outside the panel without being the page behind it: pressing or focusing it
 * must not close the drawer, so `handler` never sees it. The `Toaster` is portalled into the
 * body, and Radix only skips its own toasts (a `DismissableLayer` branch).
 */
export function ignoreToasts<Event extends OutsideEvent>(
	handler: ((event: Event) => void) | undefined,
) {
	return (event: Event) => {
		if (event.target instanceof Element && event.target.closest('[data-slot="toaster"]')) {
			event.preventDefault();
			return;
		}
		handler?.(event);
	};
}

export function getContentVariants(
	direction: DrawerDirection,
	animation: DrawerAnimation,
): Variants {
	if (animation === 'slide') {
		const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
		const sign = direction === 'left' || direction === 'top' ? '-' : '';
		const offscreen = `translate${axis}(${sign}100%)`;

		return {
			initial: { opacity: 0, transform: offscreen },
			animate: {
				opacity: 1,
				transform: `translate${axis}(0%)`,
				transition: drawerTransition,
			},
			exit: { opacity: 0, transform: offscreen },
		};
	}

	const hidden = `scale(${animation === 'zoom' ? 0.9 : 0.95})`;

	return {
		initial: { opacity: 0, transform: hidden },
		animate: { opacity: 1, transform: 'scale(1)' },
		exit: { opacity: 0, transform: hidden },
	};
}
