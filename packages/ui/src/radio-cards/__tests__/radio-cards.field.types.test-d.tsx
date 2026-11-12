/**
 * Type-level tests for the props of {@link RadioCardsField}.
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
import { RadioCards } from '../radio-cards.js';
import { RadioCardsField } from '../presets/radio-cards-field.js';
import type { RadioCardsItemType } from '../types.js';

const noop = (): void => {};
const groupRef = createRef<HTMLDivElement>();
declare const maybeError: string | undefined;
declare const items: RadioCardsItemType[];

describe('label and items', () => {
	test('the label and the items are required', () => {
		assertType(<RadioCardsField label="Signal" items={items} />);
		// oxfmt-ignore
		// @ts-expect-error - a group exists to own its legend
		assertType(<RadioCardsField items={items} />);
		// oxfmt-ignore
		// @ts-expect-error - a group with no cards is not allowed
		assertType(<RadioCardsField label="Signal" />);
	});

	test('needs no aria-label, the legend names the group', () => {
		assertType(<RadioCardsField label="Signal" items={items} />);
		assertType(<RadioCardsField label="Signal" items={items} aria-label="Own" />);
		assertType(<RadioCardsField label="Signal" items={items} aria-labelledby="question" />);
		// The bare control still asks for one.
		// oxfmt-ignore
		// @ts-expect-error - the group needs a name: the question its cards answer
		assertType(<RadioCards items={items} />);
	});
});

describe('the field props', () => {
	test('takes the label parts and the description as nodes', () => {
		assertType(
			<RadioCardsField
				label="Signal"
				items={items}
				labelIcon={<span />}
				labelTooltip={<b>Tip</b>}
				description={<i>Help</i>}
				required
			/>,
		);
	});

	test('status and message travel together', () => {
		assertType(<RadioCardsField label="Signal" items={items} status="warning" message="Slow" />);
		// oxfmt-ignore
		// @ts-expect-error - a status with nothing to say belongs on the control itself
		assertType(<RadioCardsField label="Signal" items={items} status="danger" />);
		// oxfmt-ignore
		// @ts-expect-error - the message row is a validation state, it takes its color from one
		assertType(<RadioCardsField label="Signal" items={items} message="Slow" />);
	});

	test('error stands alone', () => {
		assertType(<RadioCardsField label="Signal" items={items} error={maybeError} />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<RadioCardsField label="Signal" items={items} error="Bad" status="danger" message="Bad" />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<RadioCardsField label="Signal" items={items} error="Bad" message="Bad" />);
	});

	test('data-testid is spelled testId', () => {
		assertType(<RadioCardsField label="Signal" items={items} testId="signal" />);
		// oxfmt-ignore
		// @ts-expect-error - `data-testid` is written as the `testId` prop
		assertType(<RadioCardsField label="Signal" items={items} data-testid="signal" />);
	});

	test('htmlFor, className and style are not props', () => {
		// oxfmt-ignore
		// @ts-expect-error - a group has no single control to point at
		assertType(<RadioCardsField label="Signal" items={items} htmlFor="signal" />);
		// oxfmt-ignore
		// @ts-expect-error - the layout is fixed, visual overrides go through `--radio-cards-*`
		assertType(<RadioCardsField label="Signal" items={items} className="styled" />);
		// oxfmt-ignore
		// @ts-expect-error - the layout is fixed, visual overrides go through `--radio-cards-*`
		assertType(<RadioCardsField label="Signal" items={items} style={{ gap: 0 }} />);
	});
});

describe('the props of the cards', () => {
	test('takes the value, the default value and the change handler', () => {
		assertType(<RadioCardsField label="Signal" items={items} value="logs" onChange={noop} />);
		assertType(<RadioCardsField label="Signal" items={items} value={null} onChange={noop} />);
		assertType(<RadioCardsField label="Signal" items={items} defaultValue="logs" columns={2} />);
	});

	test('allowClear asks for an onChange that takes null', () => {
		assertType(
			<RadioCardsField
				label="Signal"
				items={items}
				allowClear
				onChange={(value: string | null) => value}
			/>,
		);
		// oxfmt-ignore
		// @ts-expect-error - with `allowClear` the group reports `null`
		assertType(<RadioCardsField label="Signal" items={items} allowClear onChange={(value: string) => value} />);
	});

	test('disabled and readOnly bring their reason', () => {
		assertType(
			<RadioCardsField label="Signal" items={items} disabled disabledTooltip="Ask an admin" />,
		);
		// oxfmt-ignore
		// @ts-expect-error - a disabled control has to tell the user why
		assertType(<RadioCardsField label="Signal" items={items} disabled />);
		// oxfmt-ignore
		// @ts-expect-error - a locked control has to tell the user why
		assertType(<RadioCardsField label="Signal" items={items} readOnly />);
	});
});

describe('RadioCardsField.Multiple', () => {
	test('takes a list of values and needs no aria-label', () => {
		assertType(<RadioCardsField.Multiple label="Tools" items={items} />);
		assertType(
			<RadioCardsField.Multiple label="Tools" items={items} value={['logs']} onChange={noop} />,
		);
		// oxfmt-ignore
		// @ts-expect-error - the group holds a list
		assertType(<RadioCardsField.Multiple label="Tools" items={items} value="logs" />);
		// oxfmt-ignore
		// @ts-expect-error - a group exists to own its legend
		assertType(<RadioCardsField.Multiple items={items} />);
	});

	test('keeps the field rules', () => {
		// oxfmt-ignore
		// @ts-expect-error - a status with nothing to say belongs on the control itself
		assertType(<RadioCardsField.Multiple label="Tools" items={items} status="danger" />);
		// oxfmt-ignore
		// @ts-expect-error - a group has no single control to point at
		assertType(<RadioCardsField.Multiple label="Tools" items={items} htmlFor="tools" />);
	});
});

describe('ref', () => {
	test('the ref is the radio group div', () => {
		assertType(<RadioCardsField label="Signal" items={items} ref={groupRef} />);
		assertType(<RadioCardsField.Multiple label="Tools" items={items} ref={groupRef} />);
		// oxfmt-ignore
		// @ts-expect-error - the cards root is a div, not a span
		assertType(<RadioCardsField label="Signal" items={items} ref={createRef<HTMLSpanElement>()} />);
	});
});
