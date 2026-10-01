import { createContext, useContext } from 'react';

const TooltipLayerContext = createContext<Element | null>(null);

/**
 * Hands the trigger element to the positioner, which stacks the popup above the layer the
 * trigger sits in.
 *
 * @access private
 */
export const TooltipLayerProvider = TooltipLayerContext.Provider;

/**
 * The trigger element of the tooltip being rendered, `null` outside a `TooltipAnchor`.
 *
 * @access private
 */
export function useTooltipLayerTrigger(): Element | null {
	return useContext(TooltipLayerContext);
}

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
