/**
 * Type-level tests for the props of {@link Switch}.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it: it either
 * compiles, or it is marked `@ts-expect-error` because we refuse that combination. TypeScript
 * reports an unused `@ts-expect-error` as an error of its own, so loosening a constraint by accident
 * fails the build instead of passing silently.
 *
 * The comment suppresses the line directly below it, which is why it sits inside `assertType(...)`
 * right above the opening `<Switch` tag. Keep every prop on that opening tag line: once oxfmt
 * breaks the props one per line, a prop-level error moves off the tag line and the comment stops
 * covering it.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Switch } from '../switch.js';

const noop = (): void => {};
const switchRef = createRef<HTMLSpanElement>();
const containerRef = createRef<HTMLLabelElement>();
declare const maybeDisabled: boolean | undefined;
declare const maybeReadOnly: boolean | undefined;

describe('color', () => {
	test('accepts every SwitchColor', () => {
		assertType(<Switch color="primary" />);
		assertType(<Switch color="secondary" />);
		assertType(<Switch color="danger" />);
		assertType(<Switch color="warning" />);
		assertType(<Switch color="success" />);
		assertType(<Switch color="info" />);
		assertType(<Switch color="archive" />);
		assertType(<Switch color="highlight-danger" />);
	});

	test('is optional, the default is primary', () => {
		assertType(<Switch />);
	});

	test('rejects a color outside the palette', () => {
		// @ts-expect-error - `cherry` is the legacy palette, not a SwitchColor
		assertType(<Switch color="cherry" />);
	});
});

describe('label and description', () => {
	test('children are the label and description rides along', () => {
		assertType(<Switch>Wrap text</Switch>);
		assertType(<Switch description="Use the 24-hour convention">24-hour format</Switch>);
		assertType(<Switch textPlacement="left">Wrap text</Switch>);
	});

	test('rejects a textPlacement outside the set', () => {
		// @ts-expect-error - `start` is not a SwitchTextPlacement, the sides are `left` and `right`
		assertType(<Switch textPlacement="start">Wrap text</Switch>);
	});

	test('rejects a textOverflow outside the set', () => {
		// @ts-expect-error - `clip` is not a SwitchTextOverflow
		assertType(<Switch textOverflow="clip">Wrap text</Switch>);
	});

	test('accepts every textOverflow', () => {
		assertType(<Switch textOverflow="ellipsis">Wrap text</Switch>);
		assertType(<Switch textOverflow="wrap">Wrap text</Switch>);
		assertType(<Switch textOverflow="hidden">Wrap text</Switch>);
		assertType(<Switch textOverflow="visible">Wrap text</Switch>);
	});
});

describe('disabled and disabledTooltip', () => {
	test('accepts the pair', () => {
		assertType(<Switch disabled disabledTooltip="Why" />);
		assertType(<Switch disabled={false} disabledTooltip="Why" />);
	});

	test('accepts an explicit undefined reason as the opt-out', () => {
		assertType(<Switch disabled disabledTooltip={undefined} />);
	});

	test('a possibly undefined disabled still needs a reason', () => {
		// @ts-expect-error - `disabled` typed `boolean | undefined` is still `disabled`
		assertType(<Switch disabled={maybeDisabled} />);
	});

	test('disabled without a reason is rejected', () => {
		// @ts-expect-error - a disabled switch must explain itself through `disabledTooltip`
		assertType(<Switch disabled />);
	});

	test('a reason without disabled is rejected', () => {
		// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
		assertType(<Switch disabledTooltip="Why" />);
	});
});

describe('readOnly and readOnlyTooltip', () => {
	test('accepts the pair', () => {
		assertType(<Switch readOnly readOnlyTooltip="Saving" />);
	});

	test('accepts an explicit undefined reason as the opt-out', () => {
		assertType(<Switch readOnly readOnlyTooltip={undefined} />);
	});

	test('a possibly undefined readOnly still needs a reason', () => {
		// @ts-expect-error - `readOnly` typed `boolean | undefined` is still `readOnly`
		assertType(<Switch readOnly={maybeReadOnly} />);
	});

	test('readOnly without a reason is rejected', () => {
		// @ts-expect-error - a locked switch must explain itself through `readOnlyTooltip`
		assertType(<Switch readOnly />);
	});

	test('a reason without readOnly is rejected', () => {
		// @ts-expect-error - `readOnlyTooltip` never renders unless `readOnly` is set
		assertType(<Switch readOnlyTooltip="Saving" />);
	});

	test('both pairs live together', () => {
		assertType(<Switch disabled disabledTooltip="Why" readOnly readOnlyTooltip="Saving" />);
	});
});

describe('value, defaultValue and onChange', () => {
	test('accepts a controlled value', () => {
		assertType(<Switch value onChange={noop} />);
		assertType(<Switch value={false} onChange={noop} />);
	});

	test('accepts an uncontrolled default', () => {
		assertType(<Switch defaultValue />);
	});

	test('rejects value and defaultValue together', () => {
		// @ts-expect-error - `value` makes the switch controlled for life, `defaultValue` is dead beside it
		assertType(<Switch value defaultValue onChange={noop} />);
	});

	test('hands onChange the new checked state', () => {
		assertType(<Switch onChange={(checked: boolean) => checked} />);
	});

	test('rejects the Radix and antd spellings', () => {
		// @ts-expect-error - the controlled prop is called `value`
		assertType(<Switch checked onChange={noop} />);
		// @ts-expect-error - the uncontrolled prop is called `defaultValue`
		assertType(<Switch defaultChecked />);
		// @ts-expect-error - the change handler is called `onChange`
		assertType(<Switch onCheckedChange={noop} />);
	});
});

describe('test ids', () => {
	test('accepts testId, containerTestId and arbitrary data attributes', () => {
		assertType(<Switch testId="wrap" containerTestId="wrap-row" data-state="open" />);
	});

	test('rejects a raw data-testid', () => {
		// @ts-expect-error - use `testId`, it survives the tooltip trigger cloning the switch
		assertType(<Switch data-testid="wrap" />);
	});
});

describe('remaining props', () => {
	test('accepts the presentational and native ones', () => {
		assertType(<Switch id="wrap" name="wrap" required aria-label="Wrap text" />);
		assertType(<Switch width={240} maxWidth="100%" />);
		assertType(<Switch containerId="row" containerClassName="row" containerStyle={{}} />);
		assertType(<Switch containerRef={containerRef}>Wrap text</Switch>);
	});
});

describe('unknown props', () => {
	test('accepts key and ref', () => {
		assertType(<Switch key="row" ref={switchRef} />);
	});

	test('rejects a misspelled prop', () => {
		// @ts-expect-error - `onChage` is not a prop, a generic `T extends SwitchProps` would let it through
		assertType(<Switch onChage={noop} />);
	});

	test('rejects the dropped isLoading prop', () => {
		// @ts-expect-error - `isLoading` was dropped in the rework, no other input supports loading
		assertType(<Switch isLoading />);
	});
});
