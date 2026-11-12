import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from '../../input/input.js';
import { Field } from '../field.js';
import { slot } from './field.test-utils.js';

const LONG_LABEL =
	'The name of the organisation as it appears on the invoices we send you every month, including the legal form';

describe('Field label and the control name', () => {
	it('points the label at the generated id of an Input', () => {
		render(
			<Field label="Your Organisation Name" testId="field">
				<Input placeholder="For eg. Simpsonville..." />
			</Field>,
		);

		const input = screen.getByRole('textbox', { name: 'Your Organisation Name' });
		const label = screen.getByTestId('field-label');

		expect(input.id).not.toBe('');
		expect(label).toHaveAttribute('for', input.id);
	});

	it('points the label at the Input id when the Input names its own, without htmlFor', () => {
		render(
			<Field label="Organisation" testId="field">
				<Input id="org-input" />
			</Field>,
		);

		const input = screen.getByRole('textbox', { name: 'Organisation' });

		expect(input).toHaveAttribute('id', 'org-input');
		expect(screen.getByTestId('field-label')).toHaveAttribute('for', 'org-input');
	});

	it('hands htmlFor to an Input that names no id of its own', () => {
		render(
			<Field label="Organisation" htmlFor="org-input" testId="field">
				<Input />
			</Field>,
		);

		const input = screen.getByRole('textbox', { name: 'Organisation' });

		expect(input).toHaveAttribute('id', 'org-input');
		expect(screen.getByTestId('field-label')).toHaveAttribute('for', 'org-input');
	});

	it('names a control that does not read the field yet through htmlFor and its own id', () => {
		render(
			<Field label="Organisation" htmlFor="plain-input" testId="field">
				<input id="plain-input" />
			</Field>,
		);

		expect(screen.getByRole('textbox', { name: 'Organisation' })).toHaveAttribute(
			'id',
			'plain-input',
		);
		expect(screen.getByTestId('field-label')).toHaveAttribute('for', 'plain-input');
	});

	it('gives each field of a form its own generated id', () => {
		render(
			<>
				<Field label="First">
					<Input />
				</Field>
				<Field label="Second">
					<Input />
				</Field>
			</>,
		);

		const first = screen.getByRole('textbox', { name: 'First' });
		const second = screen.getByRole('textbox', { name: 'Second' });

		expect(first.id).not.toBe(second.id);
	});

	it('moves focus to the control when the label is clicked', async () => {
		const user = userEvent.setup();
		render(
			<Field label="Your Organisation Name" testId="field">
				<Input placeholder="For eg. Simpsonville..." />
			</Field>,
		);

		await user.click(screen.getByTestId('field-label'));

		expect(screen.getByRole('textbox')).toHaveFocus();
	});

	it('moves focus to the control when the text inside the label is clicked', async () => {
		const user = userEvent.setup();
		render(
			<Field label="Your Organisation Name" required testId="field">
				<Input />
			</Field>,
		);

		await user.click(slot(screen.getByTestId('field-label'), 'field-label-text') as HTMLElement);

		expect(screen.getByRole('textbox')).toHaveFocus();
	});

	it('renders <No label> for an empty label and names the control with it', () => {
		render(
			<Field label="" testId="field">
				<Input />
			</Field>,
		);

		expect(screen.getByTestId('field-label')).toHaveTextContent('<No label>');
		expect(screen.getByRole('textbox', { name: '<No label>' })).toBeInTheDocument();
	});

	it('keeps the full label as the accessible name when the label is cut to 2 lines', () => {
		render(
			<div style={{ inlineSize: 160 }}>
				<Field label={LONG_LABEL} testId="field">
					<Input />
				</Field>
			</div>,
		);

		expect(screen.getByRole('textbox')).toHaveAccessibleName(LONG_LABEL);
		expect(slot(screen.getByTestId('field-label'), 'field-label-text')).toHaveTextContent(
			LONG_LABEL,
		);
	});

	it('marks the label cut and shows the full text in a tooltip on hover', async () => {
		const user = userEvent.setup();
		render(
			<div style={{ inlineSize: 160 }}>
				<Field label={LONG_LABEL} testId="field">
					<Input />
				</Field>
			</div>,
		);
		const text = slot(screen.getByTestId('field-label'), 'field-label-text') as HTMLElement;

		await waitFor(() => expect(text).toHaveAttribute('data-truncated'));
		await user.hover(text);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG_LABEL);
	});

	it('says nothing while the label fits', async () => {
		const user = userEvent.setup();
		render(
			<div style={{ inlineSize: 480 }}>
				<Field label="Organisation" testId="field">
					<Input />
				</Field>
			</div>,
		);
		const text = slot(screen.getByTestId('field-label'), 'field-label-text') as HTMLElement;

		await user.hover(text);

		expect(text).not.toHaveAttribute('data-truncated');
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});
});

describe('Field required marker', () => {
	it('adds an aria-hidden asterisk after the label text', () => {
		render(
			<Field label="Organisation" required testId="field">
				<Input />
			</Field>,
		);

		const label = screen.getByTestId('field-label');
		const marker = slot(label, 'field-required-marker');

		expect(marker).toHaveTextContent('*');
		expect(marker).toHaveAttribute('aria-hidden', 'true');
		expect(marker?.previousElementSibling).toBe(slot(label, 'field-label-text'));
	});

	it('keeps the asterisk out of the control name', () => {
		render(
			<Field label="Organisation" required>
				<Input />
			</Field>,
		);

		expect(screen.getByRole('textbox')).toHaveAccessibleName('Organisation');
	});

	it('marks the control required with aria-required, never the native required', () => {
		render(
			<Field label="Organisation" required>
				<Input />
			</Field>,
		);

		const input = screen.getByRole('textbox');

		expect(input).toBeRequired();
		expect(input).toHaveAttribute('aria-required', 'true');
		expect(input).not.toHaveAttribute('required');
	});

	it('lets a plain form submit with an empty required field, the schema owns the check', () => {
		render(
			<form>
				<Field label="Organisation" required>
					<Input />
				</Field>
				<button type="submit">Save</button>
			</form>,
		);

		const form = screen.getByRole('button', { name: 'Save' }).closest('form');

		expect(form?.checkValidity()).toBe(true);
	});

	it('sets the native required when the control asks for it itself', () => {
		render(
			<Field label="Organisation" required>
				<Input required />
			</Field>,
		);

		expect(screen.getByRole('textbox')).toHaveAttribute('required');
	});

	it('keeps an own aria-required over the field', () => {
		render(
			<Field label="Organisation" required>
				<Input aria-required={false} />
			</Field>,
		);

		expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'false');
	});

	it('renders no marker and no required control without required', () => {
		render(
			<Field label="Organisation" testId="field">
				<Input />
			</Field>,
		);

		expect(slot(screen.getByTestId('field-label'), 'field-required-marker')).toBeNull();
		expect(screen.getByRole('textbox')).not.toBeRequired();
	});
});
