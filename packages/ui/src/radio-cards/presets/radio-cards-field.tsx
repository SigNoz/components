import type { ReactElement, RefAttributes } from 'react';
import { createFieldShorthand } from '../../field/field-shorthand.js';
import type { ValidateFieldProps } from '../../field/types.js';
import { RadioCards } from '../radio-cards.js';
import type {
	RadioCardsFieldMultipleProps,
	RadioCardsFieldProps,
	ValidateRadioCardsProps,
} from '../types.js';

// The legend names the group, so the rule that asks the call site for `aria-label` or
// `aria-labelledby` is met here by a name that is always there.
type NamedByTheLegend = { 'aria-label': string };

type Checked<P, T extends P> = T &
	ValidateFieldProps<T> &
	ValidateRadioCardsProps<T & NamedByTheLegend> &
	// `T` is inferred from the call site, so `T extends P` alone never runs excess property checks.
	// Every key outside the props is pinned to `never` instead.
	Record<Exclude<keyof T, keyof P | keyof RefAttributes<HTMLDivElement>>, never> &
	RefAttributes<HTMLDivElement>;

const RadioCardsFieldRoot = createFieldShorthand<RadioCardsFieldProps, HTMLDivElement>(
	RadioCards as never,
	{ displayName: 'RadioCardsField', group: true },
);
const RadioCardsFieldMultiple = createFieldShorthand<RadioCardsFieldMultipleProps, HTMLDivElement>(
	RadioCards.Multiple as never,
	{ displayName: 'RadioCardsField.Multiple', group: true },
);

/**
 * `RadioCards` inside a `Field.Group`, from one object holding the props of both. It renders the
 * same DOM as the hand-written pair and adds nothing of its own.
 *
 * `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`, `message` and `required`
 * go to the group. The label is its `<legend>`, and the cards take it as their name, so
 * `aria-label` and `aria-labelledby` are not needed. The radio group takes `aria-required` from
 * `required` and gets `aria-invalid` while the status is `danger`. Every other prop goes to the
 * cards: `items`, `columns`, `value`, `onChange`, `ref`, `aria-*`, `data-*` and `testId` land where
 * `RadioCards` puts them. The group parts take `testId` as their prefix (`${testId}-label`,
 * `${testId}-message`), and the `<fieldset>` gets none.
 *
 * `RadioCardsField.Multiple` does the same for `RadioCards.Multiple`, whose root is a
 * `role="group"` and so takes no `aria-invalid`.
 *
 * @example
 * ```tsx
 * <RadioCardsField
 *   label="When do you plan to migrate?"
 *   columns={2}
 *   items={timelines}
 *   error={errors.timeline?.message}
 *   {...field}
 * />
 * ```
 */
export const RadioCardsField = Object.assign(RadioCardsFieldRoot, {
	Multiple: RadioCardsFieldMultiple,
}) as (<T extends RadioCardsFieldProps>(
	props: Checked<RadioCardsFieldProps, T>,
) => ReactElement) & {
	Multiple: <T extends RadioCardsFieldMultipleProps>(
		props: Checked<RadioCardsFieldMultipleProps, T>,
	) => ReactElement;
};
