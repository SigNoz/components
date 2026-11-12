/**
 * Type-level tests for the props of {@link RadioGroupField}.
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
import { assertType, describe, test } from 'vitest';
import { RadioGroupField } from '../presets/radio-group-field.js';
import type { RadioGroupItemType } from '../types.js';

const noop = (): void => {};
const inputRef = createRef<HTMLInputElement>();
declare const maybeError: string | undefined;
declare const items: RadioGroupItemType[];

describe('label, items and color', () => {
	test('the label, the items and the color are required', () => {
		assertType(<RadioGroupField label="Retention" color="primary" items={items} />);
		// oxfmt-ignore
		// @ts-expect-error - a group exists to own its legend
		assertType(<RadioGroupField color="primary" items={items} />);
		// oxfmt-ignore
		// @ts-expect-error - a radio group with no options is not allowed
		assertType(<RadioGroupField label="Retention" color="primary" />);
		// oxfmt-ignore
		// @ts-expect-error - `color` has no default, it must be picked explicitly
		assertType(<RadioGroupField label="Retention" items={items} />);
	});

	test('needs no aria-label, the legend names the group', () => {
		assertType(<RadioGroupField label="Retention" color="primary" items={items} />);
		assertType(
			<RadioGroupField label="Retention" color="primary" items={items} aria-label="Own" />,
		);
	});
});

describe('the field props', () => {
	test('takes the label parts and the description as nodes', () => {
		assertType(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={items}
				labelIcon={<span />}
				labelTooltip={<b>Tip</b>}
				description={<i>Help</i>}
				required
			/>,
		);
	});

	test('status and message travel together', () => {
		assertType(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={items}
				status="warning"
				message="Short"
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a status with nothing to say belongs on the control itself
		assertType(<RadioGroupField label="Retention" color="primary" items={items} status="danger" />);
		// oxfmt-ignore
		// @ts-expect-error - the message row is a validation state, it takes its color from one
		assertType(<RadioGroupField label="Retention" color="primary" items={items} message="Short" />);
	});

	test('error stands alone', () => {
		assertType(
			<RadioGroupField label="Retention" color="primary" items={items} error={maybeError} />,
		);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<RadioGroupField label="Retention" color="primary" items={items} error="Bad" status="danger" message="Bad" />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<RadioGroupField label="Retention" color="primary" items={items} error="Bad" message="Bad" />);
	});

	test('data-testid is spelled testId', () => {
		assertType(
			<RadioGroupField label="Retention" color="primary" items={items} testId="retention" />,
		);
		// oxfmt-ignore
		// @ts-expect-error - `data-testid` is written as the `testId` prop
		assertType(<RadioGroupField label="Retention" color="primary" items={items} data-testid="retention" />);
	});

	test('htmlFor, className and style are not props', () => {
		// oxfmt-ignore
		// @ts-expect-error - a group has no single control to point at
		assertType(<RadioGroupField label="Retention" color="primary" items={items} htmlFor="retention" />);
		// oxfmt-ignore
		// @ts-expect-error - the layout is fixed, visual overrides go through `--radio-group-*`
		assertType(<RadioGroupField label="Retention" color="primary" items={items} className="styled" />);
		// oxfmt-ignore
		// @ts-expect-error - the layout is fixed, visual overrides go through `--radio-group-*`
		assertType(<RadioGroupField label="Retention" color="primary" items={items} style={{ gap: 0 }} />);
	});

	test('a prop that does not exist is rejected', () => {
		// oxfmt-ignore
		// @ts-expect-error - the message always sits below the group
		assertType(<RadioGroupField label="Retention" color="primary" items={items} messagePlacement="top" />);
	});
});

describe('the props of the radio group', () => {
	test('takes the value, the default value and the change handler', () => {
		assertType(
			<RadioGroupField label="Retention" color="primary" items={items} value="7" onChange={noop} />,
		);
		assertType(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={items}
				value={null}
				onChange={noop}
			/>,
		);
		assertType(
			<RadioGroupField label="Retention" color="primary" items={items} defaultValue="7" />,
		);
		// oxfmt-ignore
		// @ts-expect-error - a value is a string
		assertType(<RadioGroupField label="Retention" color="primary" items={items} value={7} />);
		// oxfmt-ignore
		// @ts-expect-error - the change handler takes the value, not an event
		assertType(<RadioGroupField label="Retention" color="primary" items={items} onChange={(event: MouseEvent) => event} />);
	});

	test('takes the blur handler, with or without the event', () => {
		assertType(<RadioGroupField label="Retention" color="primary" items={items} onBlur={noop} />);
		assertType(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={items}
				onBlur={(event: FocusEvent<HTMLElement>) => event}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - the blur handler takes a focus event
		assertType(<RadioGroupField label="Retention" color="primary" items={items} onBlur={(event: MouseEvent) => event} />);
	});

	test('disabled and readOnly bring their reason', () => {
		assertType(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={items}
				disabled
				disabledTooltip="Ask an admin"
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a disabled control has to tell the user why
		assertType(<RadioGroupField label="Retention" color="primary" items={items} disabled />);
		// oxfmt-ignore
		// @ts-expect-error - a locked control has to tell the user why
		assertType(<RadioGroupField label="Retention" color="primary" items={items} readOnly />);
	});
});

describe('ref', () => {
	test('the ref is the hidden radio input, the element a focus() can land on', () => {
		assertType(<RadioGroupField label="Retention" color="primary" items={items} ref={inputRef} />);
		// oxfmt-ignore
		// @ts-expect-error - the ref is the radio input, not the root div
		assertType(<RadioGroupField label="Retention" color="primary" items={items} ref={createRef<HTMLDivElement>()} />);
	});
});
