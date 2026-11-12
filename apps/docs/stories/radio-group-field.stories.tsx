import { RadioGroupField, type RadioGroupItemType } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { fieldLabelArgTypes, fieldParameters } from './shared/field-arg-types.js';
import { radioGroupArgTypes } from './shared/radio-group-arg-types.js';
import styles from './radio-group-field.stories.module.css';

const RETENTION: RadioGroupItemType[] = [
	{ label: '7 days', value: '7' },
	{ label: '30 days', value: '30' },
	{ label: '90 days', value: '90' },
];

const REGIONS: RadioGroupItemType[] = [
	{ label: 'US East', value: 'us-east' },
	{ label: 'EU West', value: 'eu-west' },
];

const ENVIRONMENTS: RadioGroupItemType[] = [
	{ label: 'Staging', value: 'staging' },
	{ label: 'Production', value: 'production' },
];

/**
 * `RadioGroupField` is `RadioGroup` inside a `Field.Group`, in one element. It is documented on the
 * `RadioGroup` page, `radio-group.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof RadioGroupField> = {
	title: 'Primitive Components/Field/RadioGroupField',
	component: RadioGroupField,
	tags: ['!autodocs'],
	parameters: fieldParameters,
	argTypes: {
		...radioGroupArgTypes,
		...fieldLabelArgTypes,
		required: {
			control: 'boolean',
			description: 'Marks the legend with an asterisk and sets `aria-required` on the radio group.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		'aria-label': {
			control: 'text',
			description:
				'Not needed: the legend names the radio group. A name of your own still wins over the legend.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-labelledby': {
			control: 'text',
			description:
				'Not needed: the legend names the radio group. A name of your own still wins over the legend.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'Forwarded to the radio group. The `<fieldset>` gets none.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the radio group as `data-testid`. It names every row too, as `${testId}-item-${value}`, unless the item carries a `testId` of its own. The field parts take it as their prefix: `${testId}-label`, `${testId}-label-tooltip`, `${testId}-description` and `${testId}-message`. The `<fieldset>` gets no `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		label: 'Retention',
		description: 'How long the data is kept.',
		color: 'primary',
		items: RETENTION,
		defaultValue: '30',
		onChange: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof RadioGroupField>;

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	parameters: {
		// `States` holds the states of the shorthand, and `Field` covers the states of the field.
		chromatic: { disableSnapshot: true },
	},
	// Remounts on a new `defaultValue`, since the value is uncontrolled.
	render: (args) => <RadioGroupField key={String(args.defaultValue)} {...args} />,
};

/**
 * The legend is the label of the group, so the radio group takes it as its name. `required` sets
 * `aria-required` on it, and a `danger` status sets `aria-invalid`. `disabled` and every other
 * prop of `RadioGroup` go to the radio group as they are.
 */
export const States: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-lg ${styles.stack}`}>
			<RadioGroupField
				label="Retention"
				description="How long the data is kept."
				color="primary"
				items={RETENTION}
				defaultValue="30"
				required
				testId="retention"
			/>
			<RadioGroupField
				label="Region"
				description="Where the data lives."
				color="primary"
				items={REGIONS}
				error="Pick a region."
				testId="region"
			/>
			<RadioGroupField
				label="Environment"
				color="primary"
				items={ENVIRONMENTS}
				defaultValue="staging"
				disabled
				disabledTooltip="Ask an admin for access"
				testId="environment"
			/>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const retention = canvas.getByRole('radiogroup', { name: 'Retention' });

		await expect(retention).toHaveAttribute('aria-required', 'true');
		await expect(canvas.getByRole('group', { name: 'Retention' })).toHaveAccessibleDescription(
			'How long the data is kept.',
		);
		await expect(within(retention).getByRole('radio', { name: '30 days' })).toBeChecked();

		const region = canvas.getByRole('radiogroup', { name: 'Region' });

		await expect(region).toHaveAttribute('aria-invalid', 'true');
		// The message takes the place of the description in the same row.
		await expect(canvas.getByRole('group', { name: 'Region' })).toHaveAccessibleDescription(
			'Pick a region.',
		);
		await expect(canvas.queryByTestId('region-description')).not.toBeInTheDocument();

		const environment = canvas.getByRole('radiogroup', { name: 'Environment' });

		await expect(within(environment).getByRole('radio', { name: 'Production' })).toHaveAttribute(
			'aria-disabled',
			'true',
		);
		await expect(environment).not.toHaveAttribute('aria-invalid');
	},
};
