import { SelectField, type SelectItemType } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { fieldLabelArgTypes, fieldParameters } from './shared/field-arg-types.js';
import { waitForEffects } from './shared/play.js';
import { selectArgTypes } from './shared/select-arg-types.js';
import styles from './select-field.stories.module.css';

const FRAMEWORKS: SelectItemType[] = [
	{ type: 'item', value: 'react', label: 'React' },
	{ type: 'item', value: 'vue', label: 'Vue' },
	{ type: 'item', value: 'angular', label: 'Angular' },
	{ type: 'item', value: 'svelte', label: 'Svelte' },
];

/**
 * `SelectField` is `Select` inside a `Field`, in one element. It is documented on the `Select`
 * page, `select.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof SelectField> = {
	title: 'Primitive Components/Field/SelectField',
	component: SelectField,
	tags: ['!autodocs'],
	parameters: fieldParameters,
	argTypes: {
		...selectArgTypes,
		...fieldLabelArgTypes,
		placeholder: {
			control: 'text',
			description:
				'What the trigger shows while nothing is selected. The label names the trigger, not the placeholder.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		multiple: {
			control: 'boolean',
			description:
				'Picks several values, shown as chips in the trigger. The trigger is then a `<div>`: the field still names it and focuses it when the label is clicked.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		'aria-label': {
			control: 'text',
			description:
				'Not needed: the label names the trigger. A name of your own still wins over the label.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-labelledby': {
			control: 'text',
			description:
				'Not needed: the label names the trigger. A name of your own still wins over the label.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description:
				'Forwarded to the trigger. Without it the field generates one, and its label points at it.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the trigger as `data-testid`, and the stem every row and chip is named from. The field parts take it as their prefix: `${testId}-label`, `${testId}-label-tooltip`, `${testId}-description` and `${testId}-message`. The field root gets no `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		label: 'Framework',
		description: 'The one the team builds with.',
		placeholder: 'Select a framework...',
		items: FRAMEWORKS,
		onChange: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof SelectField>;

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
	render: (args) => <SelectField {...args} />,
};

/**
 * The marker, the description and the status of the field, each wired to the trigger. The
 * message takes the place of the description in the same row, and only `danger` sets
 * `aria-invalid` and tints the border.
 */
export const States: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-lg ${styles.stack}`}>
			<SelectField
				label="Framework"
				required
				description="The one the team builds with."
				placeholder="Select a framework..."
				items={FRAMEWORKS}
			/>
			<SelectField
				label="Runtime"
				labelTooltip="Applies to new projects only."
				description="Where the service runs."
				placeholder="Select a runtime..."
				items={FRAMEWORKS}
			/>
			<SelectField
				label="Language"
				status="warning"
				message="This one is deprecated for new services."
				placeholder="Select a language..."
				items={FRAMEWORKS}
			/>
			<SelectField
				label="Region"
				status="success"
				message="Available in your plan."
				placeholder="Select a region..."
				items={FRAMEWORKS}
			/>
			<SelectField
				label="Database"
				required
				error="Pick a database to continue."
				placeholder="Select a database..."
				items={FRAMEWORKS}
			/>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const framework = await canvas.findByRole('combobox', { name: 'Framework' });

		await expect(framework).toHaveAttribute('aria-required', 'true');
		await expect(framework).not.toHaveAttribute('aria-invalid');
		await expect(framework).toHaveAccessibleDescription('The one the team builds with.');

		await expect(
			await canvas.findByRole('combobox', { name: 'Runtime' }),
		).toHaveAccessibleDescription('Where the service runs. Applies to new projects only.');

		const language = await canvas.findByRole('combobox', { name: 'Language' });

		await expect(language).toHaveAccessibleDescription('This one is deprecated for new services.');
		await expect(language).not.toHaveAttribute('aria-invalid');
		await expect(await canvas.findByRole('combobox', { name: 'Region' })).not.toHaveAttribute(
			'aria-invalid',
		);

		const database = await canvas.findByRole('combobox', { name: 'Database' });

		await expect(database).toHaveAttribute('aria-invalid', 'true');
		await expect(database).toHaveAttribute('aria-required', 'true');
		await expect(database).toHaveAccessibleDescription('Pick a database to continue.');
	},
};

/**
 * With `multiple` the trigger is a `<div>` and not a button. The field still names it, describes it
 * and marks it invalid, and a click on the label moves the focus to it.
 */
export const Multiple: Story = {
	args: {
		label: 'Frameworks',
		placeholder: 'Select frameworks...',
		description: 'Every one the team ships with.',
		error: 'Pick at least one framework.',
		multiple: true,
		defaultValue: ['react', 'vue'],
		testId: 'frameworks',
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
	render: (args) => <SelectField {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const trigger = await canvas.findByRole('combobox', { name: 'Frameworks' });

		await expect(trigger).toBeInstanceOf(HTMLDivElement);
		await expect(trigger).toHaveAttribute('aria-invalid', 'true');
		await expect(trigger).toHaveAccessibleDescription('Pick at least one framework.');
		await expect(canvas.getByTestId('frameworks-chip-react')).toBeInTheDocument();
		await expect(canvas.getByTestId('frameworks-chip-vue')).toBeInTheDocument();

		await userEvent.click(canvas.getByTestId('frameworks-label'));

		await expect(trigger).toHaveFocus();
		await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
	},
};
