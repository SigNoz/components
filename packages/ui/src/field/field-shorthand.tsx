import { type ComponentType, forwardRef, type Ref } from 'react';
import { FieldImpl } from './field.js';
import { FieldGroup } from './subcomponents/field-group.js';
import type { FieldLabelAndMessageProps } from './types.js';

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
	displayName: string;
};

/**
 * A component that renders `Control` inside a `Field`, or a `Field.Group` with `group`, from one object holding the props of both.
 * It adds no layout and no behavior, so it renders the same DOM as a hand-written `Field`.
 *
 * @access private
 */
export function createFieldShorthand<P extends FieldLabelAndMessageProps, E>(
	Control: ComponentType<Record<string, unknown> & { ref?: Ref<E> }>,
	{ passRequired = false, group = false, displayName }: ShorthandOptions,
) {
	const Shorthand = forwardRef<E, P>(function FieldShorthand(props, ref) {
		// `htmlFor` is not a prop of any shorthand: the field points its label at the control itself.
		const {
			label,
			labelIcon,
			labelTooltip,
			description,
			error,
			status,
			message,
			required,
			htmlFor: _htmlFor,
			...control
		} = props as P & { htmlFor?: unknown };
		const testId = (control as { testId?: string }).testId;
		const Wrapper = group ? FieldGroup : FieldImpl;

		return (
			<Wrapper
				label={label}
				labelIcon={labelIcon}
				labelTooltip={labelTooltip}
				description={description}
				error={error}
				status={status}
				message={message}
				required={required}
				testId={testId}
				testIdOnPartsOnly
			>
				<Control {...control} {...(passRequired && required ? { required: true } : {})} ref={ref} />
			</Wrapper>
		);
	});

	Shorthand.displayName = displayName;

	return Shorthand;
}
