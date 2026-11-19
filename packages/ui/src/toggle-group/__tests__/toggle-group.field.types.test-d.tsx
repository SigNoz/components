/**
 * Type-level tests for the props of {@link ToggleGroupField}.
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
import { ToggleGroupField } from '../presets/toggle-group-field.js';
import type { ToggleGroupItemProps } from '../types.js';

const noop = (): void => {};
const buttonRef = createRef<HTMLButtonElement>();
declare const maybeError: string | undefined;
declare const items: ToggleGroupItemProps[];

describe('label and the bar props', () => {
	test('the label and the bar props are required', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a group exists to own its legend
		assertType(<ToggleGroupField type="single" variant="outlined" color="secondary" size="md" items={items} />);
		// oxfmt-ignore
		// @ts-expect-error - `type` has no default, it must be picked explicitly
		assertType(<ToggleGroupField label="Layout" variant="outlined" color="secondary" size="md" items={items} />);
		// oxfmt-ignore
		// @ts-expect-error - `size` has no default, it must be picked explicitly
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" items={items} />);
	});

	test('the value follows the selection type', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				value="list"
				onChange={noop}
			/>,
		);
		assertType(
			<ToggleGroupField
				label="Layout"
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				value={['list']}
				onChange={noop}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a single bar holds one value
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} value={['list']} />);
		// oxfmt-ignore
		// @ts-expect-error - a multiple bar holds a list
		assertType(<ToggleGroupField label="Layout" type="multiple" variant="outlined" color="secondary" size="md" items={items} value="list" />);
	});
});

describe('the field props', () => {
	test('takes the label parts and the description as nodes', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
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
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				status="warning"
				message="Careful"
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a status with nothing to say belongs on the control itself
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} status="danger" />);
		// oxfmt-ignore
		// @ts-expect-error - the message row is a validation state, it takes its color from one
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} message="Careful" />);
	});

	test('error stands alone', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				error={maybeError}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} error="Bad" message="Bad" />);
	});

	test('data-testid is spelled testId', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				testId="layout"
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - `data-testid` is written as the `testId` prop
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} data-testid="layout" />);
	});

	test('htmlFor, className and style are not props', () => {
		// oxfmt-ignore
		// @ts-expect-error - a group has no single control to point at
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} htmlFor="layout" />);
		// oxfmt-ignore
		// @ts-expect-error - the layout is fixed, visual overrides go through `--toggle-group-*`
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} className="styled" />);
		// oxfmt-ignore
		// @ts-expect-error - the layout is fixed, visual overrides go through `--toggle-group-*`
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} style={{ gap: 0 }} />);
	});

	test('takes the blur handler, with or without the event', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				onBlur={noop}
			/>,
		);
		assertType(
			<ToggleGroupField
				label="Layout"
				type="multiple"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				onBlur={(event: FocusEvent<HTMLElement>) => event}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - the blur handler takes a focus event
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} onBlur={(event: MouseEvent) => event} />);
	});

	test('disabled and readOnly bring their reason', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				disabled
				disabledTooltip="Ask an admin"
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - a disabled control has to tell the user why
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} disabled />);
	});
});

describe('ref', () => {
	test('the ref is a button of the bar, the element a focus() can land on', () => {
		assertType(
			<ToggleGroupField
				label="Layout"
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={items}
				ref={buttonRef}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - the ref is a button, not the root div
		assertType(<ToggleGroupField label="Layout" type="single" variant="outlined" color="secondary" size="md" items={items} ref={createRef<HTMLDivElement>()} />);
	});
});
