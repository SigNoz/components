import { render, screen } from '@testing-library/react';
import { Info } from '@signozhq/icons';
import { describe, expect, it } from 'vitest';
import { Field } from '../field.js';

describe('Field rendering', () => {
	it('renders the label above the control', () => {
		render(
			<Field label="Your Organisation Name" testId="field">
				<input aria-label="control" />
			</Field>,
		);

		const root = screen.getByTestId('field');
		const label = screen.getByTestId('field-label');

		expect(root).toHaveAttribute('data-slot', 'field');
		expect(root).toHaveAttribute('data-size', 'base');
		expect(label.tagName).toBe('LABEL');
		expect(label).toHaveTextContent('Your Organisation Name');
	});

	it('renders no message row without a status or error', () => {
		render(
			<Field label="Organisation" testId="field">
				<input aria-label="control" />
			</Field>,
		);

		expect(screen.queryByTestId('field-message')).toBeNull();
		expect(screen.getByTestId('field')).not.toHaveAttribute('data-status');
	});

	it.each(['success', 'warning', 'danger'] as const)(
		'renders the %s message row with its icon',
		(status) => {
			render(
				<Field label="Organisation" status={status} message="Something to say" testId="field">
					<input aria-label="control" />
				</Field>,
			);

			const root = screen.getByTestId('field');
			const message = screen.getByTestId('field-message');

			expect(root).toHaveAttribute('data-status', status);
			expect(message).toHaveTextContent('Something to say');
			expect(message.querySelector('svg')).not.toBeNull();
		},
	);

	it('treats error as a danger status with the message', () => {
		render(
			<Field label="Organisation" error="This name is taken" testId="field">
				<input aria-label="control" />
			</Field>,
		);

		expect(screen.getByTestId('field')).toHaveAttribute('data-status', 'danger');
		expect(screen.getByTestId('field-message')).toHaveTextContent('This name is taken');
	});

	it('renders nothing for an error that renders nothing', () => {
		render(
			<Field label="Organisation" error={undefined} testId="field">
				<input aria-label="control" />
			</Field>,
		);

		expect(screen.queryByTestId('field-message')).toBeNull();
		expect(screen.getByTestId('field')).not.toHaveAttribute('data-status');
	});

	it('marks a required field on the label without naming the control twice', () => {
		render(
			<Field label="Organisation" required testId="field">
				<input aria-label="control" />
			</Field>,
		);

		const marker = screen.getByTestId('field').querySelector('[data-slot="field-required-marker"]');

		expect(marker).toHaveTextContent('*');
		expect(marker).toHaveAttribute('aria-hidden', 'true');
	});

	it('renders the label icon aria-hidden and drops one that renders nothing', () => {
		const { rerender } = render(
			<Field label="Organisation" labelIcon={<Info />} testId="field">
				<input aria-label="control" />
			</Field>,
		);

		const icon = screen.getByTestId('field').querySelector('[data-slot="field-label-icon"]');

		expect(icon).not.toBeNull();
		expect(icon).toHaveAttribute('aria-hidden', 'true');

		rerender(
			<Field label="Organisation" labelIcon={null} testId="field">
				<input aria-label="control" />
			</Field>,
		);

		expect(screen.getByTestId('field').querySelector('[data-slot="field-label-icon"]')).toBeNull();
	});

	it('forwards aria-* and data-* to the root', () => {
		render(
			<Field label="Organisation" aria-live="polite" data-analytics="org-field" testId="field">
				<input aria-label="control" />
			</Field>,
		);

		const root = screen.getByTestId('field');

		expect(root).toHaveAttribute('aria-live', 'polite');
		expect(root).toHaveAttribute('data-analytics', 'org-field');
	});

	it('mirrors the size onto the root', () => {
		render(
			<Field label="Organisation" size="large" testId="field">
				<input aria-label="control" />
			</Field>,
		);

		expect(screen.getByTestId('field')).toHaveAttribute('data-size', 'large');
	});
});
