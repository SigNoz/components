/**
 * Type-level tests for the props of {@link Form}.
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
import { createRef, type FormEvent } from 'react';
import { assertType, describe, test } from 'vitest';
import { Form } from '../form.js';

const noop = (): void => {};
const formRef = createRef<HTMLFormElement>();
const divRef = createRef<HTMLDivElement>();
declare const handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
declare const layout: 'vertical' | 'inline' | undefined;
declare const registration: (event: FormEvent<HTMLFormElement>) => void;

describe('submit and children', () => {
	test('onSubmit and children are required', () => {
		assertType(<Form onSubmit={noop}>fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - a form that cannot be submitted has nothing to call
		assertType(<Form>fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - a form with no children has nothing to submit
		assertType(<Form onSubmit={noop} />);
	});

	test('onSubmit takes the form event', () => {
		assertType(<Form onSubmit={(event) => event.currentTarget.reset()}>fields</Form>);
		assertType(<Form onSubmit={handleSubmit}>fields</Form>);
		assertType(<Form onSubmit={registration}>fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - the submit callback gets the form event, not the values
		assertType(<Form onSubmit={(values: { email: string }) => values.email}>fields</Form>);
	});

	test('onReset takes the form event', () => {
		assertType(
			<Form onSubmit={noop} onReset={noop}>
				fields
			</Form>,
		);
		assertType(
			<Form onSubmit={noop} onReset={(event) => event.currentTarget.reset()}>
				fields
			</Form>,
		);
		// oxfmt-ignore
		// @ts-expect-error - the reset callback gets the form event, not the values
		assertType(<Form onSubmit={noop} onReset={(values: { email: string }) => values.email}>fields</Form>);
	});
});

describe('accepted props', () => {
	test('accepts the ref, the id, the testId, aria-* and data-*', () => {
		assertType(
			<Form
				onSubmit={noop}
				id="signup-form"
				testId="form"
				aria-label="Sign up"
				data-analytics="signup"
				ref={formRef}
			>
				fields
			</Form>,
		);
	});

	test('accepts the layout and autoComplete', () => {
		assertType(
			<Form onSubmit={noop} layout="inline" autoComplete="off">
				fields
			</Form>,
		);
		assertType(
			<Form onSubmit={noop} layout="vertical" autoComplete="on">
				fields
			</Form>,
		);
		assertType(
			<Form onSubmit={noop} layout={layout}>
				fields
			</Form>,
		);
	});
});

describe('rejected props', () => {
	test('the layout is one of the two', () => {
		// oxfmt-ignore
		// @ts-expect-error - the label always sits above the control, there is no horizontal layout
		assertType(<Form onSubmit={noop} layout="horizontal">fields</Form>);
	});

	test('autoComplete is on or off', () => {
		// oxfmt-ignore
		// @ts-expect-error - autoComplete is one switch for every field, the tokens belong to the field
		assertType(<Form onSubmit={noop} autoComplete="new-password">fields</Form>);
	});

	test('className and style are not props', () => {
		// oxfmt-ignore
		// @ts-expect-error - the spacing comes from `layout`, visual overrides go through `--form-*`
		assertType(<Form onSubmit={noop} className="styled">fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - the spacing comes from `layout`, visual overrides go through `--form-*`
		assertType(<Form onSubmit={noop} style={{ gap: 0 }}>fields</Form>);
	});

	test('data-testid is spelled testId', () => {
		// oxfmt-ignore
		// @ts-expect-error - `data-testid` is written as the `testId` prop
		assertType(<Form onSubmit={noop} data-testid="form">fields</Form>);
	});

	test('the form is always noValidate', () => {
		// oxfmt-ignore
		// @ts-expect-error - the browser bubbles would show one error at a time on top of the field message
		assertType(<Form onSubmit={noop} noValidate={false}>fields</Form>);
	});

	test('the form never posts natively', () => {
		// oxfmt-ignore
		// @ts-expect-error - `action` is for a page that reloads on submit, the submit goes through onSubmit
		assertType(<Form onSubmit={noop} action="/signup">fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - `method` is for a page that reloads on submit, the submit goes through onSubmit
		assertType(<Form onSubmit={noop} method="post">fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - `target` is for a page that reloads on submit, the submit goes through onSubmit
		assertType(<Form onSubmit={noop} target="_blank">fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - `encType` is for a page that reloads on submit, the submit goes through onSubmit
		assertType(<Form onSubmit={noop} encType="multipart/form-data">fields</Form>);
	});

	test('name, size, disabled and readOnly stay on the controls', () => {
		// oxfmt-ignore
		// @ts-expect-error - `name` was antd's way to build ids, the field generates them now
		assertType(<Form onSubmit={noop} name="signup">fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - each control keeps its own `size`
		assertType(<Form onSubmit={noop} size="lg">fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - each control keeps its own `disabled` and its reason tooltip
		assertType(<Form onSubmit={noop} disabled>fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - each control keeps its own `readOnly` and its reason tooltip
		assertType(<Form onSubmit={noop} readOnly>fields</Form>);
	});

	test('the antd Form props are not props', () => {
		// oxfmt-ignore
		// @ts-expect-error - the values live in react-hook-form or in the consumer's state
		assertType(<Form onSubmit={noop} form={{}}>fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - the values live in react-hook-form or in the consumer's state
		assertType(<Form onSubmit={noop} initialValues={{}}>fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - submit goes through onSubmit, the validation is the consumer's
		assertType(<Form onSubmit={noop} onFinish={noop}>fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - the label always sits above the control
		assertType(<Form onSubmit={noop} labelCol={{ span: 4 }}>fields</Form>);
		// oxfmt-ignore
		// @ts-expect-error - the required marker is an asterisk after the label, always
		assertType(<Form onSubmit={noop} requiredMark={false}>fields</Form>);
	});

	test('a prop that does not exist is rejected', () => {
		// oxfmt-ignore
		// @ts-expect-error - a form-level error is a Callout or a Toast the consumer places
		assertType(<Form onSubmit={noop} error="Request failed">fields</Form>);
	});

	test('the ref points at the form', () => {
		// oxfmt-ignore
		// @ts-expect-error - the root is a form element, not a div
		assertType(<Form onSubmit={noop} ref={divRef}>fields</Form>);
	});
});
