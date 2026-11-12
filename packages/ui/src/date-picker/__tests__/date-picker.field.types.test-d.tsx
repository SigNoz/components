/**
 * Type-level tests for the props of {@link DatePickerField}. Run by `vitest --typecheck` and by
 * `pnpm type-check`. See `field.types.test-d.tsx` for how the cases are written.
 */
import { createRef, type FocusEvent, type Ref } from 'react';
import { assertType, describe, test } from 'vitest';
import { DatePickerField } from '../presets/date-picker-field.js';

const triggerRef = createRef<HTMLButtonElement>();
declare const maybeError: string | undefined;
declare const maybeDisabled: boolean | undefined;
declare const controllerRef: Ref<HTMLButtonElement>;
/**
 * What react-hook-form's `Controller` and `useController` hand over as `field`, written out by
 * hand because the library does not depend on react-hook-form.
 */
type ReactHookFormField<Value> = {
	onChange: (...event: any[]) => void;
	onBlur: () => void;
	value: Value;
	name: string;
	ref: (instance: any) => void;
	disabled?: boolean;
};
declare const rhfField: ReactHookFormField<Date | undefined>;
declare const rhfNullableField: ReactHookFormField<Date | null>;
declare const isNullable: boolean;

describe('label and the date picker props', () => {
	test('takes the label with the props the date picker requires', () => {
		assertType(<DatePickerField label="Expiry" placeholder="Select date" />);
		// @ts-expect-error - a field exists to own its label
		assertType(<DatePickerField placeholder="Select date" />);
		// @ts-expect-error - the trigger shows a placeholder while there is no value
		assertType(<DatePickerField label="Expiry" />);
	});
});

describe('the field props', () => {
	test('takes the label parts, the description, the status and required', () => {
		assertType(
			<DatePickerField
				label="Expiry"
				labelIcon={<span />}
				labelTooltip={<b>Tip</b>}
				description={<i>Help</i>}
				error={maybeError}
				required
				placeholder="Select date"
				ref={triggerRef}
				testId="expiry"
				onBlur={(event: FocusEvent<HTMLElement>) => event.currentTarget}
			/>,
		);
	});

	test('a react-hook-form field is accepted as the props it spreads', () => {
		assertType(
			<DatePickerField label="Expiry" placeholder="Select date" {...rhfField} error={maybeError} />,
		);
		assertType(<DatePickerField label="Expiry" placeholder="Select date" ref={controllerRef} />);
	});

	test('disabled keeps its reason', () => {
		assertType(
			<DatePickerField
				label="Expiry"
				placeholder="Select date"
				disabled
				disabledTooltip="Ask an admin"
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a disabled date picker has to tell the user why
		assertType(<DatePickerField label="Expiry" placeholder="Select date" disabled />);
		// oxfmt-ignore
		// @ts-expect-error - a possibly undefined `disabled` is still `disabled`
		assertType(<DatePickerField label="Expiry" placeholder="Select date" disabled={maybeDisabled} />);
	});

	test('rejects a prop that is neither the field nor the date picker', () => {
		// oxfmt-ignore
		// @ts-expect-error - `htmlFor` is not accepted, the shorthand wires the id itself
		assertType(<DatePickerField label="Expiry" placeholder="Select date" htmlFor="x" />);
		// oxfmt-ignore
		// @ts-expect-error - `format` is antd, the date picker takes `formatValue`
		assertType(<DatePickerField label="Expiry" placeholder="Select date" format="YYYY-MM-DD" />);
	});
});

describe('nullable', () => {
	test('a react-hook-form field whose value can be null is accepted, with nullable', () => {
		assertType(
			<DatePickerField
				label="Expiry"
				placeholder="Select date"
				nullable
				{...rhfNullableField}
				error={maybeError}
			/>,
		);
	});

	test('takes null as the value and reports a date or null', () => {
		assertType(
			<DatePickerField
				label="Expiry"
				placeholder="Select date"
				nullable
				value={null}
				onChange={(value: Date | null) => value}
			/>,
		);
	});

	test('rejects a null value without nullable', () => {
		// oxfmt-ignore
		// @ts-expect-error - `null` needs `nullable`
		assertType(<DatePickerField label="Expiry" placeholder="Select date" {...rhfNullableField} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, leave it out instead of passing `false`
		assertType(<DatePickerField label="Expiry" placeholder="Select date" nullable={false} {...rhfNullableField} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, a `boolean` is not accepted
		assertType(<DatePickerField label="Expiry" placeholder="Select date" nullable={isNullable} {...rhfNullableField} />);
	});
});
