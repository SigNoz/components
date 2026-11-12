import { SwitchField } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { fieldLabelArgTypes, fieldParameters } from './shared/field-arg-types.js';
import { waitForEffects } from './shared/play.js';
import { switchArgTypes } from './shared/switch-arg-types.js';
import styles from './switch-field.stories.module.css';

// The switch has no text of its own in a field: `label` and `description` take that place, so the
// props that lay the text out are not accepted.
const {
	children: _children,
	textPlacement: _textPlacement,
	textOverflow: _textOverflow,
	width: _width,
	maxWidth: _maxWidth,
	containerTestId: _containerTestId,
	...switchControlArgTypes
} = switchArgTypes ?? {};

/**
 * `SwitchField` is `Switch` inside a `Field`, in one element. It is documented on the `Switch`
 * page, `switch.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof SwitchField> = {
	title: 'Primitive Components/Field/SwitchField',
	component: SwitchField,
	tags: ['!autodocs'],
	parameters: fieldParameters,
	argTypes: {
		...switchControlArgTypes,
		...fieldLabelArgTypes,
		id: {
			control: 'text',
			description:
				'Lands on the switch input. Without it the field generates one, and its label points at it.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-label': {
			control: 'text',
			description: 'Not needed: `label` is the accessible name of the switch.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the switch itself as `data-testid`. The field parts take it as their prefix: `${testId}-label`, `${testId}-label-tooltip`, `${testId}-description` and `${testId}-message`. The field root gets no `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		color: 'primary',
		label: 'Send alerts',
		description: 'Email the on-call channel when a rule fires.',
		onChange: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof SwitchField>;

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	parameters: {
		// `States` holds the states of the field, and `Field` covers how they look.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => <SwitchField {...args} />,
};

/**
 * The marker, the description and the status of the field, each wired to the switch. The message
 * takes the place of the description in the same row, and only `danger` sets `aria-invalid`. A
 * switch has no frame, so `danger` draws a ring around the track, and the label and the message
 * carry every status.
 */
export const States: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-lg ${styles.stack}`}>
			<SwitchField
				color="primary"
				label="Send alerts"
				required
				description="Email the on-call channel when a rule fires."
			/>
			<SwitchField
				color="primary"
				label="Weekly digest"
				labelTooltip="Sent on Monday morning."
				description="A summary of last week."
			/>
			<SwitchField
				color="primary"
				label="Mute alerts at night"
				status="warning"
				message="No quiet hours are set up yet."
			/>
			<SwitchField
				color="primary"
				label="Share usage data"
				status="success"
				message="Sharing is on for this workspace."
			/>
			<SwitchField
				color="primary"
				label="Accept the data processing terms"
				required
				error="Turn this on to continue."
			/>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const alerts = canvas.getByRole('switch', { name: 'Send alerts' });

		await expect(alerts).toHaveAttribute('aria-required', 'true');
		await expect(alerts).not.toHaveAttribute('aria-invalid');
		await expect(alerts).toHaveAccessibleDescription(
			'Email the on-call channel when a rule fires.',
		);

		await expect(canvas.getByRole('switch', { name: 'Weekly digest' })).toHaveAccessibleDescription(
			'A summary of last week. Sent on Monday morning.',
		);

		const quiet = canvas.getByRole('switch', { name: 'Mute alerts at night' });

		await expect(quiet).toHaveAccessibleDescription('No quiet hours are set up yet.');
		await expect(quiet).not.toHaveAttribute('aria-invalid');
		await expect(canvas.getByRole('switch', { name: 'Share usage data' })).not.toHaveAttribute(
			'aria-invalid',
		);

		const terms = canvas.getByRole('switch', { name: 'Accept the data processing terms' });

		await expect(terms).toHaveAttribute('aria-invalid', 'true');
		await expect(terms).toHaveAttribute('aria-required', 'true');
		await expect(terms).toHaveAccessibleDescription('Turn this on to continue.');
	},
};

/**
 * The label above the switch, the switch and the space key all toggle it, and `onChange` gets the
 * new state each time.
 */
export const Toggling: Story = {
	args: {
		description: undefined,
	},
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: (args) => <SwitchField {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const control = canvas.getByRole('switch', { name: 'Send alerts' });

		await userEvent.click(canvas.getByText('Send alerts'));

		await expect(control).toBeChecked();
		await expect(args.onChange).toHaveBeenLastCalledWith(true);

		await userEvent.click(control);

		await expect(control).not.toBeChecked();
		await expect(args.onChange).toHaveBeenLastCalledWith(false);

		await userEvent.keyboard(' ');

		await expect(control).toBeChecked();
		await expect(args.onChange).toHaveBeenLastCalledWith(true);
		await expect(args.onChange).toHaveBeenCalledTimes(3);
	},
};
