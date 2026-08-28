import { RadioGroup, RadioGroupItem } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Radio Group',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by two Base UI namespaces — RadioGroup for the group and Radio for each item. The loop prop has no equivalent and was dropped.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="RadioGroup + Radio.Root / Radio.Indicator"
			notes={[
				'Items come from a second namespace (Radio) rather than being a part of the group.',
				'The loop prop has no Base UI equivalent and was dropped; arrow-key navigation still wraps.',
				'BREAKING: id on an item now lands on the hidden radio input, not the interactive root. Use testId to target the visual element.',
			]}
		>
			<Demo title="Single choice">
				<RadioGroup defaultValue="logs">
					<RadioGroupItem value="logs">Logs</RadioGroupItem>
					<RadioGroupItem value="traces">Traces</RadioGroupItem>
					<RadioGroupItem value="metrics">Metrics</RadioGroupItem>
				</RadioGroup>
			</Demo>

			<Demo title="Disabled item">
				<RadioGroup defaultValue="logs">
					<RadioGroupItem value="logs">Logs</RadioGroupItem>
					<RadioGroupItem value="traces" disabled>
						Traces
					</RadioGroupItem>
				</RadioGroup>
			</Demo>
		</BaseUIPanel>
	),
};
