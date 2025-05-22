import type { Meta, StoryObj } from '@storybook/react';
import IconGallery from '../components/IconGallery';

const meta: Meta<typeof IconGallery> = {
	title: 'Design System/Icons',
	component: IconGallery,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: { type: 'number', min: 12, max: 48, step: 4 },
			description: 'Size of the icons in pixels',
		},
		strokeWidth: {
			control: { type: 'number', min: 1, max: 4, step: 0.5 },
			description: 'Stroke width of the icons',
		},
		color: {
			control: 'color',
			description: 'Color of the icons',
		},
	},
};

export default meta;
type Story = StoryObj<typeof IconGallery>;

export const Default: Story = {
	args: {
		size: 32,
		strokeWidth: 2,
		color: 'currentColor',
	},
};

export const CustomColor: Story = {
	args: {
		size: 32,
		strokeWidth: 2,
		color: '#FF0000',
	},
};
