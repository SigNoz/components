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
import { headerArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DrawerHeader> = {
	title: 'Components/Drawer/DrawerHeader',
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
					<p className="text-sm">The header typically contains the title and optional actions.</p>
				</DrawerDescription>
			</DrawerContent>
		</Drawer>
	),
};
