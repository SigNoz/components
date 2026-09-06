import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import type * as React from 'react';
import {
	type TooltipContainer,
	TooltipConfigProvider,
	useTooltipConfig,
} from '../tooltip-config-context.js';

type OriginalProviderProps = React.ComponentProps<typeof TooltipPrimitive.Provider>;

export interface TooltipProviderProps {
	/**
	 * The subtree the provider applies to.
	 */
	children?: OriginalProviderProps['children'];
	/**
	 * How long to wait before opening a tooltip on hover, in milliseconds. Long enough
	 * that a pointer passing over a trigger does not open it. Focus opens it at once.
	 *
	 * @default 300
	 */
	delay?: OriginalProviderProps['delay'];
	/**
	 * How long to wait before closing a tooltip once the pointer leaves, in milliseconds.
	 *
	 * @default 0
	 */
	closeDelay?: OriginalProviderProps['closeDelay'];
	/**
	 * Another tooltip opens at once, skipping `delay`, when the previous one closed
	 * within this many milliseconds.
	 *
	 * @default 400
	 */
	timeout?: OriginalProviderProps['timeout'];
	/**
	 * The element every tooltip below is portalled into unless it sets its own
	 * `container`. Defaults to `document.body`.
	 */
	container?: TooltipContainer;
}

export function TooltipProvider({
	container,
	children,
	delay = 300,
	...props
}: TooltipProviderProps): React.ReactNode {
	return (
		<TooltipConfigProvider container={container}>
			<TooltipPrimitive.Provider delay={delay} {...props}>
				{children}
			</TooltipPrimitive.Provider>
		</TooltipConfigProvider>
	);
}

/**
 * @access private
 */
export function TooltipProviderIfMissing(props: TooltipProviderProps): React.ReactNode {
	const { hasProvider } = useTooltipConfig();

	if (hasProvider) {
		return props.children;
	}

	return <TooltipProvider {...props} />;
}
