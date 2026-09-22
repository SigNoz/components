/**
 * Keeps the hand-written props aligned with Base UI's.
 *
 * `CheckboxProps` declares the simple props (`disabled`, `name`, `required`, …) directly rather
 * than borrowing them by indexed access, because `boolean` and `string` read better than an indexed
 * lookup. The cost of writing a type by hand is that it can drift on an upgrade without anything
 * in this repo noticing, which is exactly what these assertions close: each one fails the moment
 * Base UI's shape stops accepting ours.
 */
import type { CheckboxRootProps as UpstreamCheckboxProps } from '@base-ui/react/checkbox';
import { describe, expectTypeOf, test } from 'vitest';
import type { CheckboxProps } from '../types.js';

describe('CheckboxProps against Base UI', () => {
	test('the state props are what the primitive takes', () => {
		expectTypeOf<CheckboxProps['disabled']>().toExtend<UpstreamCheckboxProps['disabled']>();
		expectTypeOf<CheckboxProps['readOnly']>().toExtend<UpstreamCheckboxProps['readOnly']>();
		expectTypeOf<CheckboxProps['required']>().toExtend<UpstreamCheckboxProps['required']>();
		expectTypeOf<CheckboxProps['name']>().toExtend<UpstreamCheckboxProps['name']>();
		expectTypeOf<CheckboxProps['id']>().toExtend<UpstreamCheckboxProps['id']>();
		expectTypeOf<CheckboxProps['indeterminate']>().toExtend<
			UpstreamCheckboxProps['indeterminate']
		>();
	});

	test('the checked props are what the primitive takes', () => {
		// `value`/`defaultValue` here are booleans that land on the primitive's
		// `checked`/`defaultChecked`; Base UI's own `value` is the submitted form string, which
		// this component does not expose.
		expectTypeOf<CheckboxProps['value']>().toExtend<UpstreamCheckboxProps['checked']>();
		expectTypeOf<CheckboxProps['defaultValue']>().toExtend<
			UpstreamCheckboxProps['defaultChecked']
		>();
	});

	test('onChange accepts every state the primitive reports', () => {
		expectTypeOf<Parameters<NonNullable<UpstreamCheckboxProps['onCheckedChange']>>[0]>().toExtend<
			Parameters<NonNullable<CheckboxProps['onChange']>>[0]
		>();
	});
});
