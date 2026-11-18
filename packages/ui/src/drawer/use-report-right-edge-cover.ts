import { useState } from 'react';
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
	// so the distance from its edge to the window's counts too. Read again as the width changes,
	// which is when a resize of the window moves things.
	useIsomorphicLayoutEffect(() => {
		const viewport = panel?.parentElement;
		if (!viewport) {
			setGap(0);
			return;
		}

		const outside =
			viewport.ownerDocument.documentElement.clientWidth - viewport.getBoundingClientRect().right;
		const padding = Number.parseFloat(getComputedStyle(viewport).paddingRight) || 0;
		setGap(outside + padding);
	}, [panel, width]);

	useCoverRightEdge(isOpen && width !== undefined ? width + gap : undefined);
}
