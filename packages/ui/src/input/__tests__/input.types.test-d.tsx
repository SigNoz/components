/**
 * Type-level tests for the props of {@link Input} and its members.
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
 * right above the opening `<Input` tag. Keep every prop on that opening tag line: once oxfmt breaks
 * the props one per line, a prop-level error moves off the tag line and the comment stops covering
 * it.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Input } from '../input.js';

const noop = (): void => {};
const inputRef = createRef<HTMLInputElement>();
const textAreaRef = createRef<HTMLTextAreaElement>();
declare const maybeDisabled: boolean | undefined;
declare const maybeReadOnly: boolean | undefined;
declare const runtimeNullable: boolean;
declare const nullableText: string | null;
declare const reportsNull: (value: string | null) => void;
declare const registration: {
	name: string;
	onChange: (event: unknown) => Promise<boolean>;
	onBlur: (event: unknown) => Promise<boolean>;
	ref: (instance: HTMLInputElement | null) => void;
	disabled?: boolean;
	required?: boolean;
};

describe('native props', () => {
	test('accepts the input attributes and events', () => {
		assertType(
			<Input
				name="org"
				placeholder="Name"
				maxLength={64}
				onChange={noop}
				onWheel={noop}
				ref={inputRef}
			/>,
		);
	});

	test('accepts a react-hook-form register() spread without a tooltip', () => {
		assertType(<Input aria-label="Organisation" {...registration} />);
	});

	test('rejects the native size attribute, the prop means the frame height', () => {
		// @ts-expect-error - `size` is `'sm' | 'md' | 'lg'`, not the character-width attribute
		assertType(<Input size={20} />);
	});

	test('accepts sm, md and lg, rejects any other size', () => {
		assertType(<Input size="sm" />);
		assertType(<Input size="md" />);
		assertType(<Input size="lg" />);
		// @ts-expect-error - the sizes are `'sm' | 'md' | 'lg'`
		assertType(<Input size="xl" />);
	});

	test('rejects className and style', () => {
		// @ts-expect-error - visual overrides go through the `--input-*` custom properties
		assertType(<Input className="styled" />);
		// @ts-expect-error - visual overrides go through the `--input-*` custom properties
		assertType(<Input style={{ color: 'red' }} />);
	});

	test('rejects a prop that does not exist', () => {
		// @ts-expect-error - `onPressEnter` is antd, submit on Enter comes from the owning form
		assertType(<Input onPressEnter={noop} />);
	});
});

describe('disabled and read-only pairing', () => {
	test('disabled requires disabledTooltip', () => {
		// @ts-expect-error - a disabled control has to say why
		assertType(<Input disabled />);
	});

	test('disabled with an explicit undefined reason passes', () => {
		assertType(<Input disabled disabledTooltip={undefined} />);
	});

	test('a forwarded `boolean | undefined` still counts as disabled', () => {
		// @ts-expect-error - a disabled control has to say why
		assertType(<Input disabled={maybeDisabled} />);
	});

	test('disabledTooltip requires disabled', () => {
		// @ts-expect-error - the reason only renders while `disabled` is set
		assertType(<Input disabledTooltip="Ask an admin" />);
	});

	test('readOnly requires readOnlyTooltip', () => {
		// @ts-expect-error - a locked control has to say why
		assertType(<Input readOnly={maybeReadOnly} />);
	});

	test('readOnlyTooltip requires readOnly', () => {
		// @ts-expect-error - the reason only renders while `readOnly` is set
		assertType(<Input readOnlyTooltip="Saving" />);
	});

	test('both pairs together pass', () => {
		assertType(<Input disabled disabledTooltip="Ask an admin" readOnly readOnlyTooltip="Saving" />);
	});
});

describe('testId', () => {
	test('data-testid is spelled testId', () => {
		// @ts-expect-error - `data-testid` is written as the `testId` prop
		assertType(<Input data-testid="org" />);
	});

	test('other data-* props pass', () => {
		assertType(<Input data-analytics="org" testId="org" />);
	});
});

describe('Input.Password', () => {
	test('accepts the shared props', () => {
		assertType(
			<Input.Password placeholder="Password" size="lg" testId="password" ref={inputRef} />,
		);
	});

	test('rejects type, the toggle owns it', () => {
		// @ts-expect-error - the visibility toggle is what switches `password` and `text`
		assertType(<Input.Password type="text" />);
	});

	test('rejects suffix, the toggle owns the slot', () => {
		// @ts-expect-error - the toggle owns the suffix slot
		assertType(<Input.Password suffix={<span>x</span>} />);
	});

	test('enforces the pairing rules too', () => {
		// @ts-expect-error - a disabled control has to say why
		assertType(<Input.Password disabled />);
	});
});

describe('Input.TextArea', () => {
	test('accepts rows and the textarea events', () => {
		assertType(<Input.TextArea rows={4} onChange={noop} status="danger" ref={textAreaRef} />);
	});

	test('rejects prefix and suffix', () => {
		// @ts-expect-error - adornments belong to a one-line field
		assertType(<Input.TextArea prefix={<span>@</span>} />);
	});

	test('rejects an input ref', () => {
		// @ts-expect-error - the control is a textarea
		assertType(<Input.TextArea ref={inputRef} />);
	});
});

describe('Input.Number', () => {
	test('accepts a numeric value and change handler', () => {
		assertType(
			<Input.Number
				value={5}
				min={0}
				max={10}
				step={1}
				onChange={(_value: number | null) => noop()}
				ref={inputRef}
			/>,
		);
	});

	test('null is the empty controlled value', () => {
		assertType(<Input.Number value={null} onChange={noop} aria-label="Count" />);
	});

	test('rejects a string value', () => {
		// @ts-expect-error - the value is a number, `null` while empty
		assertType(<Input.Number value="5" />);
	});

	test('rejects an event-shaped onChange', () => {
		// @ts-expect-error - `onChange` reports the parsed value, not the event
		assertType(<Input.Number onChange={(_event: { target: unknown }) => noop()} />);
	});

	test('rejects type and pattern, the primitive owns parsing', () => {
		// @ts-expect-error - the control is always a number field
		assertType(<Input.Number type="number" />);
		// @ts-expect-error - the control is always a number field
		assertType(<Input.Number pattern="[0-9]+" />);
	});
});

describe('nullable', () => {
	test('value takes null and undefined with nullable, on every text member', () => {
		assertType(<Input nullable value={null} onChange={noop} aria-label="Nickname" />);
		assertType(<Input nullable value={undefined} onChange={noop} aria-label="Nickname" />);
		assertType(<Input nullable value={nullableText} onChange={noop} aria-label="Nickname" />);
		assertType(<Input.Password nullable value={nullableText} aria-label="Secret" />);
		assertType(<Input.TextArea nullable value={nullableText} aria-label="Notes" />);
	});

	test('rejects a nullable decided at run time', () => {
		// @ts-expect-error - `nullable` only takes `true`, a `boolean` is not accepted
		assertType(<Input nullable={runtimeNullable} value={nullableText} aria-label="Nickname" />);
		// @ts-expect-error - `nullable` only takes `true`, also without a `null` value
		assertType(<Input nullable={runtimeNullable} value="Ada" aria-label="Nickname" />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on Input.Password too
		assertType(<Input.Password nullable={runtimeNullable} value={nullableText} aria-label="Secret" />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on Input.TextArea too
		assertType(<Input.TextArea nullable={runtimeNullable} value={nullableText} aria-label="Notes" />);
	});

	test('rejects nullable={false}, which is the same as leaving it out', () => {
		// @ts-expect-error - `nullable` only takes `true`
		assertType(<Input nullable={false} value={null} aria-label="Nickname" />);
		// @ts-expect-error - `nullable` only takes `true`, also without a `null` value
		assertType(<Input nullable={false} value="Ada" aria-label="Nickname" />);
		// @ts-expect-error - `nullable` only takes `true`, on Input.Password too
		assertType(<Input.Password nullable={false} value={null} aria-label="Secret" />);
		// @ts-expect-error - `nullable` only takes `true`, on Input.TextArea too
		assertType(<Input.TextArea nullable={false} value={null} aria-label="Notes" />);
	});

	test('without nullable the value is what it was', () => {
		assertType(<Input value="Ada" onChange={noop} aria-label="Nickname" />);
		// @ts-expect-error - `null` needs `nullable` on Input
		assertType(<Input value={null} aria-label="Nickname" />);
		// @ts-expect-error - a `string | null` value needs `nullable` on Input
		assertType(<Input value={nullableText} aria-label="Nickname" />);
		// @ts-expect-error - `null` needs `nullable` on Input.Password
		assertType(<Input.Password value={null} aria-label="Secret" />);
		// @ts-expect-error - `null` needs `nullable` on Input.TextArea
		assertType(<Input.TextArea value={null} aria-label="Notes" />);
	});

	test('accepts a react-hook-form register() spread with or without nullable', () => {
		assertType(<Input aria-label="Nickname" {...registration} />);
		assertType(<Input nullable aria-label="Nickname" {...registration} />);
	});

	test('onChange stays the native event', () => {
		assertType(<Input nullable value={null} onChange={(_event) => noop()} aria-label="Nickname" />);
		// @ts-expect-error - the change event is native, it cannot report `null`
		assertType(<Input nullable value={null} onChange={reportsNull} aria-label="Nickname" />);
	});

	test('Input.Number takes nullable too, and keeps its number value', () => {
		assertType(<Input.Number nullable value={undefined} onChange={noop} aria-label="Count" />);
		// @ts-expect-error - `nullable` only takes `true`, a `boolean` is not accepted
		assertType(<Input.Number nullable={runtimeNullable} value={null} aria-label="Count" />);
		// @ts-expect-error - `nullable` only takes `true`
		assertType(<Input.Number nullable={false} value={null} aria-label="Count" />);
		// @ts-expect-error - the value is a number, `null` while empty
		assertType(<Input.Number nullable value="5" aria-label="Count" />);
	});
});
