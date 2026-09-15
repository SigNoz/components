/**
 * Keeps the hand-written props aligned with Base UI's.
 *
 * `RadioGroupProps` declares the simple props (`disabled`, `name`, `value`, …) directly rather than
 * borrowing them by indexed access, because `boolean` and `string` read better than an indexed
 * lookup. The cost of writing a type by hand is that it can drift on an upgrade without anything in
 * this repo noticing, which is exactly what these assertions close: each one fails the moment Base
 * UI's shape stops accepting ours.
 */
import type { RadioRootProps as UpstreamRadioProps } from '@base-ui/react/radio';
import type { RadioGroupProps as UpstreamRadioGroupProps } from '@base-ui/react/radio-group';
import { describe, expectTypeOf, test } from 'vitest';
import type { RadioGroupItemType, RadioGroupProps } from '../types.js';

/** Instantiated with the value type `RadioGroup` renders with. */
type Upstream = UpstreamRadioGroupProps<string | null>;
type UpstreamRadio = UpstreamRadioProps<string>;

type UpstreamChangeValue = Parameters<NonNullable<Upstream['onValueChange']>>[0];

describe('RadioGroupProps against Base UI', () => {
	test('the group state props are what the primitive takes', () => {
		expectTypeOf<RadioGroupProps['disabled']>().toExtend<Upstream['disabled']>();
		expectTypeOf<RadioGroupProps['readOnly']>().toExtend<Upstream['readOnly']>();
		expectTypeOf<RadioGroupProps['required']>().toExtend<Upstream['required']>();
		expectTypeOf<RadioGroupProps['name']>().toExtend<Upstream['name']>();
	});

	test('the value props are what the primitive takes', () => {
		expectTypeOf<RadioGroupProps['value']>().toExtend<Upstream['value']>();
		expectTypeOf<RadioGroupProps['defaultValue']>().toExtend<Upstream['defaultValue']>();
	});

	test('onChange accepts every value a radio reports', () => {
		// The group's own `onValueChange` is typed `string | null`, because the generic that carries
		// the empty `value` carries the change too. Only a radio reports a change, and it reports its
		// own `value`, so that is the type the handler has to take.
		expectTypeOf<NonNullable<UpstreamRadio['value']>>().toExtend<
			Parameters<NonNullable<RadioGroupProps['onChange']>>[0]
		>();
	});

	test('the empty value is the only thing the handler does not take', () => {
		expectTypeOf<UpstreamChangeValue>().toExtend<
			Parameters<NonNullable<RadioGroupProps['onChange']>>[0] | null
		>();
	});
});

describe('RadioGroupItemType against Base UI', () => {
	test('the item props are what the radio takes', () => {
		expectTypeOf<RadioGroupItemType['value']>().toExtend<UpstreamRadio['value']>();
		expectTypeOf<RadioGroupItemType['disabled']>().toExtend<UpstreamRadio['disabled']>();
	});
});
