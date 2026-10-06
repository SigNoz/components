/**
 * Type-level tests for the props of {@link Field}.
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
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Field } from '../field.js';

const control = <input aria-label="control" />;
const fieldRef = createRef<HTMLDivElement>();
declare const maybeError: string | undefined;

describe('label and children', () => {
	test('both are required', () => {
		assertType(<Field label="Organisation">{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - a field exists to own its label
		assertType(<Field>{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - a field with no control labels nothing
		assertType(<Field label="Organisation" />);
	});

	test('accepts the ref, the sizes and a testId', () => {
		assertType(
			<Field label="Organisation" size="large" required testId="field" ref={fieldRef}>
				{control}
			</Field>,
		);
	});
});

describe('status, message and error', () => {
	test('status and message travel together', () => {
		assertType(
			<Field label="Organisation" status="danger" message="Taken">
				{control}
			</Field>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a status with nothing to say belongs on the control itself
		assertType(<Field label="Name" status="danger">{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - the message row is a validation state, it takes its color from one
		assertType(<Field label="Name" message="Taken">{control}</Field>);
	});

	test('error stands alone', () => {
		assertType(
			<Field label="Organisation" error={maybeError}>
				{control}
			</Field>,
		);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<Field label="Name" error="Taken" status="danger" message="Taken">{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<Field label="Name" error="Taken" message="Taken">{control}</Field>);
	});
});

describe('rejected props', () => {
	test('className and style are not props', () => {
		// oxfmt-ignore
		// @ts-expect-error - the layout is fixed, visual overrides go through `--field-*`
		assertType(<Field label="Name" className="styled">{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - the layout is fixed, visual overrides go through `--field-*`
		assertType(<Field label="Name" style={{ gap: 0 }}>{control}</Field>);
	});

	test('data-testid is spelled testId', () => {
		// oxfmt-ignore
		// @ts-expect-error - `data-testid` is written as the `testId` prop
		assertType(<Field label="Name" data-testid="field">{control}</Field>);
	});

	test('a prop that does not exist is rejected', () => {
		// oxfmt-ignore
		// @ts-expect-error - the message always sits below the control
		assertType(<Field label="Name" messagePlacement="top">{control}</Field>);
	});
});
