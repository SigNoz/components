import { type CSSProperties, useState } from 'react';
import { isVisible } from './utils.js';

function createsStackingContext(
	style: CSSStyleDeclaration,
	parentStyle: CSSStyleDeclaration | null,
) {
	if (style.position === 'fixed' || style.position === 'sticky') {
		return true;
	}
	if (style.zIndex !== 'auto') {
		const parentDisplay = parentStyle?.display ?? '';
		if (style.position !== 'static' || /flex|grid/.test(parentDisplay)) {
			return true;
		}
	}

	return (
		Number(style.opacity) < 1 ||
		style.transform !== 'none' ||
		style.filter !== 'none' ||
		style.isolation === 'isolate' ||
		style.mixBlendMode !== 'normal'
	);
}

/**
 * z-index of the outermost stacking context around `element`, the value it competes with in
 * the root stacking context where the popup is portalled. `0` when nothing around it sets one.
 *
 * @access private
 */
export function getLayerZIndex(element: Element): number {
	let layer = 0;

	for (
		let node = element.parentElement;
		node && node !== document.body;
		node = node.parentElement
	) {
		const style = getComputedStyle(node);
		const parentStyle = node.parentElement ? getComputedStyle(node.parentElement) : null;

		if (createsStackingContext(style, parentStyle)) {
			const zIndex = Number.parseInt(style.zIndex, 10);
			layer = Number.isNaN(zIndex) ? 0 : zIndex;
		}
	}

	return layer;
}

/**
 * Whatever a popup is placed against: the element, a ref to one, a getter for either, or a
 * virtual element standing in for a rect or a point.
 *
 * @access private
 */
export type LayerSource =
	| Element
	| { current: Element | null }
	// Structural, not `DOMRect`: a floating-ui virtual element returns a plain rect object.
	| { getBoundingClientRect: () => { left: number; top: number; width: number; height: number } }
	| (() => LayerSource)
	| null
	| undefined;

function resolveLayerElement(source: LayerSource): Element | null {
	if (source == null) {
		return null;
	}
	if (source instanceof Element) {
		return source;
	}
	if (typeof source === 'function') {
		return resolveLayerElement(source());
	}
	if ('current' in source) {
		return source.current;
	}

	// A rect or a point sits in no tree, so it has no layer of its own. Whatever is painted
	// there is in the layer the popup is being shown in, which is the one it has to clear.
	const { left, top, width, height } = source.getBoundingClientRect();

	return document.elementFromPoint(left + width / 2, top + height / 2);
}

/**
 * The `z-index` of a popup portalled out of the layer it is shown in: a drawer, a modal or a
 * floating panel, from this library or another one. `floor`, the popup's own z-index, stays the
 * minimum. A popup shown inside a layer lifts just above it, and one shown behind a layer stays
 * under it.
 *
 * Pass what the popup is anchored to, falling back to its trigger. A popup a handle shows has no
 * trigger to read, and one anchored away from its trigger would read the wrong layer.
 *
 * The layer is read once, on mount. Call it from the positioner, which mounts on open.
 *
 * @access private
 */
export function useLayerZIndex(source: LayerSource, floor: string): CSSProperties | undefined {
	const [layer] = useState(() => {
		const element = resolveLayerElement(source);

		return element ? getLayerZIndex(element) : 0;
	});

	return layer > 0 ? { zIndex: `max(${floor}, ${layer + 1})` } : undefined;
}

// A toast is a `role="dialog"`, or `role="alertdialog"` for a danger one, with
// `aria-modal="false"`. It sits above every dialog and is not one to cover.
const MODAL_SELECTOR =
	'[role="dialog"]:not([aria-modal="false"]), [role="alertdialog"]:not([aria-modal="false"])';
const TOASTER_SELECTOR = '[data-slot="toaster"]';

/**
 * The element a layer that opens by itself reads its own layer from: the one with the focus. When
 * the focus is on `body`, because the element that had it unmounted as the layer opened (a
 * drawer's save button that closes its form), it is a child of the highest open modal on the page,
 * a `role="dialog"` from this library or another one, so the new layer still covers it. A dialog
 * that says it is not modal, such as a toast, does not count.
 *
 * The same goes for a focus inside a toast, such as its action button: a toast stacks above every
 * layer, and one that took the layer of a toast would cover the next toast.
 *
 * @access private
 */
export function findLayerOpener(): Element | null {
	const active = document.activeElement;

	if (active && active !== document.body && !active.closest(TOASTER_SELECTOR)) {
		return active;
	}

	let opener: Element | null = null;
	let openerLayer = 0;

	for (const modal of Array.from(document.querySelectorAll(MODAL_SELECTOR))) {
		// `getLayerZIndex` starts at the parent, so a child counts the modal's own z-index too.
		const inside = modal.firstElementChild ?? modal;
		const layer = isVisible(modal) ? getLayerZIndex(inside) : 0;

		if (layer > openerLayer) {
			opener = inside;
			openerLayer = layer;
		}
	}

	return opener;
}

/**
 * `useLayerZIndex` for a layer that opens by itself and has no trigger to read: a dialog or a
 * command palette. It reads the layer of {@link findLayerOpener} at the moment it mounts, which is
 * the element that opened the layer, because the focus moves into the layer only after its first
 * render.
 *
 * @access private
 */
export function useOpenerLayerZIndex(floor: string): CSSProperties | undefined {
	return useLayerZIndex(findLayerOpener, floor);
}
