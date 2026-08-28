import { Button, DrawerWrapper, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Drawer',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Composed on our Dialog, so it moved to Base UI with the dialog swap. Base UI now ships a real Drawer primitive with swipe handling, which is a separate opportunity.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="our Dialog → Dialog.Root / Portal / Backdrop / Popup"
			notes={[
				'The drawer is our Dialog with a slide animation and a direction prop; it followed the primitive with no change of its own.',
				'Base UI 1.7 ships Drawer (root, provider, trigger, portal, popup, indent, handle). Adopting it would add swipe and gesture handling and let motion’s AnimatePresence go — a separate change.',
			]}
		>
			<Demo title="Directions">
				<DrawerWrapper trigger={<Button>From the right</Button>} direction="right" title="Settings">
					<Typography.Text>Slides in from the right.</Typography.Text>
				</DrawerWrapper>
				<DrawerWrapper
					trigger={<Button variant="outlined">From the bottom</Button>}
					direction="bottom"
					title="Filters"
				>
					<Typography.Text>Slides up from the bottom.</Typography.Text>
				</DrawerWrapper>
			</Demo>
		</BaseUIPanel>
	),
};
