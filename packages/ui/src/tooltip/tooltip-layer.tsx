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
