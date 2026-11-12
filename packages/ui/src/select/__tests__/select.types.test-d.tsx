/**
 * Type-level tests for the props of {@link Select}. Run by `vitest --typecheck` and by
 * `pnpm type-check`. See `dropdown.types.test-d.tsx` for how the cases are written.
 */
import { createRef, type FocusEvent } from 'react';
import { assertType, describe, test } from 'vitest';
import { Select } from '../select.js';
import type { SelectGroupItemType, SelectItemType, SelectOptionItemType } from '../types.js';

const ONE: SelectItemType[] = [{ type: 'item', value: 'a', label: 'A' }];
const ref = createRef<HTMLElement>();
declare const isNullable: boolean;

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

describe('nullable', () => {
	test('takes null or undefined as the value, and reports a string or null', () => {
		assertType(
			<Select
				placeholder="Pick"
				items={ONE}
				nullable
				value={null}
				onChange={(value: string | null) => value}
			/>,
		);
		assertType(<Select placeholder="Pick" items={ONE} nullable value={undefined} />);
		assertType(<Select placeholder="Pick" items={ONE} nullable value="a" />);
		assertType(<Select placeholder="Pick" items={ONE} nullable={true} value={null} />);
	});

	test('takes null with multiple, and still reports an array', () => {
		assertType(
			<Select
				placeholder="Pick"
				multiple
				items={ONE}
				nullable
				value={null}
				onChange={(value: string[]) => value}
			/>,
		);
		assertType(<Select placeholder="Pick" multiple items={ONE} nullable value={['a']} />);
	});

	test('rejects a nullable decided at run time', () => {
		assertType(
			// @ts-expect-error - `nullable` only takes `true`, a `boolean` is not accepted
			<Select placeholder="Pick" items={ONE} nullable={isNullable} value={null} />,
		);
		assertType(
			// @ts-expect-error - `nullable` only takes `true`, with multiple too
			<Select placeholder="Pick" multiple items={ONE} nullable={isNullable} value={null} />,
		);
		assertType(
			// @ts-expect-error - `nullable` only takes `true`, also without a `null` value
			<Select placeholder="Pick" items={ONE} nullable={isNullable} value="a" />,
		);
	});

	test('rejects null without nullable', () => {
		assertType(
			// @ts-expect-error - `null` needs `nullable`
			<Select placeholder="Pick" items={ONE} value={null} />,
		);
		assertType(
			// @ts-expect-error - `null` needs `nullable`, with multiple too
			<Select placeholder="Pick" multiple items={ONE} value={null} />,
		);
	});

	test('rejects null when nullable is false or undefined', () => {
		assertType(
			// @ts-expect-error - `nullable` only takes `true`, leave it out instead of passing `false`
			<Select placeholder="Pick" items={ONE} nullable={false} value={null} />,
		);
		assertType(
			// @ts-expect-error - `nullable` only takes `true`, leave it out instead of passing `false`, with multiple too
			<Select placeholder="Pick" multiple items={ONE} nullable={false} value={null} />,
		);
		assertType(
			// @ts-expect-error - `nullable={undefined}` is the same as leaving it out
			<Select placeholder="Pick" items={ONE} nullable={undefined} value={null} />,
		);
	});

	test('keeps the shape that multiple decides', () => {
		assertType(
			// @ts-expect-error - a nullable single select holds one value
			<Select placeholder="Pick" items={ONE} nullable value={['a']} />,
		);
		assertType(
			// @ts-expect-error - a nullable multiple select holds an array
			<Select placeholder="Pick" multiple items={ONE} nullable value="a" />,
		);
	});

	test('a nullable select reports null, so its onChange has to take it', () => {
		assertType(
			// @ts-expect-error - a `(value: string) => void` does not take `null`
			<Select placeholder="Pick" items={ONE} nullable onChange={(value: string) => value} />,
		);
	});
});

describe('onBlur', () => {
	test('takes a handler of the blur event, or one with no parameters', () => {
		assertType(
			<Select
				placeholder="Pick"
				items={ONE}
				onBlur={(event: FocusEvent<HTMLElement>) => event.relatedTarget}
			/>,
		);
		assertType(<Select placeholder="Pick" items={ONE} onBlur={() => undefined} />);
		assertType(<Select placeholder="Pick" multiple items={ONE} onBlur={() => undefined} />);
	});
});

describe('name', () => {
	test('takes a name, with one value or several', () => {
		assertType(<Select placeholder="Pick" items={ONE} name="framework" />);
		assertType(<Select placeholder="Pick" multiple items={ONE} name="frameworks" />);
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
