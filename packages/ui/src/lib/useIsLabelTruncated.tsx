import { type RefCallback, useCallback, useRef, useState } from 'react';

// `scrollWidth`/`clientWidth` are rounded to integers, so a label that fits can
// still report a one pixel overflow on fractional layouts. Anything above that
// is a real truncation.
const LABEL_OVERFLOW_TOLERANCE_PX = 1;

export function isLabelTruncated(label: HTMLElement): boolean {
	return label.scrollWidth - label.clientWidth > LABEL_OVERFLOW_TOLERANCE_PX;
}

export function isLabelTruncatedInHeight(label: HTMLElement): boolean {
	return label.scrollHeight - label.clientHeight > LABEL_OVERFLOW_TOLERANCE_PX;
}

export function useIsLabelTruncated(
	enabled: boolean,
	isTruncated: (node: HTMLElement) => boolean = isLabelTruncated,
): [boolean, RefCallback<HTMLElement>] {
	const [truncated, setTruncated] = useState(false);
	const stopMeasuring = useRef<(() => void) | null>(null);

	const labelRef = useCallback(
		(node: HTMLElement | null): void => {
			stopMeasuring.current?.();
			stopMeasuring.current = null;

			if (
				!node ||
				!enabled ||
				typeof ResizeObserver === 'undefined' ||
				typeof MutationObserver === 'undefined'
			) {
				return;
			}

			const measure = (): void => setTruncated(isTruncated(node));

			const resizeObserver = new ResizeObserver(measure);
			resizeObserver.observe(node);

			const mutationObserver = new MutationObserver(measure);
			mutationObserver.observe(node, { characterData: true, childList: true, subtree: true });

			const { fonts } = node.ownerDocument;
			fonts?.addEventListener('loadingdone', measure);

			stopMeasuring.current = (): void => {
				resizeObserver.disconnect();
				mutationObserver.disconnect();
				fonts?.removeEventListener('loadingdone', measure);
			};
		},
		[enabled, isTruncated],
	);

	return [enabled && truncated, labelRef];
}
