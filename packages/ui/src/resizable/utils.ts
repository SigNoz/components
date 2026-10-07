import type { RefObject } from 'react';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import type { ResizableOrientationType, ResizableSizeType, ResizableStorageType } from './types.js';

/**
 * Whether a panel keeps its size in pixels when the root changes size.
 *
 * @access private
 */
export function isFixedSize(size: ResizableSizeType | undefined): boolean {
	return typeof size === 'string' && (size.endsWith('px') || size.endsWith('rem'));
}

/**
 * Whether a `label` leaves its handle with no name. Takes any value, for a caller with no types.
 *
 * @access private
 */
export function isBlankLabel(label: unknown): boolean {
	return typeof label !== 'string' || label.trim() === '';
}

/**
 * `encodeURIComponent`, which also takes a lone surrogate. There it throws, and here it comes out
 * as `%u` and the code unit in hex, which `encodeURIComponent` never writes, so two values never
 * come out the same.
 *
 * @access private
 */
export function encodeValue(value: string): string {
	return value
		.split(/(\p{Cs})/u)
		.map((part, index) =>
			index % 2 === 1
				? `%u${part.charCodeAt(0).toString(16).toUpperCase()}`
				: encodeURIComponent(part),
		)
		.join('');
}

/**
 * Panel sizes in pixels, keyed by panel `value`. Has no prototype, so a `value` of `__proto__` is a
 * key like any other.
 *
 * @access private
 */
export type ResizableLayout = Record<string, number>;

/**
 * @access private
 */
export function createLayout(): ResizableLayout {
	return Object.create(null) as ResizableLayout;
}

/**
 * A panel as the saved layout sees it.
 *
 * @access private
 */
export type ResizableLayoutPanel = {
	value: string;
	/**
	 * The panel's DOM id, which keys it in the library's layout.
	 */
	id: string;
	/**
	 * Keeps its size in pixels when the root changes size.
	 */
	fixed: boolean;
};

/**
 * The layout of these panels saved under `key`, or `undefined` when there is none or it does not
 * parse.
 *
 * @access private
 */
export function readLayout(
	storage: ResizableStorageType | undefined,
	key: string,
	values: string[],
): ResizableLayout | undefined {
	try {
		const raw = (storage ?? localStorage).getItem(key);
		const saved: unknown = raw === null ? null : JSON.parse(raw);

		if (typeof saved !== 'object' || saved === null) {
			return undefined;
		}

		const sizes = saved as Record<string, unknown>;
		const layout = createLayout();

		for (const value of values) {
			const size = sizes[value];

			if (typeof size !== 'number' || !Number.isFinite(size) || size < 0) {
				return undefined;
			}

			layout[value] = size;
		}

		return layout;
	} catch {
		return undefined;
	}
}

/**
 * @access private
 */
export function writeLayout(
	storage: ResizableStorageType | undefined,
	key: string,
	layout: ResizableLayout,
): void {
	try {
		(storage ?? localStorage).setItem(key, JSON.stringify(layout));
	} catch {
		// A full or blocked storage loses the save. The layout on screen stays as it is.
	}
}

/**
 * The pixels the panels of a root share along its axis: the root less its handles, the room the
 * library measures its percentages against. Measured from the root, not by adding up the panels,
 * whose rounded sizes add up to a pixel more or less depending on the split.
 *
 * @access private
 */
export function measurePanels(root: HTMLElement, orientation: ResizableOrientationType): number {
	const isHorizontal = orientation === 'horizontal';
	let room = isHorizontal ? root.clientWidth : root.clientHeight;

	root
		.querySelectorAll<HTMLElement>(':scope > [data-slot="resizable-handle"]')
		.forEach((handle) => {
			room -= isHorizontal ? handle.offsetWidth : handle.offsetHeight;
		});

	return room;
}

/**
 * A saved layout in percent of `room`, keyed by panel id. A fixed panel gets its saved pixels back,
 * and the other panels share what is left in the proportions they were saved with. The library
 * applies the same rule when the root changes size, so a root of another size between two visits
 * reads as a resize.
 *
 * @access private
 */
export function restoreLayout(
	saved: ResizableLayout,
	panels: ResizableLayoutPanel[],
	room: number,
): Record<string, number> {
	let fixedShare = 0;
	let relativePixels = 0;
	let relativeCount = 0;

	for (const { value, fixed } of panels) {
		if (fixed) {
			fixedShare += (saved[value] / room) * 100;
		} else {
			relativePixels += saved[value];
			relativeCount++;
		}
	}

	const rest = 100 - fixedShare;
	const layout: Record<string, number> = {};

	for (const { value, id, fixed } of panels) {
		if (fixed) {
			layout[id] = (saved[value] / room) * 100;
		} else {
			layout[id] =
				relativePixels > 0 ? (saved[value] / relativePixels) * rest : rest / relativeCount;
		}
	}

	return layout;
}

/**
 * Writes `data-testid` on an element `react-resizable-panels` renders, or removes it when there is
 * no `testId`.
 *
 * The library writes `data-testid` from the element `id` after the props it is given, so a
 * `data-testid` prop never reaches the DOM. React writes the attribute again only when that `id`
 * changes, so `id` reruns the effect.
 *
 * @access private
 */
export function useTestIdAttribute(
	ref: RefObject<HTMLElement | null>,
	testId: string | undefined,
	id: string,
): void {
	useIsomorphicLayoutEffect(() => {
		const element = ref.current;

		if (element === null) {
			return;
		}

		if (testId === undefined) {
			element.removeAttribute('data-testid');
		} else {
			element.setAttribute('data-testid', testId);
		}
	}, [ref, testId, id]);
}
