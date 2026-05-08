import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type * as React from 'react';

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
export function TooltipTrigger({ testId, ...props }: TooltipTriggerProps) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" data-testid={testId} {...props} />;
}
