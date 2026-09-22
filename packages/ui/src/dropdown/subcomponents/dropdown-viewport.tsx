import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import styles from '../dropdown.module.scss';

// `scrollHeight`/`clientHeight` are rounded to integers, so a list that fits can still report a one
// pixel overflow on fractional layouts.
const SCROLL_TOLERANCE_PX = 1;

type ScrollEdges = {
	start: boolean;
	end: boolean;
};

const NO_EDGES: ScrollEdges = { start: false, end: false };

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
	const viewportRef = useRef<HTMLDivElement | null>(null);
	const [edges, setEdges] = useState<ScrollEdges>(NO_EDGES);

	const measure = useCallback((): void => {
		const node = viewportRef.current;

		if (node === null) {
			setEdges(NO_EDGES);
			return;
		}

		const maxScroll = node.scrollHeight - node.clientHeight;

		setEdges({
			start: node.scrollTop > SCROLL_TOLERANCE_PX,
			end: maxScroll - node.scrollTop > SCROLL_TOLERANCE_PX,
		});
	}, []);

	useEffect(() => {
		const node = viewportRef.current;

		if (node === null || typeof ResizeObserver === 'undefined') {
			return;
		}

		measure();

		const observer = new ResizeObserver(measure);
		observer.observe(node);

		for (const child of Array.from(node.children)) {
			observer.observe(child);
		}

		return () => {
			observer.disconnect();
		};
	}, [measure]);

	return (
		<div
			ref={viewportRef}
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
