/**
 * Type-level tests for the props of {@link Select}. Run by `vitest --typecheck` and by
 * `pnpm type-check`. See `dropdown.types.test-d.tsx` for how the cases are written.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Select } from '../select.js';
import type { SelectGroupItemType, SelectItemType, SelectOptionItemType } from '../types.js';

const ONE: SelectItemType[] = [{ type: 'item', value: 'a', label: 'A' }];
const ref = createRef<HTMLElement>();

describe('root props', () => {
	test('accepts items and a placeholder, plus a ref', () => {
		assertType(<Select placeholder="Pick" items={ONE} ref={ref} />);
	});

	test('rejects a select with nothing in it', () => {
		assertType(
			// @ts-expect-error - `items` is what the select lists, it cannot be left out
			<Select placeholder="Pick" aria-label="Framework" />,
		);
	});

	test('rejects a select with no placeholder', () => {
		assertType(
			// @ts-expect-error - the trigger has to show something while nothing is selected
			<Select items={ONE} />,
		);
	});

	test('rejects className and style, the size comes from width and maxWidth', () => {
		assertType(
			<Select
				placeholder="Pick"
				items={ONE}
				// @ts-expect-error - `className` is not a prop
				className="x"
			/>,
		);
		assertType(
			<Select
				placeholder="Pick"
				items={ONE}
				// @ts-expect-error - `style` is not a prop
				style={{}}
			/>,
		);
	});

	test('rejects a raw data-testid', () => {
		assertType(
			// @ts-expect-error - the prop is called `testId`
			<Select placeholder="Pick" items={ONE} data-testid="x" />,
		);
	});

	test('rejects the props SelectSimple had', () => {
		assertType(
			<Select
				placeholder="Pick"
				items={ONE}
				// @ts-expect-error - `groups` is now a `group` row in `items`
				groups={[]}
			/>,
		);
		assertType(
			<Select
				placeholder="Pick"
				items={ONE}
				// @ts-expect-error - `withPortal` is now `container`
				withPortal={false}
			/>,
		);
		assertType(
			<Select
				placeholder="Pick"
				items={ONE}
				// @ts-expect-error - `loadingPlaceholder` is now `loadingContent`
				loadingPlaceholder="Loading"
			/>,
		);
		assertType(
			<Select
				placeholder="Pick"
				items={ONE}
				// @ts-expect-error - the select owns its open state
				defaultOpen
			/>,
		);
		assertType(
			<Select
				placeholder="Pick"
				items={ONE}
				// @ts-expect-error - a story or a test holds it open with `ForceOpenProvider`
				open
			/>,
		);
	});

	test('accepts width, maxWidth and the popup sizes as a number or a string', () => {
		assertType(
			<Select
				placeholder="Pick"
				items={ONE}
				width={240}
				maxWidth="100%"
				contentMaxWidth="20rem"
				contentMaxHeight={200}
			/>,
		);
	});
});

describe('value', () => {
	test('takes a string, and reports a string', () => {
		assertType(
			<Select
				placeholder="Pick"
				items={ONE}
				value="a"
				onChange={(value: string) => value}
				displayValue={(item) => item?.label}
			/>,
		);
	});

	test('takes a string array with multiple, and reports one', () => {
		assertType(
			<Select
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

	test('rejects an array without multiple', () => {
		assertType(
			// @ts-expect-error - a single select holds one value
			<Select placeholder="Pick" items={ONE} value={['a']} />,
		);
	});

	test('rejects a string with multiple', () => {
		assertType(
			// @ts-expect-error - a multiple select holds an array
			<Select placeholder="Pick" multiple items={ONE} value="a" />,
		);
	});

	test('rejects maxDisplayedPills without multiple', () => {
		assertType(
			// @ts-expect-error - only a multiple select shows chips
			<Select placeholder="Pick" items={ONE} maxDisplayedPills={2} />,
		);
	});

	test('rejects an onChange that takes the other shape', () => {
		assertType(
			// @ts-expect-error - a single select reports a string
			<Select placeholder="Pick" items={ONE} onChange={(value: string[]) => value} />,
		);
	});
});

describe('disabled and readOnly', () => {
	test('rejects a disabled select with no reason', () => {
		assertType(
			// @ts-expect-error - a disabled select has to tell the user why
			<Select placeholder="Pick" items={ONE} disabled />,
		);
	});

	test('rejects a disabled reason with no disabled', () => {
		assertType(
			// @ts-expect-error - `disabledTooltip` only renders while `disabled` is set
			<Select placeholder="Pick" items={ONE} disabledTooltip="Why" />,
		);
	});

	test('rejects a readOnly select with no reason', () => {
		assertType(
			// @ts-expect-error - a read-only select has to tell the user why
			<Select placeholder="Pick" items={ONE} readOnly />,
		);
	});

	test('rejects a readOnly reason with no readOnly', () => {
		assertType(
			// @ts-expect-error - `readOnlyTooltip` only renders while `readOnly` is set
			<Select placeholder="Pick" items={ONE} readOnlyTooltip="Why" />,
		);
	});

	test('accepts each with its reason, or with an explicit undefined', () => {
		assertType(<Select placeholder="Pick" items={ONE} disabled disabledTooltip="No access" />);
		assertType(<Select placeholder="Pick" items={ONE} readOnly readOnlyTooltip={undefined} />);
	});
});

describe('rows', () => {
	test('accepts every kind', () => {
		const items: SelectItemType[] = [
			{ type: 'item', value: 'a', label: 'A', displayValue: 'a' },
			{ type: 'separator', value: 'sep' },
			{
				type: 'group',
				value: 'g',
				label: 'Group',
				items: [{ type: 'item', value: 'b', label: 'B', prefix: <span />, suffix: <span /> }],
			},
		];

		assertType(<Select placeholder="Pick" items={items} />);
	});

	test('rejects a row with no type', () => {
		// @ts-expect-error - every row carries `type`
		const row: SelectItemType = { value: 'a', label: 'A' };

		assertType(row);
	});

	test('rejects a disabled row with no reason', () => {
		// @ts-expect-error - a disabled row has to tell the user why
		const row: SelectOptionItemType = { type: 'item', value: 'a', label: 'A', disabled: true };

		assertType(row);
	});

	test('rejects a hint row, the select has no search', () => {
		const row: SelectItemType = {
			// @ts-expect-error - a hint writes into a search row, which a select does not have
			type: 'hint',
			value: 's',
			label: 'status:',
		};

		assertType(row);
	});

	test('rejects a group in a group', () => {
		const group: SelectGroupItemType = {
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
