import * as React from 'react';
import {
	hasTooltipContent,
	TooltipContentStackProvider,
	useTooltipContentStackEntries,
} from '../tooltip-content-stack-context.js';
import { useTooltipHandle } from '../tooltip-handle.js';
import { TooltipLayerProvider } from '../tooltip-layer.js';
import { useIsInsideTooltipTrigger } from '../tooltip-trigger-context.js';
import { TooltipContent, type TooltipContentProps } from './tooltip-content.js';
import { TooltipProviderIfMissing } from './tooltip-provider.js';
import { TooltipRoot, type TooltipRootProps } from './tooltip-root.js';
import { TooltipTrigger, type TooltipTriggerProps } from './tooltip-trigger.js';

/**
 * @access private
 */
export type TooltipAnchorProps = Omit<
	TooltipTriggerProps,
	'handle' | 'contentId' | 'children' | 'content'
> & {
	/**
	 * What this element has to say. Empty content still opens a popup when a tooltip
	 * nested in the trigger stacks an entry onto it.
	 */
	content: React.ReactNode;
	/**
	 * The trigger element. It stays mounted whether there is a popup or not.
	 */
	children: React.ReactNode;
	open?: TooltipRootProps['open'];
	contentProps?: Omit<TooltipContentProps, 'children'>;
};

/**
 * A trigger and the popup it opens, for every component that carries a tooltip of its own.
 *
 * Owns the content stack: a tooltip nested in the trigger adds its entry here, so the popup
 * opens for it even when this element has nothing to say itself. Inside the trigger of another
 * tooltip it adds its own content to that one instead.
 *
 * @access private
 */
export const TooltipAnchor = React.forwardRef<HTMLButtonElement, TooltipAnchorProps>(
	function TooltipAnchor(props, ref) {
		const stacked = useIsInsideTooltipTrigger();
		const parts = <TooltipAnchorParts ref={ref} {...props} />;

		// The trigger and the root are siblings, so their stack has to sit above both.
		return (
			<TooltipProviderIfMissing>
				{stacked ? parts : <TooltipContentStackProvider>{parts}</TooltipContentStackProvider>}
			</TooltipProviderIfMissing>
		);
	},
);

const TooltipAnchorParts = React.forwardRef<HTMLButtonElement, TooltipAnchorProps>(
	function TooltipAnchorParts({ content, children, open, contentProps, ...triggerProps }, ref) {
		const stacked = useIsInsideTooltipTrigger();
		const handle = useTooltipHandle();
		const generatedId = React.useId();
		const contentId = contentProps?.id ?? generatedId;
		const stackedEntries = useTooltipContentStackEntries();
		const hasContent = hasTooltipContent(content) || (!stacked && stackedEntries.length > 0);
		const [trigger, setTrigger] = React.useState<HTMLButtonElement | null>(null);
		const triggerRef = React.useCallback(
			(node: HTMLButtonElement | null) => {
				setTrigger(node);
				if (typeof ref === 'function') {
					ref(node);
				} else if (ref != null) {
					ref.current = node;
				}
			},
			[ref],
		);

		return (
			<>
				<TooltipTrigger
					ref={triggerRef}
					handle={handle}
					contentId={hasContent ? contentId : null}
					{...triggerProps}
				>
					{children}
				</TooltipTrigger>
				{hasContent && (
					<TooltipLayerProvider value={trigger}>
						<TooltipRoot handle={handle} open={open}>
							<TooltipContent {...contentProps} id={contentId}>
								{content}
							</TooltipContent>
						</TooltipRoot>
					</TooltipLayerProvider>
				)}
			</>
		);
	},
);
