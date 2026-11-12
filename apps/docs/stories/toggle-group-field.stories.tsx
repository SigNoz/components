import {
	ToggleGroupColor,
	ToggleGroupField,
	type ToggleGroupItemProps,
	ToggleGroupSize,
	ToggleGroupVariant,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { fieldLabelArgTypes, fieldParameters } from './shared/field-arg-types.js';
import { toggleGroupArgTypes } from './shared/toggle-group-arg-types.js';
import styles from './toggle-group-field.stories.module.css';

const CHART_ITEMS: ToggleGroupItemProps[] = [
	{ value: 'line', label: 'Line' },
	{ value: 'bar', label: 'Bar' },
	{ value: 'area', label: 'Area' },
];

const LAYOUT_ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
	{ value: 'table', label: 'Table' },
];

/**
 * `ToggleGroupField` is `ToggleGroup` inside a `Field.Group`, in one element. It is documented on
 * the `ToggleGroup` page, `toggle-group.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof ToggleGroupField> = {
	title: 'Primitive Components/Field/ToggleGroupField',
	component: ToggleGroupField,
	tags: ['!autodocs'],
	parameters: fieldParameters,
	argTypes: {
		...toggleGroupArgTypes,
		...fieldLabelArgTypes,
		required: {
			control: 'boolean',
			description:
				'Marks the legend with an asterisk, and nothing else: a `role="group"` takes no `aria-required`, so the bar sets none.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		'aria-label': {
			control: 'text',
			description:
				'A name of your own for the bar. It stays on the root, and the list of buttons no longer takes the legend as its name.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-labelledby': {
			control: 'text',
			description:
				'The id of an element that names the bar in place of the legend. It stays on the root, and the list of buttons no longer takes the legend as its name.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'Forwarded to the root of the bar. The `<fieldset>` gets none.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the root of the bar as `data-testid`. It names every button too, as `${testId}-button-${value}`, unless the item carries a `testId` of its own. The field parts take it as their prefix: `${testId}-label`, `${testId}-label-tooltip`, `${testId}-description` and `${testId}-message`. The `<fieldset>` gets no `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		label: 'Chart type',
		description: 'How the series are drawn.',
		type: 'single',
		variant: ToggleGroupVariant.Outlined,
		color: ToggleGroupColor.Secondary,
		size: ToggleGroupSize.MD,
		items: CHART_ITEMS,
		defaultValue: 'line',
		onChange: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof ToggleGroupField>;

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
	// Remounts on a new `defaultValue` or `type`, since the value is uncontrolled.
	render: (args) => (
		<ToggleGroupField key={`${args.type}-${String(args.defaultValue)}`} {...args} />
	),
};

/**
 * The legend is the label of the group, and the `role="group"` list of the bar takes it as its
 * name. That role takes neither `aria-required` nor `aria-invalid`, so `required` draws the
 * asterisk and a `danger` status shows on the legend and the message, and turns the outline of the
 * bar red.
 */
export const States: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-lg ${styles.stack}`}>
			<ToggleGroupField
				label="Chart type"
				description="How the series are drawn."
				type="single"
				variant={ToggleGroupVariant.Outlined}
				color={ToggleGroupColor.Secondary}
				size={ToggleGroupSize.MD}
				items={CHART_ITEMS}
				defaultValue="line"
				required
				testId="chart"
			/>
			<ToggleGroupField
				label="Layout"
				description="How the rows are drawn."
				type="multiple"
				variant={ToggleGroupVariant.Outlined}
				color={ToggleGroupColor.Secondary}
				size={ToggleGroupSize.MD}
				items={LAYOUT_ITEMS}
				error="Pick at least one layout."
				testId="layout"
			/>
			<ToggleGroupField
				label="Density"
				type="single"
				variant={ToggleGroupVariant.Outlined}
				color={ToggleGroupColor.Secondary}
				size={ToggleGroupSize.MD}
				items={LAYOUT_ITEMS}
				defaultValue="list"
				disabled
				disabledTooltip="Set by your workspace"
				testId="density"
			/>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const chart = canvas.getAllByRole('group', { name: 'Chart type' });

		await expect(chart).toHaveLength(2);
		await expect(chart[0]).toHaveAccessibleDescription('How the series are drawn.');
		await expect(
			within(canvas.getByTestId('chart')).getByRole('button', { name: 'Line' }),
		).toHaveAttribute('aria-pressed', 'true');
		await expect(canvas.getByTestId('chart')).not.toHaveAttribute('aria-required');

		const layout = canvas.getAllByRole('group', { name: 'Layout' });

		// The message takes the place of the description in the same row.
		await expect(layout[0]).toHaveAccessibleDescription('Pick at least one layout.');
		await expect(canvas.getByTestId('layout-message')).toHaveTextContent(
			'Pick at least one layout.',
		);
		await expect(canvas.queryByTestId('layout-description')).not.toBeInTheDocument();

		for (const group of layout) {
			await expect(group).not.toHaveAttribute('aria-invalid');
		}

		await expect(
			within(canvas.getByTestId('density')).getByRole('button', { name: 'Grid' }),
		).toHaveAttribute('aria-disabled', 'true');
	},
};
