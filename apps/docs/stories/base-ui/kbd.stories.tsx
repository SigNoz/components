import { Kbd } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Kbd',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					"Radix's Slot is gone; asChild now runs on Base UI's useRender through our AsChild helper.",
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
			notes={['Sizes and the active state are unchanged — only the asChild implementation moved.']}
		>
			<Demo title="Sizes">
				<Kbd size="sm">⌘</Kbd>
				<Kbd>K</Kbd>
				<Kbd size="lg">Enter</Kbd>
			</Demo>

			<Demo title="Active">
				<Kbd active>Esc</Kbd>
			</Demo>
		</BaseUIPanel>
	),
};

export const AsChild: StoryObj = {
	name: 'asChild',
	render: () => (
		<BaseUIPanel
			parts="useRender"
			notes={['The child element is rendered in place of the kbd, with our props merged onto it.']}
		>
			<Demo title="Kbd as span" note="renders <span>">
				<Kbd asChild active>
					<span title="rendered as a span">⌘K</span>
				</Kbd>
			</Demo>
		</BaseUIPanel>
	),
};
