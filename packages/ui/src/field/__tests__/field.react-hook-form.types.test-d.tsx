/**
 * Type-level tests for the `field` object react-hook-form hands to the `render` of a `Controller`,
 * spread on the shorthands that wrap a group or a slider: `<RadioGroupField {...field} />`.
 *
 * The library does not depend on react-hook-form, so the shape is written out here from its
 * `ControllerRenderProps` (7.7x). `onChange` and `ref` take `any`, which is what makes them fit
 * every control, and `disabled` is optional.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it, and it
 * has to compile.
 */
import { assertType, describe, test } from 'vitest';
import { RadioCardsField } from '../../radio-cards/presets/radio-cards-field.js';
import type { RadioCardsItemType } from '../../radio-cards/types.js';
import { RadioGroupField } from '../../radio-group/presets/radio-group-field.js';
import type { RadioGroupItemType } from '../../radio-group/types.js';
import { SliderField } from '../../slider/presets/slider-field.js';
import { ToggleGroupField } from '../../toggle-group/presets/toggle-group-field.js';
import type { ToggleGroupItemProps } from '../../toggle-group/types.js';

type ControllerField<T> = {
	onChange: (...event: any[]) => void;
	onBlur: () => void;
	value: T;
	name: string;
	ref: (instance: any) => void;
	disabled?: boolean;
};

declare const stringField: ControllerField<string>;
declare const optionalStringField: ControllerField<string | undefined>;
declare const nullableStringField: ControllerField<string | null>;
declare const stringsField: ControllerField<string[]>;
declare const optionalStringsField: ControllerField<string[] | undefined>;
declare const numberField: ControllerField<number>;
declare const optionalNumberField: ControllerField<number | undefined>;
declare const rangeField: ControllerField<[number, number]>;
declare const optionalRangeField: ControllerField<[number, number] | undefined>;
declare const maybeError: string | undefined;
declare const radioItems: RadioGroupItemType[];
declare const cardItems: RadioCardsItemType[];
declare const toggleItems: ToggleGroupItemProps[];

describe('RadioGroupField takes the field a Controller spreads', () => {
	test('whatever the value is', () => {
		assertType(
			<RadioGroupField label="Retention" color="primary" items={radioItems} {...stringField} />,
		);
		assertType(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={radioItems}
				{...optionalStringField}
			/>,
		);
		assertType(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={radioItems}
				{...nullableStringField}
			/>,
		);
	});

	test('next to the error and the props of the group', () => {
		assertType(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={radioItems}
				error={maybeError}
				{...stringField}
				testId="retention"
			/>,
		);
	});
});

describe('RadioCardsField takes the field a Controller spreads', () => {
	test('whatever the value is', () => {
		assertType(<RadioCardsField label="Signal" items={cardItems} {...stringField} />);
		assertType(<RadioCardsField label="Signal" items={cardItems} {...optionalStringField} />);
		assertType(<RadioCardsField label="Signal" items={cardItems} {...nullableStringField} />);
	});

	test('next to the error and the props of the cards', () => {
		assertType(
			<RadioCardsField
				label="Signal"
				items={cardItems}
				columns={2}
				error={maybeError}
				{...stringField}
			/>,
		);
	});

	test('on the multiple group, with a list', () => {
		assertType(<RadioCardsField.Multiple label="Tools" items={cardItems} {...stringsField} />);
		assertType(
			<RadioCardsField.Multiple label="Tools" items={cardItems} {...optionalStringsField} />,
		);
		assertType(
			<RadioCardsField.Multiple
				label="Tools"
				items={cardItems}
				error={maybeError}
				{...stringsField}
			/>,
		);
	});
});

describe('ToggleGroupField takes the field a Controller spreads', () => {
	test('on a single bar, with a string', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={toggleItems}
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
				items={toggleItems}
				{...optionalStringField}
			/>,
		);
	});

	test('on a multiple bar, with a list', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={toggleItems}
				error={maybeError}
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
				items={toggleItems}
				{...optionalStringsField}
			/>,
		);
	});
});

describe('SliderField takes the field a Controller spreads', () => {
	test('with a number', () => {
		assertType(<SliderField label="Sampling rate" color="primary" {...numberField} />);
		assertType(<SliderField label="Sampling rate" color="primary" {...optionalNumberField} />);
		assertType(
			<SliderField label="Sampling rate" color="primary" error={maybeError} {...numberField} />,
		);
	});

	test('on the range, with a pair', () => {
		assertType(<SliderField.Range label="Duration" color="primary" {...rangeField} />);
		assertType(<SliderField.Range label="Duration" color="primary" {...optionalRangeField} />);
		assertType(
			<SliderField.Range label="Duration" color="primary" error={maybeError} {...rangeField} />,
		);
	});
});
