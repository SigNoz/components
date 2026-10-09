import type { ReactNode } from 'react';
import { useScrollEdges } from '../../lib/use-scroll-edges.js';
import styles from '../dropdown.module.scss';

/**
 * The scrolling part of a popup, and the two attributes that say which of its edges is clipping
 * something.
 *
 * A plain `div`, not `Menu.Viewport`. Base UI's viewport is the morphing container for a popup that
 * several triggers share, and mounting it turns on `adaptiveOrigin`: the popup is taken out of flow
 * and anchored to the positioner's bottom edge whenever the menu opens upwards. The positioner then
 * measures zero tall, Floating UI reads that as "it fits below", flips back to `bottom`, and
 * `--available-height` clamps the popup into a sliver, which resizes it and starts the cycle again.
 *
 * The fade is drawn at a clipped edge alone: a list scrolled to its top has nothing above it to
 * hint at, so fading its first row there would only make it harder to read.
 *
 * @access private
 */
export function DropdownViewport({ children }: { children: ReactNode }): ReactNode {
	const { ref, edges, measure } = useScrollEdges<HTMLDivElement>();

	return (
		<div
			ref={ref}
			data-slot="dropdown-viewport"
			data-scroll-start={edges.start || undefined}
			data-scroll-end={edges.end || undefined}
			className={styles['dropdown__viewport']}
			onScroll={measure}
		>
			{children}
		</div>
	);
}
