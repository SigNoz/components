/**
 * Type-level tests for the props of {@link Field} and `Field.Group`.
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
import { Info } from '@signozhq/icons';
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Field } from '../field.js';

const control = <input aria-label="control" />;
const fieldRef = createRef<HTMLDivElement>();
const groupRef = createRef<HTMLFieldSetElement>();
declare const maybeError: string | undefined;
declare const maybeStatus: 'danger' | undefined;
declare const maybeMessage: string | undefined;

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

	test('the label is a string', () => {
		assertType(<Field label="Organisation">{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - the label is also the accessible name and the ellipsis tooltip, it needs text
		assertType(<Field label={<b>Organisation</b>}>{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - a number is not a name, write it as a string
		assertType(<Field label={42}>{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - an undefined label is a field with no name, pass an empty string to see the gap
		assertType(<Field label={undefined}>{control}</Field>);
	});

	test('the child is exactly one element', () => {
		// oxfmt-ignore
		// @ts-expect-error - a bare string is not a control
		assertType(<Field label="Organisation">text</Field>);
		// oxfmt-ignore
		// @ts-expect-error - two controls need a `Field.Group` and one label
		assertType(<Field label="Organisation">{control}{control}</Field>);
	});
});

describe('accepted props', () => {
	test('accepts the ref, the id, the testId, aria-* and data-*', () => {
		assertType(
			<Field
				label="Organisation"
				required
				id="org-field"
				testId="field"
				aria-label="Organisation field"
				data-analytics="org"
				ref={fieldRef}
			>
				{control}
			</Field>,
		);
	});

	test('accepts the parts of the label and of the row', () => {
		assertType(
			<Field
				label="Organisation"
				labelIcon={<Info />}
				labelTooltip={<span>Why we ask</span>}
				description={<span>The name on your invoices</span>}
				htmlFor="org-input"
			>
				{control}
			</Field>,
		);
		assertType(
			<Field label="Organisation" labelTooltip="Why we ask" description="The name on your invoices">
				{control}
			</Field>,
		);
	});

	test('accepts a label icon only as an element', () => {
		// oxfmt-ignore
		// @ts-expect-error - an icon is an element, text before the label belongs in the label
		assertType(<Field label="Organisation" labelIcon="info">{control}</Field>);
	});
});

describe('status, message and error', () => {
	test('status and message travel together', () => {
		assertType(
			<Field label="Organisation" status="danger" message="Taken">
				{control}
			</Field>,
		);
		assertType(
			<Field label="Organisation" status="success" message={<span>Available</span>}>
				{control}
			</Field>,
		);
		assertType(
			<Field label="Organisation" status={maybeStatus} message={maybeMessage}>
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

	test('the status is one of the three states', () => {
		// oxfmt-ignore
		// @ts-expect-error - there is no info status, a neutral hint is the description
		assertType(<Field label="Name" status="info" message="Taken">{control}</Field>);
	});

	test('error stands alone', () => {
		assertType(
			<Field label="Organisation" error={maybeError}>
				{control}
			</Field>,
		);
		assertType(
			<Field label="Organisation" error={<span>Taken</span>}>
				{control}
			</Field>,
		);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<Field label="Name" error="Taken" status="danger" message="Taken">{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says the message, a second one is the same thing twice
		assertType(<Field label="Name" error="Taken" message="Taken">{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"`, a second status is the same thing twice
		assertType(<Field label="Name" error="Taken" status="warning" message="Taken">{control}</Field>);
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

	test('size stays on the control', () => {
		// oxfmt-ignore
		// @ts-expect-error - the label has the same type at every size, the control keeps its own `size`
		assertType(<Field label="Name" size="lg">{control}</Field>);
	});

	test('data-testid is spelled testId', () => {
		// oxfmt-ignore
		// @ts-expect-error - `data-testid` is written as the `testId` prop
		assertType(<Field label="Name" data-testid="field">{control}</Field>);
	});

	test('name, disabled and readOnly stay on the control', () => {
		// oxfmt-ignore
		// @ts-expect-error - react-hook-form register puts `name` on the control
		assertType(<Field label="Name" name="org">{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - the control keeps its own `disabled` and its reason tooltip
		assertType(<Field label="Name" disabled>{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - the control keeps its own `readOnly` and its reason tooltip
		assertType(<Field label="Name" readOnly>{control}</Field>);
	});

	test('the antd Form.Item props are not props', () => {
		// oxfmt-ignore
		// @ts-expect-error - validation belongs to the consumer, `error` shows the result
		assertType(<Field label="Name" rules={[]}>{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - `description` is the help text and `message` the status text
		assertType(<Field label="Name" help="Use the legal name">{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - `status` with `message` replaces validateStatus
		assertType(<Field label="Name" validateStatus="error">{control}</Field>);
		// oxfmt-ignore
		// @ts-expect-error - a field always renders its label and its row
		assertType(<Field label="Name" noStyle>{control}</Field>);
	});

	test('a prop that does not exist is rejected', () => {
		// oxfmt-ignore
		// @ts-expect-error - the message always sits below the control
		assertType(<Field label="Name" messagePlacement="top">{control}</Field>);
	});

	test('the ref points at the root div', () => {
		// oxfmt-ignore
		// @ts-expect-error - the root is a div, the fieldset is `Field.Group`
		assertType(<Field label="Name" ref={groupRef}>{control}</Field>);
	});
});

describe('Field.Group accepted props', () => {
	test('takes any content as children, and the props of a field', () => {
		assertType(<Field.Group label="Environment">text</Field.Group>);
		assertType(
			<Field.Group label="Notify me by">
				{control}
				{control}
			</Field.Group>,
		);
		assertType(
			<Field.Group
				label="Environment"
				labelIcon={<Info />}
				labelTooltip="Why we ask"
				description="Where the data goes"
				required
				id="env-group"
				testId="group"
				aria-label="Environment group"
				data-analytics="env"
				ref={groupRef}
			>
				{control}
			</Field.Group>,
		);
	});

	test('takes the status rules of a field', () => {
		assertType(
			<Field.Group label="Environment" error={maybeError}>
				{control}
			</Field.Group>,
		);
		assertType(
			<Field.Group label="Environment" status="warning" message="Resets nightly">
				{control}
			</Field.Group>,
		);
	});
});

describe('Field.Group rejected props', () => {
	test('the status rules of a field apply', () => {
		// oxfmt-ignore
		// @ts-expect-error - a group status with nothing to say belongs on the controls themselves
		assertType(<Field.Group label="Environment" status="danger">{control}</Field.Group>);
		// oxfmt-ignore
		// @ts-expect-error - the group message row is a validation state, it takes its color from one
		assertType(<Field.Group label="Environment" message="Pick one">{control}</Field.Group>);
		// oxfmt-ignore
		// @ts-expect-error - `error` on a group already says `status="danger"` and the message
		assertType(<Field.Group label="Environment" error="Pick one" status="danger" message="Pick one">{control}</Field.Group>);
	});

	test('the label and the children are required', () => {
		// oxfmt-ignore
		// @ts-expect-error - a group exists to own its legend
		assertType(<Field.Group>{control}</Field.Group>);
		// oxfmt-ignore
		// @ts-expect-error - a group with no controls names nothing
		assertType(<Field.Group label="Environment" />);
	});

	test('the label is a string', () => {
		// oxfmt-ignore
		// @ts-expect-error - the legend is the accessible name of the fieldset, it needs text
		assertType(<Field.Group label={<b>Environment</b>}>{control}</Field.Group>);
	});

	test('htmlFor has no single control to point at', () => {
		// oxfmt-ignore
		// @ts-expect-error - a group has no single control to point at, the legend names the fieldset
		assertType(<Field.Group label="Environment" htmlFor="env">{control}</Field.Group>);
	});

	test('className, style and size are not props', () => {
		// oxfmt-ignore
		// @ts-expect-error - the group layout is fixed, visual overrides go through `--field-*`
		assertType(<Field.Group label="Environment" className="styled">{control}</Field.Group>);
		// oxfmt-ignore
		// @ts-expect-error - the group layout is fixed, visual overrides go through `--field-*`
		assertType(<Field.Group label="Environment" style={{ gap: 0 }}>{control}</Field.Group>);
		// oxfmt-ignore
		// @ts-expect-error - the controls inside keep their own `size`
		assertType(<Field.Group label="Environment" size="lg">{control}</Field.Group>);
	});

	test('data-testid is spelled testId', () => {
		// oxfmt-ignore
		// @ts-expect-error - `data-testid` on a group is written as the `testId` prop
		assertType(<Field.Group label="Environment" data-testid="group">{control}</Field.Group>);
	});

	test('the ref points at the fieldset', () => {
		// oxfmt-ignore
		// @ts-expect-error - the group root is a fieldset, not a div
		assertType(<Field.Group label="Environment" ref={fieldRef}>{control}</Field.Group>);
	});
});
