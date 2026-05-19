import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

export type TooltipTriggerProps = {
	/**
	 * The children of the tooltip trigger.
	 */
	children?: React.ReactNode;
	/**
	 * When true, merges props onto the child element instead of rendering a wrapper.
	 */
	asChild?: boolean;
	/**
	 * The test id of the tooltip trigger.
	 */
	testId?: string;
};

/**
 * The element that triggers the tooltip to open on hover. Use with `asChild` to delegate
 * to a child element (e.g. a Button).
 */
export const TooltipTrigger = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Trigger>,
	TooltipTriggerProps
>(({ testId, ...props }, ref) => (
	<TooltipPrimitive.Trigger ref={ref} data-slot="tooltip-trigger" data-testid={testId} {...props} />
));
TooltipTrigger.displayName = 'TooltipTrigger';
