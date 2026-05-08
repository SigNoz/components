import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type * as React from 'react';

export type TooltipProviderProps = {
	/**
	 * The children of the tooltip provider.
	 */
	children: React.ReactNode;
	/**
	 * The duration from when the pointer enters the trigger until the tooltip gets opened.
	 * @defaultValue 700
	 */
	delayDuration?: number;
	/**
	 * How much time a user has to enter another trigger without incurring a delay again.
	 * @defaultValue 300
	 */
	skipDelayDuration?: number;
	/**
	 * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
	 * @defaultValue false
	 */
	disableHoverableContent?: boolean;
	/**
	 * The test id of the tooltip provider.
	 */
	testId?: string;
};

/**
 * Wraps your app (or a section of it) to provide shared configuration for all tooltips.
 * Use delayDuration to control the hover delay; set to 0 in Storybook for instant feedback.
 *
 * @example
 * ```tsx
 * <TooltipProvider delayDuration={700}>
 *   <TooltipSimple title="Helpful information">
 *     <Button>Hover me</Button>
 *   </TooltipSimple>
 * </TooltipProvider>
 * ```
 */
export function TooltipProvider({ delayDuration = 0, testId, ...props }: TooltipProviderProps) {
	return (
		<TooltipPrimitive.Provider
			data-slot="tooltip-provider"
			data-testid={testId}
			delayDuration={delayDuration}
			{...props}
		/>
	);
}
