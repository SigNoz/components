import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Field } from '../../field/field.js';
import { Input } from '../input.js';

describe('Input inside a Field', () => {
	it('takes the field label through the generated id', () => {
		render(
			<Field label="Your Organisation Name">
				<Input placeholder="For eg. Simpsonville..." />
			</Field>,
		);

		expect(screen.getByRole('textbox', { name: 'Your Organisation Name' })).toBeInTheDocument();
	});

	it('keeps its own id and lets htmlFor follow it', () => {
		render(
			<Field label="Organisation" htmlFor="org-input">
				<Input id="org-input" />
			</Field>,
		);

		expect(screen.getByRole('textbox', { name: 'Organisation' })).toHaveAttribute(
			'id',
			'org-input',
		);
	});

	it('inherits status, size and required from the field', () => {
		render(
			<Field label="Organisation" status="warning" message="Almost taken" size="large" required>
				<Input testId="org" />
			</Field>,
		);

		const frame = screen.getByTestId('org');

		expect(frame).toHaveAttribute('data-status', 'warning');
		expect(frame).toHaveAttribute('data-size', 'large');
		expect(screen.getByRole('textbox')).toBeRequired();
	});

	it('lets its own status and size win over the field', () => {
		render(
			<Field label="Organisation" status="warning" message="Almost taken" size="large">
				<Input status="danger" size="base" testId="org" />
			</Field>,
		);

		const frame = screen.getByTestId('org');

		expect(frame).toHaveAttribute('data-status', 'danger');
		expect(frame).toHaveAttribute('data-size', 'base');
	});

	it('is described by the field message', () => {
		render(
			<Field label="Organisation" error="This name is taken" testId="field">
				<Input />
			</Field>,
		);

		const field = screen.getByRole('textbox');
		const message = screen.getByTestId('field-message');

		expect(field).toHaveAttribute('aria-describedby', message.id);
		expect(field).toHaveAttribute('aria-invalid', 'true');
	});

	it('joins the field message with its own aria-describedby', () => {
		render(
			<div>
				<span id="hint">Use the legal name</span>
				<Field label="Organisation" error="This name is taken" testId="field">
					<Input aria-describedby="hint" />
				</Field>
			</div>,
		);

		const describedBy = screen.getByRole('textbox').getAttribute('aria-describedby');

		expect(describedBy).toContain('hint');
		expect(describedBy).toContain(screen.getByTestId('field-message').id);
	});

	it('reaches the members through the same context', () => {
		render(
			<Field label="Replica count" status="danger" message="Too many replicas">
				<Input.Number testId="count" />
			</Field>,
		);

		expect(screen.getByRole('textbox', { name: 'Replica count' })).toBeInTheDocument();
		expect(screen.getByTestId('count')).toHaveAttribute('data-status', 'danger');
	});
});
