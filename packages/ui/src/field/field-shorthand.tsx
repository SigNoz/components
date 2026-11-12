import { type ComponentType, forwardRef, type Ref } from 'react';
import { FIELD_SHORTHAND_KEYS } from './constants.js';
import { FieldImpl } from './field.js';
import { FieldGroup } from './subcomponents/field-group.js';
import type { FieldLabelAndMessageProps } from './types.js';
import { useFocusTarget } from './use-focus-target.js';

type ShorthandOptions = {
	/**
	 * Hands `required` to the control as a prop too, for a control that does not read it from the
	 * field yet.
	 */
	passRequired?: boolean;
	/**
	 * Renders the control inside a `Field.Group`, for a control with more than one input.
	 */
	group?: boolean;
	/**
	 * For a control that is several elements, whose root `<div>` `focus()` does nothing on. The
	 * shorthand's `ref` goes to the element the control names as its focus target, through the
	 * field context, and no longer to the control's own `ref`, which keeps pointing at its root.
	 * A form library focuses the first invalid field by calling `focus()` on that `ref`.
	 */
	refIsFocusTarget?: boolean;
	displayName: string;
};

/**
 * The props of the field and the props of the control, split from one object: the label, the
 * description and the status go to the field, everything else to the control. `testId` goes to the
 * control, and the field parts take it as their prefix.
 *
 * @access private
 */
export function splitFieldProps<P extends FieldLabelAndMessageProps>(
	props: P,
): {
	field: FieldLabelAndMessageProps;
	control: Omit<P, (typeof FIELD_SHORTHAND_KEYS)[number] | 'required'>;
	required: boolean;
} {
	const field: Record<string, unknown> = {};
	const control: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(props)) {
		if ((FIELD_SHORTHAND_KEYS as readonly string[]).includes(key)) {
			field[key] = value;
		} else if (key !== 'required' && key !== 'htmlFor') {
			control[key] = value;
		}
	}

	return {
		field: field as FieldLabelAndMessageProps,
		control: control as Omit<P, (typeof FIELD_SHORTHAND_KEYS)[number] | 'required'>,
		required: props.required === true,
	};
}

/**
 * A component that renders `Control` inside a `Field`, or a `Field.Group` with `group`, from one object holding the props of both.
 * It adds no layout and no behavior, so it renders the same DOM as a hand-written `Field`.
 *
 * @access private
 */
export function createFieldShorthand<P extends FieldLabelAndMessageProps, E>(
	Control: ComponentType<Record<string, unknown> & { ref?: Ref<E> }>,
	{ passRequired = false, group = false, refIsFocusTarget = false, displayName }: ShorthandOptions,
) {
	const Shorthand = forwardRef<E, P>(function FieldShorthand(props, ref) {
		const { field, control, required } = splitFieldProps(props);
		const testId = (control as { testId?: string }).testId;
		const Wrapper = group ? FieldGroup : FieldImpl;
		const focusTarget = useFocusTarget(refIsFocusTarget ? ref : null);

		return (
			<Wrapper
				{...field}
				required={required}
				testId={testId}
				testIdOnPartsOnly
				focusTarget={refIsFocusTarget ? focusTarget : undefined}
			>
				<Control
					{...(control as Record<string, unknown>)}
					{...(passRequired && required ? { required: true } : {})}
					{...(refIsFocusTarget ? {} : { ref })}
				/>
			</Wrapper>
		);
	});

	Shorthand.displayName = displayName;

	return Shorthand;
}
