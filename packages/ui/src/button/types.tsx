import type { ButtonColor, ButtonSize, ButtonTextOverflow, ButtonVariant } from './constants.js';
import type {
	AriaAttributes,
	ButtonHTMLAttributes,
	CSSProperties,
	ReactElement,
	ReactNode,
} from 'react';

export type SizeType = (typeof ButtonSize)[keyof typeof ButtonSize];
export type VariantType = (typeof ButtonVariant)[keyof typeof ButtonVariant];
export type ColorType = (typeof ButtonColor)[keyof typeof ButtonColor];
export type TextOverflowType = (typeof ButtonTextOverflow)[keyof typeof ButtonTextOverflow];

/**
 * The variants that carry a colour of their own.
 */
export interface ColoredVariantProps {
	/**
	 * The variants of solid/link are the only ones that accept custom colors.
	 */
	variant: 'solid' | 'link';
	/**
	 * The possible colors for this variant.
	 */
	color: ColorType;
}

/**
 * The variants that only exist in the secondary treatment.
 */
export interface SecondaryOnlyVariantProps {
	/**
	 * The variant of outlined/ghost/dashed only support one type of color.
	 */
	variant: 'outlined' | 'ghost' | 'dashed';
	/**
	 * The possible colors for this variant.
	 */
	color: 'secondary';
}

export type VariantColorType = ColoredVariantProps | SecondaryOnlyVariantProps;

/**
 * `disabled` and `disabledTooltip` travel together, but the pairing is enforced by
 * {@link ValidateButtonProps} rather than by a union of the two shapes.
 *
 * A union here would be multiplied by the {@link VariantColorType} and
 * {@link IconPrefixSuffixType} unions into an eight member cross product. TypeScript can only
 * narrow such a union through a discriminant the call site actually writes, and `disabled` is
 * absent from most call sites, so it would give up and blame whichever member came first. That is
 * how a missing `aria-label` used to be reported as missing `disabled` and `disabledTooltip`.
 */
export type DisableType = {
	/**
	 * When true, this will disable the button (will not trigger onClick and onDoubleClick), but will not prevent other events to be triggered.
	 *
	 * @note Requires `disabledTooltip`.
	 *
	 * @note While the tooltip is rendered, the button carries `aria-disabled` instead of the
	 * native `disabled` attribute, so it keeps receiving hover/focus and stays tabbable. A
	 * native `disabled` button gets no events at all, which would make the tooltip unreachable.
	 */
	disabled?: boolean;
	/**
	 * When disable is defined, you must define the possible reason of the button is disabled, only render the tooltip when disabled is true.
	 *
	 * @note Only allowed alongside `disabled`.
	 *
	 * @note This does not render when loading={true} and disabled={true} is defined at same time.
	 *
	 * @note Stacks above the `ellipsis` overflow tooltip: a disabled button with a truncated
	 * label shows the reason first, then the full label.
	 *
	 * @note Pass `undefined` explicitly when there is no reason to give, for example in a
	 * wrapper that only forwards `disabled`. Leaving the prop out is the type error.
	 */
	disabledTooltip?: ReactNode;
};

/**
 * The rules below are the ones a union cannot express without blowing up {@link ButtonProps} into a
 * cross product. Each is an object whose single required key is the sentence the compiler should
 * print, so a violation reads as `Property '<the sentence>' is missing ... but required in type
 * '<the rule name>'` instead of pointing at an unrelated prop.
 */
interface ADisabledButtonMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which survives the tooltip trigger cloning the button': never;
}

interface ADisabledReasonNeedsADisabledButton {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

/**
 * Extra constraints layered on top of {@link ButtonProps} at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to a
 * rule object when they are not.
 *
 * The pairing rules look at which props the call site writes, not at their values: `disabled`
 * typed `boolean | undefined` is still `disabled`, and `disabledTooltip={undefined}` is the
 * explicit opt-out for a call site that has no reason to give.
 *
 * @note A wrapper that forwards the whole `ButtonProps` union is not checked: `T` is then the union
 * itself, every branch of the conditional is taken at once, and `unknown` from the passing branches
 * absorbs the rest. Such a wrapper is checked at its own call sites instead.
 */
export type ValidateButtonProps<T> = (T extends { disabled: boolean | undefined }
	? T extends { disabledTooltip: ReactNode }
		? unknown
		: ADisabledButtonMustSayWhy
	: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledButton
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

/**
 * A button that renders a text label, optionally flanked by a `prefix` and a `suffix`.
 */
export interface TextButtonProps {
	/**
	 * When icon is not defined, you can use prefix/suffix/children.
	 */
	icon?: never;
	/**
	 * Element rendered before the button label. The sizing class is merged into the element's
	 * own `className`.
	 */
	prefix?: ReactElement;
	/**
	 * Element rendered after the button label. The sizing class is merged into the element's
	 * own `className`.
	 */
	suffix?: ReactElement;
}

/**
 * A button whose children are the icon itself.
 *
 * Named rather than inlined so that a missing `aria-label` is reported against
 * `IconButtonProps`, which says what the call site was taken to be, instead of against the
 * structural dump of the branch.
 */
export interface IconButtonProps {
	/**
	 * Define this button should be rendered optimized for an icon
	 *
	 * @note In icon mode the children are the icon, so `prefix` and `suffix` are not allowed.
	 */
	icon: true;
	/**
	 * The prefix is not allowed when using icon
	 */
	prefix?: never;
	/**
	 * The suffix is not allowed when using icon
	 */
	suffix?: never;
	/**
	 * The text/children of this button.
	 *
	 * This field is mandatory, it's not allowed to have a empty button.
	 */
	children: ReactElement;
	/**
	 * The accessible name of the button. Required: the children are an icon, so there is no text
	 * for a screen reader to announce.
	 */
	'aria-label': string;
}

export type IconPrefixSuffixType = TextButtonProps | IconButtonProps;

/**
 * Everything that does not depend on which kind of button is being rendered.
 *
 * Named, and holding `size` and `children` itself, so that a call site missing one of them is told
 * which type wanted it rather than being handed the structural dump of an anonymous object.
 */
export interface ButtonBaseProps
	extends
		Pick<
			ButtonHTMLAttributes<HTMLButtonElement>,
			| 'id'
			| 'className'
			| 'style'
			| 'tabIndex'
			| 'autoFocus'
			| 'type'
			| 'onClick'
			| 'onDoubleClick'
			| 'onKeyDown'
			| 'onKeyUp'
			| 'onFocus'
			| 'onBlur'
			| 'onMouseEnter'
			| 'onMouseLeave'
		>,
		AriaAttributes,
		DisableType {
	/**
	 * Height + padding token.
	 */
	size: SizeType;
	/**
	 * The text/children of this button.
	 *
	 * This field is mandatory, it's not allowed to have a empty button. `IconButtonProps` narrows
	 * it to a single element.
	 */
	children: ReactNode;
	/**
	 * Controls how the text inside the button will behave when it does not fit.
	 *
	 * `ellipsis` truncates the label and shows the full text in a tooltip on
	 * hover/focus, and only while the label is actually truncated. `none` clips the
	 * label at the button's edge, no marker and no tooltip.
	 *
	 * @note The tooltip is exclusive to `ellipsis`.
	 *
	 * @note A `disabled` button stacks its `disabledTooltip` above this one, reason first.
	 * `loading` buttons stay focusable and do show this one.
	 *
	 * @default ellipsis
	 */
	textOverflow?: TextOverflowType;
	/**
	 * When `true`, cross-fades a spinner over the `prefix` slot and stops the button from
	 * responding to clicks and keyboard activation. The label and `suffix` stay visible.
	 *
	 * @note Unlike `disabled`, the button stays focusable and carries `aria-disabled`/`aria-busy`
	 * instead of the native `disabled` attribute, so clicking it does not throw focus away.
	 *
	 * @note This does not cause the disabledTooltip to be shown to the user, we intentionally hide the tooltip even if you pass disabled={true}
	 *
	 * @default false
	 */
	loading?: boolean;
	/**
	 * What the button is busy with, shown in a tooltip while `loading` is true. Optional, a
	 * spinner alone is already a valid busy state.
	 *
	 * @note Only renders while `loading` is true, and it takes the place of `disabledTooltip`,
	 * which is suppressed for the whole time the button is loading.
	 *
	 * @note Stacks above the `ellipsis` overflow tooltip, same as `disabledTooltip`: a loading
	 * button with a truncated label shows what it is doing first, then the full label.
	 */
	loadingTooltip?: ReactNode;
	/**
	 * The width of this button. Written as the `--button-internal-width` custom property, so it
	 * composes with the tokens instead of overwriting `style.width`. Numbers are written as `px`.
	 * Without it the button sizes to its content.
	 */
	width?: CSSProperties['width'];
	/**
	 * The max-width of this button. Written as the `--button-internal-max-width` custom property,
	 * so it composes with the tokens. Numbers are written as `px`. Without it the button is capped
	 * at `100%` of its container.
	 */
	maxWidth?: CSSProperties['maxWidth'];
	/**
	 * Forwarded to the rendered element as `data-testid`. Survives the tooltip trigger cloning the
	 * button, which a raw `data-testid` prop does not.
	 */
	testId?: string;
	/**
	 * Any `data-*` attribute is forwarded to the rendered element, so consumers can hook
	 * styling/selectors on top of the button without wrapping it.
	 */
	[dataAttribute: `data-${string}`]: unknown;
}

export type ButtonProps = ButtonBaseProps & VariantColorType & IconPrefixSuffixType;
