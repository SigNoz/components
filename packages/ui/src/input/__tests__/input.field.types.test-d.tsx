/**
 * Type-level tests for the props of {@link InputField} and its members.
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
import { InputField } from '../presets/input-field.js';

const noop = (): void => {};
const inputRef = createRef<HTMLInputElement>();
const textAreaRef = createRef<HTMLTextAreaElement>();
declare const maybeError: string | undefined;
declare const maybeStatus: 'danger' | undefined;
declare const maybeMessage: string | undefined;
/**
 * The object react-hook-form's `Controller` hands to `render`, modelled by hand: the library does
 * not depend on react-hook-form, but a consumer spreads this exact shape onto a field.
 */
type ControllerField<T> = {
	onChange: (...event: any[]) => void;
	onBlur: () => void;
	value: T;
	name: string;
	ref: (instance: any) => void;
	disabled?: boolean;
};
declare const textField: ControllerField<string>;
declare const numberField: ControllerField<number | null>;
declare const nullableTextField: ControllerField<string | null>;
declare const runtimeNullable: boolean;
declare const registration: {
	name: string;
	onChange: (event: unknown) => Promise<boolean>;
	onBlur: (event: unknown) => Promise<boolean>;
	ref: (instance: HTMLInputElement | null) => void;
	disabled?: boolean;
	required?: boolean;
};

describe('label', () => {
	test('is required and a string', () => {
		assertType(<InputField label="Email" />);
		// oxfmt-ignore
		// @ts-expect-error - a field exists to own its label
		assertType(<InputField />);
		// oxfmt-ignore
		// @ts-expect-error - the label is also the accessible name and the ellipsis tooltip, it needs text
		assertType(<InputField label={<b>Email</b>} />);
		// oxfmt-ignore
		// @ts-expect-error - an undefined label is a field with no name, pass an empty string to see the gap
		assertType(<InputField label={undefined} />);
	});

	test('is required on every member', () => {
		// oxfmt-ignore
		// @ts-expect-error - the password member needs a label too
		assertType(<InputField.Password />);
		// oxfmt-ignore
		// @ts-expect-error - the textarea member needs a label too
		assertType(<InputField.TextArea />);
		// oxfmt-ignore
		// @ts-expect-error - the number member needs a label too
		assertType(<InputField.Number />);
	});
});

describe('props of the field and of the input in one object', () => {
	test('accepts the field props and the input props together', () => {
		assertType(
			<InputField
				label="Email"
				labelIcon={<Info />}
				labelTooltip="Used to sign in"
				description="We never share it"
				required
				type="email"
				name="email"
				placeholder="you@example.com"
				maxLength={64}
				size="lg"
				prefix="@"
				width={240}
				testId="email"
				aria-label="Email address"
				data-analytics="email"
				id="email-input"
				onChange={noop}
				ref={inputRef}
			/>,
		);
	});

	test('accepts a react-hook-form register() spread', () => {
		assertType(<InputField label="Email" error={maybeError} {...registration} />);
		assertType(<InputField label="Email" required {...registration} />);
	});

	test('accepts a react-hook-form Controller field spread, on every member', () => {
		assertType(<InputField label="Email" error={maybeError} {...textField} />);
		assertType(<InputField.Password label="Secret" error={maybeError} {...textField} />);
		assertType(<InputField.TextArea label="Notes" error={maybeError} {...textField} />);
		assertType(<InputField.Number label="Replica count" error={maybeError} {...numberField} />);
	});

	test('accepts the members with their own props and refs', () => {
		assertType(
			<InputField.Password label="Secret" autoComplete="current-password" ref={inputRef} />,
		);
		assertType(<InputField.TextArea label="Notes" rows={4} ref={textAreaRef} />);
		assertType(
			<InputField.Number label="Replica count" min={1} max={10} onChange={noop} ref={inputRef} />,
		);
	});

	test('a locked input says why', () => {
		assertType(<InputField label="Email" disabled disabledTooltip="Ask an admin" />);
		// oxfmt-ignore
		// @ts-expect-error - a disabled control has to say why
		assertType(<InputField label="Email" disabled />);
		// oxfmt-ignore
		// @ts-expect-error - a locked control has to say why
		assertType(<InputField label="Email" readOnly />);
	});

	test('rejects what neither the field nor the input has', () => {
		// oxfmt-ignore
		// @ts-expect-error - `onPressEnter` is antd, submit on Enter comes from the owning form
		assertType(<InputField label="Email" onPressEnter={noop} />);
		// oxfmt-ignore
		// @ts-expect-error - the input renders no children, the field renders the input
		assertType(<InputField label="Email">child</InputField>);
	});

	test('keeps the input size, not the native character width', () => {
		assertType(<InputField label="Email" size="md" />);
		// oxfmt-ignore
		// @ts-expect-error - `size` is `'sm' | 'md' | 'lg'`, not the character-width attribute
		assertType(<InputField label="Email" size={20} />);
	});

	test('keeps the type of the ref of each member', () => {
		// oxfmt-ignore
		// @ts-expect-error - the textarea member points its ref at a textarea
		assertType(<InputField.TextArea label="Notes" ref={inputRef} />);
		// oxfmt-ignore
		// @ts-expect-error - the input member points its ref at an input
		assertType(<InputField label="Email" ref={textAreaRef} />);
	});
});

describe('status, message and error', () => {
	test('status and message travel together', () => {
		assertType(<InputField label="Email" status="warning" message="Looks like a typo" />);
		assertType(<InputField label="Email" status={maybeStatus} message={maybeMessage} />);
		// oxfmt-ignore
		// @ts-expect-error - a status with nothing to say belongs on the control itself
		assertType(<InputField label="Email" status="danger" />);
		// oxfmt-ignore
		// @ts-expect-error - the message row is a validation state, it takes its color from one
		assertType(<InputField label="Email" message="Not an email" />);
	});

	test('error stands alone', () => {
		assertType(<InputField label="Email" error={maybeError} />);
		assertType(<InputField label="Email" error={<span>Not an email</span>} />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says `status="danger"` and the message
		assertType(<InputField label="Email" error="Not an email" status="danger" message="Not an email" />);
		// oxfmt-ignore
		// @ts-expect-error - `error` already says the message, a second one is the same thing twice
		assertType(<InputField label="Email" error="Not an email" message="Not an email" />);
	});

	test('error stands alone on every member', () => {
		// oxfmt-ignore
		// @ts-expect-error - the password member follows the same status rules
		assertType(<InputField.Password label="Secret" status="danger" />);
		// oxfmt-ignore
		// @ts-expect-error - the textarea member follows the same status rules
		assertType(<InputField.TextArea label="Notes" error="Too long" message="Too long" />);
		// oxfmt-ignore
		// @ts-expect-error - the number member follows the same status rules
		assertType(<InputField.Number label="Replica count" message="Too many" />);
	});
});

describe('nullable', () => {
	test('accepts a Controller field whose value is nullable, on every member', () => {
		assertType(<InputField label="Nickname" error={maybeError} {...nullableTextField} nullable />);
		assertType(<InputField.Password label="Secret" {...nullableTextField} nullable />);
		assertType(<InputField.TextArea label="Notes" {...nullableTextField} nullable />);
		assertType(<InputField.Number label="Replica count" {...numberField} nullable />);
	});

	test('rejects a nullable decided at run time', () => {
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, a `boolean` is not accepted
		assertType(<InputField label="Nickname" {...nullableTextField} nullable={runtimeNullable} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on InputField.Password too
		assertType(<InputField.Password label="Secret" {...nullableTextField} nullable={runtimeNullable} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on InputField.TextArea too
		assertType(<InputField.TextArea label="Notes" {...nullableTextField} nullable={runtimeNullable} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on InputField.Number too
		assertType(<InputField.Number label="Replica count" {...numberField} nullable={runtimeNullable} />);
	});

	test('rejects nullable={false}, which is the same as leaving it out', () => {
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`
		assertType(<InputField label="Nickname" {...nullableTextField} nullable={false} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on InputField.Password too
		assertType(<InputField.Password label="Secret" {...nullableTextField} nullable={false} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on InputField.TextArea too
		assertType(<InputField.TextArea label="Notes" {...nullableTextField} nullable={false} />);
		// oxfmt-ignore
		// @ts-expect-error - `nullable` only takes `true`, on InputField.Number too
		assertType(<InputField.Number label="Replica count" {...numberField} nullable={false} />);
	});

	test('keeps the field props next to nullable', () => {
		assertType(
			<InputField label="Nickname" status="danger" message="Taken" value={null} nullable />,
		);
	});

	test('without nullable a null value is a type error', () => {
		// oxfmt-ignore
		// @ts-expect-error - `null` needs `nullable` on InputField
		assertType(<InputField label="Nickname" {...nullableTextField} />);
		// oxfmt-ignore
		// @ts-expect-error - `null` needs `nullable` on InputField.Password
		assertType(<InputField.Password label="Secret" {...nullableTextField} />);
		// oxfmt-ignore
		// @ts-expect-error - `null` needs `nullable` on InputField.TextArea
		assertType(<InputField.TextArea label="Notes" {...nullableTextField} />);
	});

	test('the excess-key check still runs with nullable', () => {
		// oxfmt-ignore
		// @ts-expect-error - `onPressEnter` is antd, submit on Enter comes from the owning form
		assertType(<InputField label="Nickname" nullable onPressEnter={noop} />);
		// oxfmt-ignore
		// @ts-expect-error - the input renders no children, the field renders the input
		assertType(<InputField label="Nickname" nullable>child</InputField>);
	});
});

describe('rejected props', () => {
	test('className and style are not props', () => {
		// oxfmt-ignore
		// @ts-expect-error - visual overrides go through the `--input-*` and `--field-*` custom properties
		assertType(<InputField label="Email" className="styled" />);
		// oxfmt-ignore
		// @ts-expect-error - visual overrides go through the `--input-*` and `--field-*` custom properties
		assertType(<InputField label="Email" style={{ color: 'red' }} />);
	});

	test('htmlFor is wired by the shorthand', () => {
		// oxfmt-ignore
		// @ts-expect-error - the shorthand wires the id of the input itself
		assertType(<InputField label="Email" htmlFor="email-input" />);
		// oxfmt-ignore
		// @ts-expect-error - the password member wires the id of its input itself
		assertType(<InputField.Password label="Secret" htmlFor="secret-input" />);
	});

	test('data-testid is spelled testId', () => {
		// oxfmt-ignore
		// @ts-expect-error - `data-testid` is written as the `testId` prop
		assertType(<InputField label="Email" data-testid="email" />);
	});
});
