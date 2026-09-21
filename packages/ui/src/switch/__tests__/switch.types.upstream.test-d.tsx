/**
 * Keeps the hand-written props aligned with Base UI's.
 *
 * `SwitchProps` declares the simple props (`disabled`, `name`, `required`, …) directly rather than
 * borrowing them by indexed access, because `boolean` and `string` read better than an indexed
 * lookup. The cost of writing a type by hand is that it can drift on an upgrade without anything
 * in this repo noticing, which is exactly what these assertions close: each one fails the moment
 * Base UI's shape stops accepting ours.
 */
import type { SwitchRootProps as UpstreamSwitchProps } from '@base-ui/react/switch';
import { describe, expectTypeOf, test } from 'vitest';
import type { SwitchProps } from '../types.js';

describe('SwitchProps against Base UI', () => {
	test('the state props are what the primitive takes', () => {
		expectTypeOf<SwitchProps['disabled']>().toExtend<UpstreamSwitchProps['disabled']>();
		expectTypeOf<SwitchProps['readOnly']>().toExtend<UpstreamSwitchProps['readOnly']>();
		expectTypeOf<SwitchProps['required']>().toExtend<UpstreamSwitchProps['required']>();
		expectTypeOf<SwitchProps['name']>().toExtend<UpstreamSwitchProps['name']>();
		expectTypeOf<SwitchProps['id']>().toExtend<UpstreamSwitchProps['id']>();
	});

	test('the checked props are what the primitive takes', () => {
		// `value`/`defaultValue` here are booleans that land on the primitive's
		// `checked`/`defaultChecked`; Base UI's own `value` is the submitted form string, which
		// this component does not expose.
		expectTypeOf<SwitchProps['value']>().toExtend<UpstreamSwitchProps['checked']>();
		expectTypeOf<SwitchProps['defaultValue']>().toExtend<UpstreamSwitchProps['defaultChecked']>();
	});

	test('onChange accepts every state the primitive reports', () => {
		expectTypeOf<Parameters<NonNullable<UpstreamSwitchProps['onCheckedChange']>>[0]>().toExtend<
			Parameters<NonNullable<SwitchProps['onChange']>>[0]
		>();
	});
});
