import { Divider } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Divider',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'The childless divider is a real Separator; the labelled form stays a plain element because a separator cannot hold content.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="Separator (childless) / plain element (labelled)"
			notes={[
				'Without children the divider renders Base UI’s Separator, which carries the separator role.',
				'With children it stays a plain element — a separator is not allowed to contain content.',
			]}
		>
			<Demo title="Plain" block>
				<Divider />
				<Divider dashed />
			</Demo>

			<Demo title="Labelled" block>
				<Divider>OR</Divider>
			</Demo>
		</BaseUIPanel>
	),
};
