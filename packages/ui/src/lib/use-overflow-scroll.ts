import { type RefCallback, useCallback, useEffect, useRef, useState } from 'react';

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
 * How far the viewport has scrolled along its inline axis, and how much is left.
 *
 * @access private
 */
export type OverflowAxis = {
	scrollSize: number;
	clientSize: number;
	/** How far the strip has already travelled from its start, on either writing direction. */
	travelled: number;
	/** How much is left before the far end. */
	remaining: number;
};

/**
 * Measures the scroll viewport along its inline axis.
 *
 * An RTL viewport counts `scrollLeft` down from zero, so `travelled` is the absolute value and
 * neither end flag has to know which direction it is on.
 *
 * @access private
 */
export function readOverflowAxis(viewport: HTMLElement): OverflowAxis {
	const scrollSize = viewport.scrollWidth;
	const clientSize = viewport.clientWidth;
	const travelled = Math.abs(viewport.scrollLeft);

	return { scrollSize, clientSize, travelled, remaining: scrollSize - clientSize - travelled };
}

/**
 * @access private
 */
export type UseOverflowScrollOptions = {
	/**
	 * The active item's key. A change scrolls that item back into view.
	 */
	activeKey: string | undefined;
	/**
	 * Finds the active item inside the viewport, so it can be brought back into view. A tab bar
	 * passes `[data-slot="tabs-item"][data-active]`, a toggle group its own pressed button.
	 */
	activeItemSelector: string;
};

/**
 * @access private
 */
export type UseOverflowScrollReturn = {
	/**
	 * Attach to the scroll viewport.
	 */
	viewportRef: RefCallback<HTMLDivElement>;
	/**
	 * True while the strip is wider than the viewport.
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
 * Keeps an overflowing horizontal strip scrollable: reports whether it overflows and how far it can
 * still travel, moves it a step at a time, and brings the active item back into view.
 *
 * Shared by `Tabs` and `ToggleGroup`, which scroll the same way and differ only in what marks the
 * active item.
 *
 * Nothing here listens for the strip moving on its own. Base UI's tab indicator measures an item
 * against the list and both live inside the viewport, so that delta is already scroll invariant, and
 * the browser scrolls a newly focused item into view by itself.
 *
 * Motion is not decided here either: `scrollBy` without a `behavior` follows the element's CSS
 * `scroll-behavior`, which each stylesheet drops to `auto` under `prefers-reduced-motion`.
 *
 * @access private
 */
export function useOverflowScroll({
	activeKey,
	activeItemSelector,
}: UseOverflowScrollOptions): UseOverflowScrollReturn {
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

		const { scrollSize, clientSize, travelled, remaining } = readOverflowAxis(viewport);

		setIsOverflowing(scrollSize - clientSize > SCROLL_OVERFLOW_TOLERANCE_PX);
		setCanScrollToStart(travelled > SCROLL_OVERFLOW_TOLERANCE_PX);
		setCanScrollToEnd(remaining > SCROLL_OVERFLOW_TOLERANCE_PX);
	}, []);

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

	const scrollByStep = useCallback((sign: 1 | -1): void => {
		const viewport = viewportNode.current;

		if (!viewport) {
			return;
		}

		const { clientSize } = readOverflowAxis(viewport);
		const step = Math.round(clientSize * SCROLL_STEP_RATIO) * sign;

		// An RTL viewport scrolls towards negative `scrollLeft`, and `scrollBy` takes physical
		// deltas on both directions.
		const directionSign = getComputedStyle(viewport).direction === 'rtl' ? -1 : 1;

		viewport.scrollBy({ left: step * directionSign });
	}, []);

	const scrollTowardsStart = useCallback((): void => scrollByStep(-1), [scrollByStep]);
	const scrollTowardsEnd = useCallback((): void => scrollByStep(1), [scrollByStep]);

	useEffect(() => {
		const viewport = viewportNode.current;

		if (!viewport) {
			return;
		}

		const item = viewport.querySelector<HTMLElement>(activeItemSelector);

		if (!item) {
			return;
		}

		const viewportRect = viewport.getBoundingClientRect();
		const itemRect = item.getBoundingClientRect();
		const before = itemRect.left - viewportRect.left;
		const after = itemRect.right - viewportRect.right;

		// Rect deltas rather than `Element.scrollIntoView`, which walks every scrollable ancestor and
		// would scroll the page whenever the strip sits below the fold.
		const delta = before < 0 ? before : after > 0 ? after : 0;

		if (delta === 0) {
			hasAligned.current = true;
			return;
		}

		// The first alignment is the strip arriving already scrolled, so it does not animate. Every
		// later one is a real change of item and does.
		const previousBehavior = viewport.style.scrollBehavior;

		if (!hasAligned.current) {
			viewport.style.scrollBehavior = 'auto';
		}

		viewport.scrollBy({ left: delta });
		viewport.style.scrollBehavior = previousBehavior;
		hasAligned.current = true;
	}, [activeKey, activeItemSelector]);

	return {
		viewportRef,
		isOverflowing,
		canScrollToStart,
		canScrollToEnd,
		scrollTowardsStart,
		scrollTowardsEnd,
	};
}
