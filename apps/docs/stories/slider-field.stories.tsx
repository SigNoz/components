import { SliderField } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { fieldLabelArgTypes, fieldParameters } from './shared/field-arg-types.js';
import { waitForEffects } from './shared/play.js';
import { sliderArgTypes } from './shared/slider-arg-types.js';
import styles from './slider-field.stories.module.css';

/**
 * `SliderField` is `Slider` inside a `Field`, in one element. `SliderField.Range` is `Slider.Range`
 * inside a `Field.Group`. They are documented on the `Slider` page, `slider.mdx`, so this file has
 * no docs page of its own.
 */
const meta: Meta<typeof SliderField> = {
	title: 'Primitive Components/Field/SliderField',
	component: SliderField,
	tags: ['!autodocs'],
	parameters: fieldParameters,
	argTypes: {
		...sliderArgTypes,
		...fieldLabelArgTypes,
		required: {
			control: 'boolean',
			description:
				'Marks the label with an asterisk, and nothing else: a slider always holds a value, so the thumb takes no `required` or `aria-required`.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		id: {
			control: 'text',
			description: 'Forwarded to the root of the slider. The label names the thumb without it.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the root of the slider as `data-testid`, and the prefix of its parts: `${testId}-track`, `${testId}-indicator`, `${testId}-thumb-${index}` and `${testId}-mark-${value}`. The field parts take it as their prefix too: `${testId}-label`, `${testId}-label-tooltip`, `${testId}-description` and `${testId}-message`. The field root gets no `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		label: 'Sampling rate',
		description: 'Share of requests that are traced.',
		color: 'primary',
		defaultValue: 40,
		tooltip: true,
		onChange: fn(),
		onAfterChange: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof SliderField>;

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	parameters: {
		// `Members` holds the range too, and `Field` covers the states of the field.
		chromatic: { disableSnapshot: true },
	},
	// Remounts on a new `defaultValue`, since the value is uncontrolled.
	render: (args) => <SliderField key={String(args.defaultValue)} {...args} />,
};

/**
 * `SliderField.Range` renders `Slider.Range` inside a `Field.Group`: the label is the legend of
 * the fieldset, the range takes the same name, and its thumbs keep `Minimum` and `Maximum`. A
 * single slider puts `aria-invalid` on its thumb for a `danger` status, and the range puts it on
 * both thumbs, since `role="group"` takes none.
 */
export const Members: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-lg ${styles.stack}`}>
			<SliderField
				label="Sampling rate"
				description="Share of requests that are traced."
				color="primary"
				defaultValue={40}
				testId="rate"
			/>
			<SliderField
				label="Error budget"
				color="primary"
				defaultValue={95}
				required
				error="Use a budget of 80 or less."
				testId="budget"
			/>
			<SliderField.Range
				label="Duration"
				description="How long a request ran."
				color="primary"
				max={1000}
				defaultValue={[200, 700]}
				formatValue={(value) => `${value} ms`}
				testId="duration"
			/>
			<SliderField.Range
				label="Payload size"
				color="primary"
				max={1000}
				defaultValue={[100, 900]}
				error="Keep the range under 500 KB."
				testId="payload"
			/>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const rate = await canvas.findByRole('slider', { name: 'Sampling rate' });

		await expect(rate).toHaveAccessibleDescription('Share of requests that are traced.');
		await expect(rate).not.toHaveAttribute('aria-invalid');

		const budget = await canvas.findByRole('slider', { name: 'Error budget' });

		await expect(budget).toHaveAccessibleDescription('Use a budget of 80 or less.');
		await expect(budget).toHaveAttribute('aria-invalid', 'true');
		// A slider has no `aria-required`, so the asterisk is all `required` draws.
		await expect(budget).not.toHaveAttribute('aria-required');

		const duration = canvas.getByTestId('duration');
		const durationThumbs = within(duration);

		await expect(
			await durationThumbs.findByRole('slider', { name: 'Minimum' }),
		).toBeInTheDocument();
		await expect(duration).toHaveAccessibleName('Duration');
		await expect(canvas.getAllByRole('group', { name: 'Duration' })[0]).toHaveAccessibleDescription(
			'How long a request ran.',
		);
		await expect(durationThumbs.getByRole('slider', { name: 'Maximum' })).toHaveAttribute(
			'aria-valuetext',
			'700 ms',
		);

		const payload = within(canvas.getByTestId('payload'));

		await expect(await payload.findByRole('slider', { name: 'Minimum' })).toHaveAttribute(
			'aria-invalid',
			'true',
		);
		await expect(payload.getByRole('slider', { name: 'Maximum' })).toHaveAttribute(
			'aria-invalid',
			'true',
		);
		await expect(canvas.getByTestId('payload')).not.toHaveAttribute('aria-invalid');

		await waitForEffects();
		rate.focus();
		await userEvent.keyboard('{ArrowRight}');

		await expect(rate).toHaveAttribute('aria-valuenow', '41');
	},
};
