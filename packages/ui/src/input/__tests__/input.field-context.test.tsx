import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { describedByIds } from '../../field/__tests__/field.test-utils.js';
import { Input } from '../input.js';

describe('Input inside a Field', () => {
	it('takes the field label through the generated id', () => {
		render(
			<Field label="Your Organisation Name" testId="field">
				<Input placeholder="For eg. Simpsonville..." />
			</Field>,
		);

		const input = screen.getByRole('textbox', { name: 'Your Organisation Name' });

		expect(input.id).not.toBe('');
		expect(screen.getByTestId('field-label')).toHaveAttribute('for', input.id);
	});

	it('keeps its own id and points the label at it', () => {
		render(
			<Field label="Organisation" testId="field">
				<Input id="org-input" />
			</Field>,
		);

		expect(screen.getByRole('textbox', { name: 'Organisation' })).toHaveAttribute(
			'id',
			'org-input',
		);
		expect(screen.getByTestId('field-label')).toHaveAttribute('for', 'org-input');
	});

	it('keeps its own id when htmlFor names it', () => {
		render(
			<Field label="Organisation" htmlFor="org-input" testId="field">
				<Input id="org-input" />
			</Field>,
		);

		expect(screen.getByRole('textbox', { name: 'Organisation' })).toHaveAttribute(
			'id',
			'org-input',
		);
		expect(screen.getByTestId('field-label')).toHaveAttribute('for', 'org-input');
	});

	it('moves the label along when its own id changes', () => {
		const { rerender } = render(
			<Field label="Organisation" testId="field">
				<Input id="first" />
			</Field>,
		);

		rerender(
			<Field label="Organisation" testId="field">
				<Input id="second" />
			</Field>,
		);

		expect(screen.getByTestId('field-label')).toHaveAttribute('for', 'second');
		expect(screen.getByRole('textbox', { name: 'Organisation' })).toHaveAttribute('id', 'second');
	});

	it('lets go of the label when it unmounts', () => {
		const { rerender } = render(
			<Field label="Organisation" testId="field">
				<Input id="org-input" />
			</Field>,
		);

		rerender(
			<Field label="Organisation" testId="field">
				<span>nothing to name</span>
			</Field>,
		);

		expect(screen.getByTestId('field-label')).not.toHaveAttribute('for', 'org-input');
	});

	it('inherits status and required from the field', () => {
		render(
			<Field label="Organisation" status="warning" message="Almost taken" required>
				<Input testId="org" />
			</Field>,
		);

		expect(screen.getByTestId('org')).toHaveAttribute('data-status', 'warning');
		expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
	});

	it('keeps its own size, the field has none to hand down', () => {
		render(
			<Field label="Organisation" status="warning" message="Almost taken" testId="field">
				<Input size="lg" testId="org" />
			</Field>,
		);

		expect(screen.getByTestId('org')).toHaveAttribute('data-size', 'lg');
		expect(screen.getByTestId('field')).not.toHaveAttribute('data-size');
	});

	it('defaults to the md size inside a field', () => {
		render(
			<Field label="Organisation" required>
				<Input testId="org" />
			</Field>,
		);

		expect(screen.getByTestId('org')).toHaveAttribute('data-size', 'md');
	});

	it('lets its own status win over the field', () => {
		render(
			<Field label="Organisation" status="warning" message="Almost taken">
				<Input status="danger" testId="org" />
			</Field>,
		);

		expect(screen.getByTestId('org')).toHaveAttribute('data-status', 'danger');
	});

	it('lets its own required win over the field', () => {
		render(
			<Field label="Organisation" required>
				<Input required={false} />
			</Field>,
		);

		expect(screen.getByRole('textbox')).not.toBeRequired();
	});

	it('lets its own aria-invalid win over a danger status', () => {
		render(
			<Field label="Organisation" error="This name is taken">
				<Input aria-invalid="false" />
			</Field>,
		);

		expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
	});

	it('is described by the field message and invalid for danger', () => {
		render(
			<Field label="Organisation" error="This name is taken" testId="field">
				<Input />
			</Field>,
		);

		const field = screen.getByRole('textbox');

		expect(describedByIds(field)).toEqual([screen.getByTestId('field-message').id]);
		expect(field).toHaveAttribute('aria-invalid', 'true');
	});

	it('lists its own aria-describedby ahead of the field ids', () => {
		render(
			<div>
				<span id="hint">Use the legal name</span>
				<Field label="Organisation" error="This name is taken" testId="field">
					<Input aria-describedby="hint" />
				</Field>
			</div>,
		);

		expect(describedByIds(screen.getByRole('textbox'))).toEqual([
			'hint',
			screen.getByTestId('field-message').id,
		]);
	});

	it('reaches the members through the same context', () => {
		render(
			<>
				<Field label="Replica count" status="danger" message="Too many replicas" testId="count">
					<Input.Number testId="count-input" />
				</Field>
				<Field label="Notes" status="danger" message="Too long" testId="notes">
					<Input.TextArea testId="notes-input" />
				</Field>
				<Field label="Secret" status="danger" message="Too short" testId="secret">
					<Input.Password testId="secret-input" />
				</Field>
			</>,
		);

		expect(screen.getByRole('textbox', { name: 'Replica count' })).toBeInTheDocument();
		expect(screen.getByTestId('count-input')).toHaveAttribute('data-status', 'danger');
		expect(screen.getByRole('textbox', { name: 'Notes' })).toBeInTheDocument();
		expect(screen.getByTestId('notes-input')).toHaveAttribute('data-status', 'danger');
		expect(screen.getByTestId('secret-label')).toHaveAttribute(
			'for',
			screen.getByTestId('secret-input-field').id,
		);
		expect(screen.getByTestId('secret-input')).toHaveAttribute('data-status', 'danger');
	});

	it('renders as before outside a field', () => {
		render(<Input aria-label="Organisation" testId="org" />);

		const input = screen.getByRole('textbox');

		expect(input).not.toHaveAttribute('id');
		expect(input).not.toHaveAttribute('aria-describedby');
		expect(input).not.toHaveAttribute('aria-invalid');
		expect(input).not.toBeRequired();
		expect(screen.getByTestId('org')).not.toHaveAttribute('data-status');
	});
});

type OwnRequiredProps = { required?: boolean; 'aria-required'?: boolean };

const members: { name: string; control: (own?: OwnRequiredProps) => ReactElement }[] = [
	{ name: 'Input', control: (own) => <Input {...own} /> },
	{ name: 'Input.TextArea', control: (own) => <Input.TextArea {...own} /> },
	{ name: 'Input.Number', control: (own) => <Input.Number {...own} /> },
];

function getForm(): HTMLFormElement {
	const form = screen.getByTestId('form');

	if (!(form instanceof HTMLFormElement)) {
		throw new Error('The form test id is not on a form element');
	}

	return form;
}

describe.each(members)('$name inside a required Field', ({ control }) => {
	it('announces required without the native attribute', () => {
		render(
			<Field label="Organisation" required>
				{control()}
			</Field>,
		);

		const input = screen.getByRole('textbox');

		expect(input).toHaveAttribute('aria-required', 'true');
		expect(input).not.toHaveAttribute('required');
	});

	it('sets the native attribute when its own required says so', () => {
		render(
			<Field label="Organisation" required>
				{control({ required: true })}
			</Field>,
		);

		const input = screen.getByRole('textbox');

		expect(input).toHaveAttribute('required');
		expect(input).toHaveAttribute('aria-required', 'true');
	});

	it('sets both attributes from its own required outside a field', () => {
		render(<form data-testid="form">{control({ required: true })}</form>);

		const input = screen.getByRole('textbox');

		expect(input).toHaveAttribute('required');
		expect(input).toHaveAttribute('aria-required', 'true');
		expect(getForm().checkValidity()).toBe(false);
	});

	it('lets its own aria-required win over the field', () => {
		render(
			<Field label="Organisation" required>
				{control({ 'aria-required': false })}
			</Field>,
		);

		const input = screen.getByRole('textbox');

		expect(input).toHaveAttribute('aria-required', 'false');
		expect(input).not.toHaveAttribute('required');
	});

	it('keeps its own aria-required without a required field', () => {
		render(<Field label="Organisation">{control({ 'aria-required': true })}</Field>);

		const input = screen.getByRole('textbox');

		expect(input).toHaveAttribute('aria-required', 'true');
		expect(input).not.toHaveAttribute('required');
	});

	it('leaves an empty control to the form validation instead of the browser', async () => {
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const user = userEvent.setup();
		render(
			<form data-testid="form" onSubmit={onSubmit}>
				<Field label="Organisation" required>
					{control()}
				</Field>
				<button type="submit">Save</button>
			</form>,
		);

		expect(getForm().checkValidity()).toBe(true);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('lets the browser stop an empty submit when the control sets required itself', async () => {
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const user = userEvent.setup();
		render(
			<form data-testid="form" onSubmit={onSubmit}>
				<Field label="Organisation" required>
					{control({ required: true })}
				</Field>
				<button type="submit">Save</button>
			</form>,
		);

		expect(getForm().checkValidity()).toBe(false);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).not.toHaveBeenCalled();
	});
});
