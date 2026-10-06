import { Building } from '@signozhq/icons';
import { Field, FieldSize, FieldStatus, Input, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './field.stories.module.css';

const meta: Meta<typeof Field> = {
	title: 'Primitive Components/Field',
	component: Field,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'The label, the control and the validation message of one form field, in the one layout the design system draws: label above, message below, nothing for the call site to arrange.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=6463-20230&p=f&m=dev',
		},
	},
	argTypes: {
		label: {
			control: 'text',
			description:
				'What the field is called, rendered as the `<label>` above the control. Required: a field exists to own its label.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		labelIcon: {
			control: false,
			description: 'Rendered before the label text, at the label icon color.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		children: {
			control: false,
			description:
				'Exactly one form control. The field hands it defaults through context: the id its label points at, `status`, `size` and `required`, and the message id for `aria-describedby`. The control’s own props win.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		error: {
			control: 'text',
			description:
				'Shorthand for `status="danger"` with `message`. A value that renders nothing shows no message and sets no status, so `error={errors.name?.message}` wires react-hook-form with nothing around it. Not allowed alongside `status` or `message`.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		status: {
			control: 'select',
			options: [undefined, ...Object.values(FieldStatus)],
			description:
				'The validation state of the whole field: colors the label, tints the control inside, and colors the message row. Requires `message`.',
			table: { category: 'Appearance', type: { summary: 'FieldStatusType' } },
		},
		message: {
			control: 'text',
			description:
				'What the status has to say, rendered below the control with the status icon. Only allowed alongside `status`.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		required: {
			control: 'boolean',
			description: 'Marks the label with an asterisk and makes the control inside required.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		size: {
			control: 'inline-radio',
			options: Object.values(FieldSize),
			description:
				'The size the control inside defaults to, so the frame and the label scale together.',
			table: {
				category: 'Appearance',
				type: { summary: 'FieldSizeType' },
				defaultValue: { summary: "'base'" },
			},
		},
		htmlFor: {
			control: 'text',
			description: 'The id of the control, for a control that names its own `id`.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'Forwarded to the root.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the root as `data-testid`, and the prefix of the parts: `${testId}-label` and `${testId}-message`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		label: 'Your Organisation Name',
	},
};

export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	parameters: {
		// Every state it can be driven into is covered by `Showcase`.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => (
		<Field {...args}>
			<Input placeholder="For eg. Simpsonville..." />
		</Field>
	),
};

function Section({
	title,
	description,
	children,
}: {
	title: string;
	description: ReactNode;
	children: ReactNode;
}): ReactElement {
	return (
		<div className="story-section">
			<Typography size="base" weight="semibold">
				{title}
			</Typography>
			<Typography size="sm">{description}</Typography>
			<div className={`${styles.stack} ${styles.marginTopMedium}`}>{children}</div>
		</div>
	);
}

export const Showcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => (
		<div className="story-grid">
			<Section
				title="Anatomy"
				description="Label above, control, message below. The label is 8px above the control and the message 8px below it. The optional label icon takes the label icon color."
			>
				<Field label="Your Organisation Name" labelIcon={<Building />}>
					<Input placeholder="For eg. Simpsonville..." prefix={<Building />} />
				</Field>
			</Section>

			<Section
				title="Statuses"
				description="The label, the control tint and the message color from one status. The control inside picks it up through context, nothing is wired by hand."
			>
				<Field
					label="Your Organisation Name"
					status="success"
					message="This is the success message appearing here"
				>
					<Input defaultValue="This is some input text" />
				</Field>
				<Field
					label="Your Organisation Name"
					status="warning"
					message="This is the warning message appearing here"
				>
					<Input defaultValue="This is some input text" />
				</Field>
				<Field label="Your Organisation Name" error="This is the error message appearing here">
					<Input placeholder="For eg. Simpsonville..." />
				</Field>
			</Section>

			<Section
				title="Sizes"
				description="size flows to the control, so the frame and the label scale together. The label and its gap are identical across sizes."
			>
				<Field label="Base field">
					<Input placeholder="For eg. Simpsonville..." />
				</Field>
				<Field label="Large field" size="large">
					<Input placeholder="For eg. Simpsonville..." />
				</Field>
			</Section>

			<Section
				title="Required"
				description="The asterisk marks the label, and the control inside becomes required."
			>
				<Field label="Your Organisation Name" required>
					<Input placeholder="For eg. Simpsonville..." />
				</Field>
			</Section>

			<Section
				title="With the members"
				description="Any member of the Input compound reads the same context."
			>
				<Field label="Description" status="danger" message="Say a little more">
					<Input.TextArea rows={3} placeholder="Describe the incident..." />
				</Field>
				<Field label="Replica count" required>
					<Input.Number defaultValue={3} min={0} max={100} />
				</Field>
			</Section>
		</div>
	),
};

export const LabelFocusesTheControl: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	render: () => (
		<Field label="Your Organisation Name" testId="field">
			<Input placeholder="For eg. Simpsonville..." />
		</Field>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByTestId('field-label'));

		await expect(canvas.getByRole('textbox')).toHaveFocus();
	},
};
