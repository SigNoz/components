import { render, screen } from '@testing-library/react';
import { createRef, forwardRef } from 'react';
import { describe, expect, it } from 'vitest';
import { useFieldControl } from '../../input/utils.js';
import { RadioGroup } from '../../radio-group/radio-group.js';
import { createFieldShorthand, splitFieldProps } from '../field-shorthand.js';
import { FieldGroup } from '../subcomponents/field-group.js';
import type { FieldLabelAndMessageProps } from '../types.js';
import { slot } from './field.test-utils.js';

type FakeProps = FieldLabelAndMessageProps & { testId?: string; placeholder?: string };

const FakeControl = forwardRef<HTMLInputElement, Record<string, unknown>>(function FakeControl(
	{ testId, required, ...props },
	ref,
) {
	const field = useFieldControl({
		id: undefined,
		status: undefined,
		required: undefined,
		ariaDescribedBy: undefined,
		ariaInvalid: undefined,
	});

	return (
		<input
			{...props}
			ref={ref}
			id={field.id}
			aria-describedby={field.ariaDescribedBy}
			required={required === true}
			data-testid={testId as string | undefined}
			data-received-required={String(required)}
		/>
	);
});

const FakeField = createFieldShorthand<FakeProps, HTMLInputElement>(FakeControl, {
	displayName: 'FakeField',
	passRequired: true,
});
const FakeFieldWithoutRequired = createFieldShorthand<FakeProps, HTMLInputElement>(FakeControl, {
	displayName: 'FakeFieldWithoutRequired',
});

describe('splitFieldProps', () => {
	it('sends the field keys to the field and everything else to the control', () => {
		const { field, control, required } = splitFieldProps({
			label: 'Email',
			labelIcon: <svg />,
			labelTooltip: 'Used to sign in',
			description: 'We never share it',
			error: 'Not an email',
			status: 'danger',
			message: 'Not an email',
			placeholder: 'you@example.com',
			testId: 'email',
			id: 'email-input',
			'aria-label': 'Email address',
			'data-analytics': 'email',
		} as FakeProps & Record<string, unknown>);

		expect(Object.keys(field).sort()).toEqual(
			['description', 'error', 'label', 'labelIcon', 'labelTooltip', 'message', 'status'].sort(),
		);
		expect(Object.keys(control).sort()).toEqual(
			['aria-label', 'data-analytics', 'id', 'placeholder', 'testId'].sort(),
		);
		expect(required).toBe(false);
	});

	it('takes required out of both and reports it on its own', () => {
		const { field, control, required } = splitFieldProps({ label: 'Email', required: true });

		expect(required).toBe(true);
		expect(field).not.toHaveProperty('required');
		expect(control).not.toHaveProperty('required');
	});

	it('drops htmlFor', () => {
		const { field, control } = splitFieldProps({
			label: 'Email',
			htmlFor: 'elsewhere',
		} as FakeProps & Record<string, unknown>);

		expect(field).not.toHaveProperty('htmlFor');
		expect(control).not.toHaveProperty('htmlFor');
	});

	it('counts only true as required', () => {
		expect(splitFieldProps({ label: 'Email' }).required).toBe(false);
		expect(splitFieldProps({ label: 'Email', required: false }).required).toBe(false);
	});
});

describe('createFieldShorthand around a field', () => {
	it('renders the control inside a Field named by the label', () => {
		const { container } = render(
			<FakeField label="Email" description="We never share it" placeholder="you@example.com" />,
		);

		const input = screen.getByRole('textbox', { name: 'Email' });

		expect(slot(container, 'field')).toContainElement(input);
		expect(input).toHaveAttribute('placeholder', 'you@example.com');
		expect(input).toHaveAccessibleDescription('We never share it');
	});

	it('puts the testId on the control and prefixes the parts, leaving the root bare', () => {
		const { container } = render(<FakeField label="Email" description="Help" testId="email" />);

		expect(screen.getByTestId('email')).toBe(screen.getByRole('textbox'));
		expect(screen.getByTestId('email-label')).toBeInTheDocument();
		expect(screen.getByTestId('email-description')).toBeInTheDocument();
		expect(slot(container, 'field')).not.toHaveAttribute('data-testid');
	});

	it('hands required to the control as a prop with passRequired', () => {
		render(<FakeField label="Email" required testId="email" />);

		expect(screen.getByTestId('email')).toHaveAttribute('data-received-required', 'true');
		expect(screen.getByTestId('email')).toBeRequired();
		expect(
			screen.getByTestId('email-label').querySelector('[data-slot="field-required-marker"]'),
		).not.toBeNull();
	});

	it('does not hand required to the control without passRequired', () => {
		render(<FakeFieldWithoutRequired label="Email" required testId="email" />);

		expect(screen.getByTestId('email')).toHaveAttribute('data-received-required', 'undefined');
		expect(
			screen.getByTestId('email-label').querySelector('[data-slot="field-required-marker"]'),
		).not.toBeNull();
	});

	it('leaves required off the control when the field is not required', () => {
		render(<FakeField label="Email" testId="email" />);

		expect(screen.getByTestId('email')).toHaveAttribute('data-received-required', 'undefined');
	});

	it('forwards the ref to the control and names the component', () => {
		const ref = createRef<HTMLInputElement>();
		render(<FakeField label="Email" testId="email" ref={ref} />);

		expect(ref.current).toBe(screen.getByRole('textbox'));
		expect(FakeField.displayName).toBe('FakeField');
	});
});

describe('createFieldShorthand around a group', () => {
	const ENVIRONMENTS = [
		{ value: 'staging', label: 'Staging' },
		{ value: 'production', label: 'Production' },
	];
	const EnvironmentField = createFieldShorthand<
		FieldLabelAndMessageProps & { color: 'primary'; items: typeof ENVIRONMENTS; testId?: string },
		HTMLDivElement
	>(RadioGroup as never, { displayName: 'EnvironmentField', group: true });

	it('renders the control inside a Field.Group named by the legend', () => {
		const { container } = render(
			<EnvironmentField
				label="Environment"
				color="primary"
				items={ENVIRONMENTS}
				description="Where the data goes"
			/>,
		);

		const group = screen.getByRole('group', { name: 'Environment' });

		expect(group.tagName).toBe('FIELDSET');
		expect(slot(container, 'field')).toBeNull();
		expect(group).toContainElement(screen.getByRole('radiogroup', { name: 'Environment' }));
		expect(group).toHaveAccessibleDescription('Where the data goes');
	});

	it('puts the testId on the control and prefixes the parts, leaving the fieldset bare', () => {
		const { container } = render(
			<EnvironmentField
				label="Environment"
				color="primary"
				items={ENVIRONMENTS}
				error="Pick one"
				testId="env"
			/>,
		);

		expect(screen.getByTestId('env')).toHaveAttribute('data-slot', 'radio-group');
		expect(screen.getByTestId('env-label').tagName).toBe('LEGEND');
		expect(screen.getByTestId('env-message')).toBeInTheDocument();
		expect(slot(container, 'field-group')).not.toHaveAttribute('data-testid');
	});

	it('leaves the fieldset of a hand-written group with its own testId', () => {
		render(
			<FieldGroup label="Environment" testId="group">
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</FieldGroup>,
		);

		expect(screen.getByTestId('group').tagName).toBe('FIELDSET');
	});

	it('takes the testId off the fieldset with testIdOnPartsOnly', () => {
		const { container } = render(
			<FieldGroup label="Environment" testId="group" testIdOnPartsOnly>
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</FieldGroup>,
		);

		expect(slot(container, 'field-group')).not.toHaveAttribute('data-testid');
		expect(screen.getByTestId('group-label').tagName).toBe('LEGEND');
	});
});
