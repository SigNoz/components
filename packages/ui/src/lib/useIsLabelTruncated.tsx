import { type RefCallback, useCallback, useRef, useState } from 'react';

// `scrollWidth`/`clientWidth` are rounded to integers, so a label that fits can
// still report a one pixel overflow on fractional layouts. Anything above that
// is a real truncation.
const LABEL_OVERFLOW_TOLERANCE_PX = 1;

function isLabelTruncated(label: HTMLElement): boolean {
	return label.scrollWidth - label.clientWidth > LABEL_OVERFLOW_TOLERANCE_PX;
}

export function useIsLabelTruncated(enabled: boolean): [boolean, RefCallback<HTMLSpanElement>] {
	const [truncated, setTruncated] = useState(false);
	const observers = useRef<Array<MutationObserver | ResizeObserver>>([]);

	const labelRef = useCallback(
		(node: HTMLSpanElement | null): void => {
			for (const observer of observers.current) {
				observer.disconnect();
			}

			observers.current = [];

			if (
				!node ||
				!enabled ||
				typeof ResizeObserver === 'undefined' ||
				typeof MutationObserver === 'undefined'
			) {
				return;
			}

			const measure = (): void => setTruncated(isLabelTruncated(node));

			const resizeObserver = new ResizeObserver(measure);
			resizeObserver.observe(node);

			const mutationObserver = new MutationObserver(measure);
			mutationObserver.observe(node, { characterData: true, childList: true, subtree: true });

			observers.current = [resizeObserver, mutationObserver];
		},
		[enabled],
	);

	return [enabled && truncated, labelRef];
}
