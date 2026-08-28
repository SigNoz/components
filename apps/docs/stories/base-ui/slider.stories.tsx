import { Slider } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Slider',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by Slider Root / Control / Track / Indicator / Thumb. The slider role now sits on a native input[type=range] inside each thumb.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="Slider.Root / Control / Track / Indicator / Thumb"
			notes={[
				'Base UI adds a Control wrapper and renames Range to Indicator.',
				'Each thumb contains a native input[type=range], so the slider role and value now come from the input.',
			]}
		>
			<Demo title="Single value" block>
				<Slider defaultValue={40} />
			</Demo>

			<Demo title="Disabled" block>
				<Slider defaultValue={60} disabled />
			</Demo>
		</BaseUIPanel>
	),
};

export const Range: StoryObj = {
	name: 'Range',
	render: () => (
		<BaseUIPanel
			parts="Slider.Thumb, one per value"
			notes={['A range renders one thumb per value, each with its own native input.']}
		>
			<Demo title="Two thumbs" block>
				<Slider defaultValue={[20, 70]} range />
			</Demo>
		</BaseUIPanel>
	),
};
