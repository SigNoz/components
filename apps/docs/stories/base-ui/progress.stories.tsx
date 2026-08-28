import { Progress } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Progress',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by Progress.Root / Track / Indicator. The component gained a Track part and the indicator is width-positioned.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="Progress.Root / Progress.Track / Progress.Indicator"
			notes={[
				'Base UI adds a Track part between the root and the indicator; the indicator is positioned by width rather than by transform.',
				'The percent, showInfo and steps props are unchanged.',
			]}
		>
			<Demo title="Percent" block>
				<Progress percent={45} showInfo />
				<Progress percent={80} showInfo />
			</Demo>

			<Demo title="Steps" block>
				<Progress percent={85} steps={4} />
			</Demo>
		</BaseUIPanel>
	),
};
