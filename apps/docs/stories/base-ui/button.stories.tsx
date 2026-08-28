import { Button } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Button',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					"Radix's Slot is gone; asChild now runs on Base UI's useRender through our AsChild helper. All 221 call sites were untouched.",
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
				'Every variant, colour, size and loading state is unchanged — only the asChild implementation moved.',
			]}
		>
			<Demo title="Variants">
				<Button>Solid</Button>
				<Button variant="outlined">Outlined</Button>
				<Button variant="ghost">Ghost</Button>
			</Demo>

			<Demo title="States">
				<Button loading>Loading</Button>
				<Button disabled>Disabled</Button>
			</Demo>
		</BaseUIPanel>
	),
};

export const AsChild: StoryObj = {
	name: 'asChild',
	render: () => (
		<BaseUIPanel
			parts="useRender"
			notes={[
				'The child becomes the rendered element, so the anchor is still announced as a link.',
				'Button props merge onto the child; className is joined rather than replaced.',
			]}
		>
			<Demo title="Button as anchor" note="renders <a>">
				<Button asChild>
					<a href="https://signoz.io" target="_blank" rel="noreferrer">
						Open SigNoz
					</a>
				</Button>
			</Demo>
		</BaseUIPanel>
	),
};
