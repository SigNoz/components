/**
 * Type-level tests for `nullable` on {@link RadioCards}, `RadioCards.Multiple` and their field
 * shorthands.
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
import { RadioCardsField } from '../presets/radio-cards-field.js';
import { RadioCards } from '../radio-cards.js';
import type { RadioCardsItemType } from '../types.js';

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
declare const maybeClear: boolean;
declare const items: RadioCardsItemType[];

describe('nullable takes the field a Controller spreads', () => {
	test('on the single group, whatever the value is', () => {
		assertType(<RadioCardsField label="Signal" items={items} nullable {...stringField} />);
		assertType(<RadioCardsField label="Signal" items={items} nullable {...nullableStringField} />);
		assertType(
			<RadioCardsField label="Signal" items={items} nullable {...optionalNullableStringField} />,
		);
		assertType(
			<RadioCardsField label="Signal" items={items} nullable allowClear {...nullableStringField} />,
		);
	});

	test('on the single group without nullable, as before', () => {
		assertType(<RadioCardsField label="Signal" items={items} {...stringField} />);
		assertType(<RadioCardsField label="Signal" items={items} {...nullableStringField} />);
	});

	test('on the multiple group, with a list that can be null', () => {
		assertType(<RadioCardsField.Multiple label="Tools" items={items} nullable {...stringsField} />);
		assertType(
			<RadioCardsField.Multiple label="Tools" items={items} nullable {...nullableStringsField} />,
		);
		assertType(
			<RadioCardsField.Multiple
				label="Tools"
				items={items}
				nullable
				{...optionalNullableStringsField}
			/>,
		);
	});

	test('on the multiple group without nullable, a null list is refused', () => {
		assertType(<RadioCardsField.Multiple label="Tools" items={items} {...stringsField} />);
		// oxfmt-ignore
		// @ts-expect-error - `null` is not a value of the multiple group until it is `nullable`
		assertType(<RadioCardsField.Multiple label="Tools" items={items} {...nullableStringsField} />);
	});

	test('next to the error and the props of the cards', () => {
		assertType(
			<RadioCardsField
				label="Signal"
				items={items}
				nullable
				columns={2}
				error="Pick one"
				{...nullableStringField}
			/>,
		);
		assertType(
			<RadioCardsField.Multiple
				label="Tools"
				items={items}
				nullable
				error="Pick one"
				{...nullableStringsField}
			/>,
		);
	});
});

describe('nullable and onChange on the single group', () => {
	test('hands onChange a value that can be null, with or without allowClear', () => {
		assertType(
			<RadioCards
				aria-label="S"
				items={items}
				nullable
				value={null}
				onChange={setNullableString}
			/>,
		);
		assertType(
			<RadioCards aria-label="S" items={items} nullable allowClear onChange={setNullableString} />,
		);
		assertType(
			<RadioCards
				aria-label="S"
				items={items}
				nullable
				allowClear={false}
				onChange={setNullableString}
			/>,
		);
		assertType(
			<RadioCards
				aria-label="S"
				items={items}
				nullable
				allowClear={maybeClear}
				onChange={setNullableString}
			/>,
		);
		assertType(
			<RadioCards
				aria-label="S"
				items={items}
				nullable
				onChange={(v) => assertType<string | null>(v)}
			/>,
		);
	});

	test('rejects an onChange that cannot take null', () => {
		// oxfmt-ignore
		// @ts-expect-error - a nullable group's `onChange` takes `string | null`
		assertType(<RadioCards aria-label="S" items={items} nullable onChange={setString} />);
		// oxfmt-ignore
		// @ts-expect-error - a nullable group's `onChange` takes `string | null`, `allowClear` or not
		assertType(<RadioCards aria-label="S" items={items} nullable allowClear onChange={setString} />);
	});

	test('rejects a nullable decided at run time', () => {
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, a `boolean` is not accepted
		assertType(<RadioCards aria-label="S" items={items} nullable={maybeNullable} onChange={setNullableString} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, with a plain callback too
		assertType(<RadioCards aria-label="S" items={items} nullable={maybeNullable} onChange={setString} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on the field shorthand too
		assertType(<RadioCardsField label="Signal" items={items} nullable={maybeNullable} {...nullableStringField} />);
	});

	test('rejects nullable={false}, which is the same as leaving it out', () => {
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`
		assertType(<RadioCards aria-label="S" items={items} nullable={false} value={null} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, with `allowClear` too
		assertType(<RadioCards aria-label="S" items={items} nullable={false} allowClear onChange={setNullableString} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on the field shorthand too
		assertType(<RadioCardsField label="Signal" items={items} nullable={false} {...nullableStringField} />);
	});

	test('keeps the allowClear rule without nullable', () => {
		assertType(<RadioCards aria-label="S" items={items} onChange={setString} />);
		assertType(<RadioCards aria-label="S" items={items} allowClear={false} onChange={setString} />);
		assertType(<RadioCards aria-label="S" items={items} allowClear onChange={setNullableString} />);
		// oxfmt-ignore
		// @ts-expect-error - a group that can be emptied reports `null`
		assertType(<RadioCards aria-label="S" items={items} allowClear onChange={setString} />);
		// oxfmt-ignore
		// @ts-expect-error - `allowClear` typed `boolean` may empty the group
		assertType(<RadioCards aria-label="S" items={items} allowClear={maybeClear} onChange={setString} />);
	});
});

describe('nullable on the multiple group', () => {
	test('keeps onChange a list', () => {
		assertType(
			<RadioCards.Multiple
				aria-label="T"
				items={items}
				nullable
				value={null}
				onChange={setStrings}
			/>,
		);
		assertType(
			<RadioCards.Multiple
				aria-label="T"
				items={items}
				nullable
				allowClear
				onChange={(v) => assertType<string[]>(v)}
			/>,
		);
	});

	test('takes null as a value only while nullable', () => {
		assertType(<RadioCards.Multiple aria-label="T" items={items} nullable value={null} />);
		// oxfmt-ignore
		// @ts-expect-error - `null` is not a value of the multiple group until it is `nullable`
		assertType(<RadioCards.Multiple aria-label="T" items={items} value={null} />);
	});

	test('rejects a nullable decided at run time', () => {
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, a `boolean` is not accepted
		assertType(<RadioCards.Multiple aria-label="T" items={items} nullable={maybeNullable} value={null} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on the field shorthand too
		assertType(<RadioCardsField.Multiple label="Tools" items={items} nullable={maybeNullable} {...nullableStringsField} />);
	});

	test('rejects nullable={false}, which is the same as leaving it out', () => {
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`
		assertType(<RadioCards.Multiple aria-label="T" items={items} nullable={false} value={null} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on the field shorthand too
		assertType(<RadioCardsField.Multiple label="Tools" items={items} nullable={false} {...nullableStringsField} />);
	});

	test('does not turn the list into a single value', () => {
		// oxfmt-ignore
		// @ts-expect-error - `RadioCards.Multiple` holds the list of checked values
		assertType(<RadioCards.Multiple aria-label="T" items={items} nullable value="logs" />);
	});
});

describe('nullable and the other props', () => {
	test('rejects a prop the shorthand does not have', () => {
		// oxfmt-ignore
		// @ts-expect-error - `signals` is not a prop
		assertType(<RadioCardsField label="Signal" items={items} nullable signals={1} {...nullableStringField} />);
		// oxfmt-ignore
		// @ts-expect-error - `signals` is not a prop
		assertType(<RadioCardsField.Multiple label="Tools" items={items} nullable signals={1} {...nullableStringsField} />);
	});

	test('still asks for the items', () => {
		// oxfmt-ignore
		// @ts-expect-error - a group with nothing to pick from is not allowed
		assertType(<RadioCardsField label="Signal" nullable />);
	});
});
