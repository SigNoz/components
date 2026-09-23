/**
 * Type-level tests for the props of {@link Checkbox}.
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
 * right above the opening `<Checkbox` tag. Keep every prop on that opening tag line: once oxfmt
 * breaks the props one per line, a prop-level error moves off the tag line and the comment stops
 * covering it.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Checkbox } from '../checkbox.js';

const noop = (): void => {};
const checkboxRef = createRef<HTMLSpanElement>();
const containerRef = createRef<HTMLLabelElement>();
declare const maybeDisabled: boolean | undefined;
declare const maybeReadOnly: boolean | undefined;

describe('color', () => {
	test('accepts every CheckboxColor', () => {
		assertType(<Checkbox color="primary" />);
		assertType(<Checkbox color="secondary" />);
		assertType(<Checkbox color="danger" />);
		assertType(<Checkbox color="warning" />);
		assertType(<Checkbox color="success" />);
		assertType(<Checkbox color="info" />);
		assertType(<Checkbox color="archive" />);
		assertType(<Checkbox color="highlight-danger" />);
	});

	test('is required, the checked fill is a semantic statement the call site makes', () => {
		// @ts-expect-error - `color` has no default, the call site has to pick the checked fill
		assertType(<Checkbox />);
	});

	test('rejects a color outside the palette', () => {
		// @ts-expect-error - `cherry` is the legacy palette, not a CheckboxColor
		assertType(<Checkbox color="cherry" />);
		// @ts-expect-error - `robin` is the legacy palette, not a CheckboxColor
		assertType(<Checkbox color="robin" />);
	});
});

describe('label and textOverflow', () => {
	test('children are the label', () => {
		assertType(<Checkbox color="primary">Accept the terms</Checkbox>);
	});

	test('accepts every textOverflow', () => {
		assertType(
			<Checkbox color="primary" textOverflow="ellipsis">
				Accept the terms
			</Checkbox>,
		);
		assertType(
			<Checkbox color="primary" textOverflow="wrap">
				Accept the terms
			</Checkbox>,
		);
		assertType(
			<Checkbox color="primary" textOverflow="hidden">
				Accept the terms
			</Checkbox>,
		);
		assertType(
			<Checkbox color="primary" textOverflow="visible">
				Accept the terms
			</Checkbox>,
		);
	});

	test('rejects a textOverflow outside the set', () => {
		// @ts-expect-error - `clip` is not a CheckboxTextOverflow
		assertType(<Checkbox color="primary" textOverflow="clip" />);
	});
});

describe('indeterminate', () => {
	test('is one more value of the checked state, controlled or uncontrolled', () => {
		assertType(<Checkbox color="primary" value="indeterminate" onChange={noop} />);
		assertType(<Checkbox color="primary" defaultValue="indeterminate" />);
	});

	test('rejects the Base UI split into a boolean prop', () => {
		// @ts-expect-error - the mixed state is `value="indeterminate"`, not its own prop
		assertType(<Checkbox color="primary" indeterminate value={false} onChange={noop} />);
	});
});

describe('disabled and disabledTooltip', () => {
	test('accepts the pair', () => {
		assertType(<Checkbox color="primary" disabled disabledTooltip="Why" />);
		assertType(<Checkbox color="primary" disabled={false} disabledTooltip="Why" />);
	});

	test('accepts an explicit undefined reason as the opt-out', () => {
		assertType(<Checkbox color="primary" disabled disabledTooltip={undefined} />);
	});

	test('a possibly undefined disabled still needs a reason', () => {
		// @ts-expect-error - `disabled` typed `boolean | undefined` is still `disabled`
		assertType(<Checkbox color="primary" disabled={maybeDisabled} />);
	});

	test('disabled without a reason is rejected', () => {
		// @ts-expect-error - a disabled checkbox must explain itself through `disabledTooltip`
		assertType(<Checkbox color="primary" disabled />);
	});

	test('a reason without disabled is rejected', () => {
		// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
		assertType(<Checkbox color="primary" disabledTooltip="Why" />);
	});
});

describe('readOnly and readOnlyTooltip', () => {
	test('accepts the pair', () => {
		assertType(<Checkbox color="primary" readOnly readOnlyTooltip="Saving" />);
	});

	test('accepts an explicit undefined reason as the opt-out', () => {
		assertType(<Checkbox color="primary" readOnly readOnlyTooltip={undefined} />);
	});

	test('a possibly undefined readOnly still needs a reason', () => {
		// @ts-expect-error - `readOnly` typed `boolean | undefined` is still `readOnly`
		assertType(<Checkbox color="primary" readOnly={maybeReadOnly} />);
	});

	test('readOnly without a reason is rejected', () => {
		// @ts-expect-error - a locked checkbox must explain itself through `readOnlyTooltip`
		assertType(<Checkbox color="primary" readOnly />);
	});

	test('a reason without readOnly is rejected', () => {
		// @ts-expect-error - `readOnlyTooltip` never renders unless `readOnly` is set
		assertType(<Checkbox color="primary" readOnlyTooltip="Saving" />);
	});

	test('both pairs live together', () => {
		assertType(
			<Checkbox color="primary" disabled disabledTooltip="Why" readOnly readOnlyTooltip="Saving" />,
		);
	});
});

describe('value, defaultValue and onChange', () => {
	test('accepts a controlled value', () => {
		assertType(<Checkbox color="primary" value onChange={noop} />);
		assertType(<Checkbox color="primary" value={false} onChange={noop} />);
	});

	test('accepts an uncontrolled default', () => {
		assertType(<Checkbox color="primary" defaultValue />);
	});

	test('rejects value and defaultValue together', () => {
		// @ts-expect-error - `value` makes the checkbox controlled for life, `defaultValue` is dead beside it
		assertType(<Checkbox color="primary" value defaultValue onChange={noop} />);
	});

	test('hands onChange the new checked state', () => {
		assertType(<Checkbox color="primary" onChange={(checked: boolean) => checked} />);
	});

	test('rejects the Radix and antd spellings', () => {
		// @ts-expect-error - the controlled prop is called `value`
		assertType(<Checkbox color="primary" checked onChange={noop} />);
		// @ts-expect-error - the uncontrolled prop is called `defaultValue`
		assertType(<Checkbox color="primary" defaultChecked />);
		// @ts-expect-error - the change handler is called `onChange`
		assertType(<Checkbox color="primary" onCheckedChange={noop} />);
	});
});

describe('test ids', () => {
	test('accepts testId, containerTestId and arbitrary data attributes', () => {
		assertType(
			<Checkbox color="primary" testId="tos" containerTestId="tos-row" data-state="open" />,
		);
	});

	test('rejects a raw data-testid', () => {
		// @ts-expect-error - use `testId`, it survives the tooltip trigger cloning the checkbox
		assertType(<Checkbox color="primary" data-testid="tos" />);
	});
});

describe('remaining props', () => {
	test('accepts the presentational and native ones', () => {
		assertType(
			<Checkbox color="primary" id="tos" name="tos" required aria-label="Accept the terms" />,
		);
		assertType(<Checkbox color="primary" tabIndex={-1} />);
		assertType(<Checkbox color="primary" width={240} maxWidth="100%" />);
		assertType(
			<Checkbox color="primary" containerId="row" containerClassName="row" containerStyle={{}} />,
		);
		assertType(
			<Checkbox color="primary" containerRef={containerRef}>
				Accept the terms
			</Checkbox>,
		);
	});

	test('accepts the full shape at once', () => {
		assertType(
			<Checkbox
				color="success"
				value="indeterminate"
				onChange={noop}
				name="tos"
				required
				tabIndex={0}
				testId="tos"
				containerTestId="tos-row"
				width={240}
				maxWidth="100%"
				aria-label="Accept the terms"
				data-analytics="tos"
				ref={checkboxRef}
				containerRef={containerRef}
			/>,
		);
	});
});

describe('unknown props', () => {
	test('accepts key and ref', () => {
		assertType(<Checkbox color="primary" key="row" ref={checkboxRef} />);
	});

	test('rejects a misspelled prop', () => {
		// @ts-expect-error - `onChage` is not a prop, a generic `T extends CheckboxProps` would let it through
		assertType(<Checkbox color="primary" onChage={noop} />);
	});

	test('rejects the dropped onClick prop', () => {
		// @ts-expect-error - `onClick` was dropped in the rework, a checkbox reports through `onChange`
		assertType(<Checkbox color="primary" onClick={noop} />);
	});
});
