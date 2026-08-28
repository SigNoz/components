import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import * as React from 'react';
import { TooltipSettingsProvider } from './tooltip-context.js';

export type TooltipProviderProps = {
	/**
	 * The children of the tooltip provider.
	 */
	children: React.ReactNode;
	/**
	 * The duration from when the pointer enters the trigger until the tooltip gets opened.
	 * @defaultValue 0
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
	 *
	 * Accepted for API compatibility only — the provider renders no element of its
	 * own, so this has never reached the DOM.
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
export function TooltipProvider({
	delayDuration = 0,
	skipDelayDuration = 300,
	disableHoverableContent,
	children,
}: TooltipProviderProps) {
	const settings = React.useMemo(
		() => ({ delayDuration, disableHoverableContent }),
		[delayDuration, disableHoverableContent],
	);

	return (
		<TooltipPrimitive.Provider delay={delayDuration} timeout={skipDelayDuration}>
			<TooltipSettingsProvider value={settings}>{children}</TooltipSettingsProvider>
		</TooltipPrimitive.Provider>
	);
}
