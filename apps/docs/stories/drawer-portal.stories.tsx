import {
	Button,
	ButtonColor,
	ButtonVariant,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { portalArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DrawerPortal> = {
	title: 'Components/Drawer/DrawerPortal',
	component: DrawerPortal,
	argTypes: portalArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrawerPortal>;

export const Default: Story = {
	render: (args) => (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open drawer
				</Button>
			</DrawerTrigger>
			<DrawerPortal {...args}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Drawer portal</DrawerTitle>
					</DrawerHeader>
					<DrawerDescription>
						<p className="text-sm">
							The portal renders the drawer content and overlay outside the regular DOM tree.
						</p>
					</DrawerDescription>
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	),
};
