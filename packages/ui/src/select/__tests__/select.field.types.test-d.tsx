/**
 * Type-level tests for the props of {@link SelectField}. Run by `vitest --typecheck` and by
 * `pnpm type-check`. See `field.types.test-d.tsx` for how the cases are written.
 */
import { createRef, type Ref } from 'react';
import { assertType, describe, test } from 'vitest';
import { SelectField } from '../presets/select-field.js';
import type { SelectItemType } from '../types.js';

const ONE: SelectItemType[] = [{ type: 'item', value: 'a', label: 'A' }];
const selectRef = createRef<HTMLElement>();
declare const maybeError: string | undefined;
declare const maybeDisabled: boolean | undefined;
declare const controllerRef: Ref<HTMLElement>;

describe('label, items and placeholder', () => {
	test('all three are required', () => {
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} />);
		// oxfmt-ignore
		// @ts-expect-error - a field exists to own its label
		assertType(<SelectField placeholder="Pick" items={ONE} />);
		// oxfmt-ignore
		// @ts-expect-error - `items` is what the select lists, it cannot be left out
		assertType(<SelectField label="Framework" placeholder="Pick" />);
		// oxfmt-ignore
		// @ts-expect-error - the trigger has to show something while nothing is selected
		assertType(<SelectField label="Framework" items={ONE} />);
	});
});

describe('the field props', () => {
	test('takes the label parts and the description as nodes', () => {
		assertType(
			<SelectField
				label="Framework"
				placeholder="Pick"
				items={ONE}
				labelIcon={<span />}
				labelTooltip={<b>Tip</b>}
				description={<i>Help</i>}
				required
			/>,
		);
	});

	test('status and message travel together', () => {
		assertType(
			<SelectField
				label="Framework"
				placeholder="Pick"
				items={ONE}
				status="warning"
				message="Careful"
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a status with nothing to say belongs on the control itself
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} status="danger" />);
		// oxfmt-ignore
		// @ts-expect-error - the message row is a validation state, it takes its color from one
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} message="Careful" />);
	});

	test('error stands alone', () => {
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} error={maybeError} />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} error="Bad" status="danger" message="Bad" />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} error="Bad" message="Bad" />);
	});

	test('data-testid is spelled testId', () => {
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} testId="framework" />);
		// oxfmt-ignore
		// @ts-expect-error - `data-testid` is written as the `testId` prop
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} data-testid="framework" />);
	});

	test('htmlFor is not a prop', () => {
		// oxfmt-ignore
		// @ts-expect-error - the shorthand wires the control id itself
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} htmlFor="framework" />);
	});
});

describe('the select props', () => {
	test('takes a string for one value and reports a string', () => {
		assertType(
			<SelectField
				label="Framework"
				placeholder="Pick"
				items={ONE}
				value="a"
				onChange={(value: string) => value}
				displayValue={(item) => item?.label}
			/>,
		);
	});

	test('takes a string array with multiple and reports one', () => {
		assertType(
			<SelectField
				label="Framework"
				placeholder="Pick"
				multiple
				items={ONE}
				value={['a']}
				defaultValue={['a']}
				onChange={(value: string[]) => value}
				maxDisplayedPills={2}
				displayValue={(items) => `${items.length} selected`}
			/>,
		);
	});

	test('multiple still decides the shape of the value', () => {
		// oxfmt-ignore
		// @ts-expect-error - a single select holds one value
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} value={['a']} />);
		// oxfmt-ignore
		// @ts-expect-error - a multiple select holds an array
		assertType(<SelectField label="Framework" placeholder="Pick" multiple items={ONE} value="a" />);
		// oxfmt-ignore
		// @ts-expect-error - only a multiple select shows chips
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} maxDisplayedPills={2} />);
		// oxfmt-ignore
		// @ts-expect-error - a single select reports a string
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} onChange={(value: string[]) => value} />);
	});

	test('a Controller field is accepted as the props it spreads', () => {
		const field = { value: 'a', onChange: (value: string) => value, ref: controllerRef };

		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} {...field} />);
	});

	test('disabled and read-only keep their reasons', () => {
		assertType(
			<SelectField
				label="Framework"
				placeholder="Pick"
				items={ONE}
				disabled
				disabledTooltip="Ask an admin"
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a disabled select has to tell the user why
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} disabled />);
		// oxfmt-ignore
		// @ts-expect-error - a possibly undefined `disabled` is still `disabled`
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} disabled={maybeDisabled} />);
		// oxfmt-ignore
		// @ts-expect-error - a read-only select has to tell the user why
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} readOnly />);
		// oxfmt-ignore
		// @ts-expect-error - `readOnlyTooltip` only renders while `readOnly` is set
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} readOnlyTooltip="Why" />);
	});

	test('the ref is the trigger element', () => {
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} ref={selectRef} />);
		assertType(
			<SelectField label="Framework" placeholder="Pick" items={ONE} ref={controllerRef} />,
		);
	});

	test('takes aria-*, data-* and the sizes', () => {
		assertType(
			<SelectField
				label="Framework"
				placeholder="Pick"
				items={ONE}
				id="framework"
				aria-keyshortcuts="F"
				data-source="settings"
				width={240}
				maxWidth="100%"
				contentMaxHeight={200}
			/>,
		);
	});
});

describe('rejected props', () => {
	test('className and style are not props', () => {
		// oxfmt-ignore
		// @ts-expect-error - `className` is not a prop
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} className="x" />);
		// oxfmt-ignore
		// @ts-expect-error - `style` is not a prop
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} style={{}} />);
	});

	test('a prop that does not exist is rejected', () => {
		// oxfmt-ignore
		// @ts-expect-error - the label always sits above the select
		assertType(<SelectField label="Framework" placeholder="Pick" items={ONE} labelPlacement="right" />);
	});
});
