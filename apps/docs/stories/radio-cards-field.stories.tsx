import { Gauge, Logs, Workflow } from '@signozhq/icons';
import { RadioCardsField, type RadioCardsItemType } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { fieldLabelArgTypes, fieldParameters } from './shared/field-arg-types.js';
import { waitForEffects } from './shared/play.js';
import { radioCardsArgTypes } from './shared/radio-cards-arg-types.js';
import styles from './radio-cards-field.stories.module.css';

const TOOLS: RadioCardsItemType[] = [
	{ label: 'Datadog', value: 'datadog' },
	{ label: 'Grafana / Prometheus', value: 'grafana' },
	{ label: 'New Relic', value: 'newrelic' },
	{ label: 'Elastic', value: 'elastic' },
];

const SIGNALS: RadioCardsItemType[] = [
	{ label: 'Logs', value: 'logs', prefix: <Logs /> },
	{ label: 'Traces', value: 'traces', prefix: <Workflow /> },
	{ label: 'Metrics', value: 'metrics', prefix: <Gauge /> },
];

const CHANNELS: RadioCardsItemType[] = [
	{ label: 'Slack', value: 'slack' },
	{ label: 'Email', value: 'email' },
	{ label: 'PagerDuty', value: 'pagerduty' },
	{ label: 'Webhook', value: 'webhook' },
];

/**
 * `RadioCardsField` is `RadioCards` inside a `Field.Group`, in one element. `RadioCardsField.Multiple`
 * is `RadioCards.Multiple`. They are documented on the `RadioCards` page, `radio-cards.mdx`, so this
 * file has no docs page of its own.
 */
const meta: Meta<typeof RadioCardsField> = {
	title: 'Primitive Components/Field/RadioCardsField',
	component: RadioCardsField,
	tags: ['!autodocs'],
	parameters: fieldParameters,
	argTypes: {
		...radioCardsArgTypes,
		...fieldLabelArgTypes,
		required: {
			control: 'boolean',
			description:
				'Marks the legend with an asterisk and sets `aria-required` on the radio group, as the cards do without a field.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		'aria-label': {
			control: 'text',
			description:
				'Not needed: the legend names the cards. A name of your own still wins over the legend.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-labelledby': {
			control: 'text',
			description:
				'Not needed: the legend names the cards. A name of your own still wins over the legend.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the root of the cards as `data-testid`. It names every card too, as `${testId}-item-${value}`, unless the item carries a `testId` of its own. The field parts take it as their prefix: `${testId}-label`, `${testId}-label-tooltip`, `${testId}-description` and `${testId}-message`. The `<fieldset>` gets no `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		label: 'Current tool',
		description: 'The import steps are tailored to it.',
		items: TOOLS,
		columns: 2,
		defaultValue: 'grafana',
		onChange: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof RadioCardsField>;

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
	parameters: {
		// `Members` holds every member, and `Field` covers the states of the field.
		chromatic: { disableSnapshot: true },
	},
	// Remounts on a new `defaultValue`, since the value is uncontrolled.
	render: (args) => <RadioCardsField key={String(args.defaultValue)} {...args} />,
};

/**
 * `RadioCardsField.Multiple` renders `RadioCards.Multiple`, whose root is a `role="group"`. That
 * role takes no `aria-invalid`, so the legend and the message carry the status there, while
 * `RadioCardsField` sets `aria-invalid` on its radio group.
 */
export const Members: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-lg ${styles.stack}`}>
			<RadioCardsField
				label="Signal"
				description="What the panel plots."
				items={SIGNALS}
				columns={3}
				defaultValue="traces"
				testId="signal"
			/>
			<RadioCardsField
				label="Current tool"
				items={TOOLS}
				columns={2}
				required
				error="Pick the tool you use today."
				testId="tool"
			/>
			<RadioCardsField.Multiple
				label="Tools to import"
				description="Pick every tool you want to import from."
				items={TOOLS}
				columns={2}
				defaultValue={['grafana']}
				testId="tools"
			/>
			<RadioCardsField.Multiple
				label="Alert channels"
				items={CHANNELS}
				columns={2}
				required
				error="Pick at least one channel."
				testId="channels"
			/>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const signal = canvas.getByRole('radiogroup', { name: 'Signal' });

		await expect(canvas.getByRole('group', { name: 'Signal' })).toHaveAccessibleDescription(
			'What the panel plots.',
		);
		await expect(signal).not.toHaveAttribute('aria-invalid');
		await expect(within(signal).getByRole('radio', { name: 'Traces' })).toHaveAttribute(
			'aria-checked',
			'true',
		);

		const metrics = within(signal).getByRole('radio', { name: 'Metrics' });

		await userEvent.click(metrics);
		await expect(metrics).toHaveAttribute('aria-checked', 'true');

		const tool = canvas.getByRole('radiogroup', { name: 'Current tool' });

		await expect(tool).toHaveAttribute('aria-invalid', 'true');
		await expect(tool).toHaveAttribute('aria-required', 'true');
		await expect(canvas.getByRole('group', { name: 'Current tool' })).toHaveAccessibleDescription(
			'Pick the tool you use today.',
		);

		const tools = canvas.getByTestId('tools');

		await expect(tools).toHaveAttribute('role', 'group');
		await expect(tools).toHaveAccessibleName('Tools to import');
		await expect(tools).not.toHaveAttribute('aria-invalid');
		await expect(
			canvas.getAllByRole('group', { name: 'Tools to import' })[0],
		).toHaveAccessibleDescription('Pick every tool you want to import from.');

		const elastic = within(tools).getByRole('checkbox', { name: 'Elastic' });

		await userEvent.click(elastic);
		await expect(elastic).toHaveAttribute('aria-checked', 'true');
		await expect(
			within(tools).getByRole('checkbox', { name: 'Grafana / Prometheus' }),
		).toHaveAttribute('aria-checked', 'true');

		const channels = canvas.getByTestId('channels');

		await expect(channels).not.toHaveAttribute('aria-invalid');
		await expect(canvas.getByTestId('channels-message')).toHaveTextContent(
			'Pick at least one channel.',
		);
		await expect(
			canvas.getAllByRole('group', { name: 'Alert channels' })[0],
		).toHaveAccessibleDescription('Pick at least one channel.');
	},
};
