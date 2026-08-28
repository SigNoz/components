import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import * as React from 'react';
import {
	DismissRegistryProvider,
	runDismissHandlers,
	useDismissRegistry,
} from '../../lib/dismiss-handlers.js';
import { TooltipSettingsProvider, useTooltipSettings } from './tooltip-context.js';

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
	 */
	delayDuration?: number;
	/**
	 * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
	 * @defaultValue false
	 */
	disableHoverableContent?: boolean;
	/**
	 * The test id of the tooltip root.
	 *
	 * Accepted for API compatibility only — the root renders no element of its own,
	 * so this has never reached the DOM.
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
export function TooltipRoot({
	open,
	defaultOpen,
	onOpenChange,
	delayDuration,
	disableHoverableContent,
	children,
}: TooltipRootProps) {
	const inherited = useTooltipSettings();
	const registry = useDismissRegistry();

	const settings = React.useMemo(
		() => ({
			delayDuration: delayDuration ?? inherited.delayDuration,
			disableHoverableContent: disableHoverableContent ?? inherited.disableHoverableContent,
		}),
		[
			delayDuration,
			disableHoverableContent,
			inherited.delayDuration,
			inherited.disableHoverableContent,
		],
	);

	const handleOpenChange = React.useCallback(
		(nextOpen: boolean, eventDetails: TooltipPrimitive.Root.ChangeEventDetails) => {
			runDismissHandlers(registry, nextOpen, eventDetails);
			if (eventDetails.isCanceled) {
				return;
			}
			onOpenChange?.(nextOpen);
		},
		[onOpenChange, registry],
	);

	return (
		<TooltipPrimitive.Root
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={handleOpenChange}
			disableHoverablePopup={settings.disableHoverableContent}
		>
			<TooltipSettingsProvider value={settings}>
				<DismissRegistryProvider registry={registry}>{children}</DismissRegistryProvider>
			</TooltipSettingsProvider>
		</TooltipPrimitive.Root>
	);
}
