/**
 * Keeps the hand-written `InputNumberProps` aligned with Base UI's `NumberField.Root`.
 *
 * The simple props (`min`, `step`, `name`, …) are declared directly rather than borrowed by
 * indexed access, because `number` reads better than an indexed lookup. Each assertion fails the
 * moment Base UI's shape stops accepting ours.
 */
import type { NumberFieldRootProps as UpstreamNumberFieldProps } from '@base-ui/react/number-field';
import { describe, expectTypeOf, test } from 'vitest';
import type { InputNumberProps } from '../types.js';

describe('InputNumberProps against Base UI', () => {
	test('the value props are what the primitive takes', () => {
		expectTypeOf<InputNumberProps['value']>().toExtend<UpstreamNumberFieldProps['value']>();
		expectTypeOf<InputNumberProps['defaultValue']>().toExtend<
			UpstreamNumberFieldProps['defaultValue']
		>();
	});

	test('the scale props are what the primitive takes', () => {
		expectTypeOf<InputNumberProps['min']>().toExtend<UpstreamNumberFieldProps['min']>();
		expectTypeOf<InputNumberProps['max']>().toExtend<UpstreamNumberFieldProps['max']>();
		expectTypeOf<InputNumberProps['step']>().toExtend<UpstreamNumberFieldProps['step']>();
		expectTypeOf<InputNumberProps['largeStep']>().toExtend<UpstreamNumberFieldProps['largeStep']>();
		expectTypeOf<InputNumberProps['snapOnStep']>().toExtend<
			UpstreamNumberFieldProps['snapOnStep']
		>();
	});

	test('the formatting props are what the primitive takes', () => {
		expectTypeOf<InputNumberProps['format']>().toExtend<UpstreamNumberFieldProps['format']>();
		expectTypeOf<InputNumberProps['locale']>().toExtend<UpstreamNumberFieldProps['locale']>();
	});

	test('the form props are what the primitive takes', () => {
		expectTypeOf<InputNumberProps['name']>().toExtend<UpstreamNumberFieldProps['name']>();
		expectTypeOf<InputNumberProps['form']>().toExtend<UpstreamNumberFieldProps['form']>();
		expectTypeOf<InputNumberProps['required']>().toExtend<UpstreamNumberFieldProps['required']>();
		expectTypeOf<InputNumberProps['disabled']>().toExtend<UpstreamNumberFieldProps['disabled']>();
		expectTypeOf<InputNumberProps['readOnly']>().toExtend<UpstreamNumberFieldProps['readOnly']>();
		expectTypeOf<InputNumberProps['id']>().toExtend<UpstreamNumberFieldProps['id']>();
	});
});
