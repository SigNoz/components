/**
 * Type-level tests for the props of {@link Combobox}. Run by `vitest --typecheck` and by
 * `pnpm type-check`. See `dropdown.types.test-d.tsx` for how the cases are written.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Combobox } from '../combobox.js';
import type {
	ComboboxGroupItemType,
	ComboboxHintItemType,
	ComboboxItemType,
	ComboboxOptionItemType,
} from '../types.js';

const ONE: ComboboxItemType[] = [{ type: 'item', value: 'a', label: 'A' }];
const ref = createRef<HTMLElement>();

describe('root props', () => {
	test('accepts items and the two placeholders, plus a ref', () => {
		assertType(
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				ref={ref}
			/>,
		);
	});

	test('rejects a combobox with nothing in it', () => {
		assertType(
			// @ts-expect-error - `items` is what the combobox lists, it cannot be left out
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
			/>,
		);
	});

	test('rejects a combobox with no placeholder', () => {
		assertType(
			// @ts-expect-error - the trigger has to show something while nothing is selected
			<Combobox searchInputProps={{ placeholder: 'Search' }} items={ONE} />,
		);
	});

	test('rejects a combobox with no search row props', () => {
		assertType(
			// @ts-expect-error - the search row is always there, so `searchInputProps` cannot be left out
			<Combobox placeholder="Pick" items={ONE} />,
		);
	});

	test('rejects a search row with no placeholder', () => {
		assertType(
			<Combobox
				placeholder="Pick"
				items={ONE}
				// @ts-expect-error - the search row has to tell the user what it searches
				searchInputProps={{ filter: false }}
			/>,
		);
	});

	test('rejects className and style, the size comes from width and maxWidth', () => {
		assertType(
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				// @ts-expect-error - `className` is not a prop
				className="x"
			/>,
		);
		assertType(
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				// @ts-expect-error - `style` is not a prop
				style={{}}
			/>,
		);
	});

	test('rejects a raw data-testid', () => {
		assertType(
			// @ts-expect-error - the prop is called `testId`
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				data-testid="c"
			/>,
		);
	});

	test('rejects the props ComboboxSimple had', () => {
		assertType(
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				// @ts-expect-error - `groups` is now a `group` row in `items`
				groups={[]}
			/>,
		);
		assertType(
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				// @ts-expect-error - `withPortal` is now `container`
				withPortal={false}
			/>,
		);
		assertType(
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				// @ts-expect-error - `inputPlaceholder` is now `searchInputProps.placeholder`
				inputPlaceholder="Search"
			/>,
		);
		assertType(
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				// @ts-expect-error - a story or a test holds it open with `ForceOpenProvider`
				open
			/>,
		);
	});

	test('accepts width, maxWidth and the popup sizes as a number or a string', () => {
		assertType(
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				width={240}
				maxWidth="100%"
				contentMaxWidth={280}
				contentMaxHeight="10rem"
			/>,
		);
	});
});

describe('value', () => {
	test('takes a string, and reports a string or undefined', () => {
		assertType(
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				value="a"
				onChange={(value: string | undefined) => value}
				displayValue={(item) => item?.label}
			/>,
		);
	});

	test('takes a string array with multiple, and reports one', () => {
		assertType(
			<Combobox
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
			<Combobox
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
			<Combobox
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
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				maxDisplayedPills={2}
			/>,
		);
	});

	test('rejects displayValue with multiple', () => {
		assertType(
			// @ts-expect-error - a multiple combobox shows chips, not one value
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				items={ONE}
				displayValue={() => 'x'}
			/>,
		);
	});
});

describe('disabled and readOnly', () => {
	test('rejects a disabled combobox with no reason', () => {
		assertType(
			// @ts-expect-error - a disabled combobox has to tell the user why
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				disabled
			/>,
		);
	});

	test('rejects a disabled reason with no disabled', () => {
		assertType(
			// @ts-expect-error - `disabledTooltip` only renders while `disabled` is set
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				disabledTooltip="Why"
			/>,
		);
	});

	test('rejects a readOnly combobox with no reason', () => {
		assertType(
			// @ts-expect-error - a read-only combobox has to tell the user why
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				readOnly
			/>,
		);
	});

	test('rejects a readOnly reason with no readOnly', () => {
		assertType(
			// @ts-expect-error - `readOnlyTooltip` only renders while `readOnly` is set
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				readOnlyTooltip="Why"
			/>,
		);
	});

	test('accepts each with its reason, or with an explicit undefined', () => {
		assertType(
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				disabled
				disabledTooltip="No access"
			/>,
		);
		assertType(
			<Combobox
				placeholder="Pick"
				searchInputProps={{ placeholder: 'Search' }}
				items={ONE}
				readOnly
				readOnlyTooltip={undefined}
			/>,
		);
	});
});

describe('rows', () => {
	test('accepts every kind', () => {
		const items: ComboboxItemType[] = [
			{ type: 'item', value: 'a', label: 'A', displayValue: 'a', searchMetadata: 'x' },
			{ type: 'hint', value: 'status', label: 'status:', insertValue: 'status:' },
			{ type: 'separator', value: 'sep' },
			{
				type: 'group',
				value: 'g',
				label: 'Group',
				items: [{ type: 'item', value: 'b', label: 'B', prefix: <span />, suffix: <span /> }],
			},
		];

		assertType(
			<Combobox placeholder="Pick" searchInputProps={{ placeholder: 'Search' }} items={items} />,
		);
	});

	test('rejects a row with no type', () => {
		// @ts-expect-error - every row carries `type`
		const row: ComboboxItemType = { value: 'a', label: 'A' };

		assertType(row);
	});

	test('rejects a disabled row with no reason', () => {
		// @ts-expect-error - a disabled row has to tell the user why
		const row: ComboboxOptionItemType = { type: 'item', value: 'a', label: 'A', disabled: true };

		assertType(row);
	});

	test('rejects a hint with no insertValue', () => {
		// @ts-expect-error - a hint writes `insertValue` into the search row
		const row: ComboboxHintItemType = { type: 'hint', value: 's', label: 'status:' };

		assertType(row);
	});

	test('rejects a group in a group', () => {
		const group: ComboboxGroupItemType = {
			type: 'group',
			value: 'outer',
			label: 'Outer',
			items: [
				// @ts-expect-error - a group is a heading, not a nesting level
				{ type: 'group', value: 'inner', label: 'Inner', items: [] },
			],
		};

		assertType(group);
	});
});
