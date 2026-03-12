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
import { overlayComponentArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DrawerOverlay> = {
	title: 'Components/Drawer/DrawerOverlay',
	component: DrawerOverlay,
	argTypes: overlayComponentArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrawerOverlay>;

export const Default: Story = {
	render: (args) => (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open drawer
				</Button>
			</DrawerTrigger>
			<DrawerPortal>
				<DrawerOverlay {...args} />
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Drawer overlay</DrawerTitle>
					</DrawerHeader>
					<DrawerDescription>
						<p className="text-sm">
							The overlay dims the background and blocks interaction with the page while the drawer
							is open.
						</p>
					</DrawerDescription>
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	),
};
