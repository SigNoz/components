import { Checkbox } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Checkbox',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by Checkbox.Root / Indicator. The CheckedState union is preserved on top of Base UI’s separate checked and indeterminate props.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="Checkbox.Root / Checkbox.Indicator"
			notes={[
				'Base UI splits checked and indeterminate into two props; our single CheckedState value still covers both.',
				'The indicator is styled off data-checked rather than data-state="checked".',
			]}
		>
			<Demo title="States">
				<Checkbox defaultValue>Checked</Checkbox>
				<Checkbox>Off</Checkbox>
				<Checkbox value="indeterminate">Mixed</Checkbox>
			</Demo>

			<Demo title="Disabled">
				<Checkbox disabled defaultValue>
					Checked
				</Checkbox>
				<Checkbox disabled>Off</Checkbox>
			</Demo>
		</BaseUIPanel>
	),
};

export const Indeterminate: StoryObj = {
	name: 'Indeterminate',
	render: () => (
		<BaseUIPanel
			parts="Checkbox.Root indeterminate"
			notes={[
				'value="indeterminate" is translated to Base UI’s indeterminate prop, so the CheckedState union keeps working.',
			]}
		>
			<Demo title="Mixed selection">
				<Checkbox value="indeterminate">Some rows selected</Checkbox>
			</Demo>
		</BaseUIPanel>
	),
};
