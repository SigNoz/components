import { InputField } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { fieldLabelArgTypes, fieldParameters } from './shared/field-arg-types.js';
import { inputArgTypes } from './shared/input-arg-types.js';
import styles from './input-field.stories.module.css';

/**
 * `InputField` is `Input` inside a `Field`, in one element. It is documented on the `Input` page,
 * `input.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof InputField> = {
	title: 'Primitive Components/Field/InputField',
	component: InputField,
	tags: ['!autodocs'],
	parameters: fieldParameters,
	argTypes: {
		...inputArgTypes,
		...fieldLabelArgTypes,
		id: {
			control: 'text',
			description:
				'Forwarded to the native input. Without it the field generates one, and its label points at it.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the frame of the input as `data-testid`, and the prefix of the parts. The field parts take it as their prefix too: `${testId}-label`, `${testId}-label-tooltip`, `${testId}-description` and `${testId}-message`. The field root gets no `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		label: 'Organisation name',
		description: 'Shown in your invoices and on the status page.',
		placeholder: 'For eg. Simpsonville...',
		onChange: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof InputField>;

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	parameters: {
		// `Members` holds every member, and `Field` covers the states of the field.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => <InputField {...args} />,
};

/**
 * Each member of `Input` has its own shorthand. They take the field props and the props of the
 * member, and render the same DOM as the hand-written `Field`.
 */
export const Members: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-lg ${styles.stack}`}>
			<InputField label="Service name" description="The name your traces report." />
			<InputField.Password
				label="Password"
				required
				error="Use at least 8 characters."
				defaultValue="short"
			/>
			<InputField.TextArea label="Runbook notes" rows={3} placeholder="What to check first..." />
			<InputField.Number label="Replicas" defaultValue={3} min={0} max={100} />
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByRole('textbox', { name: 'Service name' })).toHaveAccessibleDescription(
			'The name your traces report.',
		);
		await expect(canvas.getByLabelText(/^Password/)).toHaveAttribute('aria-invalid', 'true');
		await expect(canvas.getByRole('textbox', { name: 'Runbook notes' })).toBeInTheDocument();
		await expect(canvas.getByRole('textbox', { name: 'Replicas' })).toBeInTheDocument();
	},
};
