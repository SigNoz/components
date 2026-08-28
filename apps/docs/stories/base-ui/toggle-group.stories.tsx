import { ToggleGroup, ToggleGroupItem } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Toggle Group',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by ToggleGroup plus Toggle for each item. Radix’s type="single" | "multiple" became a single multiple flag.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="ToggleGroup + Toggle (per item)"
			notes={[
				'Items are pressed toggles from the Toggle namespace rather than a part of the group.',
				'type="single" | "multiple" is translated to Base UI’s multiple flag; our type prop still works.',
			]}
		>
			<Demo title="Single">
				<ToggleGroup type="single" defaultValue="logs">
					<ToggleGroupItem value="logs">Logs</ToggleGroupItem>
					<ToggleGroupItem value="traces">Traces</ToggleGroupItem>
					<ToggleGroupItem value="metrics">Metrics</ToggleGroupItem>
				</ToggleGroup>
			</Demo>

			<Demo title="Multiple">
				<ToggleGroup type="multiple" defaultValue={['logs', 'metrics']}>
					<ToggleGroupItem value="logs">Logs</ToggleGroupItem>
					<ToggleGroupItem value="traces">Traces</ToggleGroupItem>
					<ToggleGroupItem value="metrics">Metrics</ToggleGroupItem>
				</ToggleGroup>
			</Demo>
		</BaseUIPanel>
	),
};
