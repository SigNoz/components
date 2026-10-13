import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import {
	type CSSProperties,
	forwardRef,
	type ReactElement,
	type RefAttributes,
	useId,
	useMemo,
	useState,
} from 'react';
import { toCssLength } from '../lib/css-length.js';
import { useForceOpen } from '../lib/force-open.js';
import { mergeRefs } from '../lib/merge-refs.js';
import { usePopupContainer } from '../lib/popup-container.js';
import { hasRenderableContent, type RejectedProps } from '../lib/utils.js';
import { PopoverPopup } from './subcomponents/popover-popup.js';
import { PopoverPositioner } from './subcomponents/popover-positioner.js';
import { PopoverTrigger } from './subcomponents/popover-trigger.js';
import type { PopoverProps, ValidatePopoverProps } from './types.js';

const PopoverImpl = forwardRef<HTMLButtonElement, PopoverProps & RejectedProps>(function Popover(
	{
		children,
		trigger,
		open,
		onOpenChange,
		side,
		align,
		anchor,
		container,
		initialFocus,
		finalFocus,
		width,
		maxWidth,
		maxHeight,
		nativeButton,
		testId,
		id,
		className: _className,
		style: _style,
		...props
	},
	ref,
) {
	const popupContainer = usePopupContainer();
	// Inside a dialog the popup goes into its panel, where the focus trap lets the keyboard in.
	const portalContainer = container === undefined ? popupContainer : container;
	const generatedId = useId();
	const popupId = id ?? generatedId;
	// State, not a ref: the positioner reads the layer the trigger sits in when it mounts.
	const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
	const triggerRef = useMemo(() => mergeRefs(ref, setTriggerElement), [ref]);
	// Controlled only under a `ForceOpenProvider`. Everywhere else the consumer or Base UI owns it.
	const forcedOpen = useForceOpen() ? true : undefined;

	// The size props are written as custom properties so they compose with the tokens, the way
	// Dropdown's `contentMaxWidth` and `contentMaxHeight` do.
	const popupStyle = useMemo(
		() =>
			({
				...(width != null && { '--popover-internal-inline-size': toCssLength(width) }),
				...(maxWidth != null && { '--popover-internal-max-inline-size': toCssLength(maxWidth) }),
				...(maxHeight != null && {
					'--popover-internal-max-block-size': toCssLength(maxHeight),
				}),
			}) as CSSProperties,
		[width, maxWidth, maxHeight],
	);

	if (!hasRenderableContent(children)) {
		return <>{trigger}</>;
	}

	return (
		<PopoverPrimitive.Root open={forcedOpen ?? open} modal={false} onOpenChange={onOpenChange}>
			<PopoverTrigger ref={triggerRef} nativeButton={nativeButton} testId={testId}>
				{trigger}
			</PopoverTrigger>
			<PopoverPrimitive.Portal container={portalContainer}>
				<PopoverPositioner trigger={triggerElement} side={side} align={align} anchor={anchor}>
					<PopoverPopup
						popupId={popupId}
						initialFocus={initialFocus}
						finalFocus={finalFocus}
						style={popupStyle}
						testId={testId}
						{...props}
					>
						{children}
					</PopoverPopup>
				</PopoverPositioner>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Root>
	);
});

/**
 * Shows `children` in a floating panel hung off the element you pass as `trigger` (Base UI
 * Popover). A Tooltip with its label replaced by an open content slot: same surface, border,
 * radius and collision handling, but the slot may hold anything — which is what makes the popup a
 * dialog rather than a description.
 *
 * A popover opens on a click. A surface that opens on hover is a tooltip, and a menu at the
 * pointer is a context menu — neither is this component.
 *
 * The shell carries zero padding: `children` owns all of it, edge to edge, which is what lets a
 * divider or a search row run full-bleed. Visual values are `--popover-*` custom properties,
 * defaults in the `css-tokens` region of [./index.ts](./index.ts).
 *
 * ### Opening and closing
 *
 * The trigger opens it on a press, `Enter` or `Space`. The popup is a `role="dialog"`: focus
 * moves to its first tabbable element, nothing is trapped, and `Escape` closes it and returns
 * focus to the trigger. It also closes on an outside press and when focus leaves it.
 * `initialFocus` and `finalFocus` redirect the focus on the way in and out.
 *
 * The popover owns its open state; `onOpenChange` reports it. Controlled `open` is for what the
 * popup cannot know by itself — a form that closes only when its save succeeds.
 *
 * ### The trigger
 *
 * `trigger` is rendered as the element you pass, with the popover's props merged into it, so a
 * `Button` keeps its own look and there is no second button wrapped around it. `nativeButton`
 * says whether that element renders a native `<button>` — set it to `false` for anything else.
 *
 * ### Anchor
 *
 * `anchor` points the popup at something that is not the trigger — a typeahead anchored to its
 * whole input row. The trigger is still required.
 *
 * ### What lands on the popup
 *
 * `aria-*`, `data-*` and `id` go to the popup, the portalled part you cannot otherwise reach.
 * `testId` is the exception, because it names the trigger. A popup with a visible heading is
 * named by `aria-labelledby`; one without is named by `aria-label`.
 *
 * ### Placement and size
 *
 * `side` and `align` are required: placement is never incidental. The gap is a fixed 4px. The
 * popup flips to the opposite side and shifts along its alignment axis to stay in view. `width`,
 * `maxWidth` and `maxHeight` size the shell; past `maxHeight` (or the room the viewport leaves)
 * the content scrolls, and its own layout decides what stays pinned.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the trigger, and the popup is `` `${testId}-popup` ``. The popup
 * renders only while open, so asserting its absence asserts the popover is closed. Otherwise use
 * the data attributes, never the hashed class names.
 *
 * | popup attribute | value |
 * |---|---|
 * | `data-slot` | `"popover-popup"` |
 * | `data-side`, `data-align` | the placement actually rendered, after collisions |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `popover-trigger` | always, merged into the element you passed as `trigger` |
 * | `popover-positioner` | while open, the box the popup is placed in |
 * | `popover-popup` | while open |
 *
 * @example
 * ```tsx
 * <Popover
 *   nativeButton
 *   side="bottom"
 *   align="end"
 *   trigger={<Button variant="outlined">Save view</Button>}
 *   open={open}
 *   onOpenChange={setOpen}
 * >
 *   <SaveViewForm onDone={() => setOpen(false)} />
 * </Popover>
 * ```
 *
 * @example
 * ```tsx
 * // Uncontrolled: the popover owns its open state
 * <Popover
 *   nativeButton
 *   side="bottom"
 *   align="start"
 *   aria-label="Markdown help"
 *   trigger={<Button variant="ghost" prefix={<CircleHelp />} aria-label="Markdown help" />}
 * >
 *   <MarkdownCheatsheet />
 * </Popover>
 * ```
 */
export const Popover = PopoverImpl as <T extends PopoverProps>(
	props: T &
		ValidatePopoverProps<T> &
		// `T` is inferred from the call site, so `T extends PopoverProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof PopoverProps | keyof RefAttributes<HTMLButtonElement>>, never> &
		RefAttributes<HTMLButtonElement>,
) => ReactElement;
