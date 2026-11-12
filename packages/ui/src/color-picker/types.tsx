import type { Popover } from '@base-ui/react/popover';
import type { AriaAttributes, ComponentProps, ReactElement, ReactNode } from 'react';
import type { COLOR_PICKER_OWN_ARIA_ATTRIBUTES } from './constants.js';

type OriginalPositionerProps = Popover.Positioner.Props;
type OriginalPortalProps = Popover.Portal.Props;

/**
 * The side of the trigger the popup opens on. The physical subset of Base UI's `Side`, the same
 * four as `Popover`.
 */
export type ColorPickerSideType = Extract<
	NonNullable<OriginalPositionerProps['side']>,
	'top' | 'bottom' | 'left' | 'right'
>;

/**
 * How the popup aligns with the trigger on its side.
 */
export type ColorPickerAlignType = NonNullable<OriginalPositionerProps['align']>;

// JSX does not run excess property checks on hyphenated names, so the call site is rejected by the
// signature of `ColorPicker`, which pins every key outside the props to `never`. This `Omit` is
// what leaves them outside.
type ColorPickerAriaAttributes = Omit<
	AriaAttributes,
	(typeof COLOR_PICKER_OWN_ARIA_ATTRIBUTES)[number]
>;

/**
 * The rules below are objects whose single required key is the sentence the compiler should
 * print, so a violation reads as `Property '<the sentence>' is missing ... but required in type
 * '<the rule name>'` instead of pointing at an unrelated prop.
 */
interface ADisabledColorPickerMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface ADisabledReasonNeedsADisabledColorPicker {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

interface AReadOnlyColorPickerMustSayWhy {
	'`readOnly` needs `readOnlyTooltip`, a locked control has to tell the user why it cannot change': never;
}

interface AReadOnlyReasonNeedsAReadOnlyColorPicker {
	'`readOnlyTooltip` only renders while `readOnly` is set, add `readOnly` or drop the tooltip': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which lands on the trigger and names every part of the popup': never;
}

/**
 * Extra constraints layered on top of {@link ColorPickerProps} at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to
 * a rule object when they are not.
 *
 * The pairing rules look at which props the call site writes, not at their values: `disabled`
 * typed `boolean | undefined` is still `disabled`, and `disabledTooltip={undefined}` is the
 * explicit opt-out for a call site that has no reason to give.
 */
export type ValidateColorPickerProps<T> = (T extends { disabled: boolean | undefined }
	? T extends { disabledTooltip: ReactNode }
		? unknown
		: ADisabledColorPickerMustSayWhy
	: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledColorPicker
		: unknown) &
	(T extends { readOnly: boolean | undefined }
		? T extends { readOnlyTooltip: ReactNode }
			? unknown
			: AReadOnlyColorPickerMustSayWhy
		: unknown) &
	(T extends { readOnlyTooltip: ReactNode }
		? T extends { readOnly: boolean | undefined }
			? unknown
			: AReadOnlyReasonNeedsAReadOnlyColorPicker
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

export type ColorPickerProps = Pick<ComponentProps<'div'>, 'id'> &
	ColorPickerAriaAttributes & {
		/**
		 * The trigger. Rendered as the element you pass, with the press handler, the aria
		 * attributes and the data attributes of the picker merged into it, so there is no wrapper
		 * around it.
		 *
		 * @note It cannot be a `Tooltip`. A Tooltip routes every prop it does not recognise to its
		 * own popup, so the press handler never reaches the element underneath.
		 *
		 * @note The picker does not restyle it in any state. It reads `data-popup-open`,
		 * `data-disabled` and `data-readonly` to show them.
		 */
		children: ReactElement;
		/**
		 * Whether `children` renders a native `<button>`. Base UI only sees the element after it
		 * mounts, so the picker has to be told up front.
		 *
		 * With `true`, the browser gives the element its role, focus and `Enter` and `Space`
		 * activation. With `false`, Base UI adds `role="button"`, `tabIndex` and the key handlers.
		 *
		 * @note Required. The value has to match the element, and Base UI logs an error when it
		 * does not.
		 */
		nativeButton: boolean;
		/**
		 * The selected color, a hex string. `undefined` and `''` are no color.
		 *
		 * @note Reads `#rgb`, `#rgba`, `#rrggbb` and `#rrggbbaa`, in any case, and drops the alpha.
		 *
		 * @note Writing `value` makes the picker controlled, even with `undefined`.
		 *
		 * @note A value the picker cannot read, such as `red` or `rgb(...)`, is a bug: the panel
		 * opens at `#000000` with an empty hex field, and a warning is logged in every
		 * environment. The picker never calls `onChange` to correct it.
		 *
		 * @note While the user drags, the panel shows the color under the pointer, and applies a
		 * `value` that changed from outside after the release. So a call site that only updates
		 * `value` in `onAfterChange` still sees the drag.
		 */
		value?: string | undefined;
		/**
		 * The initial color when `value` is not written. Without both, the picker holds no color.
		 */
		defaultValue?: string | undefined;
		/**
		 * Called on every change: while the area or the hue thumb drags (at most once per animation
		 * frame), on each key press, when the hex field commits, and with `undefined` when the
		 * color is cleared.
		 *
		 * @note A color is always `#rrggbb`, in lower case. Never called when the hex did not
		 * change.
		 */
		onChange?: (value: string | undefined) => void;
		/**
		 * Called once when a change ends: on pointer release, on each key press, when the hex field
		 * commits, and with `undefined` when the color is cleared.
		 *
		 * @note A release on the hex the press started from calls nothing.
		 */
		onAfterChange?: (value: string | undefined) => void;
		/**
		 * Lets the user take the picker back to no color: a clear button at the end of the hex
		 * field, and `Delete` and `Backspace` on the trigger while the popup is closed. Both call
		 * `onChange` and `onAfterChange` once each with `undefined`, close the popup and leave the
		 * focus on the trigger.
		 *
		 * @note Only while there is a color, and never while `disabled` or `readOnly`.
		 *
		 * @default false
		 */
		allowClear?: boolean;
		/**
		 * The side of the trigger the popup opens on. It flips to the opposite side when there is
		 * no room.
		 *
		 * @note Required. Placement is never incidental, as on `Popover` and `Dropdown`.
		 */
		side: ColorPickerSideType;
		/**
		 * How the popup aligns with the trigger on that side.
		 *
		 * @note Required, for the same reason as `side`.
		 */
		align: ColorPickerAlignType;
		/**
		 * The element the popup is portalled into.
		 *
		 * @note Inside a `Dialog` or `Drawer` the default is an element in its panel, where the
		 * focus trap of the modal lets the keyboard reach the panel.
		 *
		 * @default document.body
		 */
		container?: OriginalPortalProps['container'];
		/**
		 * Content rendered under the hex field, inside the popup. It receives the color the panel
		 * shows as `#rrggbb`, the draft color during a drag included, and `#000000` while there is
		 * no color.
		 *
		 * @note It wraps inside the fixed width of the popup, and the popup grows in height with it
		 * and never scrolls, so keep it to a line or two.
		 *
		 * @note It is not a live region. Content that has to be announced when it changes carries
		 * its own `aria-live`.
		 */
		footer?: (color: string) => ReactNode;
		/**
		 * Identifies the field when the owning form is submitted. The submitted value is
		 * `#rrggbb`, or `''` while there is no color.
		 */
		name?: string;
		/**
		 * The id of the owning form, for a picker rendered outside the `<form>` element.
		 */
		form?: string;
		/**
		 * Blocks the submit of the owning form while the picker holds no color, and moves the focus
		 * to the trigger. A `readOnly` picker never blocks it.
		 *
		 * @default false
		 */
		required?: boolean;
		/**
		 * Blocks the picker: a press, `Enter` and `Space` on the trigger do not open the popup, and
		 * `Delete` and `Backspace` do not clear it. The picker is left out of the form submit.
		 *
		 * @note Requires `disabledTooltip`.
		 *
		 * @note The trigger carries `aria-disabled` and `data-disabled`, never the native
		 * `disabled`, so it stays focusable and the reason stays reachable.
		 *
		 * @note Closes the popup if it is open when this turns true.
		 *
		 * @note Ignored while `readOnly` is true, along with `disabledTooltip`.
		 *
		 * @default false
		 */
		disabled?: boolean;
		/**
		 * Why the picker cannot be used, shown in a tooltip on the trigger, on hover and on keyboard
		 * focus, while `disabled` is true. Empty content renders no tooltip.
		 *
		 * @note Only allowed alongside `disabled`. Pass `undefined` explicitly when there is no
		 * reason to give.
		 */
		disabledTooltip?: ReactNode;
		/**
		 * Locks the color. The popup still opens, so the color can be read and the hex copied, but
		 * the area, the hue strip and the keys change nothing, the hex field is a native read-only
		 * input, and the clear button does not render. `onChange` and `onAfterChange` are never
		 * called. The picker is still submitted with its form.
		 *
		 * @note Requires `readOnlyTooltip`.
		 *
		 * @note Outranks `disabled`: while this is true the picker is not disabled at all.
		 *
		 * @default false
		 */
		readOnly?: boolean;
		/**
		 * Why the color is locked, shown in a tooltip on the trigger, on hover and on keyboard
		 * focus, while `readOnly` is true. Empty content renders no tooltip.
		 *
		 * @note Only allowed alongside `readOnly`. Pass `undefined` explicitly when there is no
		 * reason to give.
		 */
		readOnlyTooltip?: ReactNode;
		/**
		 * Forwarded to the trigger as `data-testid`, where it wins over a `data-testid` the element
		 * has. It also names every part of the popup: `` `${testId}-popup` ``,
		 * `` `${testId}-area` ``, `` `${testId}-area-thumb` ``, `` `${testId}-hue` ``,
		 * `` `${testId}-hue-thumb` ``, `` `${testId}-preview` ``, `` `${testId}-hex` ``,
		 * `` `${testId}-clear` `` and `` `${testId}-footer` ``.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the trigger, alongside `aria-*`.
		 */
		[key: `data-${string}`]: unknown;
	};
