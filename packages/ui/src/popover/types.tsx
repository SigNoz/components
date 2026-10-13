import type { Popover } from '@base-ui/react/popover';
import type { AriaAttributes, ComponentProps, ReactNode } from 'react';

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

/**
 * Extra constraints layered on top of {@link PopoverProps} at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to
 * a rule object when they are not, the way `ValidateDropdownProps` does.
 */
export type ValidatePopoverProps<T> = T extends { 'data-testid': unknown }
	? TheTestIdPropIsCalledTestId
	: unknown;

export type PopoverProps = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes & {
		/**
		 * The popup content. The shell has no padding, so the content owns all of it, edge to
		 * edge, which is what lets a divider or a search row run full-bleed.
		 *
		 * @note A node that renders nothing (`null`, `false`, an empty string) renders the trigger
		 * alone: no listeners, no aria wiring, no portal. Same rule as Tooltip's empty `title`.
		 */
		children: ReactNode;
		/**
		 * The trigger. Rendered as the element you pass, with the popover's props merged into it,
		 * so there is no second button wrapped around it. A popover always hangs off a trigger: it
		 * opens on a click. A surface that opens on hover is a tooltip, and a menu at the pointer
		 * is a context menu.
		 *
		 * @note A trigger that does not render a `<button>` needs `nativeButton={false}`.
		 */
		trigger: ReactNode;
		/**
		 * The controlled open state. `undefined` leaves the popover uncontrolled.
		 *
		 * @note Kept for the cases `onOpenChange` alone cannot cover: a form that closes only when
		 * its mutation succeeds, and state the popup cannot read off itself.
		 */
		open?: OriginalRootProps['open'];
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
