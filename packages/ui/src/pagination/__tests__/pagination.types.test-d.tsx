/**
 * Type-level tests for the props of {@link Pagination}, and `Pagination.Cursor`.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it: it
 * either compiles, or it is marked `@ts-expect-error` because we refuse that combination.
 * TypeScript reports an unused `@ts-expect-error` as an error of its own, so loosening a
 * constraint by accident fails the build instead of passing silently.
 *
 * The comment suppresses the line directly below it, so it sits inside the `assertType(...)` call,
 * right above its argument, with every prop on that line.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Pagination } from '../pagination.js';

const ref = createRef<HTMLElement>();
const noop = (): void => {};

describe('Pagination props', () => {
	test('accepts the total alone', () => {
		assertType(<Pagination total={100} />);
	});

	test('accepts every prop', () => {
		assertType(
			<Pagination
				ref={ref}
				id="logs"
				testId="logs-pagination"
				total={100}
				showTotalLabel="pods"
				current={1}
				onPageChange={noop}
				pageSize={10}
				onPageSizeChange={noop}
				pageSizeOptions={{
					items: [
						10,
						{ value: 25, label: 'Auto (25)' },
						{ value: 50, label: '50', testId: 'fifty' },
					],
					label: 'Items',
					position: 'start',
				}}
				showTotal={false}
				variant="compact"
				align="center"
				disabled
				disabledTooltip="Loading"
				aria-label="Logs"
				aria-describedby="hint"
				data-foo="bar"
			/>,
		);
	});

	test('accepts the uncontrolled props', () => {
		assertType(<Pagination total={100} defaultCurrent={2} defaultPageSize={20} />);
	});

	test('accepts pageSizeOptions as a boolean or a partial object', () => {
		assertType(<Pagination total={100} pageSizeOptions />);
		assertType(<Pagination total={100} pageSizeOptions={true} />);
		assertType(<Pagination total={100} pageSizeOptions={false} />);
		assertType(<Pagination total={100} pageSizeOptions={{}} />);
		assertType(<Pagination total={100} pageSizeOptions={{ items: [10, 20] }} />);
		assertType(<Pagination total={100} pageSizeOptions={{ label: 'Items' }} />);
		assertType(<Pagination total={100} pageSizeOptions={{ position: 'start' }} />);
	});

	test('requires total', () => {
		assertType(
			// @ts-expect-error - a bar with no total has nothing to number, `Pagination.Cursor` is for that
			<Pagination />,
		);
	});

	test('rejects className and style, the look comes from the props and tokens', () => {
		assertType(
			// @ts-expect-error - `className` is not a prop
			<Pagination total={100} className="x" />,
		);
		assertType(
			// @ts-expect-error - `style` is not a prop
			<Pagination total={100} style={{}} />,
		);
	});

	test('rejects the props of Pagination.Cursor', () => {
		assertType(
			// @ts-expect-error - `hasNextPage` belongs to `Pagination.Cursor`, a known total knows its last page
			<Pagination total={100} hasNextPage />,
		);
	});

	test('rejects a variant outside numbered and compact', () => {
		assertType(
			// @ts-expect-error - `simple` is `compact`
			<Pagination total={100} variant="simple" />,
		);
	});

	test('rejects an align outside start, center and end', () => {
		assertType(
			// @ts-expect-error - `left` is not an align
			<Pagination total={100} align="left" />,
		);
	});

	test('rejects a pageSizeOptions position outside start and end', () => {
		assertType(
			// @ts-expect-error - `right` is `end`
			<Pagination total={100} pageSizeOptions={{ position: 'right' }} />,
		);
	});

	test('rejects a pageSizeOptions that is neither a boolean nor an object', () => {
		assertType(
			// @ts-expect-error - a string is not a boolean
			<Pagination total={100} pageSizeOptions="yes" />,
		);
		assertType(
			// @ts-expect-error - a list of sizes goes in `pageSizeOptions.items`
			<Pagination total={100} pageSizeOptions={[10, 20]} />,
		);
	});

	test('rejects a pageSizeOptions field that does not exist or has the wrong type', () => {
		assertType(
			// @ts-expect-error - `size` is not a field of `pageSizeOptions`
			<Pagination total={100} pageSizeOptions={{ size: 10 }} />,
		);
		assertType(
			// @ts-expect-error - the label is a string
			<Pagination total={100} pageSizeOptions={{ label: 10 }} />,
		);
	});

	test('rejects the page size options that are not numbers or labelled numbers', () => {
		assertType(
			// @ts-expect-error - an option is a number, or a value with a label
			<Pagination total={100} pageSizeOptions={{ items: ['10'] }} />,
		);
		assertType(
			// @ts-expect-error - an option with a value needs a label
			<Pagination total={100} pageSizeOptions={{ items: [{ value: 25 }] }} />,
		);
		assertType(
			// @ts-expect-error - the value is a number
			<Pagination total={100} pageSizeOptions={{ items: [{ value: '25', label: 'Auto' }] }} />,
		);
	});

	test('rejects the page size props that pageSizeOptions replaced', () => {
		assertType(
			// @ts-expect-error - `enablePageSize` is `pageSizeOptions`
			<Pagination total={100} enablePageSize />,
		);
		assertType(
			// @ts-expect-error - `pageSizeLabel` is `pageSizeOptions.label`
			<Pagination total={100} pageSizeLabel="Items" />,
		);
		assertType(
			// @ts-expect-error - `pageSizePosition` is `pageSizeOptions.position`
			<Pagination total={100} pageSizePosition="start" />,
		);
	});

	test('rejects totalLabel, which showTotalLabel replaced', () => {
		assertType(
			// @ts-expect-error - `totalLabel` is `showTotalLabel`
			<Pagination total={100} totalLabel="pods" />,
		);
	});

	test('rejects a handler with the wrong shape', () => {
		assertType(
			// @ts-expect-error - `onPageChange` gets the page
			<Pagination total={100} onPageChange={(page: string) => page} />,
		);
	});

	test('rejects the props the design left out', () => {
		assertType(
			// @ts-expect-error - the page controls have one size
			<Pagination total={100} size="small" />,
		);
		assertType(
			// @ts-expect-error - `siblingCount`, the page list always has the same seven slots
			<Pagination total={100} siblingCount={2} />,
		);
		assertType(
			// @ts-expect-error - `boundaryCount`, the page list always has the same seven slots
			<Pagination total={100} boundaryCount={2} />,
		);
		assertType(
			// @ts-expect-error - the bar always renders
			<Pagination total={100} hideOnSinglePage />,
		);
		assertType(
			// @ts-expect-error - replaced by `variant="compact"`
			<Pagination total={100} simple />,
		);
		assertType(
			// @ts-expect-error - no use-case today
			<Pagination total={100} showQuickJumper />,
		);
		assertType(
			// @ts-expect-error - the pages are buttons and always render their own elements
			<Pagination total={100} itemRender={noop} />,
		);
		assertType(
			// @ts-expect-error - use `disabled` with `disabledTooltip`
			<Pagination total={100} loading />,
		);
	});
});

describe('Pagination.Cursor props', () => {
	test('accepts hasNextPage alone', () => {
		assertType(<Pagination.Cursor hasNextPage />);
		assertType(<Pagination.Cursor hasNextPage={false} />);
	});

	test('accepts every prop', () => {
		assertType(
			<Pagination.Cursor
				ref={ref}
				id="logs"
				testId="logs-pagination"
				hasNextPage
				current={1}
				onPageChange={noop}
				pageSize={10}
				onPageSizeChange={noop}
				pageSizeOptions={{
					items: [10, { value: 25, label: 'Auto (25)' }],
					label: 'Items',
					position: 'start',
				}}
				showTotal={false}
				align="center"
				disabled
				disabledTooltip="Loading"
				aria-label="Logs"
				data-foo="bar"
			/>,
		);
	});

	test('accepts the uncontrolled props', () => {
		assertType(<Pagination.Cursor hasNextPage defaultCurrent={2} defaultPageSize={20} />);
	});

	test('accepts pageSizeOptions as a boolean or a partial object', () => {
		assertType(<Pagination.Cursor hasNextPage pageSizeOptions />);
		assertType(<Pagination.Cursor hasNextPage pageSizeOptions={true} />);
		assertType(<Pagination.Cursor hasNextPage pageSizeOptions={false} />);
		assertType(<Pagination.Cursor hasNextPage pageSizeOptions={{}} />);
		assertType(<Pagination.Cursor hasNextPage pageSizeOptions={{ items: [10, 20] }} />);
		assertType(<Pagination.Cursor hasNextPage pageSizeOptions={{ label: 'Items' }} />);
		assertType(<Pagination.Cursor hasNextPage pageSizeOptions={{ position: 'start' }} />);
	});

	test('requires hasNextPage', () => {
		assertType(
			// @ts-expect-error - the consumer knows from the cursor whether a page follows
			<Pagination.Cursor />,
		);
	});

	test('rejects total', () => {
		assertType(
			// @ts-expect-error - a list with a cursor does not know its total
			<Pagination.Cursor hasNextPage total={100} />,
		);
	});

	test('rejects showTotalLabel', () => {
		assertType(
			// @ts-expect-error - there is no total to write it after
			<Pagination.Cursor hasNextPage showTotalLabel="pods" />,
		);
	});

	test('rejects variant', () => {
		assertType(
			// @ts-expect-error - a cursor list always renders the compact controls
			<Pagination.Cursor hasNextPage variant="compact" />,
		);
	});

	test('rejects a pageSizeOptions position outside start and end', () => {
		assertType(
			// @ts-expect-error - `right` is `end`
			<Pagination.Cursor hasNextPage pageSizeOptions={{ position: 'right' }} />,
		);
	});

	test('rejects the page size props that pageSizeOptions replaced', () => {
		assertType(
			// @ts-expect-error - `enablePageSize` is `pageSizeOptions`
			<Pagination.Cursor hasNextPage enablePageSize />,
		);
		assertType(
			// @ts-expect-error - `pageSizeLabel` is `pageSizeOptions.label`
			<Pagination.Cursor hasNextPage pageSizeLabel="Items" />,
		);
		assertType(
			// @ts-expect-error - `pageSizePosition` is `pageSizeOptions.position`
			<Pagination.Cursor hasNextPage pageSizePosition="start" />,
		);
	});

	test('rejects className and style, the look comes from the props and tokens', () => {
		assertType(
			// @ts-expect-error - `className` is not a prop
			<Pagination.Cursor hasNextPage className="x" />,
		);
		assertType(
			// @ts-expect-error - `style` is not a prop
			<Pagination.Cursor hasNextPage style={{}} />,
		);
	});
});
