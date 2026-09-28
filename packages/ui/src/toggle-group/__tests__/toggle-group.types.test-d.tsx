/**
 * Type-level tests for the props of {@link ToggleGroup}.
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
 * right above the opening `<ToggleGroup` tag. Keep every prop on that opening tag line: once oxfmt
 * breaks the props one per line, a prop-level error moves off the tag line and the comment stops
 * covering it.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { ToggleGroup } from '../toggle-group.js';
import type { ToggleGroupItemProps } from '../types.js';

const ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
];

/** The appearance props, spread so a case still fits on the opening tag line. */
const BASE = { variant: 'outlined', color: 'secondary', size: 'md' } as const;
const noop = (): void => {};
const maybeReadOnly = false as boolean | undefined;
const groupRef = createRef<HTMLDivElement>();

describe('items', () => {
	test('is required', () => {
		// @ts-expect-error - a bar with nothing to show is not allowed
		assertType(<ToggleGroup type="single" variant="outlined" color="secondary" size="md" />);
	});

	test('accepts a value and a label', () => {
		assertType<ToggleGroupItemProps>({ value: 'list', label: 'List' });
	});

	test('rejects an item without a value', () => {
		// @ts-expect-error - `value` is what `value`/`onChange` carry, it cannot be left out
		assertType<ToggleGroupItemProps>({ label: 'List' });
	});

	test('accepts a disabled item with its reason', () => {
		assertType<ToggleGroupItemProps>({
			value: 'profiles',
			label: 'Profiles',
			disabled: true,
			disabledTooltip: 'Profiling is not enabled',
		});
	});

	test('rejects a disabled item without a reason', () => {
		// @ts-expect-error - a disabled button has to tell the user why it cannot be used
		assertType<ToggleGroupItemProps>({ value: 'profiles', label: 'Profiles', disabled: true });
	});

	test('rejects an item reason without a disabled item', () => {
		// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
		assertType<ToggleGroupItemProps>({ value: 'p', label: 'P', disabledTooltip: 'Not enabled' });
	});

	test('accepts a prefix and a suffix', () => {
		assertType<ToggleGroupItemProps>({
			value: 'list',
			label: 'List',
			prefix: <span />,
			suffix: <span />,
		});
	});

	test('rejects a prefix that is not an element', () => {
		// @ts-expect-error - the slot wraps one element, text belongs in `label`
		assertType<ToggleGroupItemProps>({ value: 'list', label: 'List', prefix: 'icon' });
	});
});

describe('bar disabled', () => {
	test('accepts disabled with its reason', () => {
		assertType(
			<ToggleGroup
				type="single"
				{...BASE}
				items={ITEMS}
				disabled
				disabledTooltip="This workspace is read only"
			/>,
		);
	});

	test('rejects disabled without a reason', () => {
		// @ts-expect-error - a bar that cannot be used has to tell the user why
		assertType(<ToggleGroup type="single" {...BASE} items={ITEMS} disabled />);
	});

	test('rejects a reason without disabled', () => {
		// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
		assertType(<ToggleGroup type="single" {...BASE} items={ITEMS} disabledTooltip="Read only" />);
	});
});

describe('bar read-only', () => {
	test('accepts readOnly with its reason', () => {
		assertType(
			<ToggleGroup type="single" {...BASE} items={ITEMS} readOnly readOnlyTooltip="Saving" />,
		);
	});

	test('accepts an explicitly undefined reason', () => {
		assertType(
			<ToggleGroup type="single" {...BASE} items={ITEMS} readOnly readOnlyTooltip={undefined} />,
		);
	});

	test('rejects readOnly without a reason', () => {
		// @ts-expect-error - a locked bar has to tell the user why its value cannot change
		assertType(<ToggleGroup type="single" {...BASE} items={ITEMS} readOnly />);
	});

	test('rejects a reason without readOnly', () => {
		// @ts-expect-error - `readOnlyTooltip` never renders unless `readOnly` is set
		assertType(<ToggleGroup type="single" {...BASE} items={ITEMS} readOnlyTooltip="Saving" />);
	});

	test('a possibly undefined readOnly still needs a reason', () => {
		// @ts-expect-error - `readOnly` typed `boolean | undefined` is still `readOnly`
		assertType(<ToggleGroup type="single" {...BASE} items={ITEMS} readOnly={maybeReadOnly} />);
	});

	test('accepts both pairs at once, where readOnly wins at runtime', () => {
		assertType(
			<ToggleGroup
				type="single"
				{...BASE}
				items={ITEMS}
				disabled
				disabledTooltip="Ask an admin"
				readOnly
				readOnlyTooltip="Saving"
			/>,
		);
	});
});

describe('appearance', () => {
	test('requires variant, color and size', () => {
		// @ts-expect-error - the bar states its treatment rather than defaulting to one
		assertType(<ToggleGroup type="single" items={ITEMS} />);
	});

	test('rejects a variant the design spec does not draw', () => {
		// @ts-expect-error - `outlined` is the only variant
		assertType(<ToggleGroup type="single" {...BASE} variant="solid" items={ITEMS} />);
	});

	test('rejects a size that is not sm or md', () => {
		// @ts-expect-error - `lg` was dropped, no other input is that tall
		assertType(<ToggleGroup type="single" {...BASE} size="lg" items={ITEMS} />);
	});
});

describe('selection', () => {
	test('accepts a string value on a single bar', () => {
		assertType(<ToggleGroup type="single" {...BASE} items={ITEMS} value="list" onChange={noop} />);
	});

	test('accepts an array value on a multiple bar', () => {
		assertType(<ToggleGroup type="multiple" {...BASE} items={ITEMS} value={['list']} />);
	});

	test('rejects an array value on a single bar', () => {
		// @ts-expect-error - a single bar presses one button, so its value is a string
		assertType(<ToggleGroup type="single" {...BASE} items={ITEMS} value={['list']} />);
	});

	test('rejects a string value on a multiple bar', () => {
		// @ts-expect-error - a multiple bar reports every pressed value, so its value is an array
		assertType(<ToggleGroup type="multiple" {...BASE} items={ITEMS} value="list" />);
	});

	test('accepts allowClear on either type', () => {
		assertType(<ToggleGroup type="single" {...BASE} items={ITEMS} allowClear />);
		assertType(<ToggleGroup type="multiple" {...BASE} items={ITEMS} allowClear />);
	});

	test('rejects a handler taking an array on a single bar', () => {
		// @ts-expect-error - `onChange` carries the string a single bar reports
		assertType(<ToggleGroup type="single" {...BASE} items={ITEMS} onChange={(v: string[]) => v} />);
	});
});

describe('root props', () => {
	test('accepts a ref, aria-* and data-*', () => {
		assertType(
			<ToggleGroup
				type="single"
				{...BASE}
				items={ITEMS}
				ref={groupRef}
				aria-label="Layout"
				data-analytics="layout"
			/>,
		);
	});

	test('rejects data-testid in favour of testId', () => {
		// @ts-expect-error - `data-testid` is written as `testId`, which also names every button
		assertType(<ToggleGroup type="single" {...BASE} items={ITEMS} data-testid="layout" />);
	});

	test('rejects a prop the bar does not have', () => {
		// @ts-expect-error - `orientation` was rejected: there is no vertical segmented bar
		assertType(<ToggleGroup type="single" {...BASE} items={ITEMS} orientation="vertical" />);
	});
});
