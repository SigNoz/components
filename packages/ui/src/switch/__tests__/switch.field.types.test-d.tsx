/**
 * Type-level tests for the props of {@link SwitchField}.
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
import { SwitchField } from '../presets/switch-field.js';

const noop = (): void => {};
const switchRef = createRef<HTMLSpanElement>();
declare const maybeError: string | undefined;
declare const maybeDisabled: boolean | undefined;
declare const controllerRef: Ref<HTMLSpanElement>;

describe('label and color', () => {
	test('the label and the color are required', () => {
		assertType(<SwitchField label="Send alerts" color="primary" />);
		// oxfmt-ignore
		// @ts-expect-error - a field exists to own its label
		assertType(<SwitchField color="primary" />);
		// oxfmt-ignore
		// @ts-expect-error - `color` has no default, it must be picked explicitly
		assertType(<SwitchField label="Send alerts" />);
	});

	test('rejects a color outside the palette', () => {
		// oxfmt-ignore
		// @ts-expect-error - `cherry` is the legacy palette, not a SwitchColor
		assertType(<SwitchField label="Send alerts" color="cherry" />);
	});
});

describe('the field props', () => {
	test('takes the label parts and the description as nodes', () => {
		assertType(
			<SwitchField
				label="Send alerts"
				color="primary"
				labelIcon={<span />}
				labelTooltip={<b>Tip</b>}
				description={<i>Help</i>}
				required
			/>,
		);
	});

	test('status and message travel together', () => {
		assertType(
			<SwitchField label="Send alerts" color="primary" status="warning" message="Careful" />,
		);
		// oxfmt-ignore
		// @ts-expect-error - a status with nothing to say belongs on the control itself
		assertType(<SwitchField label="Send alerts" color="primary" status="danger" />);
		// oxfmt-ignore
		// @ts-expect-error - the message row is a validation state, it takes its color from one
		assertType(<SwitchField label="Send alerts" color="primary" message="Careful" />);
	});

	test('error stands alone', () => {
		assertType(<SwitchField label="Send alerts" color="primary" error={maybeError} />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<SwitchField label="Send alerts" color="primary" error="Bad" status="danger" message="Bad" />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<SwitchField label="Send alerts" color="primary" error="Bad" message="Bad" />);
	});

	test('data-testid is spelled testId', () => {
		assertType(<SwitchField label="Send alerts" color="primary" testId="alerts" />);
		// oxfmt-ignore
		// @ts-expect-error - `data-testid` is written as the `testId` prop
		assertType(<SwitchField label="Send alerts" color="primary" data-testid="alerts" />);
	});

	test('htmlFor is not a prop', () => {
		// oxfmt-ignore
		// @ts-expect-error - the shorthand wires the control id itself
		assertType(<SwitchField label="Send alerts" color="primary" htmlFor="alerts" />);
	});
});

describe('the switch props', () => {
	test('takes the value, the change handler and the form props', () => {
		assertType(
			<SwitchField
				label="Send alerts"
				color="primary"
				value
				onChange={(_checked: boolean) => noop()}
				name="alerts"
				id="alerts"
				aria-keyshortcuts="A"
				data-source="settings"
			/>,
		);
		assertType(<SwitchField label="Send alerts" color="primary" defaultValue />);
	});

	test('a controlled value cannot come with a default', () => {
		// oxfmt-ignore
		// @ts-expect-error - `value` makes the switch controlled for its whole life
		assertType(<SwitchField label="Send alerts" color="primary" value defaultValue />);
	});

	test('a Controller field is accepted as the props it spreads', () => {
		const field = { value: true, onChange: noop, name: 'enabled', ref: controllerRef };

		assertType(<SwitchField label="Send alerts" color="primary" {...field} />);
	});

	test('disabled and read-only keep their reasons', () => {
		assertType(
			<SwitchField label="Send alerts" color="primary" disabled disabledTooltip="Ask an admin" />,
		);
		assertType(
			<SwitchField label="Send alerts" color="primary" readOnly readOnlyTooltip="Saving" />,
		);
		// oxfmt-ignore
		// @ts-expect-error - a disabled switch must explain itself through `disabledTooltip`
		assertType(<SwitchField label="Send alerts" color="primary" disabled />);
		// oxfmt-ignore
		// @ts-expect-error - a possibly undefined `disabled` is still `disabled`
		assertType(<SwitchField label="Send alerts" color="primary" disabled={maybeDisabled} />);
		// oxfmt-ignore
		// @ts-expect-error - a locked switch must explain itself through `readOnlyTooltip`
		assertType(<SwitchField label="Send alerts" color="primary" readOnly />);
	});

	test('the ref is the switch element', () => {
		assertType(<SwitchField label="Send alerts" color="primary" ref={switchRef} />);
		assertType(<SwitchField label="Send alerts" color="primary" ref={controllerRef} />);
	});
});

describe('the props of the switch that lay out its own text', () => {
	test('children are rejected, the label above takes their place', () => {
		// oxfmt-ignore
		// @ts-expect-error - the label above the switch is the field's `label`
		assertType(<SwitchField label="Send alerts" color="primary">Send alerts</SwitchField>);
	});

	test('textPlacement and textOverflow are rejected', () => {
		// oxfmt-ignore
		// @ts-expect-error - the switch has no text of its own to place
		assertType(<SwitchField label="Send alerts" color="primary" textPlacement="left" />);
		// oxfmt-ignore
		// @ts-expect-error - the switch has no text of its own to truncate
		assertType(<SwitchField label="Send alerts" color="primary" textOverflow="wrap" />);
	});

	test('the row sizes and the container props are rejected', () => {
		// oxfmt-ignore
		// @ts-expect-error - there is no labelled row to size
		assertType(<SwitchField label="Send alerts" color="primary" width={200} />);
		// oxfmt-ignore
		// @ts-expect-error - there is no labelled row to size
		assertType(<SwitchField label="Send alerts" color="primary" maxWidth={200} />);
		// oxfmt-ignore
		// @ts-expect-error - there is no wrapper to name
		assertType(<SwitchField label="Send alerts" color="primary" containerTestId="row" />);
	});

	test('a prop that does not exist is rejected', () => {
		// oxfmt-ignore
		// @ts-expect-error - the label always sits above the switch
		assertType(<SwitchField label="Send alerts" color="primary" labelPlacement="right" />);
	});
});
