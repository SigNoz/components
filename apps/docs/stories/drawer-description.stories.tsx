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
import { descriptionArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DrawerDescription> = {
	title: 'Components/Drawer/DrawerDescription',
	component: DrawerDescription,
	argTypes: descriptionArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrawerDescription>;

export const Default: Story = {
	args: {
		children: 'Are you sure you want to proceed? This action cannot be undone.',
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
					<DrawerTitle>Confirm action</DrawerTitle>
				</DrawerHeader>
				<DrawerDescription {...args} />
			</DrawerContent>
		</Drawer>
	),
};
