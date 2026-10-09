/**
 * Type-level tests for the props of `AlertStrip.Button`. See `button.types.test-d.tsx` for how these
 * run and why every prop stays on the opening tag line.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { AlertStrip } from '../alert-strip.js';

const icon = <span data-testid="icon" />;
const noop = (): void => {};
const buttonRef = createRef<HTMLButtonElement>();
declare const maybeDisabled: boolean | undefined;

describe('variant, color, size and suffix', () => {
	test('come from the strip', () => {
		assertType(<AlertStrip.Button>Upgrade</AlertStrip.Button>);
	});

	test('variant is rejected', () => {
		assertType(
			// @ts-expect-error - the strip has one look for its action
			<AlertStrip.Button variant="ghost">Upgrade</AlertStrip.Button>,
		);
	});

	test('color is rejected', () => {
		assertType(
			// @ts-expect-error - the button follows the strip around it
			<AlertStrip.Button color="primary">Upgrade</AlertStrip.Button>,
		);
	});

	test('size is rejected', () => {
		assertType(
			// @ts-expect-error - the strip sets the size
			<AlertStrip.Button size="md">Upgrade</AlertStrip.Button>,
		);
	});

	test('suffix is rejected', () => {
		assertType(
			// @ts-expect-error - Figma draws the icon before the label only
			<AlertStrip.Button suffix={icon}>Upgrade</AlertStrip.Button>,
		);
	});
});

describe('disabled and disabledTooltip', () => {
	test('accepts the pair', () => {
		assertType(
			<AlertStrip.Button disabled disabledTooltip="Why">
				Refresh
			</AlertStrip.Button>,
		);
	});

	test('accepts an explicit undefined reason as the opt-out', () => {
		assertType(
			<AlertStrip.Button disabled disabledTooltip={undefined}>
				Refresh
			</AlertStrip.Button>,
		);
	});

	test('a possibly undefined disabled still needs a reason', () => {
		assertType(
			// @ts-expect-error - `disabled` typed `boolean | undefined` is still `disabled`
			<AlertStrip.Button disabled={maybeDisabled}>Refresh</AlertStrip.Button>,
		);
	});

	test('disabled without a reason is rejected', () => {
		assertType(
			// @ts-expect-error - a disabled button must explain itself through `disabledTooltip`
			<AlertStrip.Button disabled>Refresh</AlertStrip.Button>,
		);
	});

	test('a reason without disabled is rejected', () => {
		assertType(
			// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
			<AlertStrip.Button disabledTooltip="Why">Refresh</AlertStrip.Button>,
		);
	});
});

describe('prefix and children', () => {
	test('accepts a prefix', () => {
		assertType(<AlertStrip.Button prefix={icon}>Refresh</AlertStrip.Button>);
	});

	test('children are required', () => {
		assertType(
			// @ts-expect-error - a button with nothing inside it is not allowed
			<AlertStrip.Button />,
		);
	});

	test('icon mode is not offered', () => {
		assertType(
			// @ts-expect-error - the action needs a visible label
			<AlertStrip.Button icon aria-label="Refresh">
				{icon}
			</AlertStrip.Button>,
		);
	});
});

describe('test ids', () => {
	test('accepts testId and arbitrary data attributes', () => {
		assertType(
			<AlertStrip.Button testId="refresh" data-state="idle">
				Refresh
			</AlertStrip.Button>,
		);
	});

	test('rejects a raw data-testid', () => {
		assertType(
			// @ts-expect-error - use `testId`, it survives the tooltip trigger cloning the button
			<AlertStrip.Button data-testid="refresh">Refresh</AlertStrip.Button>,
		);
	});
});

describe('unknown props', () => {
	test('accepts key and ref', () => {
		assertType(
			<AlertStrip.Button key="refresh" ref={buttonRef}>
				Refresh
			</AlertStrip.Button>,
		);
	});

	test('rejects a misspelled prop', () => {
		assertType(
			// @ts-expect-error - `onClik` is not a prop
			<AlertStrip.Button onClik={noop}>Refresh</AlertStrip.Button>,
		);
	});

	test('rejects className and style, the look comes from the strip', () => {
		assertType(
			// @ts-expect-error - `className` is not a prop
			<AlertStrip.Button className="x">Refresh</AlertStrip.Button>,
		);
		assertType(
			// @ts-expect-error - `style` is not a prop
			<AlertStrip.Button style={{}}>Refresh</AlertStrip.Button>,
		);
	});

	test('rejects width and maxWidth, the button sizes to its label', () => {
		assertType(
			// @ts-expect-error - `width` is not a prop
			<AlertStrip.Button width={120}>Refresh</AlertStrip.Button>,
		);
	});
});

describe('remaining props', () => {
	test('accepts the button props that are left', () => {
		assertType(
			<AlertStrip.Button onClick={noop} loading loadingTooltip="Refreshing">
				Refresh
			</AlertStrip.Button>,
		);
		assertType(
			<AlertStrip.Button type="submit" form="settings" aria-describedby="hint">
				Refresh
			</AlertStrip.Button>,
		);
		assertType(
			<AlertStrip.Button textOverflow="hidden" onFocus={noop} onBlur={noop}>
				Refresh
			</AlertStrip.Button>,
		);
	});
});
