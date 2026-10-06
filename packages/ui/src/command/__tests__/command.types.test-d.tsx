/**
 * Type-level tests for the props of {@link Command}. Run by `vitest --typecheck` and by
 * `pnpm type-check`. See `dropdown.types.test-d.tsx` for how the cases are written.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Command } from '../command.js';
import type { CommandItemType } from '../types.js';

const ONE: CommandItemType[] = [{ type: 'item', value: 'a', label: 'A', onClick: () => {} }];
const SEARCH = { placeholder: 'Search…' };
const ref = createRef<HTMLDivElement>();
const noop = () => {};

describe('root props', () => {
	test('accepts the required props, a ref, aria-* and data-*', () => {
		assertType(
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				searchInputProps={SEARCH}
				items={ONE}
				noContent="Nothing"
				contentMaxWidth="40rem"
				contentMaxHeight={240}
				testId="palette"
				id="palette"
				aria-describedby="hint"
				data-area="nav"
				ref={ref}
			/>,
		);
	});

	test('rejects a palette with no label', () => {
		assertType(
			// @ts-expect-error - the placeholder is not a name, `label` is required
			<Command open onOpenChange={noop} searchInputProps={SEARCH} items={ONE} />,
		);
	});

	test('rejects a palette the app does not control', () => {
		assertType(
			// @ts-expect-error - the palette has no trigger, `open` is required
			<Command label="Palette" onOpenChange={noop} searchInputProps={SEARCH} items={ONE} />,
		);
		assertType(
			// @ts-expect-error - `onOpenChange` is required next to `open`
			<Command label="Palette" open searchInputProps={SEARCH} items={ONE} />,
		);
	});

	test('rejects a search row with no placeholder', () => {
		assertType(
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				// @ts-expect-error - `placeholder` is required in `searchInputProps`
				searchInputProps={{}}
				items={ONE}
			/>,
		);
	});

	test('rejects className and style, the palette owns its look', () => {
		assertType(
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				searchInputProps={SEARCH}
				items={ONE}
				// @ts-expect-error - `className` is not a prop
				className="x"
			/>,
		);
		assertType(
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				searchInputProps={SEARCH}
				items={ONE}
				// @ts-expect-error - `style` is not a prop
				style={{}}
			/>,
		);
	});

	test('rejects a raw data-testid', () => {
		assertType(
			// @ts-expect-error - the prop is called `testId`
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				searchInputProps={SEARCH}
				items={ONE}
				data-testid="x"
			/>,
		);
	});

	test('rejects the props CommandDialog had', () => {
		assertType(
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				searchInputProps={SEARCH}
				items={ONE}
				// @ts-expect-error - the palette always opens at the top
				position="top"
			/>,
		);
		assertType(
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				searchInputProps={SEARCH}
				items={ONE}
				// @ts-expect-error - the palette always opens 110px from the top
				offset={110}
			/>,
		);
		assertType(
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				searchInputProps={SEARCH}
				items={ONE}
				// @ts-expect-error - same reason as `className`
				contentClassName="x"
			/>,
		);
		assertType(
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				searchInputProps={SEARCH}
				items={ONE}
				// @ts-expect-error - the palette has no trigger, the app holds `open`
				defaultOpen
			/>,
		);
		assertType(
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				searchInputProps={SEARCH}
				items={ONE}
				// @ts-expect-error - the palette is always modal
				modal={false}
			/>,
		);
		assertType(
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				searchInputProps={SEARCH}
				items={ONE}
				// @ts-expect-error - `searchInputProps.loading` shows the wait in the field
				loading
			/>,
		);
		assertType(
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				searchInputProps={SEARCH}
				items={ONE}
				// @ts-expect-error - no loading row replaces the list
				loadingContent="Loading"
			/>,
		);
		assertType(
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				searchInputProps={SEARCH}
				items={ONE}
				// @ts-expect-error - the highlighted row is not a value
				value="a"
			/>,
		);
		assertType(
			<Command
				label="Palette"
				open
				onOpenChange={noop}
				searchInputProps={SEARCH}
				items={ONE}
				// @ts-expect-error - the arrows always wrap
				loop
			/>,
		);
	});
});

describe('rows', () => {
	test('accepts items, groups, icons, a shortcut or a suffix', () => {
		assertType<CommandItemType[]>([
			{
				type: 'item',
				value: 'home',
				label: 'Go to Home',
				searchMetadata: 'landing',
				prefix: <svg />,
				shortcut: 'Shift+H',
				onClick: noop,
				testId: 'home',
			},
			{
				type: 'group',
				value: 'nav',
				label: 'Navigation',
				testId: 'nav',
				items: [{ type: 'item', value: 'logs', label: 'Logs', suffix: <svg />, onClick: noop }],
			},
		]);
	});

	test('rejects a row with both a shortcut and a suffix', () => {
		assertType<CommandItemType[]>([
			// @ts-expect-error - `shortcut` and `suffix` share the trailing slot
			{ type: 'item', value: 'a', label: 'A', shortcut: 'K', suffix: <svg />, onClick: noop },
		]);
	});

	test('accepts a disabled or a loading row with its reason', () => {
		assertType<CommandItemType[]>([
			{
				type: 'item',
				value: 'a',
				label: 'A',
				disabled: true,
				disabledTooltip: 'Ask an admin',
				onClick: noop,
			},
			{
				type: 'item',
				value: 'b',
				label: 'B',
				loading: true,
				loadingTooltip: 'Saving',
				onClick: noop,
			},
			{
				type: 'item',
				value: 'c',
				label: 'C',
				disabled: false,
				disabledTooltip: undefined,
				loading: true,
				loadingTooltip: 'Saving',
				shortcut: 'K',
				onClick: noop,
			},
		]);
	});

	test('rejects a disabled row with no reason', () => {
		assertType<CommandItemType[]>([
			// @ts-expect-error - a blocked row has to tell the user why
			{ type: 'item', value: 'a', label: 'A', disabled: true, onClick: noop },
		]);
	});

	test('rejects a reason with nothing disabled', () => {
		assertType<CommandItemType[]>([
			// @ts-expect-error - `disabledTooltip` only renders while `disabled` is set
			{ type: 'item', value: 'a', label: 'A', disabledTooltip: 'Ask an admin', onClick: noop },
		]);
	});

	test('rejects a loading row with no reason', () => {
		assertType<CommandItemType[]>([
			// @ts-expect-error - a row that is waiting has to say what for
			{ type: 'item', value: 'a', label: 'A', loading: true, onClick: noop },
		]);
	});

	test('rejects a reason with nothing loading', () => {
		assertType<CommandItemType[]>([
			// @ts-expect-error - `loadingTooltip` only renders while `loading` is set
			{ type: 'item', value: 'a', label: 'A', loadingTooltip: 'Saving', onClick: noop },
		]);
	});

	test('rejects a row with no onClick', () => {
		assertType<CommandItemType[]>([
			// @ts-expect-error - a palette row runs an action
			{ type: 'item', value: 'a', label: 'A' },
		]);
	});

	test('rejects a row with no type', () => {
		assertType<CommandItemType[]>([
			// @ts-expect-error - every row carries `type`
			{ value: 'a', label: 'A', onClick: noop },
		]);
	});

	test('rejects the cmdk row and group props', () => {
		assertType<CommandItemType[]>([
			// @ts-expect-error - `keywords` is `searchMetadata`
			{ type: 'item', value: 'a', label: 'A', keywords: ['x'], onClick: noop },
		]);
		assertType<CommandItemType[]>([
			// @ts-expect-error - `onSelect` is `onClick`
			{ type: 'item', value: 'a', label: 'A', onSelect: noop },
		]);
		assertType<CommandItemType[]>([
			// @ts-expect-error - `heading` is `label`
			{ type: 'group', value: 'g', heading: 'G', items: [] },
		]);
	});

	test('rejects a group in a group and a separator', () => {
		assertType<CommandItemType[]>([
			{
				type: 'group',
				value: 'outer',
				label: 'Outer',
				// @ts-expect-error - a group holds rows only
				items: [{ type: 'group', value: 'inner', label: 'Inner', items: [] }],
			},
		]);
		assertType<CommandItemType[]>([
			// @ts-expect-error - a group heading already separates sections
			{ type: 'separator', value: 's' },
		]);
	});
});
