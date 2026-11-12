import { CheckboxField } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import styles from './checkbox-field.stories.module.css';
import { checkboxArgTypes } from './shared/checkbox-arg-types.js';
import { fieldLabelArgTypes, fieldParameters } from './shared/field-arg-types.js';
import { waitForEffects } from './shared/play.js';

// The field takes over `children` and `textOverflow`: its `label` is the text, and the text wraps.
const {
	children: _children,
	textOverflow: _textOverflow,
	...checkboxControlArgTypes
} = checkboxArgTypes ?? {};

// `labelIcon` is not a prop of `CheckboxField`: the box already sits where an icon would.
const { labelIcon: _labelIcon, ...checkboxLabelArgTypes } = fieldLabelArgTypes ?? {};

/**
 * `CheckboxField` is `Checkbox` inside a `Field`, in one element. It is documented on the
 * `Checkbox` page, `checkbox.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof CheckboxField> = {
	title: 'Primitive Components/Field/CheckboxField',
	component: CheckboxField,
	tags: ['!autodocs'],
	parameters: fieldParameters,
	argTypes: {
		...checkboxControlArgTypes,
		...checkboxLabelArgTypes,
		label: {
			control: 'text',
			description:
				'Required. The text next to the box, and the accessible name of the checkbox. Clicking it toggles. Nothing renders above the box: a checkbox with a heading above it is a group, so use `Field.Group`. It wraps to 2 lines, then ends with an ellipsis and a tooltip with the full text. An empty label renders `<No label>`.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		description: {
			control: 'text',
			description:
				'Neutral help text below the text, lined up with it and not with the box. A status message replaces it in the same row, so the field does not grow when an error appears.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		id: {
			control: 'text',
			description:
				'Lands on the hidden checkbox input. Without it the field generates one and points the text at it.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-label': {
			control: 'text',
			description: 'Not needed: `label` is the accessible name of the checkbox.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the checkbox itself as `data-testid`. The field parts take it as their prefix: `${testId}-label-tooltip`, `${testId}-description` and `${testId}-message`. There is no `${testId}-label`, since the checkbox owns its text, and the field root gets no `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		color: 'primary',
		label: 'I accept the terms of service',
		description: 'You can read them in your account settings.',
		onChange: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof CheckboxField>;

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
	render: (args) => <CheckboxField {...args} />,
};

/**
 * The marker, the description and the status of the field, each wired to the checkbox. The
 * message takes the place of the description in the same row, and only `danger` sets
 * `aria-invalid`.
 */
export const States: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-lg ${styles.stack}`}>
			<CheckboxField
				color="primary"
				label="Accept the terms of service"
				required
				description="You can read them in your account settings."
			/>
			<CheckboxField
				color="primary"
				label="Share usage data"
				labelTooltip="Counts only, never content."
				description="Helps us size the product."
			/>
			<CheckboxField
				color="primary"
				label="Send the weekly digest"
				status="warning"
				message="No digest channel is set up yet."
			/>
			<CheckboxField
				color="primary"
				label="Enable request tracing"
				status="success"
				message="Tracing is on for this workspace."
			/>
			<CheckboxField
				color="primary"
				label="Accept the privacy policy"
				required
				error="Accept the policy to continue."
			/>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const terms = canvas.getByRole('checkbox', { name: 'Accept the terms of service' });

		await expect(terms).toHaveAttribute('aria-required', 'true');
		await expect(terms).not.toHaveAttribute('aria-invalid');
		await expect(terms).toHaveAccessibleDescription('You can read them in your account settings.');

		await expect(
			canvas.getByRole('checkbox', { name: 'Share usage data' }),
		).toHaveAccessibleDescription('Helps us size the product. Counts only, never content.');

		const digest = canvas.getByRole('checkbox', { name: 'Send the weekly digest' });

		await expect(digest).toHaveAccessibleDescription('No digest channel is set up yet.');
		await expect(digest).not.toHaveAttribute('aria-invalid');
		await expect(
			canvas.getByRole('checkbox', { name: 'Enable request tracing' }),
		).not.toHaveAttribute('aria-invalid');

		const policy = canvas.getByRole('checkbox', { name: 'Accept the privacy policy' });

		await expect(policy).toHaveAttribute('aria-invalid', 'true');
		await expect(policy).toHaveAttribute('aria-required', 'true');
		await expect(policy).toHaveAccessibleDescription('Accept the policy to continue.');
	},
};

/**
 * The text next to the box toggles it, like the box itself. The info icon of `labelTooltip` only
 * explains, so a click on it leaves the checkbox as it is.
 */
export const Toggling: Story = {
	args: {
		label: 'Share usage data',
		labelTooltip: 'Counts only, never content.',
		description: undefined,
		testId: 'usage',
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
	render: (args) => <CheckboxField {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const checkbox = canvas.getByRole('checkbox', { name: 'Share usage data' });

		await userEvent.click(canvas.getByTestId('usage-label-tooltip'));

		await expect(checkbox).not.toBeChecked();
		await expect(args.onChange).not.toHaveBeenCalled();

		await userEvent.click(canvas.getByText('Share usage data'));

		await expect(checkbox).toBeChecked();
		await expect(args.onChange).toHaveBeenCalledTimes(1);
		await expect(args.onChange).toHaveBeenCalledWith(true);
	},
};
