import type { Popover } from '@base-ui/react/popover';
import type { AriaAttributes, ComponentProps, ReactNode } from 'react';
import type { PopupHandle } from '../lib/popup-handle.js';

type OriginalRootProps = Popover.Root.Props;
type OriginalPositionerProps = Popover.Positioner.Props;
type OriginalPopupProps = Popover.Popup.Props;
type OriginalPortalProps = Popover.Portal.Props;

/**
 * The physical subset of Base UI's `Side`. The logical values (`inline-start`, `inline-end`) have
 * no call site, and Tooltip exposes the same four.
 */
export type PopoverSideType = Extract<
	NonNullable<OriginalPositionerProps['side']>,
	'top' | 'bottom' | 'left' | 'right'
>;

/**
 * What the popup positions against when it is not the trigger: another element or a ref, taken
 * from Base UI's own `anchor` prop.
 */
export type PopoverAnchorType = OriginalPositionerProps['anchor'];

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which lands on the trigger and names the popup': never;
}

interface APopoverNeedsATriggerOrAHandle {
	'a popover opens from a trigger press or from `handle.showAt(...)`: pass `trigger`, or a `handle`': never;
}

interface AHoverDelayNeedsAHoverPopover {
	'`delay` and `closeDelay` describe the hover timing, so they only apply with `openOnHover`': never;
}

/**
 * Extra constraints layered on top of {@link PopoverProps} at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to
 * a rule object when they are not, the way `ValidateDropdownProps` does.
 */
export type ValidatePopoverProps<T, Payload = unknown> = (T extends {
	'data-testid': unknown;
}
	? TheTestIdPropIsCalledTestId
	: unknown) &
	// Keyed, not shaped: `T extends { trigger: ... } | { handle: ... }` resolves to its false
	// branch while `T` is still being inferred, which an unannotated `onOpenChange` arrow is
	// enough to cause — and would hand every such call site this rule.
	//
	// A handle is read off `Payload` rather than `keyof T`, because the signature that infers
	// the payload takes `handle` out of `T`. An inferred payload means a handle was passed;
	// `unknown` means nothing matched.
	([Extract<keyof T, 'trigger' | 'handle'>] extends [never]
		? unknown extends Payload
			? APopoverNeedsATriggerOrAHandle
			: unknown
		: unknown) &
	([Extract<keyof T, 'delay' | 'closeDelay'>] extends [never]
		? unknown
		: [Extract<keyof T, 'openOnHover'>] extends [never]
			? AHoverDelayNeedsAHoverPopover
			: unknown);

export type PopoverProps<Payload = unknown> = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes & {
		/**
		 * The popup content. The shell has no padding, so the content owns all of it, edge to
		 * edge, which is what lets a divider or a search row run full-bleed.
		 *
		 * With a `handle`, pass a function instead: it receives the payload of the most recent
		 * `showAt` call, so one declared popover serves many rows without one popup each. It is
		 * `undefined` until the first `showAt`, and whenever `showAt` was called without one.
		 *
		 * @note A node that renders nothing (`null`, `false`, an empty string) renders the trigger
		 * alone: no listeners, no aria wiring, no portal. Same rule as Tooltip's empty `title`.
		 */
		children: ReactNode | ((payload: Payload | undefined) => ReactNode);
		/**
		 * The trigger. Rendered as the element you pass, with the popover's props merged into it,
		 * so there is no second button wrapped around it.
		 *
		 * @note Required unless a `handle` is passed. A popover opens either from a press on its
		 * trigger or from `handle.showAt(...)`; with neither it could never be shown.
		 *
		 * @note A trigger that does not render a `<button>` needs `nativeButton={false}`.
		 */
		trigger?: ReactNode;
		/**
		 * Shows and hides the popover from application state rather than from a trigger press.
		 *
		 * `handle.showAt(target, payload)` places it against an element, a `DOMRect` or a point,
		 * and renders `payload` through `children`. `handle.close()` dismisses it — which is how
		 * a form inside the popup closes it after a save succeeds.
		 *
		 * @note Create one with `usePopoverHandle()`.
		 */
		handle?: PopupHandle<Payload>;
		/**
		 * Also opens the popover while the pointer rests on the trigger.
		 *
		 * The popup stays interactive: the pointer can travel into it to select text or follow a
		 * link, and the trigger still opens it on click, which is the route a keyboard takes.
		 *
		 * @default false
		 */
		openOnHover?: boolean;
		/**
		 * Milliseconds the pointer must rest on the trigger before a hover popover opens.
		 *
		 * @note Only with `openOnHover`.
		 *
		 * @default 300
		 */
		delay?: number;
		/**
		 * Milliseconds after the pointer leaves before a hover popover closes.
		 *
		 * @note Only with `openOnHover`.
		 *
		 * @default 0
		 */
		closeDelay?: number;
		/**
		 * Called when the popover opens or closes. `eventDetails.reason` says why
		 * (`trigger-press`, `outside-press`, `escape-key`, `focus-out`, …) and
		 * `eventDetails.cancel()` vetoes the change — how a popover is kept open while a press
		 * lands somewhere that only looks outside, such as its own anchor.
		 */
		onOpenChange?: OriginalRootProps['onOpenChange'];
		/**
		 * Which side of the anchor the popup opens against. May change on its own to avoid the
		 * edges of the viewport.
		 *
		 * @note Required. Placement is never incidental, as on Dropdown.
		 */
		side: PopoverSideType;
		/**
		 * How the popup is aligned along the side it opens against.
		 *
		 * @note Required, for the same reason as `side`.
		 */
		align: NonNullable<OriginalPositionerProps['align']>;
		/**
		 * What the popup positions against when it is not the trigger: another element or a ref,
		 * such as the input row of a typeahead.
		 *
		 * @default the trigger
		 */
		anchor?: PopoverAnchorType;
		/**
		 * The element the popup is portalled into.
		 *
		 * @note Inside a `Dialog` or `Drawer` the default is an element in its panel, where the
		 * focus trap of the modal lets the keyboard reach the content. Anywhere else the popup
		 * goes to the body and stacks just above the layer its trigger sits in.
		 *
		 * @default document.body
		 */
		container?: OriginalPortalProps['container'];
		/**
		 * Where focus goes when the popover opens: the first tabbable element of the content, or
		 * the popup itself when a touch opened it. `false` leaves focus on the trigger, for a
		 * typeahead that must not steal the caret. A ref pins it to one element.
		 */
		initialFocus?: OriginalPopupProps['initialFocus'];
		/**
		 * Where focus returns when the popover closes.
		 *
		 * @default the trigger
		 */
		finalFocus?: OriginalPopupProps['finalFocus'];
		/**
		 * The popup width, written as `--popover-internal-inline-size`.
		 *
		 * @note So it composes with the tokens. A number is written as `px`.
		 *
		 * @default 'fit-content'
		 */
		width?: number | string;
		/**
		 * How wide the popup may get, written as `--popover-internal-max-inline-size`.
		 *
		 * @default '25rem'
		 */
		maxWidth?: number | string;
		/**
		 * How tall the popup may get, written as `--popover-internal-max-block-size`. Past it, the
		 * content scrolls — its own layout decides what stays pinned.
		 *
		 * @default the room the viewport leaves (Base UI's available height)
		 */
		maxHeight?: number | string;
		/**
		 * Whether the trigger renders a native `<button>`. Base UI only sees the element the child
		 * renders after it mounts, so the popover has to be told up front.
		 *
		 * With `true`, Base UI leaves the element to the browser, which already gives a `<button>`
		 * its role, focus and `Enter` and `Space` activation. With `false`, Base UI adds those
		 * itself: `role="button"`, `tabIndex` and the key handlers.
		 *
		 * @note Required. The value has to match the trigger, and a default of `true` is silently
		 * wrong for anything that is not a button. Base UI logs an error on a mismatch.
		 */
		nativeButton: boolean;
		/**
		 * Forwarded to the trigger as `data-testid`. The popup is `` `${testId}-popup` ``.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the popup, alongside `aria-*`.
		 */
		[key: `data-${string}`]: unknown;
	};
