import { Info } from '@signozhq/icons';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '../../input/input.js';
import { Field } from '../field.js';
import { slot } from './field.test-utils.js';

describe('Field rendering', () => {
	it('renders a div root with the label, the control and the row, in that order', () => {
		render(
			<Field label="Organisation" description="Shown below" testId="field">
				<Input aria-label="control" />
			</Field>,
		);

		const root = screen.getByTestId('field');

		expect(root.tagName).toBe('DIV');
		expect(root).toHaveAttribute('data-slot', 'field');
		expect(Array.from(root.children).map((child) => child.getAttribute('data-slot'))).toEqual([
			'field-label',
			'field-control',
			'field-description',
			'field-announcer',
		]);
		expect(slot(root, 'field-label')?.tagName).toBe('LABEL');
		expect(slot(root, 'field-control')).toContainElement(screen.getByRole('textbox'));
	});

	it('renders the label text', () => {
		render(
			<Field label="Your Organisation Name" testId="field">
				<Input aria-label="control" />
			</Field>,
		);

		expect(screen.getByTestId('field-label')).toHaveTextContent('Your Organisation Name');
	});

	it('uses the testId on the root and as the prefix of the parts', () => {
		const { rerender } = render(
			<Field label="Organisation" labelTooltip="Why we ask" description="Shown below" testId="org">
				<Input aria-label="control" />
			</Field>,
		);

		expect(screen.getByTestId('org')).toHaveAttribute('data-slot', 'field');
		expect(screen.getByTestId('org-label')).toHaveAttribute('data-slot', 'field-label');
		expect(screen.getByTestId('org-label-tooltip')).toHaveAttribute(
			'data-slot',
			'field-label-tooltip',
		);
		expect(screen.getByTestId('org-description')).toHaveAttribute('data-slot', 'field-description');

		rerender(
			<Field label="Organisation" error="Taken" testId="org">
				<Input aria-label="control" />
			</Field>,
		);

		expect(screen.getByTestId('org-message')).toHaveAttribute('data-slot', 'field-message');
	});

	it('sets no data-testid on the root or any part without a testId', () => {
		const { container, rerender } = render(
			<Field
				label="Organisation"
				labelIcon={<Info />}
				labelTooltip="Why we ask"
				description="Shown below"
				required
			>
				<Input aria-label="control" />
			</Field>,
		);

		const withDescription = container.querySelectorAll('[data-slot^="field"]');

		rerender(
			<Field label="Organisation" labelTooltip="Why we ask" error="Taken" required>
				<Input aria-label="control" />
			</Field>,
		);

		const withError = container.querySelectorAll('[data-slot^="field"]');

		expect(withDescription.length).toBeGreaterThanOrEqual(9);
		expect(withError.length).toBeGreaterThanOrEqual(8);

		for (const element of [...withDescription, ...withError]) {
			expect(element, element.getAttribute('data-slot') ?? '').not.toHaveAttribute('data-testid');
		}
	});

	it('leaves the control to its own testId', () => {
		render(
			<Field label="Organisation" testId="field">
				<Input testId="control" />
			</Field>,
		);

		expect(screen.getByTestId('field')).toHaveAttribute('data-slot', 'field');
		expect(screen.getByTestId('control')).toHaveAttribute('data-slot', 'input');
	});

	it('forwards id, aria-* and data-* to the root', () => {
		render(
			<Field
				label="Organisation"
				id="org-field"
				aria-label="Organisation field"
				data-analytics="org-field"
				testId="field"
			>
				<Input aria-label="control" />
			</Field>,
		);

		const root = screen.getByTestId('field');

		expect(root).toHaveAttribute('id', 'org-field');
		expect(root).toHaveAttribute('aria-label', 'Organisation field');
		expect(root).toHaveAttribute('data-analytics', 'org-field');
	});

	it('keeps data-required on the root only while required', () => {
		const { rerender } = render(
			<Field label="Organisation" required testId="field">
				<Input aria-label="control" />
			</Field>,
		);

		expect(screen.getByTestId('field')).toHaveAttribute('data-required');

		rerender(
			<Field label="Organisation" required={false} testId="field">
				<Input aria-label="control" />
			</Field>,
		);

		expect(screen.getByTestId('field')).not.toHaveAttribute('data-required');

		rerender(
			<Field label="Organisation" testId="field">
				<Input aria-label="control" />
			</Field>,
		);

		expect(screen.getByTestId('field')).not.toHaveAttribute('data-required');
	});

	it('does not stamp a data-size, the control owns its size', () => {
		render(
			<Field label="Organisation" testId="field">
				<Input size="lg" testId="control" />
			</Field>,
		);

		expect(screen.getByTestId('field')).not.toHaveAttribute('data-size');
		expect(screen.getByTestId('control')).toHaveAttribute('data-size', 'lg');
	});

	it('renders the label icon before the text, aria-hidden', () => {
		render(
			<Field label="Organisation" labelIcon={<Info />} testId="field">
				<Input aria-label="control" />
			</Field>,
		);

		const label = screen.getByTestId('field-label');
		const icon = slot(label, 'field-label-icon');

		expect(icon).toHaveAttribute('aria-hidden', 'true');
		expect(icon).toContainElement(screen.getByTestId('info'));
		expect(label.firstElementChild).toBe(icon);
	});

	it('renders no label icon without one', () => {
		render(
			<Field label="Organisation" testId="field">
				<Input aria-label="control" />
			</Field>,
		);

		expect(slot(screen.getByTestId('field'), 'field-label-icon')).toBeNull();
	});
});
