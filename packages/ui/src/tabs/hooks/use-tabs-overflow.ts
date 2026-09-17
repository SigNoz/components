import { type RefCallback, useCallback, useEffect, useRef, useState } from 'react';
import { TabsOrientation } from '../constants.js';
import type { TabsOrientationType } from '../types.js';
import { readTabsAxis } from '../utils.js';

/**
 * `scrollWidth`/`clientWidth` are rounded to integers, so a strip that fits can still report a one
 * pixel overflow on fractional layouts. Same number as `lib/useIsLabelTruncated.tsx`.
 */
const SCROLL_OVERFLOW_TOLERANCE_PX = 1;

/**
 * How much of the visible strip one press of an arrow moves. Short of a full page on purpose: the
 * sliver left behind is what tells the user the strip moved rather than jumped.
 */
const SCROLL_STEP_RATIO = 0.8;

/**
 * @access private
 */
export type UseTabsOverflowOptions = {
	/**
	 * The bar's `orientation`, which decides the axis every measurement reads.
	 */
	orientation: TabsOrientationType;
	/**
	 * The active item's `key`. A change scrolls that tab back into view.
	 */
	activeKey: string | undefined;
};

/**
 * @access private
 */
export type UseTabsOverflowReturn = {
	/**
	 * Attach to the scroll viewport.
	 */
	viewportRef: RefCallback<HTMLDivElement>;
	/**
	 * True while the strip is longer than the viewport along the bar's own axis.
	 */
	isOverflowing: boolean;
	/**
	 * False once the strip is scrolled all the way to that end, which disables the matching arrow.
	 */
	canScrollToStart: boolean;
	canScrollToEnd: boolean;
	/**
	 * Move the strip one step towards that end.
	 */
	scrollTowardsStart: () => void;
	scrollTowardsEnd: () => void;
};

/**
 * Keeps an overflowing tab strip scrollable: reports whether it overflows and how far it can still
 * travel, moves it a step at a time, and brings the active tab back into view.
 *
 * Nothing here listens for the strip moving on its own. Base UI's indicator measures a tab against
 * the list and both live inside the viewport, so that delta is already scroll invariant, and the
 * browser scrolls a newly focused tab into view by itself.
 *
 * Motion is not decided here either: `scrollBy` without a `behavior` follows the element's CSS
 * `scroll-behavior`, which the stylesheet drops to `auto` under `prefers-reduced-motion`.
 *
 * @access private
 */
export function useTabsOverflow({
	orientation,
	activeKey,
}: UseTabsOverflowOptions): UseTabsOverflowReturn {
	const isVertical = orientation === TabsOrientation.Vertical;

	const viewportNode = useRef<HTMLDivElement | null>(null);
	const observer = useRef<ResizeObserver | null>(null);
	const hasAligned = useRef(false);

	const [isOverflowing, setIsOverflowing] = useState(false);
	const [canScrollToStart, setCanScrollToStart] = useState(false);
	const [canScrollToEnd, setCanScrollToEnd] = useState(false);

	const measure = useCallback((): void => {
		const viewport = viewportNode.current;

		if (!viewport) {
			return;
		}

		const { scrollSize, clientSize, travelled, remaining } = readTabsAxis(viewport, isVertical);

		setIsOverflowing(scrollSize - clientSize > SCROLL_OVERFLOW_TOLERANCE_PX);
		setCanScrollToStart(travelled > SCROLL_OVERFLOW_TOLERANCE_PX);
		setCanScrollToEnd(remaining > SCROLL_OVERFLOW_TOLERANCE_PX);
	}, [isVertical]);

	const viewportRef = useCallback<RefCallback<HTMLDivElement>>(
		(node) => {
			observer.current?.disconnect();
			observer.current = null;
			viewportNode.current?.removeEventListener('scroll', measure);
			viewportNode.current = node;

			if (!node) {
				return;
			}

			node.addEventListener('scroll', measure, { passive: true });
			measure();

			if (typeof ResizeObserver === 'undefined') {
				return;
			}

			// The viewport changes with the window or the bar's extra content, the list with an item
			// added, removed or relabelled. Watching both covers every way the two sizes move.
			const resizeObserver = new ResizeObserver(measure);
			resizeObserver.observe(node);

			if (node.firstElementChild) {
				resizeObserver.observe(node.firstElementChild);
			}

			observer.current = resizeObserver;
		},
		[measure],
	);

	useEffect(
		() => () => {
			observer.current?.disconnect();
			viewportNode.current?.removeEventListener('scroll', measure);
		},
		[measure],
	);

	const scrollByStep = useCallback(
		(sign: 1 | -1): void => {
			const viewport = viewportNode.current;

			if (!viewport) {
				return;
			}

			const { clientSize } = readTabsAxis(viewport, isVertical);
			const step = Math.round(clientSize * SCROLL_STEP_RATIO) * sign;

			// An RTL viewport scrolls towards negative `scrollLeft`, and `scrollBy` takes physical
			// deltas on both directions.
			const directionSign = !isVertical && getComputedStyle(viewport).direction === 'rtl' ? -1 : 1;

			viewport.scrollBy(isVertical ? { top: step } : { left: step * directionSign });
		},
		[isVertical],
	);

	const scrollTowardsStart = useCallback((): void => scrollByStep(-1), [scrollByStep]);
	const scrollTowardsEnd = useCallback((): void => scrollByStep(1), [scrollByStep]);

	useEffect(() => {
		const viewport = viewportNode.current;

		if (!viewport) {
			return;
		}

		const tab = viewport.querySelector<HTMLElement>('[data-slot="tabs-item"][data-active]');

		if (!tab) {
			return;
		}

		const viewportRect = viewport.getBoundingClientRect();
		const tabRect = tab.getBoundingClientRect();
		const before = isVertical ? tabRect.top - viewportRect.top : tabRect.left - viewportRect.left;
		const after = isVertical
			? tabRect.bottom - viewportRect.bottom
			: tabRect.right - viewportRect.right;

		// Rect deltas rather than `Element.scrollIntoView`, which walks every scrollable ancestor and
		// would scroll the page whenever the bar sits below the fold.
		const delta = before < 0 ? before : after > 0 ? after : 0;

		if (delta === 0) {
			hasAligned.current = true;
			return;
		}

		// The first alignment is the bar arriving already scrolled, so it does not animate. Every
		// later one is a real change of tab and does.
		const previousBehavior = viewport.style.scrollBehavior;

		if (!hasAligned.current) {
			viewport.style.scrollBehavior = 'auto';
		}

		viewport.scrollBy(isVertical ? { top: delta } : { left: delta });
		viewport.style.scrollBehavior = previousBehavior;
		hasAligned.current = true;
	}, [activeKey, isVertical]);

	return {
		viewportRef,
		isOverflowing,
		canScrollToStart,
		canScrollToEnd,
		scrollTowardsStart,
		scrollTowardsEnd,
	};
}
