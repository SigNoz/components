import {
	Button,
	ButtonColor,
	ButtonVariant,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { footerArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DrawerFooter> = {
	title: 'Components/Drawer/DrawerFooter',
	component: DrawerFooter,
	argTypes: footerArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrawerFooter>;

export const Default: Story = {
	render: (args) => (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open drawer
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Delete this item</DrawerTitle>
				</DrawerHeader>
				<DrawerDescription>
					<p className="text-sm">
						Deleting this item cannot be undone and may affect related data.
					</p>
				</DrawerDescription>
				<DrawerFooter {...args}>
					<Button variant={ButtonVariant.Ghost} color="secondary">
						Cancel
					</Button>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Delete
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	),
};
