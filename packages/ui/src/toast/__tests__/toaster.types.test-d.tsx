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
import type { ToastOffset } from '../index.js';
import { Toaster } from '../toaster.js';

declare const offset: ToastOffset;

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
