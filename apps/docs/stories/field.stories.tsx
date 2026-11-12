import { Building } from '@signozhq/icons';
import {
	Checkbox,
	Combobox,
	type ComboboxOptionItemType,
	Field,
	Input,
	RadioGroup,
	type RadioGroupItemType,
	Select,
	type SelectOptionItemType,
	Slider,
	Switch,
	ToggleGroup,
	ToggleGroupColor,
	type ToggleGroupItemProps,
	ToggleGroupSize,
	ToggleGroupVariant,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './field.stories.module.css';
import { fieldArgTypes, fieldParameters } from './shared/field-arg-types.js';
import { waitForEffects } from './shared/play.js';

const meta: Meta<typeof Field> = {
	title: 'Primitive Components/Field',
	component: Field,
	parameters: fieldParameters,
	argTypes: fieldArgTypes,
	args: {
		label: 'Organisation name',
		description: 'Shown in your invoices and on the status page.',
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
			<Typography
				variant="paragraph"
				size="base"
				weight="bold"
				color="inherit"
				as="p"
				textOverflow="wrap"
			>
				{title}
			</Typography>
			<Typography
				variant="paragraph"
				size="small"
				weight="regular"
				color="inherit"
				as="p"
				textOverflow="wrap"
			>
				{description}
			</Typography>
			<div className={`${styles.stack} ${styles.marginTopMedium}`}>{children}</div>
		</div>
	);
}

function option(value: string, label: string): SelectOptionItemType & ComboboxOptionItemType {
	return { type: 'item', value, label } as SelectOptionItemType & ComboboxOptionItemType;
}

const RETENTION_ITEMS: RadioGroupItemType[] = [
	{ label: '7 days', value: '7' },
	{ label: '30 days', value: '30' },
	{ label: '90 days', value: '90' },
];

const LONG_LABEL =
	'Organisation name shown in your invoices, on the public status page, in every email we send and in the audit log of your workspace';

const LONG_MESSAGE =
	'This name is already used by another workspace in your account. Pick a different one, or ask the owner of that workspace to rename it before you continue.';

export const Showcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => (
		<div className={styles.showcase}>
			<Section
				title="Anatomy"
				description="The label above the control, and the row below it only when it has something to show. The label is 8px above the control and the row 8px under it, less than the 16px between fields, so a label reads as part of its own field."
			>
				<Field label="Organisation name">
					<Input placeholder="For eg. Simpsonville..." />
				</Field>
				<Field
					label="Organisation name"
					description="Shown in your invoices and on the status page."
				>
					<Input placeholder="For eg. Simpsonville..." />
				</Field>
				<Field label="Organisation name" required>
					<Input placeholder="For eg. Simpsonville..." />
				</Field>
				<Field label="Organisation name" labelIcon={<Building />}>
					<Input placeholder="For eg. Simpsonville..." />
				</Field>
				<Field label="Organisation name" labelTooltip="Visible to everyone in the workspace.">
					<Input placeholder="For eg. Simpsonville..." />
				</Field>
				<Field
					label="Organisation name"
					labelIcon={<Building />}
					labelTooltip="Visible to everyone in the workspace."
					description="Shown in your invoices and on the status page."
					required
				>
					<Input placeholder="For eg. Simpsonville..." />
				</Field>
			</Section>

			<Section
				title="Status"
				description="One status colors the label and the message, adds the status icon to the message, and tints the control inside. The message takes the place of the description in the same row, so the field does not grow by a line. danger also sets aria-invalid on the control. success confirms a check that ran and passed, it is not the state of a valid field."
			>
				<Field
					label="Organisation name"
					description="Between 3 and 40 characters."
					error="Use at least 3 characters."
				>
					<Input defaultValue="Si" />
				</Field>
				<Field
					label="Organisation name"
					description="Between 3 and 40 characters."
					status="warning"
					message="This name is close to one that is taken."
				>
					<Input defaultValue="Simpsonville Co" />
				</Field>
				<Field
					label="Organisation name"
					description="Between 3 and 40 characters."
					status="success"
					message="This name is available."
				>
					<Input defaultValue="Simpsonville" />
				</Field>
				<Field label="Organisation name" error={LONG_MESSAGE}>
					<Input defaultValue="Simpsonville" />
				</Field>
			</Section>

			<Section
				title="Label"
				description="The label wraps to 2 lines and then ends with an ellipsis, with the full text in a tooltip and as the accessible name. A label that needs more is a sentence: split it into a short label and a description. An empty label renders <No label> and names the control that way, so the missing name shows in review."
			>
				<Field label={LONG_LABEL}>
					<Input placeholder="For eg. Simpsonville..." />
				</Field>
				<Field label="">
					<Input placeholder="For eg. Simpsonville..." />
				</Field>
			</Section>

			<Section
				title="Locked controls"
				description="The control keeps its own disabled and read-only states and their reason tooltips. The field passes nothing down for them, and its label does not brighten on hover while the control is locked."
			>
				<Field label="Organisation name">
					<Input
						defaultValue="Simpsonville"
						disabled
						disabledTooltip="Managed by your identity provider"
					/>
				</Field>
				<Field label="Organisation name">
					<Input
						defaultValue="Simpsonville"
						readOnly
						readOnlyTooltip="Set when the workspace was created"
					/>
				</Field>
			</Section>

			<Section
				title="Field.Group"
				description="Several controls under one label, as a fieldset named by its legend. It takes the same props as Field, so the marker, the description and the message look the same."
			>
				<Field.Group label="Retention" description="How long the data is kept." required>
					<RadioGroup color="primary" items={RETENTION_ITEMS} defaultValue="30" />
				</Field.Group>
				<Field.Group label="Retention" error="Pick a retention period." required>
					<RadioGroup color="primary" items={RETENTION_ITEMS} />
				</Field.Group>
			</Section>
		</div>
	),
};

const FRAMEWORKS = [
	option('react', 'React'),
	option('vue', 'Vue'),
	option('angular', 'Angular'),
	option('svelte', 'Svelte'),
];

const REGIONS = [
	option('us', 'United States'),
	option('eu', 'Europe'),
	option('in', 'India'),
	option('au', 'Australia'),
];

/**
 * Every control is hand-written inside its own `Field`. The field label is the accessible name of
 * each one, whichever element carries it.
 */
export const EveryControl: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className="story-container-lg">
			<div className={styles.stack}>
				<Field label="Service name" description="The name your traces report.">
					<Input placeholder="checkout-service" />
				</Field>
				<Field label="Runbook notes" description="Shown on the alert page.">
					<Input.TextArea rows={3} placeholder="What to check first..." />
				</Field>
				<Field label="Replicas">
					<Input.Number defaultValue={3} min={0} max={100} />
				</Field>
				<Field label="Framework">
					<Select items={FRAMEWORKS} placeholder="Pick a framework" />
				</Field>
				<Field label="Region">
					<Combobox
						items={REGIONS}
						placeholder="Pick a region"
						searchInputProps={{ placeholder: 'Search regions' }}
					/>
				</Field>
				<Field label="Send alerts">
					<Switch color="primary" textPlacement="right" />
				</Field>
				<Field label="Sampling rate">
					<Slider color="primary" min={0} max={100} defaultValue={25} />
				</Field>
				<Field label="Accept the terms">
					<Checkbox color="primary" />
				</Field>
			</div>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		await expect(canvas.getByRole('textbox', { name: 'Service name' })).toHaveAccessibleDescription(
			'The name your traces report.',
		);
		await expect(canvas.getByRole('textbox', { name: 'Runbook notes' })).toBeInTheDocument();
		await expect(canvas.getByRole('textbox', { name: 'Replicas' })).toBeInTheDocument();
		await expect(canvas.getByRole('combobox', { name: 'Framework' })).toBeInTheDocument();
		await expect(canvas.getByRole('combobox', { name: 'Region' })).toBeInTheDocument();
		await expect(canvas.getByRole('switch', { name: 'Send alerts' })).toBeInTheDocument();
		await expect(canvas.getByRole('slider', { name: 'Sampling rate' })).toBeInTheDocument();
		await expect(canvas.getByRole('checkbox', { name: 'Accept the terms' })).toBeInTheDocument();
	},
};

const CHART_ITEMS: ToggleGroupItemProps[] = [
	{ value: 'line', label: 'Line' },
	{ value: 'bar', label: 'Bar' },
	{ value: 'area', label: 'Area' },
];

const UNITS = [option('hours', 'Hours'), option('days', 'Days'), option('weeks', 'Weeks')];

/**
 * A control with more than one input sits in a `Field.Group`: the group is a fieldset and the
 * label is its legend. Each input inside needs a name of its own, since the label names the
 * group and not them.
 */
export const Groups: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className="story-container-lg">
			<div className={styles.stack}>
				<Field.Group label="Retention" description="How long the data is kept." required>
					<RadioGroup color="primary" items={RETENTION_ITEMS} defaultValue="30" />
				</Field.Group>
				<Field.Group label="Chart type">
					<ToggleGroup
						type="single"
						variant={ToggleGroupVariant.Outlined}
						color={ToggleGroupColor.Secondary}
						size={ToggleGroupSize.MD}
						items={CHART_ITEMS}
						defaultValue="line"
					/>
				</Field.Group>
				<Field.Group label="Notify me about" description="Sent to the on-call channel.">
					<div className={styles.checkboxList}>
						<Checkbox color="primary" defaultValue>
							Deploys
						</Checkbox>
						<Checkbox color="primary">Alerts</Checkbox>
						<Checkbox color="primary">Weekly digest</Checkbox>
					</div>
				</Field.Group>
				<Field.Group
					label="Retention period"
					description="Two controls that make one value."
					error="Enter an amount."
				>
					<div className={styles.valueRow}>
						<div className={styles.valueCell}>
							<Input.Number aria-label="Amount" min={1} />
						</div>
						<div className={styles.valueCell}>
							<Select aria-label="Unit" items={UNITS} placeholder="Unit" defaultValue="days" />
						</div>
					</div>
				</Field.Group>
				<Field.Group label="Terms" required>
					<Checkbox color="primary">I accept the terms of service</Checkbox>
				</Field.Group>
			</div>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const retention = canvas.getByRole('group', { name: 'Retention' });

		await expect(retention).toHaveAccessibleDescription('How long the data is kept.');
		await expect(canvas.getByRole('radiogroup', { name: 'Retention' })).toBeInTheDocument();
		await expect(canvas.getByRole('group', { name: 'Notify me about' })).toBeInTheDocument();
		await expect(canvas.getByRole('checkbox', { name: 'Deploys' })).toBeChecked();

		const period = canvas.getByRole('group', { name: 'Retention period' });

		await expect(period).toHaveAccessibleDescription('Enter an amount.');
		await expect(canvas.getByRole('textbox', { name: 'Amount' })).toHaveAttribute(
			'aria-invalid',
			'true',
		);
	},
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
		<Field label="Organisation name" testId="field">
			<Input placeholder="For eg. Simpsonville..." />
		</Field>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByTestId('field-label'));

		await expect(canvas.getByRole('textbox', { name: 'Organisation name' })).toHaveFocus();
	},
};
