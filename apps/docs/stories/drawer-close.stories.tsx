import {
	Button,
	ButtonColor,
	ButtonVariant,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { closeArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DrawerClose> = {
	title: 'Components/Drawer/DrawerClose',
	component: DrawerClose,
	argTypes: closeArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrawerClose>;

export const Default: Story = {
	args: {
		asChild: true,
	},
	render: (args) => (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open drawer
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Drawer with custom close</DrawerTitle>
				</DrawerHeader>
				<DrawerDescription>
					This drawer uses DrawerClose in the footer for the close action.
				</DrawerDescription>
				<DrawerFooter>
					<Button variant={ButtonVariant.Ghost} color="secondary">
						Cancel
					</Button>
					<DrawerClose {...args}>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
							Close
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	),
};
