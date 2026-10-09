/**
 * Type-level tests for the props of {@link Resizable}. Run by `vitest --typecheck` and by
 * `pnpm type-check`. See `dropdown.types.test-d.tsx` for how the cases are written.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Resizable } from '../resizable.js';
import type { ResizableItemType } from '../types.js';

const TWO: ResizableItemType[] = [
	{ value: 'a', label: 'A', children: 'a' },
	{ value: 'b', label: 'B', children: 'b' },
];
const ref = createRef<HTMLDivElement>();

describe('root props', () => {
	test('accepts the required props, a ref, aria-* and data-*', () => {
		assertType(
			<Resizable
				items={TWO}
				orientation="horizontal"
				storageKey="layout"
				storage={sessionStorage}
				testId="split"
				id="split"
				aria-describedby="hint"
				data-area="editor"
				ref={ref}
			/>,
		);
	});

	test('rejects a Resizable with no orientation', () => {
		// @ts-expect-error - `orientation` is required
		assertType(<Resizable items={TWO} />);
	});

	test('rejects an orientation outside the two', () => {
		// @ts-expect-error - `diagonal` is not an orientation
		assertType(<Resizable items={TWO} orientation="diagonal" />);
	});

	/* oxlint-disable react/no-children-prop -- the case under test is a `children` prop */
	test('rejects children, the panels come from items', () => {
		// @ts-expect-error - `children` is not a prop, pass the panels in `items`
		assertType(<Resizable items={TWO} orientation="horizontal" children={<div />} />);
	});
	/* oxlint-enable react/no-children-prop */

	test('rejects className and style, the component owns its look', () => {
		// @ts-expect-error - `className` is not a prop
		assertType(<Resizable items={TWO} orientation="horizontal" className="x" />);
		// @ts-expect-error - `style` is not a prop
		assertType(<Resizable items={TWO} orientation="horizontal" style={{}} />);
	});

	test('rejects data-testid, the prop is testId', () => {
		// @ts-expect-error - `data-testid` is written as `testId`
		assertType(<Resizable items={TWO} orientation="horizontal" data-testid="split" />);
	});

	test('rejects the props of the library', () => {
		// @ts-expect-error - `defaultLayout` is replaced by `storageKey`
		assertType(<Resizable items={TWO} orientation="horizontal" defaultLayout={{ a: 50 }} />);
		// @ts-expect-error - `disabled` has no use-case
		assertType(<Resizable items={TWO} orientation="horizontal" disabled />);
	});

	test('rejects a storage without getItem and setItem', () => {
		assertType(
			<Resizable
				items={TWO}
				orientation="horizontal"
				storageKey="k"
				// @ts-expect-error - a storage needs `setItem` too
				storage={{ getItem: () => null }}
			/>,
		);
	});
});

describe('items', () => {
	test('accepts sizes in %, px and rem, and onResize', () => {
		assertType(
			<Resizable
				orientation="vertical"
				items={[
					{
						value: 'a',
						label: 'A',
						defaultSize: '25%',
						minSize: '10rem',
						maxSize: '600px',
						onResize: (size: number) => size,
						children: 'a',
					},
					{ value: 'b', label: 'B', children: 'b' },
				]}
			/>,
		);
	});

	test('accepts a readonly list', () => {
		const rows = [
			{ value: 'a', label: 'A', defaultSize: '25%', children: 'a' },
			{ value: 'b', label: 'B', children: 'b' },
		] as const;
		const list: readonly ResizableItemType[] = TWO;

		assertType(<Resizable orientation="vertical" items={rows} />);
		assertType(<Resizable orientation="vertical" items={list} />);
	});

	test('rejects a size with no unit', () => {
		assertType(
			<Resizable
				orientation="horizontal"
				// @ts-expect-error - `'25'` has no unit
				items={[{ value: 'a', label: 'A', defaultSize: '25', children: 'a' }]}
			/>,
		);
	});

	test('rejects a size given as a number', () => {
		assertType(
			<Resizable
				orientation="horizontal"
				// @ts-expect-error - `240` has no unit
				items={[{ value: 'a', label: 'A', minSize: 240, children: 'a' }]}
			/>,
		);
	});

	test('rejects a size in a unit other than %, px or rem', () => {
		assertType(
			<Resizable
				orientation="horizontal"
				// @ts-expect-error - `vh` is not one of the units
				items={[{ value: 'a', label: 'A', maxSize: '50vh', children: 'a' }]}
			/>,
		);
	});

	test('rejects a panel with no label', () => {
		assertType(
			<Resizable
				orientation="horizontal"
				// @ts-expect-error - `label` names the handle and is required
				items={[{ value: 'a', children: 'a' }]}
			/>,
		);
	});

	test('rejects a panel with an id instead of a value', () => {
		assertType(
			<Resizable
				orientation="horizontal"
				// @ts-expect-error - a panel is named by `value`
				items={[{ id: 'a', label: 'A', children: 'a' }]}
			/>,
		);
	});

	test('rejects the panel props of the library', () => {
		assertType(
			<Resizable
				orientation="horizontal"
				// @ts-expect-error - `collapsible` has no use-case
				items={[{ value: 'a', label: 'A', collapsible: true, children: 'a' }]}
			/>,
		);
	});
});
