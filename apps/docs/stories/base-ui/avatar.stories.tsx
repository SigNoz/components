import { Avatar } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Avatar',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by Avatar.Root / Image / Fallback. The image only swaps in once it has loaded, so a broken src no longer flashes before the fallback.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="Avatar.Root / Avatar.Image / Avatar.Fallback"
			notes={[
				'The fallback renders until the image has actually loaded, so a slow or broken src no longer flashes.',
				'Colour, shape and size props are unchanged.',
			]}
		>
			<Demo title="Fallback initials">
				<Avatar>YM</Avatar>
				<Avatar color="forest">AB</Avatar>
				<Avatar color="amber">CD</Avatar>
				<Avatar color="cherry">EF</Avatar>
			</Demo>

			<Demo title="Shapes">
				<Avatar>YM</Avatar>
				<Avatar shape="square" color="amber">
					CD
				</Avatar>
			</Demo>
		</BaseUIPanel>
	),
};

export const BrokenImage: StoryObj = {
	name: 'Broken image',
	render: () => (
		<BaseUIPanel
			parts="Avatar.Image with an unreachable src"
			notes={[
				'Avatar.Image mounts only after the load succeeds — the fallback stays put instead of flashing empty.',
			]}
		>
			<Demo title="Unreachable src">
				<Avatar src="https://broken.invalid/x.png" color="cherry">
					EF
				</Avatar>
				<Avatar src="https://broken.invalid/y.png">YM</Avatar>
			</Demo>
		</BaseUIPanel>
	),
};
