/**
 * Type-level tests for the props of {@link SliderField} and `SliderField.Range`.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it: it either
 * compiles, or it is marked `@ts-expect-error` because we refuse that combination. TypeScript
 * reports an unused `@ts-expect-error` as an error of its own, so loosening a constraint by accident
 * fails the build instead of passing silently.
 *
 * The comment suppresses the line directly below it. `oxfmt-ignore` keeps that line whole: once
 * oxfmt breaks the props one per line, a prop-level error moves off the suppressed line and the
 * comment stops covering it.
 */
import { createRef, type FocusEvent } from 'react';
import { assertType, describe, expectTypeOf, test } from 'vitest';
import { SliderField } from '../presets/slider-field.js';
import type { SliderRangeValue } from '../types.js';

const sliderRef = createRef<HTMLDivElement>();
const wrongRef = createRef<HTMLButtonElement>();
const noop = (): void => {};

declare const maybeError: string | undefined;
declare const maybeDisabled: boolean | undefined;
declare const maybeReadOnly: boolean | undefined;
declare const controllerField: {
	name: string;
	value: number;
	onChange: (value: number) => void;
	ref: (instance: HTMLDivElement | null) => void;
};
declare const controllerRangeField: {
	name: string;
	value: [number, number];
	onChange: (value: [number, number]) => void;
	ref: (instance: HTMLDivElement | null) => void;
};

describe('SliderField label and slider props', () => {
	test('takes the label and the props of Slider in one object', () => {
		assertType(<SliderField label="Sampling rate" color="primary" />);
		assertType(
			<SliderField
				label="Sampling rate"
				labelIcon={<span />}
				labelTooltip="Applied at the collector"
				description={<em>Share of requests</em>}
				required
				color="primary"
				min={0}
				max={100}
				step={5}
				marks={{ 0: 'None', 100: 'All' }}
				tooltip
				formatValue={(value) => `${value}%`}
				name="rate"
				aria-describedby="hint"
				data-extra="yes"
				testId="rate"
				ref={sliderRef}
			/>,
		);
	});

	test('requires the label and the color', () => {
		// oxfmt-ignore
		// @ts-expect-error - a field exists to own its label
		assertType(<SliderField color="primary" />);
		// oxfmt-ignore
		// @ts-expect-error - the fill needs a color
		assertType(<SliderField label="Sampling rate" />);
	});

	test('takes a number, never a pair', () => {
		assertType(
			<SliderField
				label="Sampling rate"
				color="primary"
				value={40}
				onChange={(value) => expectTypeOf(value).toEqualTypeOf<number>()}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a pair is a range, write `SliderField.Range`
		assertType(<SliderField label="Sampling rate" color="primary" value={[10, 20]} />);
	});

	test('the ref is the root div', () => {
		// oxfmt-ignore
		// @ts-expect-error - the ref is the root div, not a button
		assertType(<SliderField label="Sampling rate" color="primary" ref={wrongRef} />);
	});

	test('accepts the fields a Controller spreads', () => {
		assertType(<SliderField label="Sampling rate" color="primary" {...controllerField} />);
	});

	test('takes the blur handler, with or without the event', () => {
		assertType(<SliderField label="Sampling rate" color="primary" onBlur={noop} />);
		assertType(
			<SliderField
				label="Sampling rate"
				color="primary"
				onBlur={(event: FocusEvent<HTMLElement>) => event}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - the blur handler takes a focus event
		assertType(<SliderField label="Sampling rate" color="primary" onBlur={(event: MouseEvent) => event} />);
		assertType(<SliderField.Range label="Duration" color="primary" onBlur={noop} />);
	});
});

describe('SliderField status, message and error', () => {
	test('status and message travel together', () => {
		assertType(
			<SliderField label="Sampling rate" color="primary" status="warning" message="Almost high" />,
		);
		// oxfmt-ignore
		// @ts-expect-error - a status with nothing to say belongs on the control itself
		assertType(<SliderField label="Sampling rate" color="primary" status="danger" />);
		// oxfmt-ignore
		// @ts-expect-error - the message row is a validation state, it takes its color from one
		assertType(<SliderField label="Sampling rate" color="primary" message="Too high" />);
	});

	test('error stands alone', () => {
		assertType(<SliderField label="Sampling rate" color="primary" error={maybeError} />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<SliderField label="Sampling rate" color="primary" error="Too high" status="danger" message="Too high" />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<SliderField label="Sampling rate" color="primary" error="Too high" message="Too high" />);
	});
});

describe('SliderField rejected props', () => {
	test('htmlFor is wired by the shorthand', () => {
		// oxfmt-ignore
		// @ts-expect-error - the shorthand wires the control's id itself
		assertType(<SliderField label="Sampling rate" color="primary" htmlFor="rate" />);
	});

	test('className and style are not props', () => {
		// oxfmt-ignore
		// @ts-expect-error - visual overrides go through the `--slider-*` custom properties
		assertType(<SliderField label="Sampling rate" color="primary" className="styled" />);
		// oxfmt-ignore
		// @ts-expect-error - visual overrides go through the `--slider-*` custom properties
		assertType(<SliderField label="Sampling rate" color="primary" style={{ width: 10 }} />);
	});

	test('data-testid is spelled testId', () => {
		// oxfmt-ignore
		// @ts-expect-error - `data-testid` is written as the `testId` prop
		assertType(<SliderField label="Sampling rate" color="primary" data-testid="rate" />);
	});

	test('a prop that does not exist is rejected', () => {
		// oxfmt-ignore
		// @ts-expect-error - the message always sits below the control
		assertType(<SliderField label="Sampling rate" color="primary" messagePlacement="top" />);
	});

	test('a disabled or read-only slider says why', () => {
		assertType(
			<SliderField
				label="Sampling rate"
				color="primary"
				disabled
				disabledTooltip="Pick a source"
			/>,
		);
		assertType(
			<SliderField label="Sampling rate" color="primary" readOnly readOnlyTooltip="Saving" />,
		);
		assertType(
			<SliderField
				label="Sampling rate"
				color="primary"
				disabled={maybeDisabled}
				disabledTooltip={undefined}
				readOnly={maybeReadOnly}
				readOnlyTooltip={undefined}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a disabled control has to tell the user why
		assertType(<SliderField label="Sampling rate" color="primary" disabled />);
		// oxfmt-ignore
		// @ts-expect-error - the reason only renders while `disabled` is set
		assertType(<SliderField label="Sampling rate" color="primary" disabledTooltip="Pick a source" />);
		// oxfmt-ignore
		// @ts-expect-error - a locked control has to tell the user why
		assertType(<SliderField label="Sampling rate" color="primary" readOnly />);
	});
});

describe('SliderField.Range props', () => {
	test('takes the label and the props of Slider.Range in one object', () => {
		assertType(<SliderField.Range label="Duration" color="primary" />);
		assertType(
			<SliderField.Range
				label="Duration"
				description="How long a request ran."
				required
				color="primary"
				max={100000}
				tooltip
				formatValue={(value) => `${value} ms`}
				name="duration"
				testId="duration"
				ref={sliderRef}
			/>,
		);
	});

	test('requires the label and the color', () => {
		// oxfmt-ignore
		// @ts-expect-error - a field exists to own its label
		assertType(<SliderField.Range color="primary" />);
		// oxfmt-ignore
		// @ts-expect-error - the fill needs a color
		assertType(<SliderField.Range label="Duration" />);
	});

	test('takes and returns a pair, never a number', () => {
		assertType(
			<SliderField.Range
				label="Duration"
				color="primary"
				value={[10, 20]}
				onChange={(value) => expectTypeOf(value).toEqualTypeOf<SliderRangeValue>()}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a range holds a pair, `SliderField` holds one number
		assertType(<SliderField.Range label="Duration" color="primary" value={40} />);
		// oxfmt-ignore
		// @ts-expect-error - a range reports a pair
		assertType(<SliderField.Range label="Duration" color="primary" onChange={(value: number) => value} />);
	});

	test('accepts the fields a Controller spreads', () => {
		assertType(<SliderField.Range label="Duration" color="primary" {...controllerRangeField} />);
	});

	test('keeps the rules of the field and of the slider', () => {
		assertType(<SliderField.Range label="Duration" color="primary" error={maybeError} />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<SliderField.Range label="Duration" color="primary" error="Too long" message="Too long" />);
		// oxfmt-ignore
		// @ts-expect-error - the shorthand wires the control's id itself
		assertType(<SliderField.Range label="Duration" color="primary" htmlFor="duration" />);
		// oxfmt-ignore
		// @ts-expect-error - a disabled control has to tell the user why
		assertType(<SliderField.Range label="Duration" color="primary" disabled />);
		// oxfmt-ignore
		// @ts-expect-error - visual overrides go through the `--slider-*` custom properties
		assertType(<SliderField.Range label="Duration" color="primary" className="styled" />);
		// oxfmt-ignore
		// @ts-expect-error - the ref is the root div, not a button
		assertType(<SliderField.Range label="Duration" color="primary" ref={wrongRef} />);
	});
});

test('the handlers are plain functions', () => {
	assertType(
		<SliderField label="Sampling rate" color="primary" onChange={noop} onAfterChange={noop} />,
	);
	assertType(
		<SliderField.Range label="Duration" color="primary" onChange={noop} onAfterChange={noop} />,
	);
});
