import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import {
	cloneElement,
	forwardRef,
	type KeyboardEvent,
	type ReactElement,
	type RefAttributes,
	useId,
	useMemo,
	useState,
} from 'react';
import { useForceOpen } from '../lib/force-open.js';
import { mergeRefs } from '../lib/merge-refs.js';
import { usePopupContainer } from '../lib/popup-container.js';
import type { RejectedProps } from '../lib/utils.js';
import { TooltipAnchor } from '../tooltip/subcomponents/tooltip-anchor.js';
import { hasTooltipContent } from '../tooltip/tooltip-content-stack-context.js';
import { ColorPickerHiddenInput } from './subcomponents/color-picker-hidden-input.js';
import { ColorPickerPopup } from './subcomponents/color-picker-popup.js';
import { ColorPickerPositioner } from './subcomponents/color-picker-positioner.js';
import type { ColorPickerFormat, ColorPickerProps, ValidateColorPickerProps } from './types.js';
import { useColorPickerState } from './use-color-picker-state.js';

const ColorPickerImpl = forwardRef<HTMLElement, ColorPickerProps & RejectedProps>(
	function ColorPicker(props, ref) {
		const {
			children,
			nativeButton,
			value,
			defaultValue,
			onChange,
			onAfterChange,
			opaque = false,
			allowClear = false,
			side,
			align,
			container,
			footer,
			name,
			form,
			required = false,
			disabled = false,
			disabledTooltip,
			readOnly = false,
			readOnlyTooltip,
			testId,
			id,
			className: _className,
			style: _style,
			...attributes
		} = props;
		// `value={undefined}` is a controlled picker with no color, so the key decides, not the value.
		const isControlled = 'value' in props;
		const popupContainer = usePopupContainer();
		// Inside a dialog the popup goes into its panel, where the focus trap lets the keyboard in.
		const portalContainer = container === undefined ? popupContainer : container;
		const generatedPopupId = useId();
		const popupId = id ?? generatedPopupId;
		const generatedTriggerId = useId();
		const triggerId = (children.props as { id?: string }).id ?? generatedTriggerId;
		// State, not a ref: the positioner reads the layer the trigger sits in when it mounts.
		const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
		const triggerRef = useMemo(() => mergeRefs(ref, setTriggerElement), [ref]);

		const isDisabled = disabled && !readOnly;
		const [pressedOpen, setPressedOpen] = useState(false);
		// Kept here, not in the popup, which unmounts on close: the panel opens in the format the
		// user last picked.
		const [format, setFormat] = useState<ColorPickerFormat>('hex');

		if (isDisabled && pressedOpen) {
			setPressedOpen(false);
		}

		// Controlled only under a `ForceOpenProvider`. Everywhere else the picker owns its open state.
		const forcedOpen = useForceOpen() ? !isDisabled : undefined;
		const isOpen = forcedOpen ?? pressedOpen;

		const state = useColorPickerState({
			isControlled,
			value,
			defaultValue,
			isOpen,
			isReadOnly: readOnly,
			isOpaque: opaque,
			onChange,
			onAfterChange,
		});
		const canClear = allowClear && state.valueHex !== undefined && !readOnly && !isDisabled;

		const hasReasonAnchor = disabledTooltip != null || readOnlyTooltip != null;
		const reason =
			readOnly && hasTooltipContent(readOnlyTooltip)
				? readOnlyTooltip
				: isDisabled && hasTooltipContent(disabledTooltip)
					? disabledTooltip
					: null;

		function clearFromPanel(): void {
			state.clear();
			setPressedOpen(false);
			triggerElement?.focus();
		}

		function handleTriggerKeyDown(event: KeyboardEvent<HTMLElement>): void {
			if ((event.key === 'Delete' || event.key === 'Backspace') && canClear && !isOpen) {
				event.preventDefault();
				state.clear();
			}
		}

		// Cloned rather than left to Base UI, which lets the element's own props win the merge. The
		// state the picker owns has to win over the element, and the caller's `aria-*` and `data-*`
		// over the element's.
		const triggerChild = cloneElement(children, {
			...attributes,
			'data-slot': 'color-picker-trigger',
			// Written even while off, so a value on the element or the caller cannot show a state the
			// picker is not in.
			'data-popup-open': isOpen || undefined,
			// The same values Base UI writes, which lose to an element that already has them.
			'aria-haspopup': 'dialog',
			'aria-expanded': isOpen,
			'aria-controls': isOpen ? popupId : undefined,
			'aria-disabled': isDisabled || undefined,
			'data-disabled': isDisabled || undefined,
			'aria-readonly': readOnly || undefined,
			'data-readonly': readOnly || undefined,
			...(testId !== undefined && { 'data-testid': testId }),
		});

		const trigger = (
			<PopoverPrimitive.Trigger
				ref={triggerRef}
				id={triggerId}
				nativeButton={nativeButton}
				onKeyDown={handleTriggerKeyDown}
				render={triggerChild}
			/>
		);

		return (
			<PopoverPrimitive.Root
				open={isOpen}
				modal={false}
				onOpenChange={(nextOpen, eventDetails) => {
					// Not Base UI's own `disabled`: that sets the native attribute on a `<button>`
					// trigger, which takes hover and focus away and with them the reason.
					if (nextOpen && isDisabled) {
						eventDetails.cancel();
						return;
					}

					if (!nextOpen) {
						// An outside press can unmount the field before its blur reaches React, so the
						// close commits the text itself. `Esc` drops it.
						if (eventDetails.reason === 'escape-key') {
							state.dropDraft();
						} else {
							state.commitDraft(false);
						}
					}

					setPressedOpen(nextOpen);
				}}
			>
				{hasReasonAnchor ? (
					// Wrapped whenever a reason is passed, not only while it shows, so toggling
					// `disabled` or `readOnly` does not remount the trigger and drop its focus.
					<TooltipAnchor content={reason}>{trigger}</TooltipAnchor>
				) : (
					trigger
				)}
				{(name !== undefined || form !== undefined || required) && (
					<ColorPickerHiddenInput
						value={state.valueHex ?? ''}
						name={name}
						form={form}
						// A read-only picker cannot be filled in, so it never blocks the submit.
						required={required && !readOnly}
						disabled={isDisabled}
						trigger={triggerElement}
						onReset={state.reset}
					/>
				)}
				<PopoverPrimitive.Portal container={portalContainer}>
					<ColorPickerPositioner trigger={triggerElement} side={side} align={align}>
						<ColorPickerPopup
							popupId={popupId}
							triggerId={triggerId}
							state={state}
							isReadOnly={readOnly}
							isOpaque={opaque}
							format={format}
							onFormatChange={setFormat}
							canClear={canClear}
							onClear={clearFromPanel}
							footer={footer}
							testId={testId}
						/>
					</ColorPickerPositioner>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Root>
		);
	},
);

/**
 * Picks any color and reports it as a hex string, `#rrggbb` while it is opaque and `#rrggbbaa`
 * otherwise, from a popup hung off a trigger you provide (Base UI `Popover`). The panel holds a
 * saturation and brightness area, a hue strip, an alpha strip, a preview of the color, a switch
 * between hex and RGB fields and an alpha field, with an optional clear button and `footer`.
 * `opaque` takes the alpha out.
 *
 * `aria-*` and `data-*` go to the trigger, and `id` to the popup.
 *
 * Visual values are `--color-picker-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * The trigger's accessible name is yours to give, through its text or `aria-label`, and it should
 * say the color, such as `Series color for cpu.user, #4e74f8`. The picker cannot read the name of
 * an element it did not render. The popup is a non-modal `role="dialog"` named by the trigger.
 *
 * ### The trigger
 *
 * `children` is rendered as the element you pass, with the press handler, the aria attributes and
 * the data attributes of the picker merged into it, so there is no wrapper around it and it keeps
 * its place in a flex row or a virtualized list. The picker does not restyle it: it carries
 * `data-popup-open`, `data-disabled` and `data-readonly` for your own rules.
 *
 * The trigger carries `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` while open.
 * The picker writes these, `aria-disabled` and `aria-readonly` itself, and passing one of them is
 * a type error.
 *
 * ### Opening and closing
 *
 * A press, `Enter` or `Space` on the trigger opens the popup, and the focus moves to the area. It
 * closes on `Esc`, on a press outside and when the focus leaves it, and the focus goes back to the
 * trigger, except after a press outside. A valid text in a field is committed by the close, and
 * dropped by `Esc`.
 *
 * The picker owns its open state. `ForceOpenProvider` from `@signozhq/ui/testing` holds it open in
 * stories and tests, and a disabled picker stays closed under it. The popup unmounts when it
 * closes and when the trigger unmounts, and a drag in progress then ends without `onAfterChange`.
 *
 * ### The panel
 *
 * The area is saturation from left to right and brightness from bottom to top, for the hue on the
 * strip. A press on either sets the color under the pointer, and a drag follows the pointer even
 * outside the panel, without closing it.
 *
 * The panel holds its own hue while it is open. Grey, black and white have no hue in hex, so a
 * drag to the left edge of the area and back keeps the hue the user picked. A `value` with no hue
 * keeps the hue the panel had.
 *
 * The alpha strip runs from transparent on the left to the color on the right, over a checkerboard.
 *
 * The format switch shows the color as a hex field or as `Red`, `Green` and `Blue` fields from 0 to
 * 255, and the panel opens in the format picked last. The alpha field next to them is a whole
 * percent. The hex field takes three, four, six or eight digits, with or without `#`, in any case:
 * three and six keep the alpha, four and eight set it. Each field commits on `Enter` and on blur,
 * and changes only its own part of the color. While its text is not a value it carries
 * `aria-invalid="true"` and `data-invalid`, and the blur puts the color back. It follows the panel,
 * except while it has the focus.
 *
 * ### Keyboard
 *
 * Inside the popup the tab stops are the area, the hue strip, the alpha strip, the format switch,
 * the hex field or the three channel fields, the clear button, the alpha field, then the footer.
 *
 * | Where | Keys |
 * |---|---|
 * | area | `ArrowRight` and `ArrowLeft` move saturation 1%, `ArrowUp` and `ArrowDown` brightness 1%, `Shift` with an arrow 10%, `PageUp` and `PageDown` brightness 10%, `Home` and `End` saturation to 0% and 100% |
 * | hue strip | `ArrowRight` and `ArrowUp` add one degree, `ArrowLeft` and `ArrowDown` remove one, `PageUp`, `PageDown` and `Shift` with an arrow move 36, `Home` and `End` go to 0 and 359 |
 * | alpha strip | `ArrowRight` and `ArrowUp` add 1%, `ArrowLeft` and `ArrowDown` remove 1%, `PageUp`, `PageDown` and `Shift` with an arrow move 10%, `Home` and `End` go to 0% and 100% |
 * | fields | `Enter` commits and keeps the popup open, `Esc` drops the text and closes it |
 * | trigger | `Delete` and `Backspace` clear the color, with `allowClear`, while the popup is closed |
 *
 * The area holds two visually hidden range inputs, `Saturation` and `Brightness`, behind one tab
 * stop. A key moves the focus to the input of the axis it changes, so a screen reader names it.
 * The hue and alpha strips are one range input each, `Hue` and `Alpha`. Each reads its value and
 * the hex, such as `60%, #3a2a63` or `255 degrees, #3a2a6380`.
 *
 * ### Disabled and read-only
 *
 * `disabled` keeps the popup closed. `readOnly` opens it so the color can be read and the hex
 * copied, with every control locked, and outranks `disabled`. Turned on during a drag or while the
 * a field holds a draft, it drops them without a change. Each travels with its reason,
 * `disabledTooltip` and `readOnlyTooltip`, shown in a tooltip on the trigger on hover and on
 * keyboard focus.
 *
 * ### Forms
 *
 * With `name`, `form` or `required`, the picker renders a visually hidden input next to the trigger
 * that holds the color as `onChange` reports it, or `''` while there is no color. It submits with the form like a native
 * input, and a disabled picker is left out. A read-only picker is submitted, and never blocks the
 * submit with `required`, since nobody can fill it in. A form reset brings an
 * uncontrolled picker back to `defaultValue`, without `onChange`, and a reset the form cancels
 * changes nothing.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the trigger, and it names every part of the popup. The popup renders
 * only while open. Otherwise use the data attributes, never the hashed class names.
 *
 * | trigger attribute | value |
 * |---|---|
 * | `data-slot` | `"color-picker-trigger"` |
 * | `data-popup-open` | present while the popup is open |
 * | `data-disabled` | present while disabled, and not read-only |
 * | `data-readonly` | present while `readOnly` |
 *
 * | `data-slot` | rendered | `data-testid` |
 * |---|---|---|
 * | `color-picker-positioner` | while open, the box the popup is placed in | none |
 * | `color-picker-popup` | while open, `data-readonly` with `readOnly`, `data-opaque` with `opaque`, `data-dragging` while a thumb moves under the pointer | `${testId}-popup` |
 * | `color-picker-area` | while open | `${testId}-area` |
 * | `color-picker-area-thumb` | while open | `${testId}-area-thumb` |
 * | `color-picker-hue` | while open | `${testId}-hue` |
 * | `color-picker-hue-thumb` | while open | `${testId}-hue-thumb` |
 * | `color-picker-alpha` | while open, without `opaque` | `${testId}-alpha` |
 * | `color-picker-alpha-thumb` | while open, without `opaque` | `${testId}-alpha-thumb` |
 * | `color-picker-preview` | while open, `data-empty` while there is no color | `${testId}-preview` |
 * | none, a `ToggleGroup` | while open, the format switch, with a button per format | `${testId}-format`, `${testId}-format-button-hex`, `${testId}-format-button-rgb` |
 * | `color-picker-hex` | while open in hex, the input, `data-invalid` while its text is not a color | `${testId}-hex` |
 * | `color-picker-red`, `color-picker-green`, `color-picker-blue` | while open in RGB, the inputs, `data-invalid` while the text is not a whole number from 0 to 255 | `${testId}-red`, `${testId}-green`, `${testId}-blue` |
 * | `color-picker-alpha-input` | while open, without `opaque`, `data-invalid` while the text is not a whole number from 0 to 100 | `${testId}-alpha-input` |
 * | `color-picker-clear` | while open, with `allowClear`, a color, and neither `disabled` nor `readOnly` | `${testId}-clear` |
 * | `color-picker-footer` | while open, with `footer` | `${testId}-footer` |
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   nativeButton
 *   side="bottom"
 *   align="start"
 *   value={color}
 *   onAfterChange={setColor}
 * >
 *   <button type="button" aria-label={`Series color for cpu.user, ${color}`}>
 *     <Swatch color={color} />
 *   </button>
 * </ColorPicker>
 * ```
 *
 * @example
 * ```tsx
 * // A contrast note that follows the drag, and a way back to no color
 * <ColorPicker
 *   nativeButton
 *   side="bottom"
 *   align="start"
 *   allowClear
 *   value={background}
 *   onAfterChange={setBackground}
 *   footer={(color) => <ContrastNote background={color} />}
 * >
 *   <button type="button" aria-label="Custom background color" />
 * </ColorPicker>
 * ```
 */
export const ColorPicker = ColorPickerImpl as <T extends ColorPickerProps>(
	props: T &
		ValidateColorPickerProps<T> &
		// `T` is inferred from the call site, so `T extends ColorPickerProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof ColorPickerProps | keyof RefAttributes<HTMLElement>>, never> &
		RefAttributes<HTMLElement>,
) => ReactElement;
