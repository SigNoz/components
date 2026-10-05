import { type CSSProperties, useState } from 'react';

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
 * The `z-index` of a popup portalled out of the layer its trigger sits in: a drawer, a modal or a
 * floating panel, from this library or another one. `floor`, the popup's own z-index, stays the
 * minimum. A trigger inside a layer lifts the popup just above it, and one behind a layer stays
 * under it.
 *
 * The layer is read once, on mount. Call it from the positioner, which mounts on open.
 *
 * @access private
 */
export function useLayerZIndex(trigger: Element | null, floor: string): CSSProperties | undefined {
	const [layer] = useState(() => (trigger ? getLayerZIndex(trigger) : 0));

	return layer > 0 ? { zIndex: `max(${floor}, ${layer + 1})` } : undefined;
}
