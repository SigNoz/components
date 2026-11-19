/**
 * Type-level tests for the props of {@link Toaster}.
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
 * right above the opening `<Toaster` tag. Keep every prop on that opening tag line.
 */
import { assertType, describe, test } from 'vitest';
import type { ToastOffset, ToastPageInset } from '../index.js';
import { Toaster } from '../toaster.js';

declare const offset: ToastOffset;
declare const pageInset: ToastPageInset;

// Props held in a variable and spread skip the excess property check a literal attribute gets, so
// these catch a rejected prop that reaches the toaster through a spread.
const declaredSpread = { position: 'top-right', limit: 5, offset: 32 } as const;
const classNameSpread = { position: 'top-right', className: 'stack' } as const;
const styleSpread = { position: 'top-right', style: { top: 8 } } as const;

describe('offset', () => {
	test('accepts a number or a string, for every edge', () => {
		assertType(<Toaster offset={32} />);
		assertType(<Toaster offset="3rem" />);
		assertType(<Toaster offset="calc(var(--footer-height) + 16px)" />);
	});

	test('accepts the edges it names, a number or a string each', () => {
		assertType(<Toaster offset={{ bottom: 48 }} />);
		assertType(<Toaster offset={{ top: 0, right: '1rem', bottom: 'var(--footer)', left: 8 }} />);
		assertType(<Toaster offset={{}} />);
		assertType(<Toaster offset={offset} />);
	});

	test('rejects an edge that is not one', () => {
		// @ts-expect-error - `middle` is not an edge of the window
		assertType(<Toaster offset={{ middle: 8 }} />);
		// @ts-expect-error - `inline` is not an edge, name `left` and `right`
		assertType(<Toaster offset={{ inline: 8 }} />);
	});

	test('rejects a value that is not a length', () => {
		// @ts-expect-error - `true` is not a distance
		assertType(<Toaster offset={{ top: true }} />);
		// @ts-expect-error - leave the edge out instead of passing `null`
		assertType(<Toaster offset={{ top: null }} />);
		// @ts-expect-error - an array is not a distance
		assertType(<Toaster offset={[8, 8]} />);
	});
});

describe('pageInset', () => {
	test('accepts the edges it names, a number or a string each', () => {
		assertType(<Toaster pageInset={{ bottom: 24 }} />);
		assertType(<Toaster pageInset={{ top: '2rem', bottom: 'var(--bottom-strip-height, 0px)' }} />);
		assertType(<Toaster pageInset={{}} />);
		assertType(<Toaster pageInset={pageInset} />);
	});

	test('rejects an edge that is not top or bottom', () => {
		// @ts-expect-error - the chrome of the page insets only the top and the bottom
		assertType(<Toaster pageInset={{ left: 8 }} />);
		// @ts-expect-error - `inline` is not an edge
		assertType(<Toaster pageInset={{ inline: 8 }} />);
	});

	test('rejects a single value, it has to name an edge', () => {
		// @ts-expect-error - a number is not an object of edges
		assertType(<Toaster pageInset={24} />);
		// @ts-expect-error - a string is not an object of edges
		assertType(<Toaster pageInset="var(--bottom-strip-height, 0px)" />);
	});

	test('rejects a value that is not a length', () => {
		// @ts-expect-error - `true` is not a distance
		assertType(<Toaster pageInset={{ bottom: true }} />);
		// @ts-expect-error - leave the edge out instead of passing `null`
		assertType(<Toaster pageInset={{ top: null }} />);
	});
});

describe('rejected props', () => {
	test('rejects className, the stack has a fixed place and size', () => {
		// @ts-expect-error - the stack is placed by `position` and `offset`
		assertType(<Toaster className="stack" />);
	});

	test('rejects style, the stack has a fixed place and size', () => {
		// @ts-expect-error - the stack is placed by `position` and `offset`
		assertType(<Toaster style={{ top: 8 }} />);
	});

	test('accepts a spread of the props it declares', () => {
		assertType(<Toaster {...declaredSpread} />);
	});

	test('rejects a className spread', () => {
		// @ts-expect-error - a spread is checked like written props, `className` is not one
		assertType(<Toaster {...classNameSpread} />);
	});

	test('rejects a style spread', () => {
		// @ts-expect-error - a spread is checked like written props, `style` is not one
		assertType(<Toaster {...styleSpread} />);
	});
});
