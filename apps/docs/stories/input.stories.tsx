import { Search } from '@signozhq/icons';
import { Input, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, type ReactNode, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import { inputArgTypes, inputParameters } from './shared/input-arg-types.js';
import styles from './input.stories.module.css';

const meta: Meta<typeof Input> = {
	title: 'Primitive Components/Input',
	component: Input,
	parameters: inputParameters,
	argTypes: inputArgTypes,
	args: {
		placeholder: 'For eg. Simpsonville...',
		'aria-label': 'Organisation name',
		onChange: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof Input>;

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
};

function Row({ label, children }: { label: string; children: ReactNode }): ReactElement {
	return (
		<>
			<Typography size="sm" weight="medium" className={styles.rowLabel}>
				{label}
			</Typography>
			{children}
		</>
	);
}

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
			<div className={`${styles.rows} ${styles.marginTopMedium}`}>{children}</div>
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
				title="Sizes"
				description="base is a 32px field, large is 40px. The text size does not change."
			>
				<Row label="base">
					<Input placeholder="For eg. Simpsonville..." aria-label="Base" />
				</Row>
				<Row label="large">
					<Input size="large" placeholder="For eg. Simpsonville..." aria-label="Large" />
				</Row>
			</Section>

			<Section
				title="Statuses"
				description="The border and the background tint, and a matching icon lands at the trailing edge. danger also announces itself as aria-invalid. Success is confirmation of a completed check, not a resting state for a valid field."
			>
				<Row label="success">
					<Input status="success" defaultValue="This is some input text" aria-label="Success" />
				</Row>
				<Row label="warning">
					<Input status="warning" defaultValue="This is some input text" aria-label="Warning" />
				</Row>
				<Row label="danger">
					<Input status="danger" defaultValue="This is some input text" aria-label="Danger" />
				</Row>
			</Section>

			<Section
				title="Prefix and suffix"
				description="Slots inside the field, before and after the text. The status icon renders after the suffix."
			>
				<Row label="prefix icon">
					<Input prefix={<Search />} placeholder="For eg. Simpsonville..." aria-label="Prefix" />
				</Row>
				<Row label="suffix text">
					<Input suffix="ms" placeholder="500" aria-label="Suffix" />
				</Row>
				<Row label="both, with a status">
					<Input
						prefix={<Search />}
						suffix="ms"
						status="danger"
						placeholder="500"
						aria-label="Both"
					/>
				</Row>
			</Section>

			<Section
				title="Unstyled"
				description="No border and no background. The focus ring stays: it is the only thing marking focus here."
			>
				<Row label="unstyled">
					<Input variant="unstyled" placeholder="For eg. Simpsonville..." aria-label="Unstyled" />
				</Row>
			</Section>

			<Section
				title="Disabled and read-only"
				description="Each state travels with its reason, shown in a tooltip on hover. Read-only outranks disabled, keeps the tab stop, and its value stays selectable."
			>
				<Row label="disabled">
					<Input
						disabled
						disabledTooltip="Ask an admin to unlock this field"
						defaultValue="Springfield"
						aria-label="Disabled"
					/>
				</Row>
				<Row label="read-only">
					<Input
						readOnly
						readOnlyTooltip="Saving your changes"
						defaultValue="Springfield"
						aria-label="Read-only"
					/>
				</Row>
			</Section>

			<Section
				title="Width"
				description="The field fills its parent. width and maxWidth bound it without a wrapper."
			>
				<Row label="width 240">
					<Input width={240} placeholder="For eg. Simpsonville..." aria-label="Width 240" />
				</Row>
			</Section>
		</div>
	),
};

function ControlledInput(): ReactElement {
	const [value, setValue] = useState('');

	return (
		<Input
			aria-label="Organisation name"
			placeholder="For eg. Simpsonville..."
			value={value}
			onChange={(event) => setValue(event.target.value)}
			testId="controlled-input"
		/>
	);
}

export const Typing: Story = {
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
	render: () => <ControlledInput />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const field = canvas.getByRole('textbox');

		await userEvent.type(field, 'Simpsonville');

		await expect(field).toHaveValue('Simpsonville');
	},
};

export const DisabledTooltip: Story = {
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
		<Input
			aria-label="Organisation name"
			disabled
			disabledTooltip="Ask an admin to unlock this field"
			testId="disabled-input"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await userEvent.hover(canvas.getByTestId('disabled-input'));

		await waitFor(() => {
			expect(document.body).toHaveTextContent('Ask an admin to unlock this field');
		});
	},
};
