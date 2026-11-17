/**
 * Type-level tests for the props of {@link Spinner}.
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
 * right above the opening `<Spinner` tag. Keep every prop on that opening tag line.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Spinner } from '../spinner.js';

const spinnerRef = createRef<HTMLDivElement>();

describe('accepted props', () => {
	test('needs no prop', () => {
		assertType(<Spinner />);
	});

	test('accepts size as a number or a string', () => {
		assertType(<Spinner size={24} />);
		assertType(<Spinner size="2rem" />);
	});

	test('accepts id, role, aria and testId', () => {
		assertType(
			<Spinner id="results-spinner" role="status" aria-label="Loading" testId="spinner" />,
		);
	});

	test('accepts a ref to the root div', () => {
		assertType(<Spinner ref={spinnerRef} />);
	});
});

describe('rejected props', () => {
	test('rejects className', () => {
		// @ts-expect-error - `className` is not a prop, wrap the spinner to place it
		assertType(<Spinner className="cell" />);
	});

	test('rejects style', () => {
		// @ts-expect-error - `style` is not a prop, wrap the spinner to place it
		assertType(<Spinner style={{ marginLeft: 4 }} />);
	});
});
