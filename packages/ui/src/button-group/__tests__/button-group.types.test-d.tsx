/**
 * Type-level tests for the props of {@link ButtonGroup}.
 *
 * Run by `vitest --typecheck` and, because the file lives under `src`, also by `pnpm type-check`.
 * Each case either compiles, or is marked `@ts-expect-error` because we refuse that combination.
 * Keep every prop on the opening tag line, so the comment above it covers a prop-level error.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { ButtonGroup } from '../button-group.js';
import type {
	ButtonGroupActionItemType,
	ButtonGroupColorType,
	ButtonGroupItemMenuType,
	ButtonGroupItemType,
	ButtonGroupLinkItemType,
	ButtonGroupMenuItemType,
} from '../index.js';

const noop = (): void => {};

const ITEMS: ButtonGroupItemType[] = [
	{ value: 'day', label: 'Day', onClick: noop },
	{ value: 'week', label: 'Week', onClick: noop },
];

/** The appearance and items, spread so a case still fits on the opening tag line. */
const BASE = { variant: 'outlined', color: 'secondary', size: 'md', items: ITEMS } as const;
const DAY = { value: 'day', label: 'Day', onClick: noop } as const;
const groupRef = createRef<HTMLDivElement>();
declare const anyColor: ButtonGroupColorType;

describe('appearance', () => {
	test('accepts outlined secondary in both sizes', () => {
		assertType(<ButtonGroup {...BASE} />);
		assertType(<ButtonGroup variant="outlined" color="secondary" size="sm" items={ITEMS} />);
	});

	test('accepts solid and link with every color', () => {
		assertType(<ButtonGroup {...BASE} variant="solid" color={anyColor} />);
		assertType(<ButtonGroup {...BASE} variant="link" color={anyColor} />);
		assertType(<ButtonGroup {...BASE} variant="solid" color="highlight-danger" />);
		assertType(<ButtonGroup {...BASE} variant="link" color="archive" />);
	});

	test('accepts dashed and ghost with secondary', () => {
		assertType(<ButtonGroup {...BASE} variant="dashed" />);
		assertType(<ButtonGroup {...BASE} variant="ghost" />);
	});

	test('rejects a color the variant has no treatment for', () => {
		// @ts-expect-error - outlined only has a secondary treatment
		assertType(<ButtonGroup variant="outlined" color="primary" size="md" items={ITEMS} />);
		// @ts-expect-error - dashed only has a secondary treatment
		assertType(<ButtonGroup {...BASE} variant="dashed" color="warning" />);
		// @ts-expect-error - ghost only has a secondary treatment
		assertType(<ButtonGroup {...BASE} variant="ghost" color="danger" />);
	});

	test('rejects a variant outside the five', () => {
		// @ts-expect-error - tonal is not a variant
		assertType(<ButtonGroup {...BASE} variant="tonal" />);
	});

	test('takes noLoadingEffect only with ghost', () => {
		assertType(<ButtonGroup {...BASE} variant="ghost" noLoadingEffect />);
		// @ts-expect-error - only the ghost variant plays a loading glow
		assertType(<ButtonGroup {...BASE} noLoadingEffect />);
		// @ts-expect-error - a solid group has no loading glow to turn off
		assertType(<ButtonGroup {...BASE} variant="solid" color="primary" noLoadingEffect />);
	});

	test('requires a size', () => {
		// @ts-expect-error - sizes never mix, so the group states its own
		assertType(<ButtonGroup variant="outlined" color="secondary" items={ITEMS} />);
	});
});

describe('items', () => {
	test('are required', () => {
		// @ts-expect-error - a group with nothing to show is not allowed
		assertType(<ButtonGroup variant="outlined" color="secondary" size="md" />);
	});

	test('take no children', () => {
		assertType(
			// @ts-expect-error - members come from `items`
			<ButtonGroup {...BASE} children={<span />} />,
		);
	});

	test('accept a text member with its icons and handler', () => {
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			prefix: <svg />,
			suffix: <svg />,
			onClick: noop,
		});
	});

	test('accept an icon member with its name', () => {
		assertType<ButtonGroupItemType>({
			value: 'next',
			icon: <svg />,
			'aria-label': 'Next page',
			onClick: noop,
		});
	});

	test('reject the old ariaLabel name', () => {
		assertType<ButtonGroupItemType>({
			value: 'next',
			icon: <svg />,
			// @ts-expect-error - the accessible name is `aria-label` now
			ariaLabel: 'Next',
			onClick: noop,
		});
	});

	test('reject an icon member without a name', () => {
		// @ts-expect-error - an icon has no text for a screen reader to announce
		assertType<ButtonGroupItemType>({ value: 'next', icon: <svg />, onClick: noop });
	});

	test('reject an icon member with a label', () => {
		// @ts-expect-error - an icon member has no label
		assertType<ButtonGroupItemType>({
			value: 'next',
			icon: <svg />,
			'aria-label': 'Next',
			label: 'Next',
		});
	});

	test('accept a link member', () => {
		assertType<ButtonGroupItemType>({ value: 'docs', label: 'Docs', render: <a href="/docs" /> });
	});

	test('accept a link member with a prefix and a suffix', () => {
		assertType<ButtonGroupItemType>({
			value: 'docs',
			label: 'Docs',
			prefix: <svg />,
			suffix: <svg />,
			render: <a href="/docs" />,
		});
	});

	test('reject a button member without an onClick', () => {
		// @ts-expect-error - a member that is not a link must do something when pressed
		assertType<ButtonGroupItemType>({ value: 'day', label: 'Day' });
	});

	test('reject a link member with an onClick', () => {
		// @ts-expect-error - the handler goes on the rendered element
		assertType<ButtonGroupItemType>({
			value: 'docs',
			label: 'Docs',
			render: <a href="/docs" />,
			onClick: noop,
		});
	});

	test('reject a tooltip on a member', () => {
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			onClick: noop,
			// @ts-expect-error - members carry reasons, not a free tooltip
			tooltip: 'Last 24 hours',
		});
	});

	test('reject an item without a value', () => {
		// @ts-expect-error - `value` keys the member and names its testId
		assertType<ButtonGroupItemType>({ label: 'Day', onClick: noop });
	});

	test('pair disabled with its reason', () => {
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			onClick: noop,
			disabled: true,
			disabledTooltip: 'Why',
		});
		// @ts-expect-error - a disabled member has to say why
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			onClick: noop,
			disabled: true,
		});
	});

	test('pair loading with its reason', () => {
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			onClick: noop,
			loading: true,
			loadingTooltip: undefined,
		});
		// @ts-expect-error - `loadingTooltip` travels with `loading`
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			onClick: noop,
			loadingTooltip: 'Saving',
		});
	});
});

// No annotation, so nothing here is checked against the row types before the cases below are.
const ROW = { type: 'item', value: 'a', label: 'A' } as const;
const MENU = { side: 'bottom' as const, align: 'end' as const, items: [ROW] };
const SECTION = { value: 'section', icon: <svg />, 'aria-label': 'Choose section' } as const;

describe('item menu', () => {
	test('accepts an icon member that opens a menu', () => {
		assertType<ButtonGroupItemType>({ ...SECTION, menu: MENU });
	});

	test('accepts a text member that opens a menu, with its icons', () => {
		assertType<ButtonGroupItemType>({
			value: 'section',
			label: 'Sections',
			prefix: <svg />,
			suffix: <svg />,
			menu: MENU,
		});
	});

	test('accepts the placement and the size caps of the popup', () => {
		assertType<ButtonGroupItemType>({
			...SECTION,
			menu: { side: 'top', align: 'start', items: MENU.items, contentMaxWidth: 320 },
		});
		assertType<ButtonGroupItemType>({
			...SECTION,
			menu: { side: 'left', align: 'center', items: MENU.items, contentMaxHeight: '30rem' },
		});
	});

	test('accepts every kind of row but a submenu', () => {
		assertType<ButtonGroupItemType>({
			...SECTION,
			menu: {
				...MENU,
				items: [
					{ type: 'item', value: 'rename', label: 'Rename', onClick: noop, danger: true },
					{ type: 'link', value: 'docs', label: 'Docs', render: <a href="/docs" /> },
					{ type: 'checkbox', name: 'pinned', label: 'Pinned' },
					{
						type: 'radio-group',
						name: 'sort',
						items: [{ value: 'name', label: 'By name' }],
					},
					{ type: 'separator', value: 'rule' },
					{
						type: 'group',
						value: 'more',
						label: 'More',
						items: [{ type: 'item', value: 'copy', label: 'Copy' }],
					},
				],
			},
		});
	});

	test('accepts a menu member that is blocked, loading or in a pair of its own', () => {
		assertType<ButtonGroupItemType>({
			...SECTION,
			menu: MENU,
			disabled: true,
			disabledTooltip: 'Why',
		});
		assertType<ButtonGroupItemType>({
			...SECTION,
			menu: MENU,
			loading: true,
			loadingTooltip: undefined,
		});
		assertType<ButtonGroupItemType>({ ...SECTION, menu: MENU, variant: 'solid', color: 'primary' });
		assertType<ButtonGroupItemType>({ ...SECTION, menu: MENU, testId: 'section', onFocus: noop });
	});

	test('rejects a menu next to an onClick', () => {
		// @ts-expect-error - the rows carry the actions, a menu member has no handler of its own
		assertType<ButtonGroupItemType>({ ...SECTION, menu: MENU, onClick: noop });
	});

	test('rejects a menu next to a render element', () => {
		// @ts-expect-error - a member either navigates or opens a menu, not both
		assertType<ButtonGroupItemType>({ ...SECTION, menu: MENU, render: <a href="/docs" /> });
	});

	test('rejects a menu without a side', () => {
		assertType<ButtonGroupItemType>({
			...SECTION,
			// @ts-expect-error - the popup has to say which side of the member it opens on
			menu: { align: 'end', items: MENU.items },
		});
	});

	test('rejects a menu without an alignment', () => {
		assertType<ButtonGroupItemType>({
			...SECTION,
			// @ts-expect-error - the popup has to say how it lines up with the member
			menu: { side: 'bottom', items: MENU.items },
		});
	});

	test('rejects a menu without rows', () => {
		assertType<ButtonGroupItemType>({
			...SECTION,
			// @ts-expect-error - a menu with nothing to pick is not a menu
			menu: { side: 'bottom', align: 'end' },
		});
	});

	test('rejects a side or an alignment outside the four and the three', () => {
		assertType<ButtonGroupItemType>({
			...SECTION,
			// @ts-expect-error - the popup opens on one of four sides
			menu: { side: 'middle', align: 'end', items: MENU.items },
		});
		assertType<ButtonGroupItemType>({
			...SECTION,
			// @ts-expect-error - the popup lines up at the start, the center or the end
			menu: { side: 'bottom', align: 'middle', items: MENU.items },
		});
	});

	test('rejects a submenu row, which the overflow menu needs for the member itself', () => {
		assertType<ButtonGroupItemType>({
			...SECTION,
			menu: {
				...MENU,
				items: [
					{
						// @ts-expect-error - a collapsed member is a submenu row, and a submenu cannot hold one
						type: 'submenu',
						value: 'export',
						label: 'Export',
						items: [{ type: 'item', value: 'csv', label: 'As CSV' }],
					},
				],
			},
		});
	});

	test('rejects a submenu row inside a group of the menu', () => {
		assertType<ButtonGroupItemType>({
			...SECTION,
			menu: {
				...MENU,
				items: [
					{
						type: 'group',
						value: 'more',
						label: 'More',
						items: [
							// @ts-expect-error - a group of the menu holds leaf rows alone
							{ type: 'submenu', value: 'export', label: 'Export', items: [] },
						],
					},
				],
			},
		});
	});

	test('rejects what the menu does not take of Dropdown', () => {
		assertType<ButtonGroupItemType>({
			...SECTION,
			menu: {
				...MENU,
				// @ts-expect-error - the member is the trigger, so the menu takes no test id of its own
				testId: 'menu',
			},
		});
		assertType<ButtonGroupItemType>({
			...SECTION,
			menu: {
				...MENU,
				// @ts-expect-error - the menu is opened by the member alone
				open: true,
			},
		});
	});

	test('rejects a menu that is not an object', () => {
		// @ts-expect-error - the rows go in `menu.items`
		assertType<ButtonGroupItemType>({ ...SECTION, menu: MENU.items });
	});

	test('exports the menu types', () => {
		assertType<ButtonGroupMenuItemType>({ menu: MENU });
		assertType<ButtonGroupItemMenuType>(MENU);
		assertType<ButtonGroupItemMenuType>({ ...MENU, contentMaxWidth: 240, contentMaxHeight: 300 });
	});
});

describe('group prefix and suffix', () => {
	test('accept an element on either side', () => {
		assertType(<ButtonGroup {...BASE} prefix={<input aria-label="Source" />} />);
		assertType(<ButtonGroup {...BASE} suffix={<input aria-label="Filter" />} />);
		assertType(<ButtonGroup {...BASE} prefix={<span />} suffix={<span />} />);
	});

	test('accept any node, since the content renders nothing when empty', () => {
		assertType(<ButtonGroup {...BASE} prefix="Source" suffix={42} />);
		assertType(<ButtonGroup {...BASE} prefix={null} suffix={undefined} />);
		assertType(<ButtonGroup {...BASE} prefix={false} suffix={true} />);
		assertType(<ButtonGroup {...BASE} prefix="" suffix={[<span key="a" />, 'b']} />);
		assertType(
			<ButtonGroup
				{...BASE}
				prefix={<></>}
				suffix={
					<>
						<span />
					</>
				}
			/>,
		);
	});

	test('sit next to disabled, loading and the other group props', () => {
		assertType(
			<ButtonGroup
				{...BASE}
				prefix={<span />}
				suffix={<span />}
				disabled
				disabledTooltip="Read only"
				testId="range"
			/>,
		);
		assertType(<ButtonGroup {...BASE} loading prefix={<span />} suffix={<span />} />);
	});

	test('reject a render function, which is not a node', () => {
		// @ts-expect-error - the content is a node, not a function that returns one
		assertType(<ButtonGroup {...BASE} prefix={() => <span />} />);
		// @ts-expect-error - the content is a node, not a function that returns one
		assertType(<ButtonGroup {...BASE} suffix={() => <span />} />);
	});

	test('reject a plain object, which React cannot render', () => {
		// @ts-expect-error - an object is not a node
		assertType(<ButtonGroup {...BASE} prefix={{ label: 'Source' }} />);
		// @ts-expect-error - an object is not a node
		assertType(<ButtonGroup {...BASE} suffix={{ label: 'Filter' }} />);
	});

	test('leave the prefix and the suffix of a member an element', () => {
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			onClick: noop,
			// @ts-expect-error - a member's icons are elements sized to the member, the group's are any node
			prefix: 'text',
		});
	});
});

describe('item variant and color', () => {
	test('accept a member in a pair of its own', () => {
		assertType<ButtonGroupItemType>({ ...DAY, variant: 'solid', color: 'danger' });
		assertType<ButtonGroupItemType>({ ...DAY, variant: 'link', color: 'highlight-danger' });
		assertType<ButtonGroupItemType>({ ...DAY, variant: 'outlined', color: 'secondary' });
		assertType<ButtonGroupItemType>({ ...DAY, variant: 'ghost', color: 'secondary' });
	});

	test('accept noLoadingEffect on a ghost member', () => {
		assertType<ButtonGroupItemType>({
			...DAY,
			variant: 'ghost',
			color: 'secondary',
			noLoadingEffect: true,
		});
	});

	test('reject a variant without a color', () => {
		// @ts-expect-error - the pair is given whole, so a member always has one `Button` can draw
		assertType<ButtonGroupItemType>({ ...DAY, variant: 'solid' });
	});

	test('reject a color without a variant', () => {
		// @ts-expect-error - a color alone would leave the variant to the group, and the pair unchecked
		assertType<ButtonGroupItemType>({ ...DAY, color: 'danger' });
	});

	test('reject a pair Button cannot draw', () => {
		// @ts-expect-error - outlined only has a secondary treatment
		assertType<ButtonGroupItemType>({ ...DAY, variant: 'outlined', color: 'primary' });
		// @ts-expect-error - ghost only has a secondary treatment
		assertType<ButtonGroupItemType>({ ...DAY, variant: 'ghost', color: 'danger' });
	});

	test('reject noLoadingEffect outside ghost', () => {
		// @ts-expect-error - only the ghost variant plays a loading glow
		assertType<ButtonGroupItemType>({
			...DAY,
			variant: 'solid',
			color: 'primary',
			noLoadingEffect: true,
		});
	});
});

describe('item Button props', () => {
	test('accept every handler and attribute Button takes', () => {
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			onClick: noop,
			onDoubleClick: noop,
			onFocus: noop,
			onBlur: noop,
			onKeyDown: noop,
			onKeyUp: noop,
			onMouseEnter: noop,
			onMouseLeave: noop,
			id: 'day',
			type: 'submit',
			form: 'filters',
			tabIndex: 0,
			autoFocus: true,
			'aria-describedby': 'hint',
			'data-owner': 'alerts',
			textOverflow: 'hidden',
			width: 120,
			maxWidth: '50%',
		});
	});

	test('accept the handlers on a link and an icon member', () => {
		assertType<ButtonGroupItemType>({
			value: 'docs',
			label: 'Docs',
			render: <a href="/docs" />,
			onDoubleClick: noop,
		});
		assertType<ButtonGroupItemType>({
			value: 'next',
			icon: <svg />,
			'aria-label': 'Next',
			onClick: noop,
			onFocus: noop,
		});
	});

	test('reject what the group owns', () => {
		assertType<ButtonGroupItemType>({
			...DAY,
			// @ts-expect-error - members share the group's size
			size: 'sm',
		});
		assertType<ButtonGroupItemType>({
			...DAY,
			// @ts-expect-error - the label goes in `label`
			children: 'Day',
		});
		assertType<ButtonGroupItemType>({
			...DAY,
			// @ts-expect-error - a member takes no `className`
			className: 'x',
		});
		assertType<ButtonGroupItemType>({
			...DAY,
			// @ts-expect-error - a member takes no `style`
			style: {},
		});
	});
});

describe('disabled', () => {
	test('accepts disabled with its reason', () => {
		assertType(<ButtonGroup {...BASE} disabled disabledTooltip="Read only" />);
	});

	test('rejects disabled without a reason', () => {
		assertType(
			// @ts-expect-error - a disabled group has to say why
			<ButtonGroup {...BASE} disabled />,
		);
	});

	test('rejects a reason without disabled', () => {
		assertType(
			// @ts-expect-error - the reason only renders while disabled
			<ButtonGroup {...BASE} disabledTooltip="Read only" />,
		);
	});
});

describe('textOverflow', () => {
	test('accepts hidden and ellipsis', () => {
		assertType(<ButtonGroup {...BASE} textOverflow="hidden" />);
		assertType(<ButtonGroup {...BASE} textOverflow="ellipsis" />);
	});

	test('rejects visible, which let a label paint outside its member', () => {
		// @ts-expect-error - a label always stays inside its member
		assertType(<ButtonGroup {...BASE} textOverflow="visible" />);
	});
});

describe('attributes', () => {
	test('forwards data-*, aria-* and the ref', () => {
		assertType(<ButtonGroup {...BASE} data-owner="alerts" aria-label="Range" ref={groupRef} />);
	});

	test('rejects a raw data-testid', () => {
		assertType(
			// @ts-expect-error - written as `testId`, which also names every member
			<ButtonGroup {...BASE} data-testid="range" />,
		);
	});

	test('rejects a raw data-testid on an item', () => {
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			onClick: noop,
			// @ts-expect-error - written as `testId`, which also names the overflow menu row
			'data-testid': 'day',
		});
	});

	test('rejects an attribute the group does not forward', () => {
		assertType(
			// @ts-expect-error - onClick belongs to the members
			<ButtonGroup {...BASE} onClick={noop} />,
		);
	});

	test('rejects className and style, the look comes from the props and tokens', () => {
		// @ts-expect-error - `className` is not a prop
		assertType(<ButtonGroup {...BASE} className="x" />);
		// @ts-expect-error - `style` is not a prop
		assertType(<ButtonGroup {...BASE} style={{}} />);
	});
});

describe('ButtonGroup entry point types', () => {
	test('exports every part of the item type', () => {
		assertType<ButtonGroupActionItemType>({ onClick: noop });
		assertType<ButtonGroupLinkItemType>({ render: <a href="/docs" /> });
	});
});
