import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@signozhq/button';
import { ArrowRight, Plus } from 'lucide-react'; // Assuming you're using lucide icons

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	argTypes: {
		backgroundColor: {
			control: 'text',
			description: 'Tailwind background color class (e.g., "robin-500")',
		},
		textColor: {
			control: 'text',
			description: 'Tailwind text color class (e.g., "white")',
		},
		border: {
			control: 'text',
			description: 'Tailwind border class (e.g., "border-gray-200")',
		},
		width: {
			control: 'text',
			description: 'Tailwind width class (e.g., "full", "32")',
		},
		size: {
			control: { type: 'select' },
			options: ['xs', 'sm', 'md', 'lg'],
		},
		disabled: {
			control: 'boolean',
		},
		asChild: {
			control: 'boolean',
		},
	},
	parameters: {
		design: [
			{
				name: 'Figma',
				type: 'figma',
				url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=12-739',
			},
			{
				name: 'Spec',
				type: 'figma',
				url: 'https://www.figma.com/board/uJOS4p4BNG1rLryBceR3YV/Untitled?node-id=6-155&t=2rVCYOnxaIjupEqA-4',
			},
		],
	},
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
	render: (args) => <Button {...args} />,
	args: {
		children: 'Button',
		backgroundColor: 'robin-500',
		textColor: 'white',
		size: 'md',
		onClick: () => {
			alert('It works!');
		},
	},
};

export const ExtraSmall: Story = {
	render: (args) => <Button {...args} />,
	args: {
		...Default.args,
		children: 'Extra Small Button',
		size: 'xs',
	},
};

export const Small: Story = {
	render: (args) => <Button {...args} />,
	args: {
		...Default.args,
		children: 'Small Button',
		size: 'sm',
	},
};

export const Medium: Story = {
	render: (args) => <Button {...args} />,
	args: {
		...Default.args,
		children: 'Medium Button',
		size: 'md',
	},
};

export const Large: Story = {
	render: (args) => <Button {...args} />,
	args: {
		...Default.args,
		children: 'Large Button',
		size: 'lg',
	},
};

export const WithIcons: Story = {
	render: (args) => <Button {...args} />,
	args: {
		...Default.args,
		children: 'Create New',
		prefixIcon: <Plus />,
		suffixIcon: <ArrowRight />,
	},
};

export const WithIconsAllSizes: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Button size="xs" prefixIcon={<Plus />} suffixIcon={<ArrowRight />}>
				Extra Small
			</Button>
			<Button size="sm" prefixIcon={<Plus />} suffixIcon={<ArrowRight />}>
				Small
			</Button>
			<Button size="md" prefixIcon={<Plus />} suffixIcon={<ArrowRight />}>
				Medium
			</Button>
			<Button size="lg" prefixIcon={<Plus />} suffixIcon={<ArrowRight />}>
				Large
			</Button>
		</div>
	),
};

export const CustomStyle: Story = {
	render: (args) => <Button {...args} />,
	args: {
		...Default.args,
		children: 'Custom Style',
		backgroundColor: 'cherry-500',
		textColor: 'vanilla-100',
		border: 'border-cherry-600',
		width: '32',
	},
};

export const Disabled: Story = {
	render: (args) => <Button {...args} />,
	args: {
		...Default.args,
		children: 'Disabled Button',
		disabled: true,
	},
};
