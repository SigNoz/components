/**
 * Type-level tests for the props of {@link Tooltip}. See `button.types.test-d.tsx` for how these
 * run, and why every `@ts-expect-error` sits inside `assertType(...)` right above the opening tag
 * with every prop kept on that line.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Tooltip, TooltipProvider } from '../index.js';

const trigger = <button type="button">Hover</button>;
const buttonRef = createRef<HTMLButtonElement>();
const divRef = createRef<HTMLDivElement>();

describe('title and children', () => {
	test('accepts any node as title, including nothing', () => {
		assertType(<Tooltip title="Text">{trigger}</Tooltip>);
		assertType(<Tooltip title={<strong>Rich</strong>}>{trigger}</Tooltip>);
		assertType(<Tooltip title={undefined}>{trigger}</Tooltip>);
		assertType(<Tooltip title={null}>{trigger}</Tooltip>);
		assertType(<Tooltip title={false}>{trigger}</Tooltip>);
	});

	test('title is required', () => {
		assertType(
			// @ts-expect-error - a tooltip has to be told what to say, pass `undefined` to say nothing
			<Tooltip>{trigger}</Tooltip>,
		);
	});

	test('children are required', () => {
		assertType(
			// @ts-expect-error - a tooltip needs a trigger to anchor to
			<Tooltip title="Text" />,
		);
	});
});

describe('positioning', () => {
	test('accepts every side and align', () => {
		assertType(
			<Tooltip title="Text" side="top" align="start">
				{trigger}
			</Tooltip>,
		);
		assertType(
			<Tooltip title="Text" side="right" align="center">
				{trigger}
			</Tooltip>,
		);
		assertType(
			<Tooltip title="Text" side="bottom" align="end">
				{trigger}
			</Tooltip>,
		);
		assertType(
			<Tooltip title="Text" side="left" sideOffset={8} alignOffset={-2}>
				{trigger}
			</Tooltip>,
		);
	});

	test('rejects a side outside the set', () => {
		assertType(
			// @ts-expect-error - `center` is not a side
			<Tooltip title="Text" side="center">
				{trigger}
			</Tooltip>,
		);
	});

	test('rejects an align outside the set', () => {
		assertType(
			// @ts-expect-error - `middle` is not an align
			<Tooltip title="Text" align="middle">
				{trigger}
			</Tooltip>,
		);
	});
});

describe('container', () => {
	test('accepts an element, a ref or null', () => {
		assertType(
			<Tooltip title="Text" container={document.body}>
				{trigger}
			</Tooltip>,
		);
		assertType(
			<Tooltip title="Text" container={divRef}>
				{trigger}
			</Tooltip>,
		);
		assertType(
			<Tooltip title="Text" container={null}>
				{trigger}
			</Tooltip>,
		);
		assertType(<TooltipProvider container={document.body}>{trigger}</TooltipProvider>);
	});

	test('rejects a selector string', () => {
		assertType(
			// @ts-expect-error - the container is an element, not a selector
			<Tooltip title="Text" container="#root">
				{trigger}
			</Tooltip>,
		);
	});
});

describe('remaining props', () => {
	test('accepts the presentational and test ones', () => {
		assertType(
			<Tooltip title="Text" className="x" style={{ color: 'red' }} id="tip">
				{trigger}
			</Tooltip>,
		);
		assertType(
			<Tooltip title="Text" testId="tip">
				{trigger}
			</Tooltip>,
		);
		assertType(
			<Tooltip title="Text" ref={buttonRef}>
				{trigger}
			</Tooltip>,
		);
	});

	test('rejects a ref for anything but the trigger element', () => {
		assertType(
			// @ts-expect-error - the ref lands on the trigger, an HTMLButtonElement
			<Tooltip title="Text" ref={divRef}>
				{trigger}
			</Tooltip>,
		);
	});

	test('accepts open', () => {
		assertType(
			<Tooltip title="Text" open>
				{trigger}
			</Tooltip>,
		);
	});

	test('rejects an open that is not a boolean', () => {
		assertType(
			// @ts-expect-error - `open` is a boolean
			<Tooltip title="Text" open="yes">
				{trigger}
			</Tooltip>,
		);
	});

	test('accepts any data-* attribute', () => {
		assertType(
			<Tooltip title="Text" data-anything="value">
				{trigger}
			</Tooltip>,
		);
	});

	test('rejects unknown props', () => {
		assertType(
			// @ts-expect-error - `onOpenChange` is not exposed
			<Tooltip title="Text" onOpenChange={() => {}}>
				{trigger}
			</Tooltip>,
		);
	});
});

describe('TooltipProvider', () => {
	test('accepts the delays in milliseconds', () => {
		assertType(
			<TooltipProvider delay={0} closeDelay={100} timeout={0}>
				{trigger}
			</TooltipProvider>,
		);
	});

	test('rejects a delay that is not a number', () => {
		assertType(
			// @ts-expect-error - delays are milliseconds, not strings
			<TooltipProvider delay="300">{trigger}</TooltipProvider>,
		);
	});
});
