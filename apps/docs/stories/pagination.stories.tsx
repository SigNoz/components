import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

const ExampleComponent = ({ text = 'Example Component' }: { text: string }) => (
	<h1>{text}</h1>
);

const meta: Meta<typeof ExampleComponent> = {
	title: 'Components/Pagination',
	component: ExampleComponent,
	argTypes: {
		text: {
			control: { type: 'text' },
		},
	},
};

export default meta;

type Story = StoryObj<typeof ExampleComponent>;

export const Default: Story = {
	render: (args) => <ExampleComponent {...args} />,
	args: {
		text: 'Default Example',
	},
};

export const CustomText: Story = {
	render: (args) => <ExampleComponent {...args} />,
	args: {
		text: 'Custom Example Text',
	},
};
