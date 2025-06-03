import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import ColorPalette from '../components/ColorPalette';

const meta: Meta<typeof ColorPalette> = {
	title: 'Design System/Colors',
	component: ColorPalette,
	tags: ['autodocs'],
	parameters: {
		backgrounds: {
			default: 'dark',
			values: [{ name: 'dark', value: '#000' }],
		},
	},
};

export default meta;
type Story = StoryObj<typeof ColorPalette>;

export const Default: Story = {
	render: () => <ColorPalette />,
};
