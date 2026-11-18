import type { AriaAttributes } from 'react';
import { fieldInvalidDataProps, useFieldContext } from '../lib/field-context.js';

/**
 * What a `Field.Group` around the cards hands down, as defaults the cards' own props win over: the
 * legend as the name of the group while it has none of its own, `aria-required`, and
 * `aria-invalid` for a `danger` status.
 *
 * `required` is the cards' own prop alone, and it is the one that reaches Base UI as the native
 * `required`. The field's `required` comes back as `isFieldRequired` instead, for the cards to
 * announce with `aria-required` and nothing native: the form's own validation owns the rule, and a
 * native `required` would stop the browser's submit before it runs.
 *
 * Base UI names a radio group with the legend of its fieldset on its own, and that name outranks an
 * `aria-label`, so a group with an `aria-label` and no `aria-labelledby` erases it.
 *
 * The `focusTarget` is where a `RadioCardsField` sends its `ref`: the element whose `focus()` lands
 * on a card, see `FieldContextValue`.
 *
 * The two attribute sets are spread before the cards' own props, and each is `undefined` rather
 * than holding an `undefined` value, which would erase what Base UI sets on the same attribute.
 * `aria-invalid` is not allowed on `role="group"`, so `RadioCards.Multiple` takes `invalidDataProps`
 * instead: `data-invalid`, which the stylesheet reads and Base UI sets by itself inside a `Field`.
 *
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
			nameProps = { 'aria-labelledby': undefined };
		} else if (field.kind === 'group') {
			nameProps = { 'aria-labelledby': field.labelId };
		}
	}

	return {
		required: required ?? false,
		isFieldRequired: required === undefined && field?.required === true,
		nameProps,
		invalidProps: field?.status === 'danger' ? { 'aria-invalid': true } : undefined,
		invalidDataProps: fieldInvalidDataProps(field),
		focusTarget: field?.focusTarget,
	};
}
