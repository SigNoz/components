import {
	Button,
	ButtonColor,
	ButtonVariant,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { triggerArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DrawerTrigger> = {
	title: 'Components/Drawer/DrawerTrigger',
	component: DrawerTrigger,
	argTypes: triggerArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrawerTrigger>;

export const Default: Story = {
	args: {
		asChild: true,
	},
	render: (args) => (
		<Drawer>
			<DrawerTrigger {...args}>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open drawer
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Drawer with custom trigger</DrawerTitle>
				</DrawerHeader>
				<DrawerDescription>
					Use DrawerTrigger asChild to wrap any interactive element that should open the drawer.
				</DrawerDescription>
			</DrawerContent>
		</Drawer>
	),
};
