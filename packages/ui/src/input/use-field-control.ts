import type { AriaAttributes } from 'react';
import { useFieldContext } from '../lib/field-context.js';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import { joinIdRefs } from '../lib/utils.js';
import type { InputStatusType } from './types.js';

/**
 * @access private
 */
export type FieldControlProps = {
	id: string | undefined;
	status: InputStatusType | undefined;
	required: boolean | undefined;
	ariaRequired: AriaAttributes['aria-required'];
	ariaDescribedBy: AriaAttributes['aria-describedby'];
	ariaInvalid: AriaAttributes['aria-invalid'];
};

/**
 * The control's own props resolved against the surrounding `Field` or `Field.Group`, which supplies
 * the defaults: the id its label points at, the status it shows a message for and whether it is
 * required. The control's own props win.
 *
 * `required` is the native attribute and comes from the control's own prop only. A `required` field
 * reaches the control as `ariaRequired` alone: the form's validation (react-hook-form, zod) owns
 * the rules, and a native `required` makes the browser stop the submit with its own bubble before
 * the schema runs whenever the form is a plain `<form>` without `noValidate`. A call site that
 * wants the browser check passes `required` to the control itself, which sets both attributes.
 * `ariaRequired` is the control's own `aria-required`, else its own `required`, else the field's.
 *
 * The id the input ends up with is handed back to the field, so its `<label for>` points at it
 * also when the call site names its own `id`. A group has no single control to name, so an input
 * inside one keeps its own id, or none.
 *
 * `aria-describedby` gains the field's description ids, and `aria-invalid` follows a `danger`
 * status unless the call site writes it.
 *
 * @access private
 */
export function useFieldControl(own: FieldControlProps): {
	id: string | undefined;
	status: InputStatusType | undefined;
	required: boolean | undefined;
	ariaRequired: AriaAttributes['aria-required'];
	ariaDescribedBy: AriaAttributes['aria-describedby'];
	ariaInvalid: AriaAttributes['aria-invalid'];
} {
	const field = useFieldContext();
	const status = own.status ?? field?.status;
	const id = own.id ?? field?.controlId;
	const claimControl = field?.claimControl;

	useIsomorphicLayoutEffect(() => {
		if (claimControl === undefined) {
			return undefined;
		}

		claimControl(id);

		return () => claimControl(undefined);
	}, [claimControl, id]);

	const required = own.required ?? field?.required;

	return {
		id,
		status,
		required: own.required,
		ariaRequired: own.ariaRequired ?? (required === true ? true : undefined),
		ariaDescribedBy: joinIdRefs(own.ariaDescribedBy, field?.describedBy),
		ariaInvalid: own.ariaInvalid ?? (status === 'danger' ? true : undefined),
	};
}
