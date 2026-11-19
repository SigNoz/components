/**
 * Type-level tests for the props of {@link ColorPickerField}. Run by `vitest --typecheck` and by
 * `pnpm type-check`. See `field.types.test-d.tsx` for how the cases are written.
 */
import { createRef, type FocusEvent, type Ref } from 'react';
import { assertType, describe, test } from 'vitest';
import { ColorPickerField } from '../presets/color-picker-field.js';

const btn = <button type="button">Pick</button>;
const pickerRef = createRef<HTMLElement>();
declare const maybeError: string | undefined;
declare const maybeDisabled: boolean | undefined;
declare const controllerRef: Ref<HTMLElement>;
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
declare const rhfField: ReactHookFormField<string>;
declare const rhfNullableField: ReactHookFormField<string | null>;
declare const isNullable: boolean;

describe('label and the picker props', () => {
	test('takes the label with the props the picker requires', () => {
		assertType(
			<ColorPickerField label="Series color" nativeButton side="bottom" align="start">
				{btn}
			</ColorPickerField>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a field exists to own its label
		assertType(<ColorPickerField nativeButton side="bottom" align="start">{btn}</ColorPickerField>);
		// oxfmt-ignore
		// @ts-expect-error - placement is never incidental, the call site states the side
		assertType(<ColorPickerField label="Series color" nativeButton align="start">{btn}</ColorPickerField>);
	});
});

describe('the field props', () => {
	test('takes the label parts, the description, the status and required', () => {
		assertType(
			<ColorPickerField
				label="Series color"
				labelIcon={<span />}
				labelTooltip={<b>Tip</b>}
				description={<i>Help</i>}
				error={maybeError}
				required
				nativeButton
				side="bottom"
				align="start"
				ref={pickerRef}
				testId="series"
				onBlur={(event: FocusEvent<HTMLElement>) => event.currentTarget}
			>
				{btn}
			</ColorPickerField>,
		);
	});

	test('a react-hook-form field is accepted as the props it spreads', () => {
		assertType(
			<ColorPickerField
				label="Series color"
				nativeButton
				side="bottom"
				align="start"
				{...rhfField}
				error={maybeError}
			>
				{btn}
			</ColorPickerField>,
		);
		assertType(
			<ColorPickerField
				label="Series color"
				nativeButton
				side="bottom"
				align="start"
				ref={controllerRef}
			>
				{btn}
			</ColorPickerField>,
		);
	});

	test('disabled keeps its reason', () => {
		assertType(
			<ColorPickerField
				label="Series color"
				nativeButton
				side="bottom"
				align="start"
				disabled
				disabledTooltip="Ask an admin"
			>
				{btn}
			</ColorPickerField>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a disabled picker has to tell the user why
		assertType(<ColorPickerField label="Series color" nativeButton side="bottom" align="start" disabled>{btn}</ColorPickerField>);
		// oxfmt-ignore
		// @ts-expect-error - a possibly undefined `disabled` is still `disabled`
		assertType(<ColorPickerField label="Series color" nativeButton side="bottom" align="start" disabled={maybeDisabled}>{btn}</ColorPickerField>);
	});

	test('rejects a prop that is neither the field nor the picker', () => {
		// oxfmt-ignore
		// @ts-expect-error - `htmlFor` is not accepted, the shorthand wires the id itself
		assertType(<ColorPickerField label="Series color" nativeButton side="bottom" align="start" htmlFor="x">{btn}</ColorPickerField>);
		// oxfmt-ignore
		// @ts-expect-error - `placement` is antd, the picker takes `side` and `align`
		assertType(<ColorPickerField label="Series color" nativeButton side="bottom" align="start" placement="top">{btn}</ColorPickerField>);
	});
});

describe('nullable', () => {
	test('a react-hook-form field whose value can be null is accepted, with nullable', () => {
		assertType(
			<ColorPickerField
				label="Series color"
				nativeButton
				side="bottom"
				align="start"
				nullable
				{...rhfNullableField}
				error={maybeError}
			>
				{btn}
			</ColorPickerField>,
		);
	});

	test('takes null as the value and reports a string or null', () => {
		assertType(
			<ColorPickerField
				label="Series color"
				nativeButton
				side="bottom"
				align="start"
				nullable
				value={null}
				onChange={(value: string | null) => value}
			>
				{btn}
			</ColorPickerField>,
		);
	});

	test('rejects a null value without nullable', () => {
		// oxfmt-ignore
		// @ts-expect-error - `null` needs `nullable`
		assertType(<ColorPickerField label="Series color" nativeButton side="bottom" align="start" {...rhfNullableField}>{btn}</ColorPickerField>);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, leave it out instead of passing `false`
		assertType(<ColorPickerField label="Series color" nativeButton side="bottom" align="start" nullable={false} {...rhfNullableField}>{btn}</ColorPickerField>);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, a `boolean` is not accepted
		assertType(<ColorPickerField label="Series color" nativeButton side="bottom" align="start" nullable={isNullable} {...rhfNullableField}>{btn}</ColorPickerField>);
	});
});
