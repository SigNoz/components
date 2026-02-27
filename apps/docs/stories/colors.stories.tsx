import type { Meta, StoryObj } from '@storybook/react-vite';
import ColorPalette from '../components/ColorPalette.jsx';

const meta: Meta<typeof ColorPalette> = {
	title: 'Design System/Colors',
	component: ColorPalette,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
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
