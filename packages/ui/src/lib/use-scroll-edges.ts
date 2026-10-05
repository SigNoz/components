import { useCallback, useEffect, useRef, useState } from 'react';

// `scrollHeight`/`clientHeight` are rounded to integers, so a list that fits can still report a one
// pixel overflow on fractional layouts.
const SCROLL_TOLERANCE_PX = 1;

/**
 * @access private
 */
export type ScrollEdges = {
	start: boolean;
	end: boolean;
};

const NO_EDGES: ScrollEdges = { start: false, end: false };

/**
 * Which edges of a vertical scroller are clipping something, kept in sync on scroll and on resize
 * of the scroller or of its direct children.
 *
 * `ref` is a callback ref, so a scroller that mounts after the hook, inside a portal that only
 * renders while its popup is open, is still measured and observed. `element` is the scroller, as
 * state, for a consumer that needs it during render.
 *
 * @access private
 */
export function useScrollEdges<T extends HTMLElement>(): {
	ref: (node: T | null) => void;
	element: T | null;
	edges: ScrollEdges;
	measure: () => void;
} {
	const elementRef = useRef<T | null>(null);
	const [element, setElement] = useState<T | null>(null);
	const [edges, setEdges] = useState<ScrollEdges>(NO_EDGES);

	const measure = useCallback((): void => {
		const node = elementRef.current;

		if (node === null) {
			setEdges(NO_EDGES);
			return;
		}

		const maxScroll = node.scrollHeight - node.clientHeight;
		const start = node.scrollTop > SCROLL_TOLERANCE_PX;
		const end = maxScroll - node.scrollTop > SCROLL_TOLERANCE_PX;

		setEdges((current) =>
			current.start === start && current.end === end ? current : { start, end },
		);
	}, []);

	// A new scroller, or none, starts from no edges. The effect below measures the new one.
	const ref = useCallback((node: T | null): void => {
		elementRef.current = node;
		setElement(node);
		setEdges(NO_EDGES);
	}, []);

	useEffect(() => {
		if (element === null || typeof ResizeObserver === 'undefined') {
			return;
		}

		measure();

		const observer = new ResizeObserver(measure);
		observer.observe(element);

		for (const child of Array.from(element.children)) {
			observer.observe(child);
		}

		return () => {
			observer.disconnect();
		};
	}, [element, measure]);

	return { ref, element, edges, measure };
}
