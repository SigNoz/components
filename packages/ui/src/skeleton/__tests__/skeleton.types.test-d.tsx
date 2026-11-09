/**
 * Type-level tests for the props of {@link Skeleton} and its parts, `Skeleton.Input`,
 * `Skeleton.Button` and `Skeleton.Avatar`.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it: it either
 * compiles, or it is marked `@ts-expect-error` because we refuse that prop. TypeScript reports an
 * unused `@ts-expect-error` as an error of its own, so loosening a constraint by accident fails the
 * build instead of passing silently.
 *
 * The comment suppresses the line directly below it, which is why it sits inside `assertType(...)`
 * right above the opening `<Skeleton` tag. Keep every prop on that opening tag line.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Skeleton } from '../skeleton.js';

const skeletonRef = createRef<HTMLDivElement>();

// Props held in a variable and spread skip the excess property check a literal attribute gets, so
// these catch a `className` or `style` that reaches a part through a spread.
const rootSpread = { title: false, className: 'card' };
const inputSpread = { size: 'md', style: { height: 14 } } as const;
const buttonSpread = { size: 'md', className: 'action' } as const;
const avatarSpread = { size: 'sm', style: { borderRadius: 4 } } as const;
const declaredSpread = { size: 'md', width: 40, 'data-row': 'first' } as const;

describe('Skeleton accepted props', () => {
	test('needs no prop', () => {
		assertType(<Skeleton />);
	});

	test('accepts every prop it declares, and data attributes', () => {
		assertType(
			<Skeleton
				active
				title={{ width: 120 }}
				paragraph={{ rows: 4, width: ['100%', 80, '60%'] }}
				width={320}
				maxWidth="24rem"
				testId="card"
				id="card"
				data-row="host-1"
				ref={skeletonRef}
			/>,
		);
	});

	test('accepts title and paragraph as booleans', () => {
		assertType(<Skeleton title={false} paragraph />);
		assertType(<Skeleton title paragraph={false} />);
	});

	test('accepts title and paragraph as empty configs', () => {
		assertType(<Skeleton title={{}} paragraph={{}} />);
	});

	test('accepts a number or a string for every width', () => {
		assertType(<Skeleton width={160} maxWidth={320} />);
		assertType(<Skeleton width="50%" maxWidth="100%" />);
		assertType(<Skeleton title={{ width: '60%' }} paragraph={{ width: 80 }} />);
		assertType(<Skeleton paragraph={{ width: '50%' }} />);
	});

	test('accepts rows as a number', () => {
		assertType(<Skeleton paragraph={{ rows: 0 }} />);
		assertType(<Skeleton paragraph={{ rows: 6 }} />);
	});
});

describe('Skeleton rejected props', () => {
	test('rejects className, the size comes from width and maxWidth', () => {
		// @ts-expect-error - use `width` and `maxWidth` for the size
		assertType(<Skeleton className="card" />);
	});

	test('rejects style, the size comes from width and maxWidth', () => {
		// @ts-expect-error - use `width` and `maxWidth` for the size
		assertType(<Skeleton style={{ flex: 1 }} />);
	});

	test('rejects size, the root has no size', () => {
		// @ts-expect-error - only the parts for a control take `size`
		assertType(<Skeleton size="md" />);
	});

	test('rejects loading, the consumer renders the skeleton in its own branch', () => {
		// @ts-expect-error - no call site wraps content in the skeleton
		assertType(<Skeleton loading />);
	});

	test('rejects children, the skeleton never wraps content', () => {
		// @ts-expect-error - render the skeleton instead of the content
		assertType(<Skeleton active>content</Skeleton>);
	});

	test('rejects children without any other prop', () => {
		// @ts-expect-error - render the skeleton instead of the content
		assertType(<Skeleton>content</Skeleton>);
	});

	test('rejects avatar, compose Skeleton.Avatar next to a Skeleton', () => {
		// @ts-expect-error - a text block with an avatar is two components
		assertType(<Skeleton avatar />);
	});

	test('rejects round, the radius is fixed', () => {
		// @ts-expect-error - the radius is fixed
		assertType(<Skeleton round />);
	});

	test('rejects block, replaced by width', () => {
		// @ts-expect-error - write `width="100%"`
		assertType(<Skeleton block />);
	});

	test('rejects a title that is not a boolean or a config', () => {
		// @ts-expect-error - `title` is a boolean or `{ width }`
		assertType(<Skeleton title="Loading" />);
	});

	test('rejects a title width that is not a string or a number', () => {
		// @ts-expect-error - the width is a string or a number
		assertType(<Skeleton title={{ width: true }} />);
	});

	test('rejects rows that are not a number', () => {
		// @ts-expect-error - `rows` is a number
		assertType(<Skeleton paragraph={{ rows: '3' }} />);
	});

	test('rejects a paragraph width that is not a string, a number or an array of both', () => {
		// @ts-expect-error - a row width is a string or a number
		assertType(<Skeleton paragraph={{ width: [true] }} />);
	});

	test('rejects a paragraph option that does not exist', () => {
		// @ts-expect-error - the paragraph takes `rows` and `width` only
		assertType(<Skeleton paragraph={{ gap: 4 }} />);
	});

	test('rejects a title option that does not exist', () => {
		// @ts-expect-error - the title takes `width` only
		assertType(<Skeleton title={{ height: 24 }} />);
	});
});

describe('Skeleton.Input accepted props', () => {
	test('accepts every size', () => {
		assertType(<Skeleton.Input size="sm" />);
		assertType(<Skeleton.Input size="md" />);
	});

	test('accepts every prop it declares, and data attributes', () => {
		assertType(
			<Skeleton.Input
				size="md"
				active
				width={240}
				maxWidth="100%"
				testId="field"
				id="field"
				data-row="host-1"
				ref={skeletonRef}
			/>,
		);
	});

	test('accepts a number or a string for every width', () => {
		assertType(<Skeleton.Input size="sm" width={160} maxWidth={320} />);
		assertType(<Skeleton.Input size="sm" width="50%" maxWidth="24rem" />);
	});
});

describe('Skeleton.Input rejected props', () => {
	test('rejects className, the size comes from size, width and maxWidth', () => {
		// @ts-expect-error - use `size`, `width` and `maxWidth`
		assertType(<Skeleton.Input size="md" className="field" />);
	});

	test('rejects style, the size comes from size, width and maxWidth', () => {
		// @ts-expect-error - use `size`, `width` and `maxWidth`
		assertType(<Skeleton.Input size="md" style={{ height: 14 }} />);
	});

	test('rejects a missing size, it has no default', () => {
		// @ts-expect-error - `size` has no default, the height must be picked explicitly
		assertType(<Skeleton.Input />);
	});

	test('rejects size small, the legacy value', () => {
		// @ts-expect-error - `small` is written `sm`
		assertType(<Skeleton.Input size="small" />);
	});

	test('rejects size default, the legacy value', () => {
		// @ts-expect-error - `default` is written `md`
		assertType(<Skeleton.Input size="default" />);
	});

	test('rejects size large, there is no lg', () => {
		// @ts-expect-error - there is no placeholder for a 40px input
		assertType(<Skeleton.Input size="large" />);
	});

	test('rejects a numeric size', () => {
		// @ts-expect-error - the size is `sm` or `md`
		assertType(<Skeleton.Input size={36} />);
	});

	test('rejects block, replaced by width', () => {
		// @ts-expect-error - write `width="100%"`
		assertType(<Skeleton.Input size="md" block />);
	});

	test('rejects shape, an input has no shape', () => {
		// @ts-expect-error - only the avatar has a shape
		assertType(<Skeleton.Input size="md" shape="square" />);
	});

	test('rejects children, the placeholder is one element', () => {
		// @ts-expect-error - the placeholder has no children
		assertType(<Skeleton.Input size="md">content</Skeleton.Input>);
	});
});

describe('Skeleton.Button accepted props', () => {
	test('accepts every size', () => {
		assertType(<Skeleton.Button size="sm" />);
		assertType(<Skeleton.Button size="md" />);
	});

	test('accepts every prop it declares, and data attributes', () => {
		assertType(
			<Skeleton.Button
				size="md"
				active
				width="100%"
				maxWidth={320}
				testId="action"
				id="action"
				data-row="host-1"
				ref={skeletonRef}
			/>,
		);
	});

	test('accepts a number or a string for every width', () => {
		assertType(<Skeleton.Button size="sm" width={96} maxWidth={320} />);
		assertType(<Skeleton.Button size="sm" width="100%" maxWidth="24rem" />);
	});
});

describe('Skeleton.Button rejected props', () => {
	test('rejects className, the size comes from size, width and maxWidth', () => {
		// @ts-expect-error - use `size`, `width` and `maxWidth`
		assertType(<Skeleton.Button size="md" className="action" />);
	});

	test('rejects style, the size comes from size, width and maxWidth', () => {
		// @ts-expect-error - use `size`, `width` and `maxWidth`
		assertType(<Skeleton.Button size="md" style={{ width: 90 }} />);
	});

	test('rejects a missing size, it has no default', () => {
		// @ts-expect-error - `size` has no default, the height must be picked explicitly
		assertType(<Skeleton.Button />);
	});

	test('rejects size small, the legacy value', () => {
		// @ts-expect-error - `small` is written `sm`
		assertType(<Skeleton.Button size="small" />);
	});

	test('rejects size default, the legacy value', () => {
		// @ts-expect-error - `default` is written `md`
		assertType(<Skeleton.Button size="default" />);
	});

	test('rejects size large, there is no lg', () => {
		// @ts-expect-error - there is no placeholder for a 40px button
		assertType(<Skeleton.Button size="large" />);
	});

	test('rejects block, replaced by width 100%', () => {
		// @ts-expect-error - write `width="100%"`
		assertType(<Skeleton.Button size="md" block />);
	});

	test('rejects shape, a button has no round or circle shape', () => {
		// @ts-expect-error - `Button` has no shape
		assertType(<Skeleton.Button size="md" shape="round" />);
	});

	test('rejects children, the placeholder is one element', () => {
		// @ts-expect-error - the placeholder has no children
		assertType(<Skeleton.Button size="md">content</Skeleton.Button>);
	});
});

describe('Skeleton.Avatar accepted props', () => {
	test('accepts every size', () => {
		assertType(<Skeleton.Avatar size="sm" />);
		assertType(<Skeleton.Avatar size="md" />);
	});

	test('accepts every shape', () => {
		assertType(<Skeleton.Avatar size="md" shape="circle" />);
		assertType(<Skeleton.Avatar size="md" shape="square" />);
	});

	test('accepts every prop it declares, and data attributes', () => {
		assertType(
			<Skeleton.Avatar
				size="md"
				shape="square"
				active
				testId="owner"
				id="owner"
				data-row="host-1"
				ref={skeletonRef}
			/>,
		);
	});
});

describe('Skeleton.Avatar rejected props', () => {
	test('rejects className, the size comes from size', () => {
		// @ts-expect-error - use `size`
		assertType(<Skeleton.Avatar size="md" className="owner" />);
	});

	test('rejects style, the size comes from size', () => {
		// @ts-expect-error - use `size`
		assertType(<Skeleton.Avatar size="md" style={{ width: 36 }} />);
	});

	test('rejects a missing size, it has no default', () => {
		// @ts-expect-error - `size` has no default, the size must be picked explicitly
		assertType(<Skeleton.Avatar />);
	});

	test('rejects size small, the legacy value', () => {
		// @ts-expect-error - `small` is written `sm`
		assertType(<Skeleton.Avatar size="small" />);
	});

	test('rejects size default, the legacy value', () => {
		// @ts-expect-error - `default` is written `md`
		assertType(<Skeleton.Avatar size="default" />);
	});

	test('rejects size large, there is no lg', () => {
		// @ts-expect-error - there is no placeholder for a 40px avatar
		assertType(<Skeleton.Avatar size="large" />);
	});

	test('rejects a numeric size, the free size is dropped', () => {
		// @ts-expect-error - the size is `sm` or `md`
		assertType(<Skeleton.Avatar size={36} />);
	});

	test('rejects a shape outside circle and square', () => {
		// @ts-expect-error - the shapes are `circle` and `square`
		assertType(<Skeleton.Avatar size="md" shape="rounded" />);
	});

	test('rejects width, the size comes from size', () => {
		// @ts-expect-error - the avatar is a square of `size`
		assertType(<Skeleton.Avatar size="md" width={40} />);
	});

	test('rejects maxWidth, the size comes from size', () => {
		// @ts-expect-error - the avatar is a square of `size`
		assertType(<Skeleton.Avatar size="md" maxWidth={40} />);
	});

	test('rejects children, the placeholder is one element', () => {
		// @ts-expect-error - the placeholder has no children
		assertType(<Skeleton.Avatar size="md">content</Skeleton.Avatar>);
	});
});

describe('Skeleton spread props', () => {
	test('accepts a spread of declared props', () => {
		assertType(<Skeleton.Button {...declaredSpread} />);
	});

	test('rejects a className spread into the root', () => {
		// @ts-expect-error - a spread is checked like written props, `className` is not one
		assertType(<Skeleton {...rootSpread} />);
	});

	test('rejects a style spread into Skeleton.Input', () => {
		// @ts-expect-error - a spread is checked like written props, `style` is not one
		assertType(<Skeleton.Input {...inputSpread} />);
	});

	test('rejects a className spread into Skeleton.Button', () => {
		// @ts-expect-error - a spread is checked like written props, `className` is not one
		assertType(<Skeleton.Button {...buttonSpread} />);
	});

	test('rejects a style spread into Skeleton.Avatar', () => {
		// @ts-expect-error - a spread is checked like written props, `style` is not one
		assertType(<Skeleton.Avatar {...avatarSpread} />);
	});
});
