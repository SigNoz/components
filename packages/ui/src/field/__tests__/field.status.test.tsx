import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '../../input/input.js';
import { Field } from '../field.js';
import { slot } from './field.test-utils.js';

const STATUS_ICONS = {
	success: 'solid-check-circle-2',
	warning: 'solid-alert-circle',
	danger: 'solid-alert-triangle',
} as const;

describe('Field status and message', () => {
	it.each(['success', 'warning', 'danger'] as const)(
		'renders the %s message below the control with its icon',
		(status) => {
			render(
				<Field label="Organisation" status={status} message="Something to say" testId="field">
					<Input testId="control" />
				</Field>,
			);

			const root = screen.getByTestId('field');
			const message = screen.getByTestId('field-message');

			expect(root).toHaveAttribute('data-status', status);
			expect(message).toHaveAttribute('data-slot', 'field-message');
			expect(message).toHaveTextContent('Something to say');
			expect(within(message).getByTestId(STATUS_ICONS[status]).parentElement).toHaveAttribute(
				'aria-hidden',
				'true',
			);
			expect(message.previousElementSibling).toBe(slot(root, 'field-control'));
		},
	);

	it('puts the status icon before the text of the message', () => {
		render(
			<Field label="Organisation" status="warning" message="Almost taken" testId="field">
				<Input />
			</Field>,
		);

		const message = screen.getByTestId('field-message');

		expect(message.firstElementChild?.querySelector('svg')).not.toBeNull();
		expect(message.lastElementChild).toHaveTextContent('Almost taken');
	});

	it('renders a message that is not a string', () => {
		render(
			<Field
				label="Organisation"
				status="danger"
				message={<strong data-testid="rich">Taken by Alex Example</strong>}
				testId="field"
			>
				<Input />
			</Field>,
		);

		expect(within(screen.getByTestId('field-message')).getByTestId('rich')).toBeInTheDocument();
	});

	it('treats error as a danger status with the message', () => {
		render(
			<Field label="Organisation" error="This name is taken" testId="field">
				<Input testId="control" />
			</Field>,
		);

		const message = screen.getByTestId('field-message');

		expect(screen.getByTestId('field')).toHaveAttribute('data-status', 'danger');
		expect(message).toHaveTextContent('This name is taken');
		expect(within(message).getByTestId('solid-alert-triangle')).toBeInTheDocument();
		expect(screen.getByTestId('control')).toHaveAttribute('data-status', 'danger');
	});

	it('renders the same row for error as for status="danger" with a message', () => {
		const { rerender } = render(
			<Field label="Organisation" error="Taken" testId="field">
				<Input />
			</Field>,
		);
		const fromError = screen.getByTestId('field-message').innerHTML;

		rerender(
			<Field label="Organisation" status="danger" message="Taken" testId="field">
				<Input />
			</Field>,
		);

		expect(screen.getByTestId('field-message').innerHTML).toBe(fromError);
	});

	it.each([
		['undefined', undefined],
		['null', null],
		['an empty string', ''],
		['false', false],
		['an empty array', []],
	])('renders no message and sets no status for an error that is %s', (_name, error) => {
		render(
			<Field label="Organisation" error={error} testId="field">
				<Input testId="control" />
			</Field>,
		);

		expect(screen.queryByTestId('field-message')).toBeNull();
		expect(screen.getByTestId('field')).not.toHaveAttribute('data-status');
		expect(screen.getByTestId('control')).not.toHaveAttribute('data-status');
		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
	});

	it('renders no row for a message that renders nothing', () => {
		render(
			<Field label="Organisation" status="warning" message="" testId="field">
				<Input />
			</Field>,
		);

		expect(screen.queryByTestId('field-message')).toBeNull();
		expect(screen.queryByTestId('field-description')).toBeNull();
		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
	});

	it('keeps the description while the message renders nothing', () => {
		render(
			<Field
				label="Organisation"
				status="warning"
				message={null}
				description="Shown below"
				testId="field"
			>
				<Input />
			</Field>,
		);

		expect(screen.queryByTestId('field-message')).toBeNull();
		expect(screen.getByTestId('field-description')).toHaveTextContent('Shown below');
	});

	it('renders no row and no status without a status or an error', () => {
		render(
			<Field label="Organisation" testId="field">
				<Input />
			</Field>,
		);

		expect(screen.queryByTestId('field-message')).toBeNull();
		expect(screen.queryByTestId('field-description')).toBeNull();
		expect(screen.getByTestId('field')).not.toHaveAttribute('data-status');
	});
});

describe('Field status on the control', () => {
	it('sets aria-invalid for danger only', () => {
		const { rerender } = render(
			<Field label="Organisation" status="danger" message="Taken">
				<Input />
			</Field>,
		);

		expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');

		rerender(
			<Field label="Organisation" status="warning" message="Almost taken">
				<Input />
			</Field>,
		);

		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');

		rerender(
			<Field label="Organisation" status="success" message="Available">
				<Input />
			</Field>,
		);

		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
	});

	it('sets aria-invalid for an error and drops it once the error clears', () => {
		const { rerender } = render(
			<Field label="Organisation" error="Taken">
				<Input />
			</Field>,
		);

		expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');

		rerender(
			<Field label="Organisation" error={undefined}>
				<Input />
			</Field>,
		);

		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
	});

	it.each(['success', 'warning', 'danger'] as const)('tints the control for %s', (status) => {
		render(
			<Field label="Organisation" status={status} message="Something to say">
				<Input testId="control" />
			</Field>,
		);

		expect(screen.getByTestId('control')).toHaveAttribute('data-status', status);
	});
});
