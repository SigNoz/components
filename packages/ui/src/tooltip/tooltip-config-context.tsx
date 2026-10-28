import type { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useMemo,
	useState,
} from 'react';
import {
	TOOLTIP_DEFAULT_CLOSE_DELAY,
	TOOLTIP_DEFAULT_DELAY,
	TOOLTIP_DEFAULT_TIMEOUT,
} from './constants.js';
import { createTooltipDelayGroup, type TooltipDelayGroup } from './tooltip-delay-group.js';

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
	/**
	 * The timings of the provider, for a tooltip that opens and closes without a Base UI trigger.
	 */
	delay: number;
	closeDelay: number;
	timeout: number;
	/**
	 * The open tooltips of the provider, so a tooltip that opens without a Base UI trigger skips the
	 * `delay` the same as one that has it. Missing without a provider, where each tooltip waits.
	 */
	group?: TooltipDelayGroup;
};

const TooltipConfigContext = createContext<TooltipConfig>({
	hasProvider: false,
	delay: TOOLTIP_DEFAULT_DELAY,
	closeDelay: TOOLTIP_DEFAULT_CLOSE_DELAY,
	timeout: TOOLTIP_DEFAULT_TIMEOUT,
});

/**
 * @access private
 */
export function TooltipConfigProvider({
	container,
	delay,
	closeDelay,
	timeout,
	children,
}: {
	container?: TooltipContainer;
	delay: number;
	closeDelay: number;
	timeout: number;
	children: ReactNode;
}): ReactNode {
	const [group] = useState(createTooltipDelayGroup);
	const value = useMemo(
		() => ({ hasProvider: true, container, delay, closeDelay, timeout, group }),
		[container, delay, closeDelay, timeout, group],
	);

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
