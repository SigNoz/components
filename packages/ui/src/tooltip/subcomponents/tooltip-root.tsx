import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import type * as React from 'react';
import { TooltipContentIdProvider } from '../tooltip-content-id-context.js';
import { TooltipContentStackProviderIfMissing } from '../tooltip-content-stack-context.js';
import { useIsInsideTooltipTrigger } from '../tooltip-trigger-context.js';

/**
 * @access private
 */
export type TooltipRootProps = Omit<
	React.ComponentProps<typeof TooltipPrimitive.Root>,
	'children'
> & {
	children?: React.ReactNode;
};

/**
 * @access private
 */
export function TooltipRoot({ children, ...props }: TooltipRootProps): React.ReactNode {
	const insideTrigger = useIsInsideTooltipTrigger();

	// A second tooltip on the same element would open on the same hover, so the parts
	// below stack into the tooltip above instead.
	if (insideTrigger) {
		return children;
	}

	return (
		<TooltipPrimitive.Root {...props}>
			<TooltipContentIdProvider>
				<TooltipContentStackProviderIfMissing>{children}</TooltipContentStackProviderIfMissing>
			</TooltipContentIdProvider>
		</TooltipPrimitive.Root>
	);
}
