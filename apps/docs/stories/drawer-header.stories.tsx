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
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { headerArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DrawerHeader> = {
	title: 'Primitive Components/Drawer/DrawerHeader',
	component: DrawerHeader,
	argTypes: headerArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrawerHeader>;

export const Default: Story = {
	render: (args) => (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open drawer
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader {...args}>
					<DrawerTitle>Drawer header</DrawerTitle>
				</DrawerHeader>
				<DrawerDescription>
					<Typography size="sm">
						The header typically contains the title and optional actions.
					</Typography>
				</DrawerDescription>
			</DrawerContent>
		</Drawer>
	),
};
