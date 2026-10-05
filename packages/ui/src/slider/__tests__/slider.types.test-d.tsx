/**
 * Type-level tests for the props of {@link Slider} and `Slider.Range`.
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
 * right above the opening `<Slider` tag. Keep every prop on that opening tag line.
 */
import { createRef } from 'react';
import { assertType, describe, expectTypeOf, test } from 'vitest';
import { Slider } from '../slider.js';
import type { SliderRangeValue } from '../types.js';

const sliderRef = createRef<HTMLDivElement>();

declare const maybeDisabled: boolean | undefined;
declare const maybeReadOnly: boolean | undefined;

describe('Slider value', () => {
	test('takes and returns a number, with no cast', () => {
		assertType(
			<Slider
				color="primary"
				value={40}
				onChange={(value) => expectTypeOf(value).toEqualTypeOf<number>()}
			/>,
		);
		assertType(
			<Slider
				color="primary"
				defaultValue={40}
				onAfterChange={(value) => expectTypeOf(value).toEqualTypeOf<number>()}
			/>,
		);
	});

	test('rejects a pair, which is Slider.Range', () => {
		// @ts-expect-error - a pair is a range, write `Slider.Range`
		assertType(<Slider color="primary" value={[10, 20]} />);
	});

	test('rejects a handler that takes a pair', () => {
		// @ts-expect-error - `Slider` reports a number, never a pair
		assertType(<Slider color="primary" onChange={(value: SliderRangeValue) => value} />);
	});
});

describe('Slider.Range value', () => {
	test('takes and returns a pair, with no cast', () => {
		assertType(
			<Slider.Range
				color="primary"
				value={[10, 20]}
				onChange={(value) => expectTypeOf(value).toEqualTypeOf<SliderRangeValue>()}
			/>,
		);
		assertType(
			<Slider.Range
				color="primary"
				defaultValue={[10, 20] as const}
				onAfterChange={(value) => expectTypeOf(value).toEqualTypeOf<SliderRangeValue>()}
			/>,
		);
	});

	test('rejects a single number', () => {
		// @ts-expect-error - a range holds a lower and an upper bound
		assertType(<Slider.Range color="primary" value={10} />);
	});

	test('rejects three values', () => {
		// @ts-expect-error - a range holds exactly two values
		assertType(<Slider.Range color="primary" value={[10, 20, 30]} />);
	});
});

describe('accepted props', () => {
	test('accepts every prop it declares, aria and data attributes', () => {
		assertType(
			<Slider
				color="primary"
				value={40}
				onChange={() => {}}
				onAfterChange={() => {}}
				min={0}
				max={100}
				step={5}
				marks={{ 0: '1 GB', 100: '10 TB' }}
				tooltip
				formatValue={(value) => `${value} GB`}
				name="volume"
				form="settings"
				required
				disabled
				disabledTooltip="Pick a source first"
				readOnly
				readOnlyTooltip="Set by the admin"
				width={240}
				maxWidth="24rem"
				testId="volume"
				id="volume"
				aria-label="Logs volume"
				data-row="host-1"
				ref={sliderRef}
			/>,
		);
	});

	test('accepts the same props on Slider.Range', () => {
		assertType(
			<Slider.Range
				color="primary"
				value={[0, 100]}
				marks={{ 0: '0 ms' }}
				tooltip
				formatValue={String}
				readOnly
				readOnlyTooltip="Set by the admin"
				aria-labelledby="duration-label"
				ref={sliderRef}
			/>,
		);
	});
});

describe('color', () => {
	test('accepts every Badge color', () => {
		assertType(<Slider color="highlight-danger" value={40} />);
		assertType(<Slider.Range color="archive" value={[10, 20]} />);
	});

	test('is required, with no default', () => {
		// @ts-expect-error - pick the color, there is no default
		assertType(<Slider value={40} />);
		// @ts-expect-error - pick the color, there is no default
		assertType(<Slider.Range value={[10, 20]} />);
	});

	test('rejects a color outside the Badge palette', () => {
		// @ts-expect-error - a raw color does not follow the theme
		assertType(<Slider color="#4E74F8" value={40} />);
	});
});

describe('disabled and disabledTooltip', () => {
	test('accepts the pair', () => {
		assertType(
			<Slider color="primary" value={40} disabled disabledTooltip="Pick a source first" />,
		);
		assertType(
			<Slider color="primary" value={40} disabled={false} disabledTooltip="Pick a source first" />,
		);
	});

	test('accepts an explicit undefined reason as the opt-out', () => {
		assertType(<Slider color="primary" value={40} disabled disabledTooltip={undefined} />);
	});

	test('a possibly undefined disabled still needs a reason', () => {
		// @ts-expect-error - `disabled` typed `boolean | undefined` is still `disabled`
		assertType(<Slider color="primary" value={40} disabled={maybeDisabled} />);
	});

	test('disabled without a reason is rejected', () => {
		// @ts-expect-error - a disabled slider must explain itself through `disabledTooltip`
		assertType(<Slider color="primary" value={40} disabled />);
	});

	test('a reason without disabled is rejected', () => {
		// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
		assertType(<Slider color="primary" value={40} disabledTooltip="Pick a source first" />);
	});

	test('applies the same rules to Slider.Range', () => {
		assertType(
			<Slider.Range color="primary" value={[10, 20]} disabled disabledTooltip={undefined} />,
		);
		// @ts-expect-error - a disabled range must explain itself through `disabledTooltip`
		assertType(<Slider.Range color="primary" value={[10, 20]} disabled />);
		assertType(
			// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
			<Slider.Range color="primary" value={[10, 20]} disabledTooltip="Pick a source first" />,
		);
	});

	test('both pairs live together', () => {
		assertType(
			<Slider
				color="primary"
				value={40}
				disabled
				disabledTooltip="Pick a source first"
				readOnly
				readOnlyTooltip="Set by the admin"
			/>,
		);
	});
});

describe('readOnly and readOnlyTooltip', () => {
	test('accepts the pair', () => {
		assertType(<Slider color="primary" value={40} readOnly readOnlyTooltip="Set by the admin" />);
	});

	test('accepts an explicit undefined reason as the opt-out', () => {
		assertType(<Slider color="primary" value={40} readOnly readOnlyTooltip={undefined} />);
	});

	test('a possibly undefined readOnly still needs a reason', () => {
		// @ts-expect-error - `readOnly` typed `boolean | undefined` is still `readOnly`
		assertType(<Slider color="primary" value={40} readOnly={maybeReadOnly} />);
	});

	test('readOnly without a reason is rejected', () => {
		// @ts-expect-error - a locked slider must explain itself through `readOnlyTooltip`
		assertType(<Slider color="primary" value={40} readOnly />);
	});

	test('a reason without readOnly is rejected', () => {
		// @ts-expect-error - `readOnlyTooltip` never renders unless `readOnly` is set
		assertType(<Slider color="primary" value={40} readOnlyTooltip="Set by the admin" />);
	});

	test('applies the same rules to Slider.Range', () => {
		assertType(
			<Slider.Range color="primary" value={[10, 20]} readOnly readOnlyTooltip={undefined} />,
		);
		// @ts-expect-error - a locked range must explain itself through `readOnlyTooltip`
		assertType(<Slider.Range color="primary" value={[10, 20]} readOnly />);
		assertType(
			// @ts-expect-error - `readOnlyTooltip` never renders unless `readOnly` is set
			<Slider.Range color="primary" value={[10, 20]} readOnlyTooltip="Set by the admin" />,
		);
	});
});

describe('rejected props', () => {
	test('rejects className, the size has its own props', () => {
		// @ts-expect-error - use `width` and `maxWidth` for the size
		assertType(<Slider color="primary" value={40} className="config-slider" />);
	});

	test('rejects style, the size has its own props', () => {
		// @ts-expect-error - use `width` and `maxWidth` for the size
		assertType(<Slider color="primary" value={40} style={{ flex: 1 }} />);
	});

	test('rejects range, replaced by Slider.Range', () => {
		// @ts-expect-error - write `Slider.Range` for two thumbs
		assertType(<Slider color="primary" value={40} range />);
	});

	test('rejects styles, the parts take no style', () => {
		assertType(
			// @ts-expect-error - the parts of the slider take no style
			<Slider color="primary" value={40} styles={{ range: { backgroundColor: '#4E74F8' } }} />,
		);
	});

	test('rejects classNames, the parts take no class', () => {
		// @ts-expect-error - the parts of the slider take no class
		assertType(<Slider color="primary" value={40} classNames={{ track: 'track' }} />);
	});

	test('rejects orientation, the slider is horizontal only', () => {
		// @ts-expect-error - the slider is horizontal only
		assertType(<Slider color="primary" value={40} orientation="vertical" />);
	});

	test('rejects the tooltip object, replaced by tooltip and formatValue', () => {
		// @ts-expect-error - write `tooltip` and `formatValue`
		assertType(<Slider color="primary" value={40} tooltip={{ formatter: String }} />);
	});

	test('rejects a mark that is not a string', () => {
		// @ts-expect-error - a mark label is a string
		assertType(<Slider color="primary" value={40} marks={{ 0: { label: '0', style: {} } }} />);
	});

	test('rejects formatValue returning a node, it feeds aria-valuetext', () => {
		// @ts-expect-error - `formatValue` returns a string, it is read by screen readers
		assertType(<Slider color="primary" value={40} formatValue={(value) => <b>{value}</b>} />);
	});

	test('rejects onValueChange, replaced by onChange', () => {
		// @ts-expect-error - write `onChange`
		assertType(<Slider color="primary" value={40} onValueChange={() => {}} />);
	});

	test('rejects onValueCommitted, replaced by onAfterChange', () => {
		// @ts-expect-error - write `onAfterChange`
		assertType(<Slider color="primary" value={40} onValueCommitted={() => {}} />);
	});

	test('rejects minStepsBetweenThumbs, the thumbs can hold the same value', () => {
		// @ts-expect-error - the two thumbs of a range can hold the same value
		assertType(<Slider.Range color="primary" value={[10, 20]} minStepsBetweenThumbs={1} />);
	});

	test('rejects the aria attributes the slider writes itself', () => {
		// @ts-expect-error - write `readOnly`, the slider sets `aria-readonly` on the thumb input
		assertType(<Slider color="primary" value={40} aria-readonly />);
		// @ts-expect-error - `formatValue` writes `aria-valuetext`
		assertType(<Slider.Range color="primary" value={[10, 20]} aria-valuetext="10 to 20" />);
	});

	test('rejects asChild, the slider renders its own elements', () => {
		// @ts-expect-error - the slider has no `asChild` or `render`
		assertType(<Slider color="primary" value={40} asChild />);
	});
});
