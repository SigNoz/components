import { Badge } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Badge',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					"Radix's Slot is gone; the asChild prop now runs on Base UI's useRender through our AsChild helper. The public prop is unchanged.",
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="useRender (via our AsChild helper)"
			notes={[
				'asChild behaves as before: the child becomes the rendered element and badge props merge onto it.',
				'className is joined rather than replaced, and event handlers from both sides run.',
			]}
		>
			<Demo title="Colours">
				<Badge>Default</Badge>
				<Badge color="forest">Healthy</Badge>
				<Badge color="cherry">Critical</Badge>
				<Badge color="amber" variant="outline">
					Warning
				</Badge>
			</Demo>

			<Demo title="Closable" note="stays a span">
				<Badge closable>Dismissible</Badge>
				<Badge color="forest" closable>
					service=frontend
				</Badge>
			</Demo>
		</BaseUIPanel>
	),
};

export const AsChild: StoryObj = {
	name: 'asChild',
	render: () => (
		<BaseUIPanel
			parts="useRender"
			notes={['The anchor keeps its own semantics — badge styling is applied to it directly.']}
		>
			<Demo title="Badge as anchor" note="renders <a>">
				<Badge asChild color="forest">
					<a href="https://signoz.io" target="_blank" rel="noreferrer">
						Linked badge
					</a>
				</Badge>
			</Demo>
		</BaseUIPanel>
	),
};
