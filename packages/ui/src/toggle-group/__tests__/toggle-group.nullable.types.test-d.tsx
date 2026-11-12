/**
 * Type-level tests for `nullable` on {@link ToggleGroup} and {@link ToggleGroupField}.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * The react-hook-form `field` is written out by hand, since the library does not depend on it.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it: it either
 * compiles, or it is marked `@ts-expect-error` because we refuse that combination. The comment
 * suppresses the line directly below it, and `oxfmt-ignore` keeps that line whole.
 */
import type { Dispatch, SetStateAction } from 'react';
import { assertType, describe, test } from 'vitest';
import { ToggleGroupField } from '../presets/toggle-group-field.js';
import { ToggleGroup } from '../toggle-group.js';
import type { ToggleGroupItemProps } from '../types.js';

type ControllerField<T> = {
	onChange: (...event: any[]) => void;
	onBlur: () => void;
	value: T;
	name: string;
	ref: (instance: any) => void;
	disabled?: boolean;
};

declare const stringField: ControllerField<string>;
declare const nullableStringField: ControllerField<string | null>;
declare const optionalNullableStringField: ControllerField<string | null | undefined>;
declare const stringsField: ControllerField<string[]>;
declare const nullableStringsField: ControllerField<string[] | null>;
declare const optionalNullableStringsField: ControllerField<string[] | null | undefined>;
declare const setString: Dispatch<SetStateAction<string>>;
declare const setNullableString: Dispatch<SetStateAction<string | null>>;
declare const setStrings: Dispatch<SetStateAction<string[]>>;
declare const maybeNullable: boolean;
declare const items: ToggleGroupItemProps[];

describe('nullable takes the field a Controller spreads', () => {
	test('on a single bar, whatever the value is', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				nullable
				{...stringField}
			/>,
		);
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				nullable
				{...nullableStringField}
			/>,
		);
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				nullable
				{...optionalNullableStringField}
			/>,
		);
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				nullable
				allowClear
				{...nullableStringField}
			/>,
		);
	});

	test('on a single bar without nullable, a null value is refused', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				{...stringField}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - `null` is not a value of the single bar until it is `nullable`
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} {...nullableStringField} />);
	});

	test('on a multiple bar, with a list that can be null', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				nullable
				{...stringsField}
			/>,
		);
		assertType(
			<ToggleGroupField
				label="Layout"
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				nullable
				{...nullableStringsField}
			/>,
		);
		assertType(
			<ToggleGroupField
				label="Layout"
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				nullable
				{...optionalNullableStringsField}
			/>,
		);
	});

	test('on a multiple bar without nullable, a null list is refused', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				{...stringsField}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - `null` is not a value of the multiple bar until it is `nullable`
		assertType(<ToggleGroupField label="Layout" type="multiple" variant="outlined" color="secondary" size="md" items={items} {...nullableStringsField} />);
	});

	test('next to the error and the props of the bar', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				nullable
				error="Pick one"
				{...nullableStringField}
				testId="layout"
			/>,
		);
	});
});

describe('nullable and onChange on a single bar', () => {
	test('hands onChange a value that can be null', () => {
		assertType(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				nullable
				value={null}
				onChange={setNullableString}
			/>,
		);
		assertType(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				nullable
				allowClear
				onChange={(v) => assertType<string | null>(v)}
			/>,
		);
	});

	test('rejects an onChange that cannot take null', () => {
		// oxfmt-ignore
		// @ts-expect-error - a nullable bar's `onChange` takes `string | null`
		assertType(<ToggleGroup type="single" variant="outlined" color="secondary" size="md" items={items} nullable onChange={setString} />);
	});

	test('rejects a nullable decided at run time', () => {
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, a `boolean` is not accepted
		assertType(<ToggleGroup type="single" variant="outlined" color="secondary" size="md" items={items} nullable={maybeNullable} onChange={setNullableString} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, with a plain callback too
		assertType(<ToggleGroup type="single" variant="outlined" color="secondary" size="md" items={items} nullable={maybeNullable} onChange={setString} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on the field shorthand too
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} nullable={maybeNullable} {...nullableStringField} />);
	});

	test('rejects nullable={false}, which is the same as leaving it out', () => {
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`
		assertType(<ToggleGroup type="single" variant="outlined" color="secondary" size="md" items={items} nullable={false} value={null} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, with `allowClear` too
		assertType(<ToggleGroup type="single" variant="outlined" color="secondary" size="md" items={items} nullable={false} allowClear onChange={setString} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on the field shorthand too
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} nullable={false} {...nullableStringField} />);
	});

	test('keeps the plain callback without nullable', () => {
		assertType(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				onChange={setString}
			/>,
		);
		assertType(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				allowClear
				onChange={(v) => assertType<string>(v)}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - without `nullable` the empty bar is the empty string
		assertType(<ToggleGroup type="single" variant="outlined" color="secondary" size="md" items={items} value={null} />);
	});

	test('does not turn the single value into a list', () => {
		// oxfmt-ignore
		// @ts-expect-error - a `single` bar holds one value, use `type="multiple"` for several
		assertType(<ToggleGroup type="single" variant="outlined" color="secondary" size="md" items={items} nullable value={['list']} />);
	});
});

describe('nullable on a multiple bar', () => {
	test('keeps onChange a list', () => {
		assertType(
			<ToggleGroup
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				nullable
				value={null}
				onChange={setStrings}
			/>,
		);
		assertType(
			<ToggleGroup
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				nullable
				allowClear
				onChange={(v) => assertType<string[]>(v)}
			/>,
		);
	});

	test('takes null as a value only while nullable', () => {
		// oxfmt-ignore
		// @ts-expect-error - `null` is not a value of the multiple bar until it is `nullable`
		assertType(<ToggleGroup type="multiple" variant="outlined" color="secondary" size="md" items={items} value={null} />);
	});

	test('rejects a nullable decided at run time', () => {
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, a `boolean` is not accepted
		assertType(<ToggleGroup type="multiple" variant="outlined" color="secondary" size="md" items={items} nullable={maybeNullable} value={null} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on the field shorthand too
		assertType(<ToggleGroupField label="Layout" type="multiple" variant="outlined" color="secondary" size="md" items={items} nullable={maybeNullable} {...nullableStringsField} />);
	});

	test('rejects nullable={false}, which is the same as leaving it out', () => {
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`
		assertType(<ToggleGroup type="multiple" variant="outlined" color="secondary" size="md" items={items} nullable={false} value={null} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on the field shorthand too
		assertType(<ToggleGroupField label="Layout" type="multiple" variant="outlined" color="secondary" size="md" items={items} nullable={false} {...nullableStringsField} />);
	});

	test('does not turn the list into a single value', () => {
		// oxfmt-ignore
		// @ts-expect-error - a `multiple` bar holds the list of pressed values
		assertType(<ToggleGroup type="multiple" variant="outlined" color="secondary" size="md" items={items} nullable value="list" />);
	});
});

describe('nullable and the other props', () => {
	test('rejects a prop the shorthand does not have', () => {
		// oxfmt-ignore
		// @ts-expect-error - `layouts` is not a prop
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} nullable layouts={1} {...nullableStringField} />);
	});

	test('still asks for the type and the items', () => {
		// oxfmt-ignore
		// @ts-expect-error - `type` has no default, it must be picked explicitly
		assertType(<ToggleGroupField label="Layout" variant="outlined" color="secondary" size="md" items={items} nullable />);
		// oxfmt-ignore
		// @ts-expect-error - a bar with no buttons is not a bar
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" nullable />);
	});
});
