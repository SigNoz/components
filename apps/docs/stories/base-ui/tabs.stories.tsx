import { Tabs, TabsContent, TabsList, TabsRoot, TabsTrigger } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Tabs',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by Tabs Root / List / Tab / Panel / Indicator. The animated underline was a data-state MutationObserver and is now Tabs.Indicator.',
			},
		},
	},
};

export default meta;

const items = [
	{ key: 'logs', label: 'Logs', children: 'Logs panel' },
	{ key: 'traces', label: 'Traces', children: 'Traces panel' },
	{ key: 'metrics', label: 'Metrics', children: 'Metrics panel' },
];

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="Tabs.Root / List / Tab / Panel / Indicator"
			notes={[
				'The underline used to be positioned by a MutationObserver watching data-state; Base UI ships Tabs.Indicator for it.',
				'Base UI calls the parts Tab and Panel, but our TabsTrigger and TabsContent names are unchanged.',
			]}
		>
			<Demo title="Items API" wide block>
				<Tabs items={items} />
			</Demo>

			<Demo title="Disabled tab" wide block>
				<Tabs
					items={[
						{ key: 'logs', label: 'Logs', children: 'Logs panel' },
						{ key: 'traces', label: 'Traces', children: 'Traces panel', disabled: true },
					]}
				/>
			</Demo>
		</BaseUIPanel>
	),
};

export const Composed: StoryObj = {
	name: 'Composed',
	render: () => (
		<BaseUIPanel
			parts="TabsRoot / TabsList / TabsTrigger / TabsContent"
			notes={['The composed API is unchanged; the indicator comes from the list.']}
		>
			<Demo title="Subcomponents" wide block>
				<TabsRoot defaultValue="logs">
					<TabsList>
						<TabsTrigger value="logs">Logs</TabsTrigger>
						<TabsTrigger value="traces">Traces</TabsTrigger>
					</TabsList>
					<TabsContent value="logs">Logs panel</TabsContent>
					<TabsContent value="traces">Traces panel</TabsContent>
				</TabsRoot>
			</Demo>
		</BaseUIPanel>
	),
};
