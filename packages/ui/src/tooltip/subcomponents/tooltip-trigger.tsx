import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import * as React from 'react';
import { useTooltipSettings } from './tooltip-context.js';

/**
 * Base UI intersects the trigger's own `RefAttributes<HTMLElement>` with the
 * `<button>` ref it renders, which no single `forwardRef` type satisfies. The
 * element is a button either way, so the forwarded ref is widened to that.
 */
type TriggerRef = React.ComponentProps<typeof TooltipPrimitive.Trigger>['ref'];

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
export const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
	({ asChild, testId, children, ...props }, ref) => {
		const { delayDuration } = useTooltipSettings();
		const child = asChild && React.isValidElement(children) ? children : undefined;

		if (child !== undefined) {
			return (
				<TooltipPrimitive.Trigger
					ref={ref as TriggerRef}
					data-slot="tooltip-trigger"
					data-testid={testId}
					delay={delayDuration}
					render={child}
					{...props}
				/>
			);
		}

		return (
			<TooltipPrimitive.Trigger
				ref={ref as TriggerRef}
				data-slot="tooltip-trigger"
				data-testid={testId}
				delay={delayDuration}
				{...props}
			>
				{children}
			</TooltipPrimitive.Trigger>
		);
	},
);
TooltipTrigger.displayName = 'TooltipTrigger';
