/**
 * Type-level tests for `nullable` on {@link RadioGroup} and {@link RadioGroupField}.
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
import { RadioGroupField } from '../presets/radio-group-field.js';
import { RadioGroup } from '../radio-group.js';
import type { RadioGroupItemType } from '../types.js';

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
declare const setString: Dispatch<SetStateAction<string>>;
declare const setNullableString: Dispatch<SetStateAction<string | null>>;
declare const maybeNullable: boolean;
declare const items: RadioGroupItemType[];

describe('nullable takes the field a Controller spreads', () => {
	test('whatever the value is', () => {
		assertType(
			<RadioGroupField label="Retention" color="primary" items={items} nullable {...stringField} />,
		);
		assertType(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={items}
				nullable
				{...nullableStringField}
			/>,
		);
		assertType(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={items}
				nullable
				{...optionalNullableStringField}
			/>,
		);
	});

	test('without nullable, as before', () => {
		assertType(
			<RadioGroupField label="Retention" color="primary" items={items} {...stringField} />,
		);
		assertType(
			<RadioGroupField label="Retention" color="primary" items={items} {...nullableStringField} />,
		);
	});

	test('next to the props of the group', () => {
		assertType(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={items}
				nullable
				error="Pick one"
				{...nullableStringField}
				testId="retention"
			/>,
		);
	});
});

describe('nullable and onChange', () => {
	test('hands onChange a value that can be null, so a nullable setter fits', () => {
		assertType(
			<RadioGroup
				color="primary"
				items={items}
				nullable
				value={null}
				onChange={setNullableString}
			/>,
		);
		assertType(
			<RadioGroup
				color="primary"
				items={items}
				nullable
				onChange={(v) => assertType<string | null>(v)}
			/>,
		);
	});

	test('rejects an onChange that cannot take null', () => {
		// oxfmt-ignore
		// @ts-expect-error - a nullable group's `onChange` takes `string | null`
		assertType(<RadioGroup color="primary" items={items} nullable onChange={setString} />);
	});

	test('rejects a nullable decided at run time', () => {
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, a `boolean` is not accepted
		assertType(<RadioGroup color="primary" items={items} nullable={maybeNullable} onChange={setNullableString} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, with a plain callback too
		assertType(<RadioGroup color="primary" items={items} nullable={maybeNullable} onChange={setString} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on the field shorthand too
		assertType(<RadioGroupField label="Retention" color="primary" items={items} nullable={maybeNullable} {...nullableStringField} />);
	});

	test('rejects nullable={false}, which is the same as leaving it out', () => {
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`
		assertType(<RadioGroup color="primary" items={items} nullable={false} value={null} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, with a plain callback too
		assertType(<RadioGroup color="primary" items={items} nullable={false} onChange={setString} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on the field shorthand too
		assertType(<RadioGroupField label="Retention" color="primary" items={items} nullable={false} {...nullableStringField} />);
	});

	test('keeps the plain callback without nullable', () => {
		assertType(<RadioGroup color="primary" items={items} onChange={setString} />);
		assertType(
			<RadioGroup color="primary" items={items} onChange={(v) => assertType<string>(v)} />,
		);
		assertType(
			<RadioGroup color="primary" items={items} value={null} onChange={setNullableString} />,
		);
	});

	test('rejects an onChange that cannot take null from the field shorthand too', () => {
		// oxfmt-ignore
		// @ts-expect-error - a nullable group's `onChange` takes `string | null`
		assertType(<RadioGroupField label="Retention" color="primary" items={items} nullable onChange={setString} />);
	});
});

describe('nullable and the other props', () => {
	test('rejects a prop the shorthand does not have', () => {
		// oxfmt-ignore
		// @ts-expect-error - `retention` is not a prop
		assertType(<RadioGroupField label="Retention" color="primary" items={items} nullable retention={1} {...nullableStringField} />);
	});

	test('still asks for the items and the color', () => {
		// oxfmt-ignore
		// @ts-expect-error - a radio group with no options is not allowed
		assertType(<RadioGroupField label="Retention" color="primary" nullable />);
		// oxfmt-ignore
		// @ts-expect-error - `color` has no default, it must be picked explicitly
		assertType(<RadioGroupField label="Retention" items={items} nullable />);
	});
});
