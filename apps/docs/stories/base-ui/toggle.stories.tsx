import { Toggle } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Toggle',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by Base UI Toggle. The pressed state moved from data-state="on" to data-pressed.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="Toggle"
			notes={[
				'Styling keys off data-pressed; data-state="on" is gone.',
				'aria-pressed still reports the state, so anything asserting on the ARIA contract is unaffected.',
			]}
		>
			<Demo title="States">
				<Toggle defaultValue>Pressed</Toggle>
				<Toggle>Not pressed</Toggle>
				<Toggle disabled>Disabled</Toggle>
			</Demo>
		</BaseUIPanel>
	),
};
