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
 * The control's props resolved against the surrounding `Field` or `Field.Group`.
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

	// The field's `<label for>` follows the id the input ends up with, its own id included. A
	// `Field.Group` ignores the claim, since it has no single control to name.
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
		// A field's `required` stays ARIA only: a native `required` makes the browser block the submit
		// before the form's schema runs.
		required: own.required,
		ariaRequired: own.ariaRequired ?? (required === true ? true : undefined),
		ariaDescribedBy: joinIdRefs(own.ariaDescribedBy, field?.describedBy),
		ariaInvalid: own.ariaInvalid ?? (status === 'danger' ? true : undefined),
	};
}
