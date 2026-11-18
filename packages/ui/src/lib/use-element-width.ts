import { useState } from 'react';
import { observeResize } from './observe-resize.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

/**
 * The rendered width of `element` in pixels, kept up to date while it resizes. `undefined` before
 * the element exists or while it has no width, such as in a test environment with no layout.
 *
 * Read in a layout effect, so what depends on it, such as a nested drawer that takes its parent's
 * width, is in place before the first paint.
 * Where there is no `ResizeObserver`, such as jsdom, the width is measured once.
 *
 * @access private
 */
export function useElementWidth(element: HTMLElement | null): number | undefined {
	const [width, setWidth] = useState<number | undefined>(undefined);

	useIsomorphicLayoutEffect(() => {
		if (!element) {
			setWidth(undefined);
			return;
		}

		const measure = (): void => {
			const next = element.getBoundingClientRect().width;
			setWidth(next > 0 ? next : undefined);
		};
		measure();

		return observeResize(element, measure);
	}, [element]);

	return width;
}
