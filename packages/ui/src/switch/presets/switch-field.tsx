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

// Switch requires textPlacement, and a switch in a field has no text to place, so any value fits.
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
 * Renders a `Switch` inside a `Field`, from one set of props. The DOM is the same as the
 * hand-written pair.
 *
 * The field takes `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`,
 * `message` and `required`. It names and describes the switch, and sets `aria-required` for
 * `required` and `aria-invalid` for `danger`. Every other prop goes to the switch.
 *
 * Visual values are the `--field-*` and `--switch-*` custom properties, defaults in the
 * `css-tokens` regions of [../../field/index.ts](../../field/index.ts) and
 * [../index.ts](../index.ts).
 *
 * ### Asserting on it
 *
 * `testId` is the switch's own: `Switch` puts it on the switch itself. The field parts take it as
 * their prefix, and the field root gets none.
 *
 * | `data-slot` | `data-testid` |
 * |---|---|
 * | `field-label` | `${testId}-label` |
 * | `field-label-tooltip` | `${testId}-label-tooltip` |
 * | `field-description` | `${testId}-description` |
 * | `field-message` | `${testId}-message` |
 *
 * The data attributes are those of `Field` and `Switch`. Use them, never the hashed class names.
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
 * // react-hook-form: spread the Controller's field
 * <Controller
 *   control={control}
 *   name="enabled"
 *   render={({ field, fieldState }) => (
 *     <SwitchField
 *       label="Send alerts"
 *       color="primary"
 *       error={fieldState.error?.message}
 *       {...field}
 *     />
 *   )}
 * />
 * ```
 */
export const SwitchField = SwitchFieldRoot as <T extends SwitchFieldProps>(
	props: Checked<SwitchFieldProps, HTMLSpanElement, T>,
) => ReactElement;
