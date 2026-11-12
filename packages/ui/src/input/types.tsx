import type { FieldLabelAndMessageProps } from '../field/types.js';
import type { AriaAttributes, ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import type { InputSize, InputStatus, InputVariant } from './constants.js';

export type InputSizeType = (typeof InputSize)[keyof typeof InputSize];
export type InputVariantType = (typeof InputVariant)[keyof typeof InputVariant];
export type InputStatusType = (typeof InputStatus)[keyof typeof InputStatus];

/**
 * The props every member of the compound shares: everything about the frame around the control,
 * none of the control's own attributes.
 */
type InputAppearanceProps = {
	/**
	 * The height of the field: `sm` is 24px, `md` is 32px, `lg` is 40px. The text size does not change.
	 *
	 * @default 'md'
	 */
	size?: InputSizeType;
	/**
	 * `default` draws the bordered field. `unstyled` drops the border and the background and keeps
	 * everything else: padding, height, text and the focus ring.
	 *
	 * @note The ring is all that marks focus on an unstyled input, so it never goes with this
	 * variant. Use `noFocusRing` only on a surface that draws a focus treatment of its own.
	 *
	 * @default 'default'
	 */
	variant?: InputVariantType;
	/**
	 * The validation state: tints the border and the background and renders a matching icon at the
	 * trailing edge of the field.
	 *
	 * @note `danger` also announces itself as `aria-invalid`.
	 *
	 * @note Inside a `Field` the field's `status` is the default, so the message below and the
	 * field tint together. This prop wins when both are set.
	 *
	 * @note `success` is confirmation of a completed check (name available, connection verified),
	 * not a resting state for a valid field.
	 */
	status?: InputStatusType;
	/**
	 * Rendered inside the field before the text. An icon takes the field's icon size and color.
	 */
	prefix?: ReactNode;
	/**
	 * Rendered inside the field after the text, before the status icon.
	 *
	 * @note A node, so it can hold a control of its own, such as a clear button.
	 */
	suffix?: ReactNode;
	/**
	 * When true, keyboard focus draws no ring around the field.
	 *
	 * @note The ring only shows on keyboard focus to begin with, never after a click, so this is
	 * for a surface that draws a focus treatment of its own, not for hiding focus.
	 *
	 * @default false
	 */
	noFocusRing?: boolean;
	/**
	 * When true, blocks typing and leaves the field out of the tab order and the form submit.
	 *
	 * @note Requires `disabledTooltip`.
	 *
	 * @note Suppressed entirely while `readOnly` is true, along with `disabledTooltip`.
	 */
	disabled?: boolean;
	/**
	 * Why the field cannot be used, shown in a tooltip while `disabled` is true.
	 *
	 * @note Only allowed alongside `disabled`.
	 *
	 * @note Pass `undefined` explicitly when there is no reason to give, for example in a wrapper
	 * that only forwards `disabled`. Leaving the prop out is the type error.
	 */
	disabledTooltip?: ReactNode;
	/**
	 * When true, the value cannot change, but the field stays focusable and its value stays
	 * selectable and copyable.
	 *
	 * @note Requires `readOnlyTooltip`.
	 *
	 * @note Outranks `disabled`: while this is true the field is not disabled at all, whatever
	 * `disabled` says.
	 */
	readOnly?: boolean;
	/**
	 * Why the value is locked, shown in a tooltip while `readOnly` is true.
	 *
	 * @note Only allowed alongside `readOnly`.
	 *
	 * @note Pass `undefined` explicitly when there is no reason to give.
	 */
	readOnlyTooltip?: ReactNode;
	/**
	 * The width of the field. A number is pixels. Without it the field fills its parent.
	 */
	width?: CSSProperties['width'];
	/**
	 * The width the field never grows past. A number is pixels.
	 */
	maxWidth?: CSSProperties['width'];
	/**
	 * Forwarded to the rendered frame as `data-testid`, and the prefix of the parts' test ids.
	 * Survives the tooltip trigger cloning the frame, which a raw `data-testid` prop does not.
	 */
	testId?: string;
	/**
	 * Any `data-*` prop is accepted and forwarded to the rendered frame.
	 */
	[key: `data-${string}`]: unknown;
};

type InputValue = ComponentPropsWithoutRef<'input'>['value'];
type InputTextAreaValue = ComponentPropsWithoutRef<'textarea'>['value'];

/**
 * `nullable` decides whether `value` may be `null`, so the two travel as a union: without it the
 * types are the native ones, and `value={null}` is a type error.
 *
 * `nullable` only takes `true`, so a field is nullable by being written that way, never by a flag
 * decided at run time.
 *
 * The member without `nullable` comes last on purpose. TypeScript reports a props object that
 * matches neither member against the last one, so a `value` of `null` without `nullable` is told
 * about the `value`, not about a missing `nullable`.
 */
export type InputNullableType<Value> =
	| {
			/**
			 * Makes `value` also take `null` as the empty field. For a nullable schema field (zod
			 * `.nullable()`) driven through a react-hook-form `Controller`.
			 *
			 * @note `onChange` is still the native change event, so it never reports `null`: the
			 * form library holds the empty field as `null` itself, and writes it back through `value`.
			 *
			 * @note Only `true` is accepted.
			 */
			nullable: true;
			/**
			 * The controlled value. `null` is the empty field, drawn as an empty string.
			 *
			 * `undefined` on the first render leaves the field uncontrolled, starting at `defaultValue`.
			 * A value that arrives later is followed, with one warning, and from then on `undefined`
			 * shows it empty.
			 *
			 * @note React also logs its own "uncontrolled to controlled" error when the value arrives
			 * late.
			 *
			 * @note Use with `onChange`. For an uncontrolled field leave `value` out and use
			 * `defaultValue`, which is what react-hook-form's `register()` does.
			 */
			value?: Value | null;
	  }
	| {
			/**
			 * Makes `value` also take `null` as the empty field. For a nullable schema field (zod
			 * `.nullable()`) driven through a react-hook-form `Controller`.
			 *
			 * @note `onChange` is still the native change event, so it never reports `null`: the
			 * form library holds the empty field as `null` itself, and writes it back through `value`.
			 *
			 * @note Only `true` is accepted.
			 */
			nullable?: never;
			/**
			 * The controlled value. The empty field is the empty string.
			 *
			 * `undefined` on the first render leaves the field uncontrolled, starting at `defaultValue`.
			 * A value that arrives later is followed, with one warning, and from then on `undefined`
			 * shows it empty.
			 *
			 * @note React also logs its own "uncontrolled to controlled" error when the value arrives
			 * late.
			 *
			 * @note `null` is not a value here. A field that holds `null` while empty takes
			 * `nullable`.
			 *
			 * @note Use with `onChange`. For an uncontrolled field leave `value` out and use
			 * `defaultValue`, which is what react-hook-form's `register()` does.
			 */
			value?: Value;
	  };

type InputNativeProps = Pick<
	ComponentPropsWithoutRef<'input'>,
	| 'id'
	| 'name'
	| 'type'
	| 'defaultValue'
	| 'placeholder'
	| 'required'
	| 'autoComplete'
	| 'autoCorrect'
	| 'autoCapitalize'
	| 'autoFocus'
	| 'autoSave'
	| 'spellCheck'
	| 'maxLength'
	| 'minLength'
	| 'min'
	| 'max'
	| 'step'
	| 'pattern'
	| 'inputMode'
	| 'enterKeyHint'
	| 'form'
	| 'list'
	| 'multiple'
	| 'accept'
	| 'capture'
	| 'tabIndex'
	| 'title'
	| 'lang'
	| 'translate'
	| 'onChange'
	| 'onBlur'
	| 'onFocus'
	| 'onInput'
	| 'onBeforeInput'
	| 'onInvalid'
	| 'onKeyDown'
	| 'onKeyUp'
	| 'onPaste'
	| 'onCopy'
	| 'onCut'
	| 'onSelect'
	| 'onClick'
	| 'onMouseDown'
	| 'onWheel'
	| 'onCompositionStart'
	| 'onCompositionEnd'
>;

type InputSharedProps = InputAppearanceProps & InputNativeProps & AriaAttributes;

export type InputProps = InputSharedProps & InputNullableType<InputValue>;

export type InputPasswordProps = Omit<InputSharedProps, 'type' | 'suffix' | 'list' | 'multiple'> &
	InputNullableType<InputValue>;

type InputTextAreaNativeProps = Pick<
	ComponentPropsWithoutRef<'textarea'>,
	| 'id'
	| 'name'
	| 'defaultValue'
	| 'placeholder'
	| 'required'
	| 'autoComplete'
	| 'autoFocus'
	| 'spellCheck'
	| 'maxLength'
	| 'minLength'
	| 'rows'
	| 'wrap'
	| 'form'
	| 'tabIndex'
	| 'title'
	| 'lang'
	| 'inputMode'
	| 'enterKeyHint'
	| 'onChange'
	| 'onBlur'
	| 'onFocus'
	| 'onInput'
	| 'onKeyDown'
	| 'onKeyUp'
	| 'onPaste'
	| 'onCopy'
	| 'onCut'
	| 'onSelect'
	| 'onClick'
	| 'onWheel'
	| 'onCompositionStart'
	| 'onCompositionEnd'
>;

export type InputTextAreaProps = Omit<InputAppearanceProps, 'prefix' | 'suffix'> &
	InputTextAreaNativeProps &
	AriaAttributes &
	InputNullableType<InputTextAreaValue>;

export type InputNumberProps = InputAppearanceProps &
	Pick<
		ComponentPropsWithoutRef<'input'>,
		'id' | 'name' | 'placeholder' | 'required' | 'autoFocus' | 'form' | 'tabIndex'
	> & {
		/**
		 * The controlled value. `null` is the empty field.
		 *
		 * `undefined` on the first render leaves the field uncontrolled, starting at `defaultValue`.
		 * A value that arrives later is followed, with one warning, and from then on `undefined`
		 * shows it empty.
		 *
		 * @note Use with `onChange`. For an uncontrolled field use `defaultValue` instead.
		 */
		value?: number | null;
		/**
		 * Accepted so a nullable schema field (zod `.nullable()`) spreads through a react-hook-form
		 * `Controller` the same way as on the other inputs.
		 *
		 * @note `value` and `onChange` already take and report `null` for an empty field, with or
		 * without this prop, so it changes nothing here.
		 *
		 * @note Only `true` is accepted.
		 */
		nullable?: true;
		/**
		 * The value on first render, for a field that keeps its own state.
		 *
		 * @note Use with `onChange`. For a controlled field use `value` instead.
		 */
		defaultValue?: number;
		/**
		 * Called with the parsed value on every change: typing, the step buttons, the arrow keys.
		 * `null` is the field going empty.
		 *
		 * @note Never called while `disabled` or `readOnly`.
		 */
		onChange?: (value: number | null) => void;
		/**
		 * Called when the value is committed: on blur after typing, and on release of a step
		 * button. Runs together with `onChange` for a key press.
		 */
		onAfterChange?: (value: number | null) => void;
		/**
		 * The smallest value the steppers and the arrow keys reach. Typing can still go below it;
		 * the form's native validation reports that as range underflow.
		 */
		min?: number;
		/**
		 * The largest value the steppers and the arrow keys reach.
		 */
		max?: number;
		/**
		 * How far one step moves the value.
		 *
		 * @default 1
		 */
		step?: number;
		/**
		 * How far one step moves the value while `Shift` is held.
		 *
		 * @default 10
		 */
		largeStep?: number;
		/**
		 * When true, stepping snaps the value to the nearest multiple of `step`.
		 *
		 * @default false
		 */
		snapOnStep?: boolean;
		/**
		 * How the value reads while the field is not being edited, for example
		 * `{ maximumFractionDigits: 2 }` or `{ style: 'percent' }`.
		 */
		format?: Intl.NumberFormatOptions;
		/**
		 * The locale the value is formatted and parsed in. Without it, the user's own.
		 */
		locale?: Intl.LocalesArgument;
		/**
		 * When true, the field renders the step buttons at its trailing edge.
		 *
		 * @default true
		 */
		controls?: boolean;
		onBlur?: ComponentPropsWithoutRef<'input'>['onBlur'];
		onFocus?: ComponentPropsWithoutRef<'input'>['onFocus'];
		onKeyDown?: ComponentPropsWithoutRef<'input'>['onKeyDown'];
	} & AriaAttributes;

/**
 * The rules below are the ones a union cannot express without blowing up the props into a cross
 * product. Each is an object whose single required key is the sentence the compiler should print,
 * so a violation reads as `Property '<the sentence>' is missing ... but required in type
 * '<the rule name>'` instead of pointing at an unrelated prop.
 */
interface ADisabledInputMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface ADisabledReasonNeedsADisabledInput {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

interface AReadOnlyInputMustSayWhy {
	'`readOnly` needs `readOnlyTooltip`, a locked control has to tell the user why it cannot change': never;
}

interface AReadOnlyReasonNeedsAReadOnlyInput {
	'`readOnlyTooltip` only renders while `readOnly` is set, add `readOnly` or drop the tooltip': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which survives the tooltip trigger cloning the frame': never;
}

/**
 * Extra constraints layered on top of the props at the call site, shared by `Input` and every
 * member of the compound.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to
 * a rule object when they are not.
 *
 * The pairing rules look at which props the call site writes, not at their values: `disabled`
 * typed `boolean | undefined` is still `disabled`, and `disabledTooltip={undefined}` is the
 * explicit opt-out for a call site that has no reason to give. A spread whose type makes the prop
 * optional, such as react-hook-form's `register()`, writes nothing and passes.
 *
 * @note A wrapper that forwards the whole props type is not checked: `T` is then the type itself,
 * every branch of the conditional is taken at once, and `unknown` from the passing branches
 * absorbs the rest. Such a wrapper is checked at its own call sites instead.
 */
export type ValidateInputProps<T> = (T extends { disabled: boolean | undefined }
	? T extends { disabledTooltip: ReactNode }
		? unknown
		: ADisabledInputMustSayWhy
	: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledInput
		: unknown) &
	(T extends { readOnly: boolean | undefined }
		? T extends { readOnlyTooltip: ReactNode }
			? unknown
			: AReadOnlyInputMustSayWhy
		: unknown) &
	(T extends { readOnlyTooltip: ReactNode }
		? T extends { readOnly: boolean | undefined }
			? unknown
			: AReadOnlyReasonNeedsAReadOnlyInput
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

/**
 * Distributes over the `nullable` union, so `nullable` still decides the type of `value`.
 */
type WithField<P> = P extends unknown
	? Omit<P, 'status' | 'required'> & FieldLabelAndMessageProps
	: never;

/**
 * The props of `InputField`: the field's label, description and status, and every prop of `Input`.
 */
export type InputFieldProps = WithField<InputProps>;
export type InputFieldPasswordProps = WithField<InputPasswordProps>;
export type InputFieldTextAreaProps = WithField<InputTextAreaProps>;
export type InputFieldNumberProps = WithField<InputNumberProps>;
