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
	title: 'Primitive Components/Drawer/DrawerClose',
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
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary} size="md">
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
					<Button variant={ButtonVariant.Ghost} color="secondary" size="md">
						Cancel
					</Button>
					<DrawerClose {...args}>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary} size="md">
							Close
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	),
};
