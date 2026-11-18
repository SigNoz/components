import { useState } from 'react';
import { readPx } from '../lib/css-length.js';
import { observeResize } from '../lib/observe-resize.js';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';

/**
 * How far the right edge of the box `element` is placed in, its containing block, sits from the
 * right edge of the window. `0` for a fixed element, unless an ancestor with a transform holds it,
 * such as a `container`. Read again as the window resizes, which resizes the root element, and as
 * the parent resizes: the portal `element` renders in fills the `container`, so it follows a
 * container that resizes on its own, such as one a drawer shares.
 *
 * The edge is the element's own right edge plus its `right` and its right margin, so it holds
 * whatever `right` the element has, even while `right` animates.
 *
 * @access private
 */
export function useContainingBlockRightInset(element: HTMLElement | null): number {
	const [inset, setInset] = useState(0);

	useIsomorphicLayoutEffect(() => {
		if (!element) {
			setInset(0);
			return;
		}

		const root = element.ownerDocument.documentElement;
		const measure = (): void => {
			const style = getComputedStyle(element);
			const edge =
				element.getBoundingClientRect().right + readPx(style.right) + readPx(style.marginRight);
			setInset(root.clientWidth - edge);
		};
		measure();

		const stopRoot = observeResize(root, measure);
		const parent = element.parentElement;
		const stopParent = parent ? observeResize(parent, measure) : undefined;

		return () => {
			stopRoot();
			stopParent?.();
		};
	}, [element]);

	return inset;
}
