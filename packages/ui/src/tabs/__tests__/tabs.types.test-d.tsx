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
const noop = (): void => {};
const tabsRef = createRef<HTMLDivElement>();

describe('items', () => {
	test('is required', () => {
		// @ts-expect-error - a tab bar with nothing to show is not allowed
		assertType(<Tabs variant="primary" orientation="horizontal" alignment="left" />);
	});

	test('accepts a key, a label and children', () => {
		assertType<TabsItemProps>({ key: 'overview', label: 'Overview', children: 'content' });
	});

	test('rejects an item without a key', () => {
		// @ts-expect-error - `key` is what `value`/`onChange` carry, it cannot be left out
		assertType<TabsItemProps>({ label: 'Overview', children: 'content' });
	});

	test('rejects an item without children', () => {
		// @ts-expect-error - the panel shown while the tab is active cannot be left out
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
		assertType(<Tabs variant="primary" orientation="horizontal" alignment="left" items={ITEMS} />);
		assertType(
			<Tabs variant="secondary" orientation="horizontal" alignment="left" items={ITEMS} />,
		);
	});

	test('is required', () => {
		// @ts-expect-error - `variant` has no default, it must be picked explicitly
		assertType(<Tabs orientation="horizontal" alignment="left" items={ITEMS} />);
	});

	test('rejects a variant outside the set', () => {
		// @ts-expect-error - `outline` is not a TabsVariant
		assertType(<Tabs variant="outline" orientation="horizontal" alignment="left" items={ITEMS} />);
	});
});

describe('orientation', () => {
	test('accepts every TabsOrientation', () => {
		assertType(<Tabs variant="primary" orientation="horizontal" alignment="left" items={ITEMS} />);
		assertType(<Tabs variant="primary" orientation="vertical" alignment="left" items={ITEMS} />);
	});

	test('is required', () => {
		// @ts-expect-error - `orientation` has no default, it must be picked explicitly
		assertType(<Tabs variant="primary" alignment="left" items={ITEMS} />);
	});

	test('rejects an orientation outside the set', () => {
		// @ts-expect-error - `diagonal` is not a TabsOrientation
		assertType(<Tabs variant="primary" orientation="diagonal" alignment="left" items={ITEMS} />);
	});
});

describe('alignment', () => {
	test('accepts every TabsAlignment', () => {
		assertType(<Tabs variant="primary" orientation="horizontal" alignment="left" items={ITEMS} />);
		assertType(
			<Tabs variant="primary" orientation="horizontal" alignment="center" items={ITEMS} />,
		);
		assertType(<Tabs variant="primary" orientation="horizontal" alignment="right" items={ITEMS} />);
	});

	test('is required', () => {
		// @ts-expect-error - `alignment` has no default, it must be picked explicitly
		assertType(<Tabs variant="primary" orientation="horizontal" items={ITEMS} />);
	});

	test('rejects an alignment outside the set', () => {
		// @ts-expect-error - `justify` is not a TabsAlignment
		assertType(
			<Tabs variant="primary" orientation="horizontal" alignment="justify" items={ITEMS} />,
		);
	});
});

describe('value, defaultValue and onChange', () => {
	test('accepts a controlled value', () => {
		assertType(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
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
				alignment="left"
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
				alignment="left"
				items={ITEMS}
				onChange={(key: string) => key}
			/>,
		);
	});
});

describe('children', () => {
	test('are rejected, the bar renders from items', () => {
		// @ts-expect-error - there is no slot to compose into, pass `items` instead
		assertType(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
				items={ITEMS}
				children={<span />}
			/>,
		);
	});
});

describe('test ids', () => {
	test('accepts testId and arbitrary data attributes', () => {
		assertType(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
				items={ITEMS}
				testId="views"
				data-state="open"
			/>,
		);
	});

	test('rejects a raw data-testid', () => {
		// @ts-expect-error - use `testId`, it also names every tab
		assertType(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
				items={ITEMS}
				data-testid="views"
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
				alignment="left"
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
				alignment="left"
				items={ITEMS}
			/>,
		);
	});

	test('rejects a misspelled prop', () => {
		// @ts-expect-error - `onChage` is not a prop, a generic `T extends TabsProps` would let it through
		assertType(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
				items={ITEMS}
				onChage={noop}
			/>,
		);
	});
});
