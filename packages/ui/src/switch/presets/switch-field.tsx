import {
	type ComponentType,
	forwardRef,
	type ReactElement,
	type Ref,
	type RefAttributes,
} from 'react';
import { createFieldShorthand } from '../../field/field-shorthand.js';
import type { ValidateFieldProps } from '../../field/types.js';
import { Switch } from '../switch.js';
import type { SwitchFieldProps, ValidateSwitchProps } from '../types.js';

type Checked<P, E, T extends P> = T &
	ValidateFieldProps<T> &
	ValidateSwitchProps<T> &
	// `T` is inferred from the call site, so `T extends P` alone never runs excess property checks.
	// Every key outside the props is pinned to `never` instead.
	Record<Exclude<keyof T, keyof P | keyof RefAttributes<E>>, never> &
	RefAttributes<E>;

const BareSwitch = Switch as unknown as ComponentType<
	Record<string, unknown> & { ref?: Ref<HTMLSpanElement> }
>;

// The switch has no text of its own in a field, and `textPlacement` only places that text.
const SwitchWithoutText = forwardRef<HTMLSpanElement, Record<string, unknown>>(
	function SwitchWithoutText(props, ref) {
		return <BareSwitch {...props} textPlacement="right" ref={ref} />;
	},
);

const SwitchFieldRoot = createFieldShorthand<SwitchFieldProps, HTMLSpanElement>(
	SwitchWithoutText as never,
	{ displayName: 'SwitchField' },
);

/**
 * `Switch` inside a `Field`, from one object holding the props of both. It renders the same DOM
 * as the hand-written pair, with the label above the switch, and adds nothing of its own.
 *
 * `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`, `message` and `required`
 * go to the field, which names and describes the switch. Every other prop goes to the switch:
 * `color`, `value`, `onChange`, `name`, `id`, `ref`, `aria-*`, `data-*` and `testId` land where
 * `Switch` puts them. The field parts take `testId` as their prefix (`${testId}-label`,
 * `${testId}-message`), and the field root gets none.
 *
 * The switch is bare: `children`, `description`, `textPlacement` and the other props that lay out
 * its own text are not accepted, since the field's label and description take that place.
 *
 * @example
 * ```tsx
 * <SwitchField
 *   label="Send alerts"
 *   description="Email the on-call channel when a rule fires."
 *   color="primary"
 *   value={enabled}
 *   onChange={setEnabled}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Controller
 *   control={control}
 *   name="enabled"
 *   render={({ field, fieldState }) => (
 *     <SwitchField
 *       label="Send alerts"
 *       color="primary"
 *       value={field.value}
 *       onChange={field.onChange}
 *       ref={field.ref}
 *       error={fieldState.error?.message}
 *     />
 *   )}
 * />
 * ```
 */
export const SwitchField = SwitchFieldRoot as <T extends SwitchFieldProps>(
	props: Checked<SwitchFieldProps, HTMLSpanElement, T>,
) => ReactElement;
