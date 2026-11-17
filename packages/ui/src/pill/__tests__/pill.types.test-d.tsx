/**
 * Type-level tests for the props of {@link Pill} and {@link Pill.Closeable}.
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
 * right above the opening `<Pill` tag. Keep every prop on that opening tag line.
 */
import { assertType, describe, test } from 'vitest';
import { Pill } from '../pill.js';

const noop = (): void => {};

describe('Pill props', () => {
	test('with variant, color and children, is all a pill needs', () => {
		assertType(
			<Pill variant="outlined" color="primary">
				Active
			</Pill>,
		);
	});

	test('takes the size, test ID and id props', () => {
		assertType(
			<Pill variant="outlined" color="primary" width={64} maxWidth="10rem" testId="pill" id="env">
				Active
			</Pill>,
		);
	});
});

describe('Pill.Closeable props', () => {
	test('with onClose and children, is all a closeable pill needs', () => {
		assertType(<Pill.Closeable onClose={noop}>env:prod</Pill.Closeable>);
	});

	test('takes the size, test ID and id props', () => {
		assertType(
			<Pill.Closeable onClose={noop} width={64} maxWidth="10rem" testId="pill" id="env">
				env:prod
			</Pill.Closeable>,
		);
	});
});

describe('rejected props', () => {
	test('Pill rejects className, size has its own props', () => {
		assertType(
			// @ts-expect-error - use `width` and `maxWidth` for the size, `color` for the look
			<Pill variant="outlined" color="primary" className="chip">
				Active
			</Pill>,
		);
	});

	test('Pill rejects style, size has its own props', () => {
		assertType(
			// @ts-expect-error - use `width` and `maxWidth` for the size, `color` for the look
			<Pill variant="outlined" color="primary" style={{ flex: 1 }}>
				Active
			</Pill>,
		);
	});

	test('Pill.Closeable rejects className, size has its own props', () => {
		assertType(
			// @ts-expect-error - use `width` and `maxWidth` for the size
			<Pill.Closeable onClose={noop} className="chip">
				env:prod
			</Pill.Closeable>,
		);
	});

	test('Pill.Closeable rejects style, size has its own props', () => {
		assertType(
			// @ts-expect-error - use `width` and `maxWidth` for the size
			<Pill.Closeable onClose={noop} style={{ flex: 1 }}>
				env:prod
			</Pill.Closeable>,
		);
	});
});
