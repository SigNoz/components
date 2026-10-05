/**
 * Keeps the hand-written props aligned with Base UI's.
 *
 * `SliderProps` declares the simple props (`min`, `step`, `name`, …) directly rather than borrowing
 * them by indexed access, because `number` and `string` read better than an indexed lookup. Each
 * assertion fails the moment Base UI's shape stops accepting ours.
 */
import type { SliderRootProps as UpstreamSliderProps } from '@base-ui/react/slider';
import { describe, expectTypeOf, test } from 'vitest';
import type { SliderProps, SliderRangeProps } from '../types.js';

describe('SliderProps against Base UI', () => {
	test('the scale and form props are what the primitive takes', () => {
		expectTypeOf<SliderProps['min']>().toExtend<UpstreamSliderProps['min']>();
		expectTypeOf<SliderProps['max']>().toExtend<UpstreamSliderProps['max']>();
		expectTypeOf<SliderProps['step']>().toExtend<UpstreamSliderProps['step']>();
		expectTypeOf<SliderProps['name']>().toExtend<UpstreamSliderProps['name']>();
		expectTypeOf<SliderProps['form']>().toExtend<UpstreamSliderProps['form']>();
		expectTypeOf<SliderProps['disabled']>().toExtend<UpstreamSliderProps['disabled']>();
		expectTypeOf<SliderProps['id']>().toExtend<UpstreamSliderProps['id']>();
	});

	test('the values are what the primitive takes', () => {
		expectTypeOf<SliderProps['value']>().toExtend<UpstreamSliderProps<number>['value']>();
		expectTypeOf<SliderRangeProps['value']>().toExtend<
			UpstreamSliderProps<readonly number[]>['value']
		>();
	});
});
