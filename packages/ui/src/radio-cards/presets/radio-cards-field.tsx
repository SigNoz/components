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
	Record<Exclude<keyof T, keyof P | keyof RefAttributes<HTMLInputElement>>, never> &
	RefAttributes<HTMLInputElement>;

const RadioCardsFieldRoot = createFieldShorthand<RadioCardsFieldProps, HTMLInputElement>(
	RadioCards as never,
	{ displayName: 'RadioCardsField', group: true, refIsFocusTarget: true },
);
const RadioCardsFieldMultiple = createFieldShorthand<
	RadioCardsFieldMultipleProps,
	HTMLInputElement
>(RadioCards.Multiple as never, {
	displayName: 'RadioCardsField.Multiple',
	group: true,
	refIsFocusTarget: true,
});

/**
 * Renders `RadioCards` inside a `Field.Group`, from one set of props.
 *
 * The group takes `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`,
 * `message` and `required`. Its legend is the label, and names the `RadioCards`. `required` sets
 * `aria-required` on the `RadioCards` while no card is checked, and a `danger` status sets
 * `aria-invalid`. Every other prop goes to the `RadioCards`.
 *
 * Visual values are the `--field-*` and `--radio-cards-*` custom properties, defaults in the
 * `css-tokens` regions of [../../field/index.ts](../../field/index.ts) and
 * [../index.ts](../index.ts).
 *
 * ### The ref
 *
 * The `ref` is the hidden `<input>` of the checked card, or of the first card while none is
 * checked. A disabled card is never the one. It is not the root `<div>` of `RadioCards`, which
 * `focus()` does nothing on.
 *
 * The input hands its focus to its card, so `focus()` lands on the card. That is how
 * react-hook-form focuses the first invalid field.
 *
 * While the group is disabled, every card is, so the `ref` is `null`.
 *
 * ### Members
 *
 * `RadioCardsField.Multiple` is the same for `RadioCards.Multiple`, which checks several cards.
 * Its root is a `role="group"`, which takes neither `aria-invalid` nor `aria-required`. So a
 * `danger` status sets `data-invalid` on the root, and `required` sets `aria-required` on the
 * cards while none is checked.
 *
 * Its `ref` is the hidden `<input>` of the first checked card that is not disabled, or of the
 * first card that is not disabled while none is checked.
 *
 * ### Asserting on it
 *
 * `testId` is the `RadioCards`' own. The parts of the group take it as their prefix, and the
 * `<fieldset>` gets none.
 *
 * | `data-testid` | rendered |
 * |---|---|
 * | `${testId}-label` | always, the `<legend>` |
 * | `${testId}-label-tooltip` | with `labelTooltip`, the info icon |
 * | `${testId}-description` | while `description` shows |
 * | `${testId}-message` | while a status message shows |
 *
 * The data attributes are those of `Field.Group` and `RadioCards`. Use them, never the hashed
 * class names.
 *
 * @example
 * ```tsx
 * <RadioCardsField
 *   label="When do you plan to migrate?"
 *   columns={2}
 *   items={timelines}
 *   value={timeline}
 *   onChange={setTimeline}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // react-hook-form: `field` carries value, onChange, onBlur, name and ref
 * <Controller
 *   control={control}
 *   name="timeline"
 *   render={({ field, fieldState }) => (
 *     <RadioCardsField
 *       label="When do you plan to migrate?"
 *       columns={2}
 *       items={timelines}
 *       error={fieldState.error?.message}
 *       {...field}
 *     />
 *   )}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Several cards: value and onChange hold the list of checked values
 * <RadioCardsField.Multiple
 *   label="Which tools do you use today?"
 *   columns={2}
 *   items={tools}
 *   value={selectedTools}
 *   onChange={setSelectedTools}
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
