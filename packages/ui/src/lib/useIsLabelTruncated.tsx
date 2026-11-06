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

type Measure = () => void;

// Every measured label shares one observer of each kind. An observer per label is an object, a
// callback and a disconnect per label, which a long list or a table pays thousands of times.
const measures = new Map<Node, Set<Measure>>();
const fontSets = new Set<FontFaceSet>();
let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;

function measureAll(): void {
	for (const nodeMeasures of measures.values()) {
		for (const measure of nodeMeasures) {
			measure();
		}
	}
}

function onResize(entries: ResizeObserverEntry[]): void {
	for (const entry of entries) {
		measures.get(entry.target)?.forEach((measure) => measure());
	}
}

// A change deep inside a label is reported on the node that changed, so every measured label
// above that node is measured again.
function onMutation(records: MutationRecord[]): void {
	const pending = new Set<Measure>();

	for (const record of records) {
		for (let node: Node | null = record.target; node; node = node.parentNode) {
			measures.get(node)?.forEach((measure) => pending.add(measure));
		}
	}

	for (const measure of pending) {
		measure();
	}
}

function observeLabel(node: HTMLElement, measure: Measure): () => void {
	resizeObserver ??= new ResizeObserver(onResize);
	mutationObserver ??= new MutationObserver(onMutation);

	const { fonts } = node.ownerDocument;

	if (fonts && !fontSets.has(fonts)) {
		fontSets.add(fonts);
		fonts.addEventListener('loadingdone', measureAll);
	}

	let nodeMeasures = measures.get(node);

	if (!nodeMeasures) {
		nodeMeasures = new Set();
		measures.set(node, nodeMeasures);
		mutationObserver.observe(node, { characterData: true, childList: true, subtree: true });
	}

	nodeMeasures.add(measure);
	// Observing a node again makes the observer report its size again, which is the first
	// measurement of this caller.
	resizeObserver.observe(node);

	return (): void => {
		nodeMeasures.delete(measure);

		if (nodeMeasures.size === 0) {
			measures.delete(node);
			resizeObserver?.unobserve(node);
		}

		// A MutationObserver cannot stop watching one node, so it stops with the last label.
		if (measures.size === 0) {
			resizeObserver?.disconnect();
			resizeObserver = null;
			mutationObserver?.disconnect();
			mutationObserver = null;

			for (const fontSet of fontSets) {
				fontSet.removeEventListener('loadingdone', measureAll);
			}

			fontSets.clear();
		}
	};
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

			stopMeasuring.current = observeLabel(node, () => setTruncated(isTruncated(node)));
		},
		[enabled, isTruncated],
	);

	return [enabled && truncated, labelRef];
}
