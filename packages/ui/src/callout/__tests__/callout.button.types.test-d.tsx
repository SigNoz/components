/**
 * Type-level tests for the props of `Callout.Button`. See `button.types.test-d.tsx` for how these
 * run and why every prop stays on the opening tag line.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Callout } from '../callout.js';

const icon = <span data-testid="icon" />;
const noop = (): void => {};
const buttonRef = createRef<HTMLButtonElement>();
declare const maybeDisabled: boolean | undefined;

describe('variant, color and size', () => {
	test('come from the callout', () => {
		assertType(<Callout.Button>Refresh</Callout.Button>);
	});

	test('variant is rejected', () => {
		assertType(
			// @ts-expect-error - the button is always solid
			<Callout.Button variant="ghost">Refresh</Callout.Button>,
		);
	});

	test('color is rejected', () => {
		assertType(
			// @ts-expect-error - the button takes the color of the callout around it
			<Callout.Button color="primary">Refresh</Callout.Button>,
		);
	});

	test('size is rejected', () => {
		assertType(
			// @ts-expect-error - the button is always sm, the size that fits the first line
			<Callout.Button size="md">Refresh</Callout.Button>,
		);
	});

	test('a solid variant with the color of the callout is still rejected', () => {
		assertType(
			// @ts-expect-error - passing what the callout already sets is noise
			<Callout.Button variant="solid" color="warning">
				Refresh
			</Callout.Button>,
		);
	});
});

describe('disabled and disabledTooltip', () => {
	test('accepts the pair', () => {
		assertType(
			<Callout.Button disabled disabledTooltip="Why">
				Refresh
			</Callout.Button>,
		);
	});

	test('accepts an explicit undefined reason as the opt-out', () => {
		assertType(
			<Callout.Button disabled disabledTooltip={undefined}>
				Refresh
			</Callout.Button>,
		);
	});

	test('a possibly undefined disabled still needs a reason', () => {
		assertType(
			// @ts-expect-error - `disabled` typed `boolean | undefined` is still `disabled`
			<Callout.Button disabled={maybeDisabled}>Refresh</Callout.Button>,
		);
	});

	test('disabled without a reason is rejected', () => {
		assertType(
			// @ts-expect-error - a disabled button must explain itself through `disabledTooltip`
			<Callout.Button disabled>Refresh</Callout.Button>,
		);
	});

	test('a reason without disabled is rejected', () => {
		assertType(
			// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
			<Callout.Button disabledTooltip="Why">Refresh</Callout.Button>,
		);
	});
});

describe('prefix, suffix and children', () => {
	test('accepts either affix', () => {
		assertType(<Callout.Button prefix={icon}>Refresh</Callout.Button>);
		assertType(<Callout.Button suffix={icon}>Refresh</Callout.Button>);
	});

	test('children are required', () => {
		assertType(
			// @ts-expect-error - a button with nothing inside it is not allowed
			<Callout.Button />,
		);
	});

	test('icon mode is not offered', () => {
		assertType(
			// @ts-expect-error - the action needs a visible label
			<Callout.Button icon aria-label="Refresh">
				{icon}
			</Callout.Button>,
		);
	});
});

describe('test ids', () => {
	test('accepts testId and arbitrary data attributes', () => {
		assertType(
			<Callout.Button testId="refresh" data-state="idle">
				Refresh
			</Callout.Button>,
		);
	});

	test('rejects a raw data-testid', () => {
		assertType(
			// @ts-expect-error - use `testId`, it survives the tooltip trigger cloning the button
			<Callout.Button data-testid="refresh">Refresh</Callout.Button>,
		);
	});
});

describe('unknown props', () => {
	test('accepts key and ref', () => {
		assertType(
			<Callout.Button key="refresh" ref={buttonRef}>
				Refresh
			</Callout.Button>,
		);
	});

	test('rejects a misspelled prop', () => {
		assertType(
			// @ts-expect-error - `onClik` is not a prop
			<Callout.Button onClik={noop}>Refresh</Callout.Button>,
		);
	});

	test('rejects className and style, the look comes from the callout', () => {
		assertType(
			// @ts-expect-error - `className` is not a prop
			<Callout.Button className="x">Refresh</Callout.Button>,
		);
		assertType(
			// @ts-expect-error - `style` is not a prop
			<Callout.Button style={{}}>Refresh</Callout.Button>,
		);
	});

	test('rejects width and maxWidth, the button sizes to its label', () => {
		assertType(
			// @ts-expect-error - `width` is not a prop
			<Callout.Button width={120}>Refresh</Callout.Button>,
		);
	});
});

describe('remaining props', () => {
	test('accepts the button props that are left', () => {
		assertType(
			<Callout.Button onClick={noop} loading loadingTooltip="Refreshing">
				Refresh
			</Callout.Button>,
		);
		assertType(
			<Callout.Button type="submit" form="settings" aria-describedby="hint">
				Refresh
			</Callout.Button>,
		);
		assertType(
			<Callout.Button textOverflow="hidden" onFocus={noop} onBlur={noop}>
				Refresh
			</Callout.Button>,
		);
	});
});
