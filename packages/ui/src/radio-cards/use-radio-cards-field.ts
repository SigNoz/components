import type { AriaAttributes } from 'react';
import { fieldInvalidDataProps, useFieldContext } from '../lib/field-context.js';

/**
 * @access private
 */
export function useRadioCardsField(
	props: Pick<AriaAttributes, 'aria-label' | 'aria-labelledby'>,
	required: boolean | undefined,
) {
	const field = useFieldContext();
	const hasOwnLabelledBy = props['aria-labelledby'] !== undefined;
	const hasOwnLabel = props['aria-label'] !== undefined;

	let nameProps: { 'aria-labelledby': string | undefined } | undefined;

	if (field !== null && !hasOwnLabelledBy) {
		if (hasOwnLabel) {
			// Base UI names the group with the field's label or the fieldset legend, and that name
			// outranks an `aria-label`, so a group with its own `aria-label` erases the name.
			nameProps = { 'aria-labelledby': undefined };
		} else if (field.kind === 'group') {
			nameProps = { 'aria-labelledby': field.labelId };
		}
	}

	return {
		required: required ?? false,
		// The field's `required` is only announced: a native one would block the submit before the
		// form's own validation runs.
		isFieldRequired: required === undefined && field?.required === true,
		nameProps,
		// `undefined`, not `{ 'aria-invalid': undefined }`, which would erase what Base UI sets.
		invalidProps: field?.status === 'danger' ? { 'aria-invalid': true } : undefined,
		// `role="group"` takes no `aria-invalid`, so `RadioCards.Multiple` reads `data-invalid`.
		invalidDataProps: fieldInvalidDataProps(field),
		focusTarget: field?.focusTarget,
	};
}
