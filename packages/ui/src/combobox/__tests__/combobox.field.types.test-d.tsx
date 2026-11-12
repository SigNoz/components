/**
 * Type-level tests for the props of {@link ComboboxField}. Run by `vitest --typecheck` and by
 * `pnpm type-check`. See `combobox.types.test-d.tsx` for how the cases are written.
 *
 * The comment suppresses the line directly below it. `oxfmt-ignore` keeps that line whole: once
 * oxfmt breaks the props one per line, a prop-level error moves off the suppressed line and the
 * comment stops covering it.
 */
import { createRef, type FocusEvent } from 'react';
import { assertType, describe, test } from 'vitest';
import { ComboboxField } from '../index.js';
import type { ComboboxFieldProps, ComboboxItemType } from '../types.js';

const ONE: ComboboxItemType[] = [{ type: 'item', value: 'a', label: 'A' }];
const triggerRef = createRef<HTMLElement>();
declare const maybeError: string | undefined;
declare const maybeDisabled: boolean | undefined;
declare const field: {
	value: string | undefined;
	onChange: (...event: unknown[]) => void;
	ref: (instance: HTMLElement | null) => void;
};

describe('field props and combobox props together', () => {
	test('takes the label with the props of the combobox', () => {
		assertType(
			<ComboboxField
				label="Framework"
				description="The stack of the service"
				labelTooltip="Picked once"
				required
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				testId="framework"
				ref={triggerRef}
			/>,
		);
	});

	test('requires the label, the items, the placeholder and the search row', () => {
		// oxfmt-ignore
		// @ts-expect-error - a field exists to own its label
		assertType(<ComboboxField placeholder="Pick" searchInputProps={{ placeholder: 'Search' }} items={ONE} />);
		// oxfmt-ignore
		// @ts-expect-error - `items` is what the combobox lists
		assertType(<ComboboxField label="Framework" placeholder="Pick" searchInputProps={{ placeholder: 'Search' }} />);
		// oxfmt-ignore
		// @ts-expect-error - the trigger has to show something while nothing is selected
		assertType(<ComboboxField label="Framework" searchInputProps={{ placeholder: 'Search' }} items={ONE} />);
		// oxfmt-ignore
		// @ts-expect-error - the search row is always there, so `searchInputProps` cannot be left out
		assertType(<ComboboxField label="Framework" placeholder="Pick" items={ONE} />);
	});

	test('accepts the spread of a Controller field that the combobox accepts', () => {
		assertType(
			<ComboboxField
				label="Framework"
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				{...field}
				error={maybeError}
			/>,
		);
	});

	test('exposes the props type', () => {
		assertType<ComboboxFieldProps>({
			label: 'Framework',
			placeholder: 'Pick',
			searchInputProps: { placeholder: 'Search' },
			items: ONE,
		});
	});
});

describe('onBlur', () => {
	test('takes the blur event, or no parameter at all', () => {
		assertType(
			<ComboboxField
				label="Framework"
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				onBlur={(event: FocusEvent<HTMLElement>) => event.relatedTarget}
			/>,
		);
		assertType(
			<ComboboxField
				label="Framework"
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				onBlur={() => undefined}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - the event comes from the trigger or the popup, never from an input
		assertType(<ComboboxField label="Framework" placeholder="Pick" searchInputProps={{ placeholder: 'Search' }} items={ONE} onBlur={(event: FocusEvent<HTMLInputElement>) => event.currentTarget.value} />);
	});
});

describe('multiple still narrows value, onChange and maxDisplayedPills', () => {
	test('takes a string with a single combobox and an array with multiple', () => {
		assertType(
			<ComboboxField
				label="Framework"
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				value="a"
				defaultValue="a"
				onChange={(value: string | undefined) => value}
			/>,
		);
		assertType(
			<ComboboxField
				label="Frameworks"
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				items={ONE}
				value={['a']}
				defaultValue={['a']}
				onChange={(value: string[]) => value}
				maxDisplayedPills={2}
			/>,
		);
	});

	test('rejects an array without multiple', () => {
		assertType(
			// @ts-expect-error - a single combobox holds one value
			<ComboboxField
				label="Framework"
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				value={['a']}
			/>,
		);
	});

	test('rejects a string with multiple', () => {
		assertType(
			// @ts-expect-error - a multiple combobox holds an array
			<ComboboxField
				label="Frameworks"
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				items={ONE}
				value="a"
			/>,
		);
	});

	test('rejects maxDisplayedPills without multiple', () => {
		assertType(
			// @ts-expect-error - only a multiple combobox shows chips
			<ComboboxField
				label="Framework"
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				maxDisplayedPills={2}
			/>,
		);
	});
});

describe('field rules', () => {
	test('status and message travel together', () => {
		assertType(
			<ComboboxField
				label="Framework"
				status="warning"
				message="Deprecated"
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a status with nothing to say belongs on the control itself
		assertType(<ComboboxField label="Framework" status="danger" placeholder="Pick" searchInputProps={{ placeholder: 'Search' }} items={ONE} />);
		// oxfmt-ignore
		// @ts-expect-error - the message row is a validation state, it takes its color from one
		assertType(<ComboboxField label="Framework" message="Taken" placeholder="Pick" searchInputProps={{ placeholder: 'Search' }} items={ONE} />);
	});

	test('error stands alone', () => {
		assertType(
			<ComboboxField
				label="Framework"
				error={maybeError}
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<ComboboxField label="Framework" error="Taken" status="danger" message="Taken" placeholder="Pick" searchInputProps={{ placeholder: 'Search' }} items={ONE} />);
	});

	test('htmlFor is not a prop, the shorthand wires the id', () => {
		// oxfmt-ignore
		// @ts-expect-error - the shorthand points the label at the trigger itself
		assertType(<ComboboxField label="Framework" htmlFor="framework" placeholder="Pick" searchInputProps={{ placeholder: 'Search' }} items={ONE} />);
	});

	test('data-testid is spelled testId', () => {
		// oxfmt-ignore
		// @ts-expect-error - `data-testid` is written as the `testId` prop
		assertType(<ComboboxField label="Framework" data-testid="framework" placeholder="Pick" searchInputProps={{ placeholder: 'Search' }} items={ONE} />);
	});

	test('a prop that does not exist is rejected', () => {
		// oxfmt-ignore
		// @ts-expect-error - the message always sits below the control
		assertType(<ComboboxField label="Framework" messagePlacement="top" placeholder="Pick" searchInputProps={{ placeholder: 'Search' }} items={ONE} />);
	});

	test('className and style are not props of the combobox', () => {
		// oxfmt-ignore
		// @ts-expect-error - the size comes from `width` and `maxWidth`
		assertType(<ComboboxField label="Framework" className="styled" placeholder="Pick" searchInputProps={{ placeholder: 'Search' }} items={ONE} />);
	});
});

describe('combobox rules', () => {
	test('disabled travels with its tooltip', () => {
		assertType(
			<ComboboxField
				label="Framework"
				disabled
				disabledTooltip="Locked by the plan"
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a disabled control has to tell the user why it cannot be used
		assertType(<ComboboxField label="Framework" disabled placeholder="Pick" searchInputProps={{ placeholder: 'Search' }} items={ONE} />);
		assertType(
			<ComboboxField
				label="Framework"
				disabled={maybeDisabled}
				disabledTooltip={undefined}
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
			/>,
		);
	});

	test('readOnly travels with its tooltip', () => {
		// oxfmt-ignore
		// @ts-expect-error - a read-only control has to tell the user why it cannot be changed
		assertType(<ComboboxField label="Framework" readOnly placeholder="Pick" searchInputProps={{ placeholder: 'Search' }} items={ONE} />);
	});

	test('status and required belong to the field, not to the combobox', () => {
		assertType(
			<ComboboxField
				label="Framework"
				required={false}
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
			/>,
		);
	});
});
