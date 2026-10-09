/**
 * Keeps the hand-written props aligned with Base UI's. Each assertion fails the moment Base UI's
 * shape stops accepting ours.
 */
import type { CheckboxRootProps as UpstreamCheckboxProps } from '@base-ui/react/checkbox';
import type { CheckboxGroupProps as UpstreamCheckboxGroupProps } from '@base-ui/react/checkbox-group';
import type { RadioRootProps as UpstreamRadioProps } from '@base-ui/react/radio';
import type { RadioGroupProps as UpstreamRadioGroupProps } from '@base-ui/react/radio-group';
import { describe, expectTypeOf, test } from 'vitest';
import type { RadioCardsItemType, RadioCardsMultipleProps, RadioCardsProps } from '../types.js';

/** Instantiated with the value type `RadioCards` renders with. */
type UpstreamRadioGroup = UpstreamRadioGroupProps<string | null>;
type UpstreamRadio = UpstreamRadioProps<string>;

describe('RadioCardsProps against Base UI', () => {
	test('the group state props are what the primitive takes', () => {
		expectTypeOf<RadioCardsProps['disabled']>().toExtend<UpstreamRadioGroup['disabled']>();
		expectTypeOf<RadioCardsProps['readOnly']>().toExtend<UpstreamRadioGroup['readOnly']>();
		expectTypeOf<RadioCardsProps['required']>().toExtend<UpstreamRadioGroup['required']>();
		expectTypeOf<RadioCardsProps['name']>().toExtend<UpstreamRadioGroup['name']>();
		expectTypeOf<RadioCardsProps['form']>().toExtend<UpstreamRadioGroup['form']>();
	});

	test('the value props are what the primitive takes', () => {
		expectTypeOf<RadioCardsProps['value']>().toExtend<UpstreamRadioGroup['value']>();
		expectTypeOf<RadioCardsProps['defaultValue']>().toExtend<UpstreamRadioGroup['defaultValue']>();
	});

	test('onChange accepts every value a radio reports', () => {
		expectTypeOf<NonNullable<UpstreamRadio['value']>>().toExtend<
			Parameters<NonNullable<RadioCardsProps['onChange']>>[0]
		>();
	});

	test('the item props are what the radio takes', () => {
		expectTypeOf<RadioCardsItemType['value']>().toExtend<UpstreamRadio['value']>();
		expectTypeOf<RadioCardsItemType['disabled']>().toExtend<UpstreamRadio['disabled']>();
	});
});

describe('RadioCardsMultipleProps against Base UI', () => {
	test('the group props are what the primitive takes', () => {
		expectTypeOf<RadioCardsMultipleProps['disabled']>().toExtend<
			UpstreamCheckboxGroupProps['disabled']
		>();
	});

	// The lists are `readonly` here and mutable upstream. Base UI never writes to them, so the group
	// hands them over as they are, and only their entries have to match.
	test('the value props hold what the primitive takes', () => {
		expectTypeOf<NonNullable<RadioCardsMultipleProps['value']>[number]>().toExtend<
			NonNullable<UpstreamCheckboxGroupProps['value']>[number]
		>();
		expectTypeOf<NonNullable<RadioCardsMultipleProps['defaultValue']>[number]>().toExtend<
			NonNullable<UpstreamCheckboxGroupProps['defaultValue']>[number]
		>();
	});

	test('onChange accepts every list the group reports', () => {
		expectTypeOf<
			Parameters<NonNullable<UpstreamCheckboxGroupProps['onValueChange']>>[0]
		>().toExtend<Parameters<NonNullable<RadioCardsMultipleProps['onChange']>>[0]>();
	});

	test('the form props are what each checkbox takes', () => {
		expectTypeOf<RadioCardsMultipleProps['name']>().toExtend<UpstreamCheckboxProps['name']>();
		expectTypeOf<RadioCardsMultipleProps['form']>().toExtend<UpstreamCheckboxProps['form']>();
		expectTypeOf<RadioCardsMultipleProps['readOnly']>().toExtend<
			UpstreamCheckboxProps['readOnly']
		>();
		expectTypeOf<RadioCardsMultipleProps['required']>().toExtend<
			UpstreamCheckboxProps['required']
		>();
	});

	test('the item props are what the checkbox takes', () => {
		expectTypeOf<RadioCardsItemType['value']>().toExtend<UpstreamCheckboxProps['value']>();
		expectTypeOf<RadioCardsItemType['disabled']>().toExtend<UpstreamCheckboxProps['disabled']>();
	});
});
