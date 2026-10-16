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
import {
	dismissedTowards,
	isEventInsideAnchor,
	type PopupHandle,
	resolveAnchorTarget,
	usePopupHandleState,
} from '../lib/popup-handle.js';
import { hasRenderableContent, type RejectedProps } from '../lib/utils.js';
import { POPOVER_HOVER_CLOSE_DELAY, POPOVER_HOVER_DELAY } from './constants.js';
import { PopoverPopup } from './subcomponents/popover-popup.js';
import { PopoverPositioner } from './subcomponents/popover-positioner.js';
import { PopoverTrigger } from './subcomponents/popover-trigger.js';
import type { PopoverProps, ValidatePopoverProps } from './types.js';

const PopoverImpl = forwardRef<HTMLButtonElement, PopoverProps<unknown> & RejectedProps>(
	function Popover(
		{
			children,
			trigger,
			handle,
			openOnHover = false,
			delay = POPOVER_HOVER_DELAY,
			closeDelay = POPOVER_HOVER_CLOSE_DELAY,
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

		// Two ways in, one open state. With a handle the handle owns it, so a press on the trigger
		// and `showAt` cannot disagree and `close()` works whichever opened it.
		const handleState = usePopupHandleState(handle);
		const [pressedOpen, setPressedOpen] = useState(false);
		const isOpen = forcedOpen ?? (handle ? handleState.open : pressedOpen);

		// A handle's anchor wins while it is showing: it is the element, rect or point the call
		// site just named. Otherwise the `anchor` prop, and failing that the trigger.
		const resolvedAnchor = handleState.open ? resolveAnchorTarget(handleState.anchor) : anchor;

		// The size props are written as custom properties so they compose with the tokens, the way
		// Dropdown's `contentMaxWidth` and `contentMaxHeight` do.
		const popupStyle = useMemo(
			() =>
				({
					...(width != null && { '--popover-internal-inline-size': toCssLength(width) }),
					...(maxWidth != null && {
						'--popover-internal-max-inline-size': toCssLength(maxWidth),
					}),
					...(maxHeight != null && {
						'--popover-internal-max-block-size': toCssLength(maxHeight),
					}),
				}) as CSSProperties,
			[width, maxWidth, maxHeight],
		);

		// A render function is content for whatever the handle last showed, so it cannot be
		// measured up front the way a node can.
		const content = typeof children === 'function' ? children(handleState.payload) : children;

		if (typeof children !== 'function' && !hasRenderableContent(children)) {
			return <>{trigger}</>;
		}

		return (
			<PopoverPrimitive.Root
				open={isOpen}
				modal={false}
				onOpenChange={(nextOpen, eventDetails) => {
					// A press or a focus move that stays inside the element the handle was shown
					// at is not outside the popover: it is the field a typeahead belongs to, or
					// the row a card follows. Without this the popup closes on the very press
					// that opened it, since the anchor is neither the trigger nor the popup.
					//
					// A focus-out names the element losing focus, which is the anchor itself, so
					// it is `relatedTarget` that says where focus actually went.
					if (
						!nextOpen &&
						isEventInsideAnchor(handleState.anchor, dismissedTowards(eventDetails))
					) {
						eventDetails.cancel();
					}

					onOpenChange?.(nextOpen, eventDetails);

					if (eventDetails.isCanceled) {
						return;
					}

					if (handle) {
						handle.setOpen(nextOpen);
					} else {
						setPressedOpen(nextOpen);
					}
				}}
			>
				{trigger !== undefined && (
					<PopoverTrigger
						ref={triggerRef}
						nativeButton={nativeButton}
						openOnHover={openOnHover}
						delay={delay}
						closeDelay={closeDelay}
						testId={testId}
					>
						{trigger}
					</PopoverTrigger>
				)}
				<PopoverPrimitive.Portal container={portalContainer}>
					<PopoverPositioner
						trigger={triggerElement}
						side={side}
						align={align}
						anchor={resolvedAnchor}
					>
						<PopoverPopup
							popupId={popupId}
							initialFocus={initialFocus}
							finalFocus={finalFocus}
							style={popupStyle}
							testId={testId}
							{...props}
						>
							{content}
						</PopoverPopup>
					</PopoverPositioner>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Root>
		);
	},
);

/**
 * Shows `children` in a floating panel hung off the element you pass as `trigger` (Base UI
 * Popover). A Tooltip with its label replaced by an open content slot: same surface, border,
 * radius and collision handling, but the slot may hold anything, which is what makes the popup a
 * dialog rather than a description.
 *
 * A popover opens on a press of its trigger, and optionally on hover as well. It can also be
 * shown from application state through a `handle`, for the surfaces no press can produce.
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
 * The popover owns its open state; `onOpenChange` reports it. There is no `open` prop: a surface
 * the application needs to drive uses a `handle` instead.
 *
 * With `openOnHover` it also opens while the pointer rests on the trigger. The popup stays
 * interactive (the pointer can travel into it to read, select or click), and the trigger still
 * opens it on press, which is the route a keyboard takes.
 *
 * ### The trigger
 *
 * `trigger` is rendered as the element you pass, with the popover's props merged into it, so a
 * `Button` keeps its own look and there is no second button wrapped around it. `nativeButton`
 * says whether that element renders a native `<button>`. Set it to `false` for anything else; it
 * belongs to the trigger, so a popover shown from a handle alone does not take it.
 *
 * It is required unless a `handle` is passed, since otherwise nothing could ever open the popup.
 *
 * It cannot be a `Tooltip`. A Tooltip routes every prop it does not recognise to its own popup, so
 * the press handlers merged into `trigger` land there instead of on the element underneath, and
 * the popover never opens. A control that needs both a tooltip and a popup keeps its tooltip and
 * takes a `handle`.
 *
 * ### Showing it from application state
 *
 * `usePopoverHandle()` returns a handle for the surfaces a press cannot produce: a menu at the
 * point of a chart click, a suggestion list opened by an input taking focus, a hover card walking
 * a list of rows. `handle.showAt(target, payload)` places the popup against an element, a
 * `DOMRect` or a point, and `handle.close()` dismisses it, which is also how a form inside the
 * popup closes itself once its save succeeds.
 *
 * Pass `children` as a function to receive the payload of the most recent `showAt`, so one
 * declared popover serves many rows instead of one popup each.
 *
 * ### Anchor
 *
 * `anchor` points the popup at something that is not the trigger, such as a typeahead anchored
 * to its whole input row. A handle's `showAt` target takes precedence while it is showing.
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
 * // The popover owns its open state
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
 *
 * @example
 * ```tsx
 * // A form that closes only once its save succeeds
 * const handle = usePopoverHandle();
 *
 * <Popover
 *   nativeButton
 *   side="bottom"
 *   align="end"
 *   handle={handle}
 *   trigger={<Button variant="outlined">Save view</Button>}
 * >
 *   <SaveViewForm onSaved={() => handle.close()} />
 * </Popover>
 * ```
 *
 * @example
 * ```tsx
 * // One card for every row, shown where the pointer is
 * const card = usePopoverHandle<Span>();
 *
 * <tr onMouseEnter={(event) => card.showAt(event.currentTarget, span)}>…</tr>
 *
 * <Popover side="right" align="start" handle={card} initialFocus={false}>
 *   {(span) => <SpanSummary span={span} />}
 * </Popover>
 * ```
 */
export const Popover = PopoverImpl as <Payload, T extends PopoverProps<Payload>>(
	// `T` is inferred from the call site, so `T extends PopoverProps` alone never runs excess
	// property checks. Every key outside the props is pinned to `never` instead.
	//
	// `handle` is restated so `Payload` has somewhere to be inferred from, which is what types
	// `children` as a function of whatever that handle shows. That restating also takes `handle`
	// back out of `T`, so the trigger-or-handle rule is told the payload separately.
	props: T & { handle?: PopupHandle<Payload> } & ValidatePopoverProps<T, Payload> &
		Record<Exclude<keyof T, keyof PopoverProps | keyof RefAttributes<HTMLButtonElement>>, never> &
		RefAttributes<HTMLButtonElement>,
) => ReactElement;
