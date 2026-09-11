import * as React from 'react';
import { TooltipContent } from '../subcomponents/tooltip-content.js';
import { TooltipProviderIfMissing } from '../subcomponents/tooltip-provider.js';
import { TooltipRoot } from '../subcomponents/tooltip-root.js';
import { TooltipTrigger } from '../subcomponents/tooltip-trigger.js';
import {
	hasTooltipContent,
	TooltipContentStackProvider,
	useTooltipContentStackEntries,
} from '../tooltip-content-stack-context.js';
import { useTooltipHandle } from '../tooltip-handle.js';
import { useStackedTooltipProps } from '../tooltip-stacked-props.js';
import { useIsInsideTooltipTrigger } from '../tooltip-trigger-context.js';
import type { TooltipProps } from '../types.js';

/**
 * Shows `title` in a popup while its child is hovered or focused (Base UI `Tooltip`).
 *
 * The child is the trigger. No wrapper element is added.
 *
 * Visual values are `--tooltip-*` custom properties, defaults in the `css-tokens` region of
 * [../index.ts](../index.ts).
 *
 * ### The provider
 *
 * Optional. A tooltip without one adds its own with the defaults.
 *
 * Place one above a subtree to set `delay`, `closeDelay`, `timeout` and `container` for every
 * tooltip under it. That is the only way to change them for more than one tooltip.
 *
 * ### The child
 *
 * - One element child. It receives the trigger props and the `ref`.
 * - Text, a fragment or several nodes end up inside a `<button>` Base UI adds.
 * - It stays mounted whether there is a popup or not, so it never remounts.
 *
 * ### The child has to forward its ref
 *
 * Base UI anchors the popup to the DOM node behind that `ref`.
 *
 * A child that drops it (a function component without `forwardRef`, one that never passes
 * `ref` down) shows no tooltip at all. Wrap it in a `<span>` or forward the `ref`.
 *
 * ### The popup
 *
 * - Empty `title` (`undefined`, `null`, `false`, `''`) renders no popup, no `aria-describedby`.
 * - So the off switch is the title itself: `title={truncated ? label : undefined}`.
 * - `role="tooltip"`, `id` from `id` or generated, trigger points at it with `aria-describedby`.
 * - Every `data-*` from the call site lands here, the only element the component renders itself.
 *   `data-slot` is the exception, it stays `tooltip-content`.
 * - Portalled into `container`, else the provider's container, else `document.body`.
 * - Clamped to 6 lines (`--tooltip-max-lines`) at 26.25rem. Longer content wants a popover.
 *
 * ### A disabled trigger never opens
 *
 * A natively `disabled` element fires no pointer events.
 *
 * Use `Button` with `disabled` and `disabledTooltip`. It stays focusable and hoverable.
 *
 * ### Stacking
 *
 * A tooltip inside the trigger of another one adds its `title` to that popup, instead of
 * opening a second one on the same hover.
 *
 * Outer title first, then each nested one in mount order, split by a `tooltip-divider`.
 *
 * | prop, on the nested tooltip | goes |
 * |---|---|
 * | `title` | into the popup of the outer tooltip |
 * | `className`, `style`, `id`, `testId`, `data-*` | onto the trigger element, not the popup |
 * | `side`, `align`, `sideOffset`, `alignOffset`, `container`, `open` | nowhere, the outer tooltip owns the popup |
 *
 * ### Do not nest two by hand
 *
 * Stacking is there for components carrying their own tooltip (`Button` with `disabledTooltip`,
 * a truncated label), so they keep working when a product wraps them in a `Tooltip`.
 *
 * When both texts are yours, pass one `title` holding both.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the **content**, not the trigger. Give the trigger its own test
 * id. Otherwise use the data attributes, never the hashed class names.
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `tooltip-trigger` | the trigger, except while stacked into another tooltip |
 * | `tooltip-positioner` | wraps the popup, carries `data-side` and `data-align` |
 * | `tooltip-content` | the popup, `role="tooltip"` |
 * | `tooltip-stack` | only when the popup holds more than one entry |
 * | `tooltip-divider` | between two entries, `aria-hidden` |
 *
 * @example
 * ```tsx
 * <Tooltip title="Helpful information" side="right">
 *   <Button>Hover me</Button>
 * </Tooltip>
 * ```
 *
 * @example
 * ```tsx
 * // Nothing to say, nothing to show
 * <Tooltip title={truncated ? label : undefined}>
 *   <span>{label}</span>
 * </Tooltip>
 * ```
 *
 * @example
 * ```tsx
 * // A custom child works only if it forwards its ref
 * const Chip = forwardRef<HTMLSpanElement, { children: ReactNode }>(function Chip(props, ref) {
 *   return <span ref={ref} {...props} />;
 * });
 * ```
 */
export const Tooltip = React.forwardRef<HTMLButtonElement, TooltipProps>(
	function Tooltip(props, ref) {
		const stacked = useIsInsideTooltipTrigger();
		const tooltip = <TooltipParts ref={ref} {...props} />;

		// The trigger and the root are siblings, so their stack has to sit above both.
		return (
			<TooltipProviderIfMissing>
				{stacked ? tooltip : <TooltipContentStackProvider>{tooltip}</TooltipContentStackProvider>}
			</TooltipProviderIfMissing>
		);
	},
);

const TooltipParts = React.forwardRef<HTMLButtonElement, TooltipProps>(function TooltipParts(
	{ title, children, open, ...props },
	ref,
) {
	const { stacked, triggerProps, contentProps } = useStackedTooltipProps(props);
	const handle = useTooltipHandle();
	const generatedId = React.useId();
	const contentId = contentProps.id ?? generatedId;
	const stackedEntries = useTooltipContentStackEntries();
	const hasContent = hasTooltipContent(title) || (!stacked && stackedEntries.length > 0);

	return (
		<>
			<TooltipTrigger
				ref={ref}
				handle={handle}
				contentId={hasContent ? contentId : null}
				{...triggerProps}
			>
				{children}
			</TooltipTrigger>
			{hasContent && (
				<TooltipRoot handle={handle} open={open}>
					<TooltipContent {...contentProps} id={contentId}>
						{title}
					</TooltipContent>
				</TooltipRoot>
			)}
		</>
	);
});
