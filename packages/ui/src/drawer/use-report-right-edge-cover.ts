import { useState } from 'react';
import { readPx } from '../lib/css-length.js';
import { observeResize } from '../lib/observe-resize.js';
import { useCoverRightEdge } from '../lib/right-edge-cover.js';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import { useElementWidth } from '../lib/use-element-width.js';

/**
 * Tells a `Toaster` how much of the right side of the window the open panel covers, the panel and
 * the gap beside it, so the right stacks of toasts move beside it. It stops as soon as the drawer
 * starts closing, so the stacks move back while the panel slides out.
 *
 * @access private
 */
export function useReportRightEdgeCover(panel: HTMLElement | null, isOpen: boolean): void {
	const width = useElementWidth(panel);
	const [gap, setGap] = useState(0);

	// The panel sits against the right edge of its viewport, inside the viewport's padding. The
	// viewport is fixed to the window, unless a `container` holds it, such as one with a transform,
	// so the distance from its edge to the window's counts too. That distance changes as the window
	// resizes, which resizes the root element, or as the container does, which the viewport fills,
	// even while the panel keeps its width at a max size.
	useIsomorphicLayoutEffect(() => {
		const viewport = panel?.parentElement;
		if (!viewport) {
			setGap(0);
			return;
		}

		const root = viewport.ownerDocument.documentElement;
		const measure = (): void => {
			const outside = root.clientWidth - viewport.getBoundingClientRect().right;
			const padding = readPx(getComputedStyle(viewport).paddingRight);
			setGap(outside + padding);
		};
		measure();

		const stopViewport = observeResize(viewport, measure);
		const stopRoot = observeResize(root, measure);

		return () => {
			stopViewport();
			stopRoot();
		};
	}, [panel]);

	useCoverRightEdge(isOpen && width !== undefined ? width + gap : undefined);
}
