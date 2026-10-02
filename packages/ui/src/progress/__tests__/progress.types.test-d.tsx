/**
 * Type-level tests for the props of {@link Progress}.
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
 * right above the opening `<Progress` tag. Keep every prop on that opening tag line.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Progress } from '../progress.js';

const progressRef = createRef<HTMLDivElement>();

describe('percent', () => {
	test('with color, is all a bar needs', () => {
		assertType(<Progress percent={40} color="primary" />);
	});

	test('is required', () => {
		// @ts-expect-error - `percent` has no default, a bar always shows a value
		assertType(<Progress color="primary" />);
	});
});

describe('color', () => {
	test('accepts every ProgressColor', () => {
		assertType(<Progress percent={40} color="primary" />);
		assertType(<Progress percent={40} color="secondary" />);
		assertType(<Progress percent={40} color="success" />);
		assertType(<Progress percent={40} color="danger" />);
		assertType(<Progress percent={40} color="warning" />);
		assertType(<Progress percent={40} color="info" />);
		assertType(<Progress percent={40} color="archive" />);
		assertType(<Progress percent={40} color="highlight-danger" />);
	});

	test('is required', () => {
		// @ts-expect-error - `color` has no default, the status must be picked explicitly
		assertType(<Progress percent={40} />);
	});

	test('rejects a color outside the palette', () => {
		// @ts-expect-error - `forest` is a ramp, not a ProgressColor
		assertType(<Progress percent={40} color="forest" />);
	});
});

describe('accepted props', () => {
	test('accepts every prop it declares, aria and data attributes', () => {
		assertType(
			<Progress
				percent={40}
				color="success"
				showInfo
				steps={5}
				active
				testId="cpu"
				id="cpu"
				width={160}
				maxWidth="24rem"
				aria-label="CPU usage"
				data-row="host-1"
				ref={progressRef}
			/>,
		);
	});
});

describe('rejected props', () => {
	test('rejects className, size and look have their own props', () => {
		// @ts-expect-error - use `width` and `maxWidth` for the size, `color` for the look
		assertType(<Progress percent={40} color="primary" className="cell" />);
	});

	test('rejects style, size and look have their own props', () => {
		// @ts-expect-error - use `width` and `maxWidth` for the size, `color` for the look
		assertType(<Progress percent={40} color="primary" style={{ flex: 1 }} />);
	});

	test('rejects strokeColor, replaced by color', () => {
		// @ts-expect-error - a raw color does not follow the theme, pick a `color`
		assertType(<Progress percent={40} color="primary" strokeColor="#52c41a" />);
	});

	test('rejects strokeLinecap, the radius is fixed', () => {
		// @ts-expect-error - the track and the fill always take `radius-1`
		assertType(<Progress percent={40} color="primary" strokeLinecap="round" />);
	});

	test('rejects size, the height is fixed', () => {
		// @ts-expect-error - the bar is always `spacing-3` high
		assertType(<Progress percent={40} color="primary" size="small" />);
	});

	test('rejects status, replaced by active', () => {
		// @ts-expect-error - `status="active"` is written `active`
		assertType(<Progress percent={40} color="primary" status="active" />);
	});

	test('rejects value, use percent', () => {
		// @ts-expect-error - the range is always 0 to 100, write `percent`
		assertType(<Progress percent={40} color="primary" value={40} />);
	});

	test('rejects max, the range is fixed', () => {
		// @ts-expect-error - the range is always 0 to 100
		assertType(<Progress percent={40} color="primary" max={50} />);
	});

	test('rejects render, the progress renders its own elements', () => {
		// @ts-expect-error - the progress has no `render` or `asChild`
		assertType(<Progress percent={40} color="primary" render={<span />} />);
	});
});
