import { useState } from 'react';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';

/**
 * The rendered width of `element` in pixels, kept up to date while it resizes. `undefined` before
 * the element exists or while it has no width, such as in a test environment with no layout.
 *
 * Read in a layout effect, so a nested drawer renders at its parent's width before the first paint.
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

		if (typeof ResizeObserver === 'undefined') {
			return;
		}

		const observer = new ResizeObserver(measure);
		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [element]);

	return width;
}
