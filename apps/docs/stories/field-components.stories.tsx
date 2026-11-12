import { Field, RadioGroup, type RadioGroupItemType } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fieldGroupArgTypes, fieldParameters } from './shared/field-arg-types.js';

/**
 * The static members of `Field`, grouped under `Field/Components` in the sidebar. They are
 * documented on the `Field` page, `field.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof Field.Group> = {
	title: 'Primitive Components/Field/Components',
	component: Field.Group,
	tags: ['!autodocs'],
	parameters: fieldParameters,
	argTypes: fieldGroupArgTypes,
	args: {
		label: 'Retention',
		description: 'How long the data is kept.',
	},
};

export default meta;

const RETENTION_ITEMS: RadioGroupItemType[] = [
	{ label: '7 days', value: '7' },
	{ label: '30 days', value: '30' },
	{ label: '90 days', value: '90' },
];

/**
 * `Field.Group` takes the props of `Field` except `htmlFor`, and its `children` are any number of
 * controls.
 */
export const Group: StoryObj<typeof Field.Group> = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	render: (args) => (
		<Field.Group {...args}>
			<RadioGroup color="primary" items={RETENTION_ITEMS} defaultValue="30" />
		</Field.Group>
	),
};
