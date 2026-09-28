/**
 * Type-level tests for the props of {@link Dropdown}.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element or an object literal written the way a consumer
 * writes it: it either compiles, or it is marked `@ts-expect-error` because we refuse that
 * combination. TypeScript reports an unused `@ts-expect-error` as an error of its own, so loosening
 * a constraint by accident fails the build instead of passing silently.
 *
 * The comment suppresses the line directly below it, so it sits *inside* the `assertType(...)`
 * call, right above its argument. That keeps the argument on a line of its own whatever oxfmt does
 * with the call, which the same comment above the `assertType` line would not: once the props are
 * broken one per line, the error moves off the line the comment covers.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Dropdown } from '../dropdown.js';
import type {
	DropdownActionItemType,
	DropdownCheckboxItemType,
	DropdownGroupItemType,
	DropdownItemType,
	DropdownLinkItemType,
	DropdownRadioGroupItemType,
	DropdownSubmenuItemType,
} from '../types.js';

/** One row, which is as much of a list as any case here needs. */
const ONE: DropdownItemType[] = [{ type: 'item', value: 'a', label: 'A' }];
const icon = <span />;
const btn = <button type="button">Actions</button>;
const ref = createRef<HTMLButtonElement>();

describe('root props', () => {
	test('accepts the required four, plus a ref', () => {
		assertType(
			<Dropdown nativeButton side="bottom" align="start" items={ONE} ref={ref}>
				{btn}
			</Dropdown>,
		);
	});

	test('rejects a menu with no side', () => {
		assertType(
			// @ts-expect-error - placement is never incidental, the call site states it
			<Dropdown nativeButton align="start" items={ONE}>
				{btn}
			</Dropdown>,
		);
	});

	test('rejects a menu with no align', () => {
		assertType(
			// @ts-expect-error - placement is never incidental, the call site states it
			<Dropdown nativeButton side="bottom" items={ONE}>
				{btn}
			</Dropdown>,
		);
	});

	test('rejects a menu with nothing in it', () => {
		assertType(
			// @ts-expect-error - `items` is what the menu renders, it cannot be left out
			<Dropdown nativeButton side="bottom" align="start">
				{btn}
			</Dropdown>,
		);
	});

	test('rejects a raw data-testid', () => {
		assertType(
			// @ts-expect-error - the prop is called `testId`
			<Dropdown nativeButton side="bottom" align="start" items={ONE} data-testid="m">
				{btn}
			</Dropdown>,
		);
	});

	test('rejects a prop the menu does not have', () => {
		assertType(
			// @ts-expect-error - the menu owns its open state, there is no `open`
			<Dropdown nativeButton side="bottom" align="start" items={ONE} open>
				{btn}
			</Dropdown>,
		);
	});

	test('rejects a menu that does not say whether its trigger is a button', () => {
		assertType(
			// @ts-expect-error - `nativeButton` has to match the trigger, so it has no default
			<Dropdown side="bottom" align="start" items={ONE}>
				{btn}
			</Dropdown>,
		);
	});

	test('rejects a disabled menu with no reason', () => {
		assertType(
			// @ts-expect-error - a disabled menu has to tell the user why it cannot be opened
			<Dropdown nativeButton side="bottom" align="start" items={ONE} disabled>
				{btn}
			</Dropdown>,
		);
	});

	test('rejects a reason with no disabled', () => {
		assertType(
			// @ts-expect-error - `disabledTooltip` only renders while `disabled` is set
			<Dropdown nativeButton side="bottom" align="start" items={ONE} disabledTooltip="Why">
				{btn}
			</Dropdown>,
		);
	});

	test('accepts disabled with its reason, or with an explicit undefined', () => {
		assertType(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				items={ONE}
				disabled
				disabledTooltip="No edit access"
			>
				{btn}
			</Dropdown>,
		);
		assertType(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				items={ONE}
				disabled={false}
				disabledTooltip={undefined}
			>
				{btn}
			</Dropdown>,
		);
	});

	test('accepts aria-*, data-*, the size props and the search row', () => {
		assertType(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				items={ONE}
				aria-label="Actions"
				data-analytics="menu"
				contentMaxWidth={320}
				contentMaxHeight="30rem"
				searchInputProps={{ filter: false }}
				onOpenChange={() => {}}
				testId="menu"
			>
				{btn}
			</Dropdown>,
		);
	});
});

describe('the action row', () => {
	test('accepts a label, a value and both slots', () => {
		assertType<DropdownActionItemType>({
			type: 'item',
			value: 'b',
			label: 'B',
			prefix: icon,
			suffix: icon,
			searchMetadata: 'bee',
			testId: 'row',
		});
	});

	test('rejects a row with no type', () => {
		assertType<DropdownActionItemType>(
			// @ts-expect-error - the discriminant is required on every entry, the plain row included
			{ value: 'b', label: 'B' },
		);
	});

	test('accepts a disabled row with its reason', () => {
		assertType<DropdownActionItemType>({
			type: 'item',
			value: 'b',
			label: 'B',
			disabled: true,
			disabledTooltip: 'Ask an admin',
		});
	});

	test('rejects a disabled row with no reason', () => {
		assertType<DropdownActionItemType>(
			// @ts-expect-error - a blocked row has to tell the user why
			{ type: 'item', value: 'b', label: 'B', disabled: true },
		);
	});

	test('rejects a reason with nothing disabled', () => {
		assertType<DropdownActionItemType>(
			// @ts-expect-error - `disabledTooltip` only renders while `disabled` is set
			{ type: 'item', value: 'b', label: 'B', disabledTooltip: 'Ask an admin' },
		);
	});

	test('accepts a loading row with its reason', () => {
		assertType<DropdownActionItemType>({
			type: 'item',
			value: 'b',
			label: 'B',
			loading: true,
			loadingTooltip: 'Saving',
		});
	});

	test('rejects a loading row with no reason', () => {
		assertType<DropdownActionItemType>(
			// @ts-expect-error - a row that is waiting has to say what for
			{ type: 'item', value: 'b', label: 'B', loading: true },
		);
	});

	test('accepts a shortcut on its own', () => {
		assertType<DropdownActionItemType>({ type: 'item', value: 'b', label: 'B', shortcut: 'R' });
	});

	test('rejects a shortcut next to a suffix', () => {
		assertType<DropdownActionItemType>(
			// @ts-expect-error - both take the trailing slot
			{ type: 'item', value: 'b', label: 'B', shortcut: 'R', suffix: icon },
		);
	});

	test('accepts a handler returning void', () => {
		assertType<DropdownActionItemType>({
			type: 'item',
			value: 'b',
			label: 'B',
			onClick: () => {},
		});
	});
});

describe('the link row', () => {
	test('accepts an element to render as, and both slots', () => {
		assertType<DropdownLinkItemType>({
			type: 'link',
			value: 'docs',
			label: 'Docs',
			render: <a href="/docs">Docs</a>,
			prefix: icon,
			suffix: icon,
		});
	});

	test('rejects a link row with nothing to render as', () => {
		assertType<DropdownLinkItemType>(
			// @ts-expect-error - the row is whatever you hand over, so there is nothing to default to
			{ type: 'link', value: 'docs', label: 'Docs' },
		);
	});

	test('rejects a handler, because navigation is the action', () => {
		assertType<DropdownLinkItemType>(
			// @ts-expect-error - put the handler on the element you render
			{ type: 'link', value: 'docs', label: 'Docs', render: <a href="/docs" />, onClick: () => {} },
		);
	});

	test('rejects a disabled link row with no reason', () => {
		assertType<DropdownLinkItemType>(
			// @ts-expect-error - a blocked row has to tell the user why
			{ type: 'link', value: 'docs', label: 'Docs', render: <a href="/docs" />, disabled: true },
		);
	});
});

describe('the checkbox row', () => {
	test('accepts the value triple', () => {
		assertType<DropdownCheckboxItemType>({
			type: 'checkbox',
			name: 'e',
			label: 'E',
			value: true,
			onChange: () => {},
		});
	});

	test('accepts a leading icon, because the check sits opposite it', () => {
		assertType<DropdownCheckboxItemType>({
			type: 'checkbox',
			name: 'e',
			label: 'E',
			prefix: icon,
		});
	});

	test('rejects a suffix, because the check takes that slot', () => {
		assertType<DropdownCheckboxItemType>(
			// @ts-expect-error - a row carries one selection control, and it owns the trailing slot
			{ type: 'checkbox', name: 'e', label: 'E', suffix: icon },
		);
	});
});

describe('the radio group row', () => {
	test('accepts its options and its selection', () => {
		assertType<DropdownRadioGroupItemType>({
			type: 'radio-group',
			name: 'f',
			value: 'g',
			onChange: () => {},
			items: [{ value: 'g', label: 'G' }],
		});
	});

	test('rejects an option with no value', () => {
		assertType<DropdownRadioGroupItemType>(
			// @ts-expect-error - `value` is what `onChange` reports
			{ type: 'radio-group', name: 'f', items: [{ label: 'G' }] },
		);
	});

	test('rejects a suffix on an option, because the check takes that slot', () => {
		assertType<DropdownRadioGroupItemType>({
			type: 'radio-group',
			name: 'f',
			// @ts-expect-error - the selection check owns the trailing slot and is not overridable
			items: [{ value: 'g', label: 'G', suffix: icon }],
		});
	});
});

describe('nesting', () => {
	test('accepts a submenu of leaves and of a group', () => {
		assertType<DropdownSubmenuItemType>({
			type: 'submenu',
			value: 'c',
			label: 'C',
			items: [
				{ type: 'item', value: 'b', label: 'B' },
				{ type: 'group', value: 'd', label: 'D', items: [] },
			],
		});
	});

	test('rejects a submenu inside a submenu', () => {
		assertType<DropdownSubmenuItemType>({
			type: 'submenu',
			value: 'c',
			label: 'C',
			items: [
				// @ts-expect-error - one level of nesting, held by the type rather than by a check
				{ type: 'submenu', value: 'e', label: 'E', items: [] },
			],
		});
	});

	test('rejects a submenu inside a group inside a submenu', () => {
		assertType<DropdownSubmenuItemType>({
			type: 'submenu',
			value: 'c',
			label: 'C',
			items: [
				{
					type: 'group',
					value: 'd',
					label: 'D',
					items: [
						// @ts-expect-error - a group is a heading, not a way around the one-level rule
						{ type: 'submenu', value: 'e', label: 'E', items: [] },
					],
				},
			],
		});
	});

	test('accepts a submenu inside a group at the root', () => {
		assertType<DropdownGroupItemType>({
			type: 'group',
			value: 'd',
			label: 'D',
			items: [{ type: 'submenu', value: 'c', label: 'C', items: [] }],
		});
	});

	test('rejects a group inside a group', () => {
		assertType<DropdownGroupItemType>({
			type: 'group',
			value: 'd',
			label: 'D',
			items: [
				// @ts-expect-error - a heading under a heading has no meaning
				{ type: 'group', value: 'e', label: 'E', items: [] },
			],
		});
	});

	test('rejects a suffix on a submenu, because the chevron takes that slot', () => {
		assertType<DropdownSubmenuItemType>(
			// @ts-expect-error - the disclosure owns the trailing slot and is not overridable
			{ type: 'submenu', value: 'c', label: 'C', items: [], suffix: icon },
		);
	});
});
