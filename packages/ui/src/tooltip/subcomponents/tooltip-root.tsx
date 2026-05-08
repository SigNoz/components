import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type * as React from 'react';

export type TooltipRootProps = {
	/**
	 * The tooltip trigger and content elements.
	 */
	children?: React.ReactNode;
	/**
	 * The controlled open state of the tooltip.
	 */
	open?: boolean;
	/**
	 * The open state of the tooltip when it is initially rendered.
	 */
	defaultOpen?: boolean;
	/**
	 * Event handler called when the open state of the tooltip changes.
	 */
	onOpenChange?: (open: boolean) => void;
	/**
	 * The duration from when the pointer enters the trigger until the tooltip gets opened. This will
	 * override the prop with the same name passed to Provider.
	 * @defaultValue 700
	 */
	delayDuration?: number;
	/**
	 * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
	 * @defaultValue false
	 */
	disableHoverableContent?: boolean;
	/**
	 * The test id of the tooltip root.
	 */
	testId?: string;
};

/**
 * Root component that manages the open state and accessibility wiring for a tooltip.
 * Compose with `TooltipTrigger` and `TooltipContent` for custom content and positioning.
 *
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <TooltipRoot>
 *     <TooltipTrigger asChild>
 *       <Button>Custom content</Button>
 *     </TooltipTrigger>
 *     <TooltipContent side="bottom" arrow>
 *       <span>Rich tooltip content</span>
 *     </TooltipContent>
 *   </TooltipRoot>
 * </TooltipProvider>
 * ```
 */
export function TooltipRoot({ testId, ...props }: TooltipRootProps) {
	return <TooltipPrimitive.Root data-slot="tooltip" data-testid={testId} {...props} />;
}
