import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Form } from '../form.js';

const noop = (): void => {};

describe('Form rendering', () => {
	it('renders a <form> with its children', () => {
		render(
			<Form onSubmit={noop} testId="form">
				<input aria-label="Email" />
				<input aria-label="Name" />
			</Form>,
		);

		const form = screen.getByTestId('form');

		expect(form.tagName).toBe('FORM');
		expect(form).toHaveAttribute('data-slot', 'form');
		expect(form).toContainElement(screen.getByRole('textbox', { name: 'Email' }));
		expect(form).toContainElement(screen.getByRole('textbox', { name: 'Name' }));
	});

	it('is a form landmark only once it has a name', () => {
		const { rerender } = render(
			<Form onSubmit={noop} testId="form">
				<input aria-label="Email" />
			</Form>,
		);

		expect(screen.queryByRole('form')).toBeNull();

		rerender(
			<Form onSubmit={noop} testId="form" aria-label="Sign up">
				<input aria-label="Email" />
			</Form>,
		);

		expect(screen.getByRole('form', { name: 'Sign up' })).toBe(screen.getByTestId('form'));
	});

	it('renders no testid without a testId', () => {
		const { container } = render(
			<Form onSubmit={noop}>
				<input aria-label="Email" />
			</Form>,
		);

		expect(container.querySelector('form')).not.toHaveAttribute('data-testid');
	});

	it('renders no buttons of its own', () => {
		render(
			<Form onSubmit={noop} testId="form">
				<input aria-label="Email" />
			</Form>,
		);

		expect(screen.getByTestId('form').querySelector('button, [type="submit"]')).toBeNull();
	});

	it('forwards id, aria-* and data-*', () => {
		render(
			<Form
				onSubmit={noop}
				id="signup-form"
				aria-label="Sign up"
				aria-describedby="signup-help"
				data-analytics="signup"
				testId="form"
			>
				<input aria-label="Email" />
			</Form>,
		);

		const form = screen.getByTestId('form');

		expect(form).toHaveAttribute('id', 'signup-form');
		expect(form).toHaveAttribute('aria-label', 'Sign up');
		expect(form).toHaveAttribute('aria-describedby', 'signup-help');
		expect(form).toHaveAttribute('data-analytics', 'signup');
	});
});

describe('Form layout and attributes', () => {
	it('defaults the layout to vertical', () => {
		render(
			<Form onSubmit={noop} testId="form">
				<input aria-label="Email" />
			</Form>,
		);

		expect(screen.getByTestId('form')).toHaveAttribute('data-layout', 'vertical');
	});

	it.each(['vertical', 'inline'] as const)('mirrors layout="%s" onto the root', (layout) => {
		render(
			<Form onSubmit={noop} layout={layout} testId="form">
				<input aria-label="Email" />
			</Form>,
		);

		expect(screen.getByTestId('form')).toHaveAttribute('data-layout', layout);
	});

	it('is always noValidate', () => {
		render(
			<Form onSubmit={noop} testId="form">
				<input aria-label="Email" required />
			</Form>,
		);

		const form = screen.getByTestId('form') as HTMLFormElement;

		expect(form).toHaveAttribute('novalidate');
		expect(form.noValidate).toBe(true);
	});

	it.each(['on', 'off'] as const)('forwards autoComplete="%s" to the form', (autoComplete) => {
		render(
			<Form onSubmit={noop} autoComplete={autoComplete} testId="form">
				<input aria-label="Email" />
			</Form>,
		);

		expect(screen.getByTestId('form')).toHaveAttribute('autocomplete', autoComplete);
	});

	it('sets no autocomplete attribute without autoComplete', () => {
		render(
			<Form onSubmit={noop} testId="form">
				<input aria-label="Email" />
			</Form>,
		);

		expect(screen.getByTestId('form')).not.toHaveAttribute('autocomplete');
	});

	it('never posts natively', () => {
		render(
			<Form onSubmit={noop} testId="form">
				<input aria-label="Email" />
			</Form>,
		);

		const form = screen.getByTestId('form');

		for (const attribute of ['action', 'method', 'target', 'enctype']) {
			expect(form).not.toHaveAttribute(attribute);
		}
	});
});
