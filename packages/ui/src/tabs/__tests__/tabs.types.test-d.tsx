/**
 * Type-level tests for the props of {@link Tabs}.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it: it either
 * compiles, or it is marked `@ts-expect-error` because we refuse that combination. TypeScript
 * reports an unused `@ts-expect-error` as an error of its own, so loosening a constraint by accident
 * fails the build instead of passing silently.
 *
 * The comment suppresses the line directly below it, which is why it sits inside `assertType(...)`
 * right above the opening `<Tabs` tag. Keep every prop on that opening tag line: once oxfmt breaks
 * the props one per line, a prop-level error moves off the tag line and the comment stops covering
 * it. The same holds for the item cases, where the object literal has to open on the `assertType`
 * line.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Tabs } from '../tabs.js';
import type { TabsItemProps } from '../types.js';

const ITEMS: TabsItemProps[] = [
	{ key: 'overview', label: 'Overview', children: 'Overview content' },
	{ key: 'settings', label: 'Settings', children: 'Settings content' },
];

/**
 * The three required props, spread so a case still fits on the opening tag line. `items` typed as
 * `TabsItemProps[]` hides which shape each item has, so the rules that read `items` need a literal:
 * that is what `PANEL_ITEM` and `NAV_ITEM` are for.
 */
const BASE = { variant: 'primary', orientation: 'horizontal', alignment: 'start' } as const;
const PANEL_ITEM = { key: 'overview', label: 'Overview', children: 'Overview content' };
const NAV_ITEM = { key: 'overview', label: 'Overview', render: <a href="/overview" /> };
const noop = (): void => {};
const tabsRef = createRef<HTMLDivElement>();

describe('items', () => {
	test('is required', () => {
		// @ts-expect-error - a tab bar with nothing to show is not allowed
		assertType(<Tabs variant="primary" orientation="horizontal" alignment="start" />);
	});

	test('accepts a key, a label and children', () => {
		assertType<TabsItemProps>({ key: 'overview', label: 'Overview', children: 'content' });
	});

	test('rejects an item without a key', () => {
		// @ts-expect-error - `key` is what `value`/`onChange` carry, it cannot be left out
		assertType<TabsItemProps>({ label: 'Overview', children: 'content' });
	});

	test('rejects an item that neither shows a panel nor navigates', () => {
		// @ts-expect-error - an item carries `children` or `render`, one of the two
		assertType<TabsItemProps>({ key: 'overview', label: 'Overview' });
	});

	test('accepts a disabled item with its reason', () => {
		assertType<TabsItemProps>({
			key: 'billing',
			label: 'Billing',
			children: 'content',
			disabled: true,
			disabledTooltip: 'Ask an admin',
		});
	});

	test('rejects a disabled item without a reason', () => {
		// @ts-expect-error - a disabled tab has to tell the user why it cannot be selected
		assertType<TabsItemProps>({
			key: 'billing',
			label: 'Billing',
			children: 'content',
			disabled: true,
		});
	});

	test('rejects an item reason without a disabled item', () => {
		// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
		assertType<TabsItemProps>({ key: 'b', label: 'B', children: 'c', disabledTooltip: 'Why' });
	});
});

describe('variant', () => {
	test('accepts every TabsVariant', () => {
		assertType(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);
		assertType(
			<Tabs variant="secondary" orientation="horizontal" alignment="start" items={ITEMS} />,
		);
	});

	test('is required', () => {
		// @ts-expect-error - `variant` has no default, it must be picked explicitly
		assertType(<Tabs orientation="horizontal" alignment="start" items={ITEMS} />);
	});

	test('rejects a variant outside the set', () => {
		// @ts-expect-error - `outline` is not a TabsVariant
		assertType(<Tabs variant="outline" orientation="horizontal" alignment="start" items={ITEMS} />);
	});
});

describe('orientation', () => {
	test('accepts every TabsOrientation', () => {
		assertType(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);
	});

	test('is required', () => {
		// @ts-expect-error - `orientation` has no default, it must be picked explicitly
		assertType(<Tabs variant="primary" alignment="start" items={ITEMS} />);
	});

	test('rejects an orientation outside the set', () => {
		// @ts-expect-error - `diagonal` is not a TabsOrientation
		assertType(<Tabs variant="primary" orientation="diagonal" alignment="start" items={ITEMS} />);
	});

	test('rejects vertical, which the bar no longer renders', () => {
		// @ts-expect-error - there is no vertical rail
		assertType(<Tabs variant="primary" orientation="vertical" alignment="start" items={ITEMS} />);
	});
});

describe('alignment', () => {
	test('accepts every TabsAlignment', () => {
		assertType(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);
		assertType(
			<Tabs variant="primary" orientation="horizontal" alignment="center" items={ITEMS} />,
		);
		assertType(<Tabs variant="primary" orientation="horizontal" alignment="end" items={ITEMS} />);
	});

	test('is required', () => {
		// @ts-expect-error - `alignment` has no default, it must be picked explicitly
		assertType(<Tabs variant="primary" orientation="horizontal" items={ITEMS} />);
	});

	test('rejects an alignment outside the set', () => {
		assertType(
			// @ts-expect-error - `justify` is not a TabsAlignment
			<Tabs variant="primary" orientation="horizontal" alignment="justify" items={ITEMS} />,
		);
	});
});

describe('tab bar content', () => {
	test('accepts content at either end of the bar', () => {
		assertType(
			<Tabs {...BASE} items={ITEMS} tabBarStartContent={<span />} tabBarEndContent={<span />} />,
		);
	});

	test('rejects the old left and right names', () => {
		// @ts-expect-error - renamed to `tabBarStartContent`, there is no alias
		assertType(<Tabs {...BASE} items={ITEMS} tabBarLeftContent={<span />} />);
	});
});

describe('value, defaultValue and onChange', () => {
	test('accepts a controlled value', () => {
		assertType(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				value="overview"
				onChange={noop}
			/>,
		);
	});

	test('accepts an uncontrolled default', () => {
		assertType(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				defaultValue="overview"
			/>,
		);
	});

	test('hands onChange the active key, and nothing else', () => {
		assertType(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				onChange={(key: string) => key}
			/>,
		);
	});
});

describe('children', () => {
	test('are rejected while every item brings its own panel', () => {
		// @ts-expect-error - that item's `children` is already its panel
		assertType(<Tabs {...BASE} items={[PANEL_ITEM]} children={<span />} />);
	});

	test('are the panel for a bar whose tabs navigate', () => {
		assertType(<Tabs {...BASE} items={[NAV_ITEM]} value="overview" children={<span />} />);
	});
});

describe('navigating items', () => {
	test('accepts an item that renders as an element of its own', () => {
		assertType<TabsItemProps>({ key: 'logs', label: 'Logs', render: <a href="/logs" /> });
	});

	test('accepts an item that renders through a function', () => {
		assertType<TabsItemProps>({
			key: 'logs',
			label: 'Logs',
			render: (props) => <a {...props} href="/logs" />,
		});
	});

	test('rejects an item that both navigates and owns a panel', () => {
		// @ts-expect-error - a tab either shows its own panel or navigates, never both
		assertType<TabsItemProps>({ key: 'l', label: 'L', children: 'c', render: <a href="/l" /> });
	});

	test('requires a controlled value once every tab navigates', () => {
		// @ts-expect-error - the router owns which tab is active, so the bar cannot keep its own
		assertType(<Tabs {...BASE} items={[NAV_ITEM]} />);
	});

	test('rejects a defaultValue once every tab navigates', () => {
		// @ts-expect-error - `defaultValue` cannot hold a bar whose tabs navigate
		assertType(<Tabs {...BASE} items={[NAV_ITEM]} value="o" defaultValue="o" />);
	});

	test('accepts a controlled bar of navigating tabs', () => {
		assertType(<Tabs {...BASE} items={[NAV_ITEM]} value="overview" onChange={noop} />);
	});
});

describe('test ids', () => {
	test('accepts testId and arbitrary data attributes', () => {
		assertType(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				testId="views"
				data-state="open"
			/>,
		);
	});

	test('rejects a raw data-testid', () => {
		// @ts-expect-error - use `testId`, it also names every tab
		assertType(<Tabs {...BASE} items={ITEMS} data-testid="views" />);
	});

	test('accepts a testId on an item', () => {
		assertType(
			<Tabs
				{...BASE}
				items={[{ key: 'overview', label: 'Overview', children: 'Overview', testId: 'overview' }]}
			/>,
		);
	});
});

describe('remaining props', () => {
	test('accepts the presentational and native ones', () => {
		assertType(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				id="views"
				aria-label="Views"
				noTabContentPadding
			/>,
		);
	});
});

describe('unknown props', () => {
	test('accepts key and ref', () => {
		assertType(
			<Tabs
				key="row"
				ref={tabsRef}
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
			/>,
		);
	});

	test('rejects a misspelled prop', () => {
		// @ts-expect-error - `onChage` is not a prop, a generic `T extends TabsProps` would let it through
		assertType(<Tabs {...BASE} items={ITEMS} onChage={noop} />);
	});
});
