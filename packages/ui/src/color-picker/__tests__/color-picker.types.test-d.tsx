/**
 * Type-level tests for the props of {@link ColorPicker}.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it: it either
 * compiles, or it is marked `@ts-expect-error` because we refuse that combination. TypeScript
 * reports an unused `@ts-expect-error` as an error of its own, so loosening a constraint by accident
 * fails the build instead of passing silently.
 *
 * The comment suppresses the line directly below it, so it sits inside the `assertType(...)` call,
 * right above the opening tag, and the refused prop stays on that tag line.
 */
import { createRef, type FocusEvent } from 'react';
import { assertType, describe, expectTypeOf, test } from 'vitest';
import { ColorPicker } from '../color-picker.js';

const btn = <button type="button">Color</button>;
const ref = createRef<HTMLButtonElement>();

declare const maybeDisabled: boolean | undefined;
declare const maybeReadOnly: boolean | undefined;
declare const maybeColor: string | undefined;
declare const maybeNullColor: string | null;
declare const isNullable: boolean;

describe('required props', () => {
	test('accepts the required four, plus a ref', () => {
		assertType(
			<ColorPicker nativeButton side="bottom" align="start" ref={ref}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects a picker with no trigger', () => {
		assertType(
			// @ts-expect-error - the trigger is the consumer's element, passed as children
			<ColorPicker nativeButton side="bottom" align="start" />,
		);
	});

	test('rejects a trigger that is not an element', () => {
		assertType(
			// @ts-expect-error - the picker merges its props into one element, text has none
			<ColorPicker nativeButton side="bottom" align="start">
				Color
			</ColorPicker>,
		);
	});

	test('rejects a picker that does not say whether its trigger is a button', () => {
		assertType(
			// @ts-expect-error - `nativeButton` has to match the trigger, so it has no default
			<ColorPicker side="bottom" align="start">
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects a picker with no side', () => {
		assertType(
			// @ts-expect-error - placement is never incidental, the call site states the side
			<ColorPicker nativeButton align="start">
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects a picker with no align', () => {
		assertType(
			// @ts-expect-error - placement is never incidental, the call site states the align
			<ColorPicker nativeButton side="bottom">
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects a logical side', () => {
		assertType(
			// @ts-expect-error - the four physical sides, the same as Popover
			<ColorPicker nativeButton side="inline-start" align="start">
				{btn}
			</ColorPicker>,
		);
	});
});

describe('value and callbacks', () => {
	test('takes and returns a string or undefined, with no cast', () => {
		assertType(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				value={maybeColor}
				onChange={(value) => expectTypeOf(value).toEqualTypeOf<string | undefined>()}
				onAfterChange={(value) => expectTypeOf(value).toEqualTypeOf<string | undefined>()}
			>
				{btn}
			</ColorPicker>,
		);
		assertType(
			<ColorPicker nativeButton side="bottom" align="start" defaultValue="#3a2a63">
				{btn}
			</ColorPicker>,
		);
	});

	test('accepts an explicit undefined value, a picker with no color that keeps its own state', () => {
		assertType(
			<ColorPicker nativeButton side="bottom" align="start" value={undefined}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects a value that is not a string', () => {
		assertType(
			// @ts-expect-error - the value is a hex string, there is no Color object
			<ColorPicker nativeButton side="bottom" align="start" value={{ r: 1, g: 2, b: 3 }}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects a handler that expects a color object', () => {
		assertType(
			// @ts-expect-error - the callbacks receive the hex string
			<ColorPicker nativeButton side="bottom" align="start" onChange={(c: { r: number }) => c}>
				{btn}
			</ColorPicker>,
		);
	});

	test('passes the shown color to footer as a string', () => {
		assertType(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				footer={(color) => {
					expectTypeOf(color).toEqualTypeOf<string>();

					return <span>{color}</span>;
				}}
			>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects a footer that is not a function', () => {
		assertType(
			// @ts-expect-error - footer receives the color, so it is a render function
			<ColorPicker nativeButton side="bottom" align="start" footer={<span />}>
				{btn}
			</ColorPicker>,
		);
	});
});

describe('onBlur', () => {
	test('takes a focus event handler, or one with no argument', () => {
		assertType(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				onBlur={(event: FocusEvent<HTMLElement>) => event.currentTarget}
			>
				{btn}
			</ColorPicker>,
		);
		assertType(
			<ColorPicker nativeButton side="bottom" align="start" onBlur={() => undefined}>
				{btn}
			</ColorPicker>,
		);
	});
});

describe('nullable', () => {
	test('takes null as the value and reports a string or null', () => {
		assertType(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				nullable
				value={maybeNullColor}
				onChange={(value) => expectTypeOf(value).toEqualTypeOf<string | null>()}
				onAfterChange={(value) => expectTypeOf(value).toEqualTypeOf<string | null>()}
			>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects a null value without nullable', () => {
		assertType(
			// @ts-expect-error - `null` needs `nullable`
			<ColorPicker nativeButton side="bottom" align="start" value={maybeNullColor}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects nullable={false}, which is the same as leaving it out', () => {
		assertType(
			// @ts-expect-error - `nullable` only takes `true`, leave it out instead of passing `false`
			<ColorPicker nativeButton side="bottom" align="start" nullable={false}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects a nullable decided at run time', () => {
		assertType(
			// @ts-expect-error - `nullable` only takes `true`, a `boolean` is not accepted
			<ColorPicker nativeButton side="bottom" align="start" nullable={isNullable}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects a handler that only takes undefined for no color', () => {
		// oxfmt-ignore
		// @ts-expect-error - a nullable picker reports `null` for no color
		assertType(<ColorPicker nativeButton side="bottom" align="start" nullable onChange={(value: string | undefined) => value}>{btn}</ColorPicker>);
	});
});

describe('accepted props', () => {
	test('accepts every prop it declares, aria and data attributes', () => {
		assertType(
			<ColorPicker
				nativeButton={false}
				side="top"
				align="end"
				value="#3a2a63"
				onChange={() => {}}
				onAfterChange={() => {}}
				allowClear
				container={document.body}
				footer={(color) => color}
				name="color"
				form="panel-form"
				required
				disabled
				disabledTooltip="Ask an admin"
				readOnly
				readOnlyTooltip="Set by the dashboard owner"
				testId="picker"
				id="series-color"
				aria-label="Series color for cpu.user, #3a2a63"
				aria-describedby="hint"
				data-series="cpu.user"
				ref={ref}
			>
				<div>Legend row</div>
			</ColorPicker>,
		);
	});

	test('accepts a ref object or null as the container', () => {
		const containerRef = createRef<HTMLDivElement>();

		assertType(
			<ColorPicker nativeButton side="bottom" align="start" container={containerRef}>
				{btn}
			</ColorPicker>,
		);
		assertType(
			<ColorPicker nativeButton side="bottom" align="start" container={null}>
				{btn}
			</ColorPicker>,
		);
	});
});

describe('disabled and disabledTooltip', () => {
	test('accepts the pair, and an explicit undefined reason as the opt-out', () => {
		assertType(
			<ColorPicker nativeButton side="bottom" align="start" disabled disabledTooltip="Why">
				{btn}
			</ColorPicker>,
		);
		assertType(
			<ColorPicker nativeButton side="bottom" align="start" disabled disabledTooltip={undefined}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects disabled without a reason', () => {
		assertType(
			// @ts-expect-error - a disabled picker has to tell the user why it cannot be used
			<ColorPicker nativeButton side="bottom" align="start" disabled>
				{btn}
			</ColorPicker>,
		);
	});

	test('a possibly undefined disabled still needs a reason', () => {
		assertType(
			// @ts-expect-error - `disabled` typed `boolean | undefined` is still `disabled`
			<ColorPicker nativeButton side="bottom" align="start" disabled={maybeDisabled}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects a reason without disabled', () => {
		assertType(
			// @ts-expect-error - `disabledTooltip` only renders while `disabled` is set
			<ColorPicker nativeButton side="bottom" align="start" disabledTooltip="Why">
				{btn}
			</ColorPicker>,
		);
	});
});

describe('readOnly and readOnlyTooltip', () => {
	test('accepts the pair, and an explicit undefined reason as the opt-out', () => {
		assertType(
			<ColorPicker nativeButton side="bottom" align="start" readOnly readOnlyTooltip="Why">
				{btn}
			</ColorPicker>,
		);
		assertType(
			<ColorPicker nativeButton side="bottom" align="start" readOnly readOnlyTooltip={undefined}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects readOnly without a reason', () => {
		assertType(
			// @ts-expect-error - a locked picker has to tell the user why it cannot change
			<ColorPicker nativeButton side="bottom" align="start" readOnly>
				{btn}
			</ColorPicker>,
		);
	});

	test('a possibly undefined readOnly still needs a reason', () => {
		assertType(
			// @ts-expect-error - `readOnly` typed `boolean | undefined` is still `readOnly`
			<ColorPicker nativeButton side="bottom" align="start" readOnly={maybeReadOnly}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects a reason without readOnly', () => {
		assertType(
			// @ts-expect-error - `readOnlyTooltip` only renders while `readOnly` is set
			<ColorPicker nativeButton side="bottom" align="start" readOnlyTooltip="Why">
				{btn}
			</ColorPicker>,
		);
	});
});

describe('picker-owned aria', () => {
	test('rejects aria-haspopup', () => {
		assertType(
			// @ts-expect-error - the picker writes `aria-haspopup="dialog"`
			<ColorPicker nativeButton side="bottom" align="start" aria-haspopup="menu">
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects aria-expanded', () => {
		assertType(
			// @ts-expect-error - the picker writes `aria-expanded` from its open state
			<ColorPicker nativeButton side="bottom" align="start" aria-expanded={false}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects aria-controls', () => {
		assertType(
			// @ts-expect-error - the picker writes `aria-controls` with the popup id
			<ColorPicker nativeButton side="bottom" align="start" aria-controls="popup">
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects aria-disabled', () => {
		assertType(
			// @ts-expect-error - write `disabled`, the picker sets `aria-disabled`
			<ColorPicker nativeButton side="bottom" align="start" aria-disabled>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects aria-readonly', () => {
		assertType(
			// @ts-expect-error - write `readOnly`, the picker sets `aria-readonly`
			<ColorPicker nativeButton side="bottom" align="start" aria-readonly>
				{btn}
			</ColorPicker>,
		);
	});
});

describe('rejected props', () => {
	test('rejects className', () => {
		assertType(
			// @ts-expect-error - the trigger takes its own class, the popup takes none
			<ColorPicker nativeButton side="bottom" align="start" className="picker">
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects style', () => {
		assertType(
			// @ts-expect-error - the trigger takes its own style, the popup takes none
			<ColorPicker nativeButton side="bottom" align="start" style={{ width: 240 }}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects a raw data-testid', () => {
		assertType(
			// @ts-expect-error - the prop is called `testId`
			<ColorPicker nativeButton side="bottom" align="start" data-testid="picker">
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects onChangeComplete, renamed to onAfterChange', () => {
		assertType(
			// @ts-expect-error - write `onAfterChange`, the name on Slider
			<ColorPicker nativeButton side="bottom" align="start" onChangeComplete={() => {}}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects the format props, the value is always hex', () => {
		assertType(
			// @ts-expect-error - the value is always `#rrggbb`, there is no `format`
			<ColorPicker nativeButton side="bottom" align="start" format="hex">
				{btn}
			</ColorPicker>,
		);
		assertType(
			// @ts-expect-error - the value is always `#rrggbb`, there is no `defaultFormat`
			<ColorPicker nativeButton side="bottom" align="start" defaultFormat="rgb">
				{btn}
			</ColorPicker>,
		);
		assertType(
			// @ts-expect-error - the value is always `#rrggbb`, there is no `onFormatChange`
			<ColorPicker nativeButton side="bottom" align="start" onFormatChange={() => {}}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects disabledAlpha, the picker has no alpha', () => {
		assertType(
			// @ts-expect-error - every value is opaque
			<ColorPicker nativeButton side="bottom" align="start" disabledAlpha>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects onClear, onChange reports the clear', () => {
		assertType(
			// @ts-expect-error - `onChange` is called with `undefined` on a clear
			<ColorPicker nativeButton side="bottom" align="start" onClear={() => {}}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects presets, the swatches live next to the trigger', () => {
		assertType(
			// @ts-expect-error - the preset row is outside the popup
			<ColorPicker nativeButton side="bottom" align="start" presets={[]}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects panelRender, replaced by footer', () => {
		assertType(
			// @ts-expect-error - write `footer`
			<ColorPicker nativeButton side="bottom" align="start" panelRender={() => null}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects showText and size, which only styled the antd trigger', () => {
		assertType(
			// @ts-expect-error - the picker draws no trigger to show text on
			<ColorPicker nativeButton side="bottom" align="start" showText={false}>
				{btn}
			</ColorPicker>,
		);
		assertType(
			// @ts-expect-error - the trigger's size is the consumer's
			<ColorPicker nativeButton side="bottom" align="start" size="small">
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects trigger, the popup opens on press only', () => {
		assertType(
			// @ts-expect-error - a press opens the popup, there is no hover trigger
			<ColorPicker nativeButton side="bottom" align="start" trigger="click">
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects the open state props, the picker owns its open state', () => {
		assertType(
			// @ts-expect-error - use ForceOpenProvider in stories and tests, there is no `open`
			<ColorPicker nativeButton side="bottom" align="start" open>
				{btn}
			</ColorPicker>,
		);
		assertType(
			// @ts-expect-error - use ForceOpenProvider in stories and tests, there is no `defaultOpen`
			<ColorPicker nativeButton side="bottom" align="start" defaultOpen>
				{btn}
			</ColorPicker>,
		);
		assertType(
			// @ts-expect-error - the picker owns its open state, there is no `onOpenChange`
			<ColorPicker nativeButton side="bottom" align="start" onOpenChange={() => {}}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects the antd placement props, replaced by side and align', () => {
		assertType(
			// @ts-expect-error - write `side` and `align`, there is no `placement`
			<ColorPicker nativeButton side="bottom" align="start" placement="bottomLeft">
				{btn}
			</ColorPicker>,
		);
		assertType(
			// @ts-expect-error - the popup has no arrow
			<ColorPicker nativeButton side="bottom" align="start" arrow>
				{btn}
			</ColorPicker>,
		);
		assertType(
			// @ts-expect-error - the popup always flips when there is no room
			<ColorPicker nativeButton side="bottom" align="start" autoAdjustOverflow={false}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects getPopupContainer, replaced by container', () => {
		assertType(
			// @ts-expect-error - write `container`
			<ColorPicker nativeButton side="bottom" align="start" getPopupContainer={() => document.body}>
				{btn}
			</ColorPicker>,
		);
	});

	test('rejects the antd popup styling props', () => {
		assertType(
			// @ts-expect-error - the popup unmounts when it closes
			<ColorPicker nativeButton side="bottom" align="start" destroyTooltipOnHide>
				{btn}
			</ColorPicker>,
		);
		assertType(
			// @ts-expect-error - the parts of the popup take no style
			<ColorPicker nativeButton side="bottom" align="start" styles={{}}>
				{btn}
			</ColorPicker>,
		);
		assertType(
			// @ts-expect-error - the popup takes no class
			<ColorPicker nativeButton side="bottom" align="start" rootClassName="root">
				{btn}
			</ColorPicker>,
		);
	});
});
