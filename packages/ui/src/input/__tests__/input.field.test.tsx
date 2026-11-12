import { Info } from '@signozhq/icons';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import {
	describedByIds,
	slot,
	withoutGeneratedIds,
} from '../../field/__tests__/field.test-utils.js';
import { Input } from '../input.js';
import { InputField } from '../presets/input-field.js';

describe('InputField rendering', () => {
	it('renders an Input named by the label inside a Field', () => {
		const { container } = render(<InputField label="Email" placeholder="you@example.com" />);

		const input = screen.getByRole('textbox', { name: 'Email' });
		const root = slot(container, 'field');

		expect(root).toContainElement(input);
		expect(slot(container, 'field-label')).toHaveAttribute('for', input.id);
		expect(input.id).not.toBe('');
		expect(input).toHaveAttribute('placeholder', 'you@example.com');
	});

	it('renders the same DOM as the hand-written Field and Input', () => {
		const props = {
			description: 'We only write about your account',
			labelTooltip: 'Used to sign in',
			required: true,
		} as const;
		const shorthand = render(
			<InputField label="Email" {...props} type="email" placeholder="you@example.com" />,
		);
		const fromShorthand = withoutGeneratedIds(shorthand.container.innerHTML);
		shorthand.unmount();

		const handWritten = render(
			<Field label="Email" {...props}>
				<Input type="email" placeholder="you@example.com" />
			</Field>,
		);

		expect(fromShorthand).not.toBe('');
		expect(withoutGeneratedIds(handWritten.container.innerHTML)).toBe(fromShorthand);
	});

	it('renders the same DOM as the hand-written pair while a message shows', () => {
		const shorthand = render(
			<InputField label="Email" description="Used to sign in" error="Not an email" />,
		);
		const fromShorthand = withoutGeneratedIds(shorthand.container.innerHTML);
		shorthand.unmount();

		const handWritten = render(
			<Field label="Email" description="Used to sign in" error="Not an email">
				<Input />
			</Field>,
		);

		expect(withoutGeneratedIds(handWritten.container.innerHTML)).toBe(fromShorthand);
	});

	it('sends the props of the Input to the Input', () => {
		render(
			<InputField
				label="Organisation"
				name="organisation"
				type="search"
				maxLength={64}
				autoComplete="organization"
				size="lg"
				variant="default"
				prefix="@"
				suffix="Inc."
				width={240}
				testId="org"
			/>,
		);

		const input = screen.getByRole('searchbox', { name: 'Organisation' });

		expect(input).toHaveAttribute('name', 'organisation');
		expect(input).toHaveAttribute('maxlength', '64');
		expect(input).toHaveAttribute('autocomplete', 'organization');
		expect(screen.getByTestId('org')).toHaveAttribute('data-size', 'lg');
		expect(screen.getByTestId('org-prefix')).toHaveTextContent('@');
		expect(screen.getByTestId('org-suffix')).toHaveTextContent('Inc.');
	});

	it('sends aria-* to the input and data-* to the frame', () => {
		const { container } = render(
			<InputField
				label="Organisation"
				aria-label="Organisation name"
				data-analytics="org"
				testId="org"
			/>,
		);

		expect(screen.getByTestId('org-field')).toHaveAttribute('aria-label', 'Organisation name');
		expect(screen.getByTestId('org')).toHaveAttribute('data-analytics', 'org');
		expect(slot(container, 'field')).not.toHaveAttribute('data-analytics');
		expect(slot(container, 'field')).not.toHaveAttribute('aria-label');
	});

	it('sends disabled with its reason to the input', () => {
		render(
			<InputField label="Organisation" disabled disabledTooltip="Ask an admin" testId="org" />,
		);

		expect(screen.getByRole('textbox', { name: 'Organisation' })).toBeDisabled();
		expect(screen.getByTestId('org')).toHaveAttribute('data-disabled');
	});

	it('names the input by its own id and points the label at it', () => {
		const { container } = render(<InputField label="Organisation" id="org-input" />);

		expect(screen.getByRole('textbox', { name: 'Organisation' })).toHaveAttribute(
			'id',
			'org-input',
		);
		expect(slot(container, 'field-label')).toHaveAttribute('for', 'org-input');
		expect(slot(container, 'field')).not.toHaveAttribute('id');
	});

	it('drops htmlFor, the shorthand wires the id itself', () => {
		const { container } = render(
			<InputField label="Organisation" {...({ htmlFor: 'elsewhere' } as object)} />,
		);

		const input = screen.getByRole('textbox', { name: 'Organisation' });

		expect(input.id).not.toBe('elsewhere');
		expect(slot(container, 'field-label')).toHaveAttribute('for', input.id);
		expect(input).not.toHaveAttribute('for');
	});

	it('renders <No label> for an empty label', () => {
		render(<InputField label="" />);

		expect(screen.getByRole('textbox', { name: '<No label>' })).toBeInTheDocument();
	});

	it('renders the label icon', () => {
		const { container } = render(<InputField label="Email" labelIcon={<Info />} />);

		expect(slot(container, 'field-label-icon')).toHaveAttribute('aria-hidden', 'true');
	});
});

describe('InputField test ids', () => {
	it('puts the testId on the control and prefixes the parts with it', () => {
		render(
			<InputField
				label="Email"
				labelTooltip="Used to sign in"
				description="We never share it"
				testId="email"
			/>,
		);

		expect(screen.getByTestId('email')).toHaveAttribute('data-slot', 'input');
		expect(screen.getByTestId('email-field')).toBe(screen.getByRole('textbox'));
		expect(screen.getByTestId('email-label')).toHaveAttribute('data-slot', 'field-label');
		expect(screen.getByTestId('email-label-tooltip')).toHaveAttribute(
			'data-slot',
			'field-label-tooltip',
		);
		expect(screen.getByTestId('email-description')).toHaveAttribute(
			'data-slot',
			'field-description',
		);
	});

	it('prefixes the message with the testId', () => {
		render(<InputField label="Email" error="Not an email" testId="email" />);

		expect(screen.getByTestId('email-message')).toHaveAttribute('data-slot', 'field-message');
		expect(screen.queryByTestId('email-description')).toBeNull();
	});

	it('leaves the root of the field without a data-testid', () => {
		const { container } = render(<InputField label="Email" testId="email" />);

		expect(slot(container, 'field')).not.toHaveAttribute('data-testid');
		expect(container.querySelectorAll('[data-testid="email"]')).toHaveLength(1);
	});

	it('sets no data-testid on the field parts without a testId', () => {
		const { container } = render(
			<InputField
				label="Email"
				labelIcon={<Info />}
				labelTooltip="Used to sign in"
				description="We never share it"
				required
			/>,
		);

		const parts = container.querySelectorAll('[data-slot^="field"]');

		expect(parts.length).toBeGreaterThanOrEqual(9);

		for (const part of parts) {
			expect(part, part.getAttribute('data-slot') ?? '').not.toHaveAttribute('data-testid');
		}

		expect(screen.getByRole('textbox')).not.toHaveAttribute('data-testid');
	});

	it('sets no data-testid on the message without a testId', () => {
		const { container } = render(<InputField label="Email" error="Not an email" />);

		expect(slot(container, 'field-message')).not.toHaveAttribute('data-testid');
	});
});

describe('InputField status, required and description', () => {
	it('shows an error on the field and on the input', () => {
		const { container } = render(<InputField label="Email" error="Not an email" testId="email" />);

		const input = screen.getByRole('textbox', { name: 'Email' });

		expect(slot(container, 'field')).toHaveAttribute('data-status', 'danger');
		expect(screen.getByTestId('email')).toHaveAttribute('data-status', 'danger');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAccessibleDescription('Not an email');
		expect(
			within(screen.getByTestId('email-message')).getByTestId('solid-alert-triangle'),
		).toBeInTheDocument();
		expect(slot(container, 'field-announcer')).toHaveTextContent('Not an email');
	});

	it('shows a warning without aria-invalid', () => {
		render(
			<InputField label="Email" status="warning" message="Looks like a typo" testId="email" />,
		);

		expect(screen.getByTestId('email')).toHaveAttribute('data-status', 'warning');
		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
		expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Looks like a typo');
	});

	it('shows a success message', () => {
		render(<InputField label="Name" status="success" message="Available" testId="name" />);

		expect(screen.getByTestId('name')).toHaveAttribute('data-status', 'success');
		expect(
			within(screen.getByTestId('name-message')).getByTestId('solid-check-circle-2'),
		).toBeInTheDocument();
	});

	it('shows no message and no status for an error that renders nothing', () => {
		const { container } = render(<InputField label="Email" error={undefined} testId="email" />);

		expect(slot(container, 'field-message')).toBeNull();
		expect(slot(container, 'field')).not.toHaveAttribute('data-status');
		expect(screen.getByTestId('email')).not.toHaveAttribute('data-status');
		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
	});

	it('replaces the description with the message in the same row', () => {
		const { rerender } = render(
			<InputField label="Email" description="We never share it" testId="email" />,
		);
		const row = screen.getByTestId('email-description');

		rerender(
			<InputField
				label="Email"
				description="We never share it"
				error="Not an email"
				testId="email"
			/>,
		);

		expect(screen.getByTestId('email-message')).toBe(row);
		expect(screen.getByTestId('email-message')).toHaveAttribute('data-slot', 'field-message');
	});

	it('marks a required field on the label, the root and the input', () => {
		const { container } = render(<InputField label="Email" required />);

		expect(slot(container, 'field-required-marker')).toHaveAttribute('aria-hidden', 'true');
		expect(slot(container, 'field')).toHaveAttribute('data-required');

		const input = screen.getByRole('textbox', { name: 'Email' });

		expect(input).toHaveAttribute('aria-required', 'true');
		expect(input).not.toHaveAttribute('required');
	});

	it('leaves the input optional without required', () => {
		const { container } = render(<InputField label="Email" />);

		expect(slot(container, 'field')).not.toHaveAttribute('data-required');
		expect(screen.getByRole('textbox')).not.toBeRequired();
	});

	it('lists the own aria-describedby, the row and the tooltip text in that order', () => {
		render(
			<div>
				<span id="hint">Use the work address</span>
				<InputField
					label="Email"
					description="We never share it"
					labelTooltip="Used to sign in"
					aria-describedby="hint"
					testId="email"
				/>
			</div>,
		);

		const ids = describedByIds(screen.getByRole('textbox'));

		expect(ids).toHaveLength(3);
		expect(ids[0]).toBe('hint');
		expect(ids[1]).toBe(screen.getByTestId('email-description').id);
		expect(document.getElementById(ids[2] as string)).toHaveTextContent('Used to sign in');
	});

	it('keeps the info icon out of the tab order and the text in the description', async () => {
		const user = userEvent.setup();
		render(<InputField label="Email" labelTooltip="Used to sign in" testId="email" />);

		await user.tab();

		expect(screen.getByRole('textbox')).toHaveFocus();
		expect(screen.getByTestId('email-label-tooltip')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Used to sign in');
	});
});

describe('InputField interaction', () => {
	it('moves focus to the input when the label is clicked', async () => {
		const user = userEvent.setup();
		render(<InputField label="Email" testId="email" />);

		await user.click(screen.getByTestId('email-label'));

		expect(screen.getByRole('textbox')).toHaveFocus();
	});

	it('types into a controlled input', async () => {
		function Controlled() {
			const [value, setValue] = useState('');

			return (
				<InputField
					label="Email"
					value={value}
					onChange={(event) => setValue(event.target.value)}
				/>
			);
		}
		const user = userEvent.setup();
		render(<Controlled />);

		await user.type(screen.getByRole('textbox', { name: 'Email' }), 'alex@example.com');

		expect(screen.getByRole('textbox')).toHaveValue('alex@example.com');
	});

	it('takes a react-hook-form register() shaped spread', async () => {
		const input: { current: HTMLInputElement | null } = { current: null };
		const registration = {
			name: 'email',
			onChange: vi.fn(async () => true),
			onBlur: vi.fn(async () => true),
			ref: vi.fn((instance: HTMLInputElement | null) => {
				input.current = instance;
			}),
		};
		const user = userEvent.setup();
		render(<InputField label="Email" required error="Required" {...registration} />);

		const field = screen.getByRole('textbox', { name: 'Email' });
		await user.type(field, 'a');
		await user.tab();

		expect(field).toHaveAttribute('name', 'email');
		expect(registration.onChange).toHaveBeenCalledTimes(1);
		expect(registration.onBlur).toHaveBeenCalledTimes(1);
		expect(input.current).toBe(field);
		expect(field).toHaveAttribute('aria-invalid', 'true');
		expect(field).toHaveAttribute('aria-required', 'true');
		expect(field).not.toHaveAttribute('required');
	});

	it('calls the own onChange with the event, as Input does', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		render(<InputField label="Email" onChange={onChange} />);

		await user.type(screen.getByRole('textbox'), 'ab');

		expect(onChange).toHaveBeenCalledTimes(2);
		expect(onChange.mock.calls[1]?.[0].target).toBe(screen.getByRole('textbox'));
	});
});

describe('InputField members', () => {
	it('renders InputField.Password with the password member and the label as its name', () => {
		render(<InputField.Password label="Secret" required error="Too short" testId="secret" />);

		const input = screen.getByLabelText(/^Secret/);

		expect(input).toHaveAttribute('type', 'password');
		expect(input).toHaveAttribute('aria-required', 'true');
		expect(input).not.toHaveAttribute('required');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAccessibleDescription('Too short');
		expect(screen.getByTestId('secret')).toHaveAttribute('data-member', 'password');
		expect(screen.getByTestId('secret')).toHaveAttribute('data-status', 'danger');
		expect(screen.getByTestId('secret-label')).toHaveAttribute('for', input.id);
	});

	it('renders InputField.TextArea with the textarea member and the label as its name', () => {
		render(
			<InputField.TextArea label="Notes" description="Shown to the team" rows={4} testId="notes" />,
		);

		const textarea = screen.getByRole('textbox', { name: 'Notes' });

		expect(textarea.tagName).toBe('TEXTAREA');
		expect(textarea).toHaveAttribute('rows', '4');
		expect(textarea).toHaveAccessibleDescription('Shown to the team');
		expect(screen.getByTestId('notes')).toHaveAttribute('data-member', 'textarea');
		expect(screen.getByTestId('notes-label')).toHaveAttribute('for', textarea.id);
	});

	it('renders InputField.Number with the number member and the label as its name', () => {
		render(
			<InputField.Number
				label="Replica count"
				status="warning"
				message="More than the plan allows"
				min={1}
				max={10}
				testId="count"
			/>,
		);

		const input = screen.getByRole('textbox', { name: 'Replica count' });

		expect(screen.getByTestId('count')).toHaveAttribute('data-member', 'number');
		expect(screen.getByTestId('count')).toHaveAttribute('data-status', 'warning');
		expect(input).toHaveAccessibleDescription('More than the plan allows');
		expect(input).not.toHaveAttribute('aria-invalid');
	});

	it('marks InputField.Number required and invalid through the field', () => {
		render(<InputField.Number label="Replica count" required error="Required" />);

		const input = screen.getByRole('textbox', { name: 'Replica count' });

		expect(input).toHaveAttribute('aria-required', 'true');
		expect(input).not.toHaveAttribute('required');
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('moves focus to the member when the label is clicked', async () => {
		const user = userEvent.setup();
		render(
			<>
				<InputField.Password label="Secret" testId="secret" />
				<InputField.TextArea label="Notes" testId="notes" />
				<InputField.Number label="Replica count" testId="count" />
			</>,
		);

		await user.click(screen.getByTestId('secret-label'));
		expect(screen.getByLabelText(/^Secret/)).toHaveFocus();

		await user.click(screen.getByTestId('notes-label'));
		expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveFocus();

		await user.click(screen.getByTestId('count-label'));
		expect(screen.getByRole('textbox', { name: 'Replica count' })).toHaveFocus();
	});

	it('names every part in DevTools', () => {
		expect(InputField.displayName).toBe('InputField');
		expect(InputField.Password.displayName).toBe('InputField.Password');
		expect(InputField.TextArea.displayName).toBe('InputField.TextArea');
		expect(InputField.Number.displayName).toBe('InputField.Number');
	});
});
