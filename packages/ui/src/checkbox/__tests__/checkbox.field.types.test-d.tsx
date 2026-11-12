/**
 * Type-level tests for the props of {@link CheckboxField}.
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
import { createRef, type Ref } from 'react';
import { assertType, describe, test } from 'vitest';
import { CheckboxField } from '../presets/checkbox-field.js';

const noop = (): void => {};
const checkboxRef = createRef<HTMLSpanElement>();
declare const maybeError: string | undefined;
declare const maybeDisabled: boolean | undefined;
declare const controllerRef: Ref<HTMLSpanElement>;

describe('label and color', () => {
	test('the label and the color are required', () => {
		assertType(<CheckboxField label="Accept the terms" color="primary" />);
		// oxfmt-ignore
		// @ts-expect-error - the label is the text of the checkbox
		assertType(<CheckboxField color="primary" />);
		// oxfmt-ignore
		// @ts-expect-error - `color` has no default, it must be picked explicitly
		assertType(<CheckboxField label="Accept the terms" />);
	});

	test('the label is a string', () => {
		// oxfmt-ignore
		// @ts-expect-error - a label is plain text, the description takes the rest
		assertType(<CheckboxField label={<b>Accept</b>} color="primary" />);
	});

	test('children is not a prop, the label takes its place', () => {
		// oxfmt-ignore
		// @ts-expect-error - `label` is the text of the checkbox
		assertType(<CheckboxField label="Accept the terms" color="primary">Accept</CheckboxField>);
	});
});

describe('the field props', () => {
	test('takes the tooltip and the description as nodes', () => {
		assertType(
			<CheckboxField
				label="Accept the terms"
				color="primary"
				labelTooltip={<b>Tip</b>}
				description={<i>Help</i>}
				required
			/>,
		);
	});

	test('status and message travel together', () => {
		assertType(
			<CheckboxField label="Accept the terms" color="primary" status="warning" message="Careful" />,
		);
		// oxfmt-ignore
		// @ts-expect-error - a status with nothing to say belongs on the control itself
		assertType(<CheckboxField label="Accept the terms" color="primary" status="danger" />);
		// oxfmt-ignore
		// @ts-expect-error - the message row is a validation state, it takes its color from one
		assertType(<CheckboxField label="Accept the terms" color="primary" message="Careful" />);
	});

	test('error stands alone', () => {
		assertType(<CheckboxField label="Accept the terms" color="primary" error={maybeError} />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<CheckboxField label="Accept the terms" color="primary" error="Bad" status="danger" message="Bad" />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<CheckboxField label="Accept the terms" color="primary" error="Bad" message="Bad" />);
	});

	test('data-testid is spelled testId', () => {
		assertType(<CheckboxField label="Accept the terms" color="primary" testId="terms" />);
		// oxfmt-ignore
		// @ts-expect-error - `data-testid` is written as the `testId` prop
		assertType(<CheckboxField label="Accept the terms" color="primary" data-testid="terms" />);
	});

	test('htmlFor, textOverflow, labelIcon, className and style are not props', () => {
		// oxfmt-ignore
		// @ts-expect-error - the shorthand wires the checkbox itself
		assertType(<CheckboxField label="Accept the terms" color="primary" htmlFor="terms" />);
		// oxfmt-ignore
		// @ts-expect-error - the text wraps, so the asterisk and the info icon always show
		assertType(<CheckboxField label="Accept the terms" color="primary" textOverflow="ellipsis" />);
		// oxfmt-ignore
		// @ts-expect-error - the box already sits where an icon before the text would
		assertType(<CheckboxField label="Accept the terms" color="primary" labelIcon={<span />} />);
		// oxfmt-ignore
		// @ts-expect-error - the layout is fixed, visual overrides go through `--checkbox-*`
		assertType(<CheckboxField label="Accept the terms" color="primary" className="styled" />);
		// oxfmt-ignore
		// @ts-expect-error - the layout is fixed, visual overrides go through `--checkbox-*`
		assertType(<CheckboxField label="Accept the terms" color="primary" style={{ gap: 0 }} />);
	});

	test('a prop that does not exist is rejected', () => {
		// oxfmt-ignore
		// @ts-expect-error - the message always sits below the text
		assertType(<CheckboxField label="Accept the terms" color="primary" messagePlacement="top" />);
	});
});

describe('the props of the checkbox', () => {
	test('takes the value, the default value and the change handler', () => {
		assertType(<CheckboxField label="Accept the terms" color="primary" value onChange={noop} />);
		assertType(
			<CheckboxField
				label="Accept the terms"
				color="primary"
				value="indeterminate"
				onChange={noop}
			/>,
		);
		assertType(<CheckboxField label="Accept the terms" color="primary" defaultValue />);
	});

	test('value and defaultValue are one or the other', () => {
		// oxfmt-ignore
		// @ts-expect-error - `value` makes the checkbox controlled for its whole life
		assertType(<CheckboxField label="Accept the terms" color="primary" value defaultValue />);
	});

	test('disabled and readOnly bring their reason', () => {
		assertType(
			<CheckboxField
				label="Accept the terms"
				color="primary"
				disabled
				disabledTooltip="Ask an admin"
			/>,
		);
		assertType(
			<CheckboxField
				label="Accept the terms"
				color="primary"
				disabled={maybeDisabled}
				disabledTooltip={undefined}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a disabled control has to tell the user why
		assertType(<CheckboxField label="Accept the terms" color="primary" disabled />);
		// oxfmt-ignore
		// @ts-expect-error - the reason only renders while the checkbox is disabled
		assertType(<CheckboxField label="Accept the terms" color="primary" disabledTooltip="Ask an admin" />);
		// oxfmt-ignore
		// @ts-expect-error - a locked control has to tell the user why
		assertType(<CheckboxField label="Accept the terms" color="primary" readOnly />);
	});

	test('takes aria and data attributes', () => {
		assertType(
			<CheckboxField
				label="Accept the terms"
				color="primary"
				aria-describedby="hint"
				data-analytics="terms"
			/>,
		);
	});
});

describe('ref', () => {
	test('the ref is the checkbox span, as an object or from a Controller', () => {
		assertType(<CheckboxField label="Accept the terms" color="primary" ref={checkboxRef} />);
		assertType(<CheckboxField label="Accept the terms" color="primary" ref={controllerRef} />);
	});
});
