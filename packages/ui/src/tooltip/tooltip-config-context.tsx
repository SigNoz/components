import type { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { type ComponentProps, createContext, type ReactNode, useContext, useMemo } from 'react';

type OriginalPortalProps = ComponentProps<typeof TooltipPrimitive.Portal>;

/**
 * Where the tooltip content is portalled to. Defaults to `document.body`.
 */
export type TooltipContainer = OriginalPortalProps['container'];

/**
 * @access private
 */
export type TooltipConfig = {
	/**
	 * True once a `TooltipProvider` is above in the tree. Components that render
	 * tooltips of their own read it to avoid nesting a second provider, which
	 * would shadow the container the app configured.
	 */
	hasProvider: boolean;
	/**
	 * The portal container every tooltip below uses unless it sets its own.
	 */
	container?: TooltipContainer;
};

const TooltipConfigContext = createContext<TooltipConfig>({ hasProvider: false });

/**
 * @access private
 */
export function TooltipConfigProvider({
	container,
	children,
}: {
	container?: TooltipContainer;
	children: ReactNode;
}): ReactNode {
	const value = useMemo(() => ({ hasProvider: true, container }), [container]);

	return <TooltipConfigContext.Provider value={value}>{children}</TooltipConfigContext.Provider>;
}

/**
 * The tooltip configuration in effect at this point of the tree.
 *
 * @access private
 */
export function useTooltipConfig(): TooltipConfig {
	return useContext(TooltipConfigContext);
}
