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
import { titleArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DrawerTitle> = {
	title: 'Components/Drawer/DrawerTitle',
	component: DrawerTitle,
	argTypes: titleArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrawerTitle>;

export const Default: Story = {
	args: {
		children: 'Drawer title',
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
					<DrawerTitle {...args} />
				</DrawerHeader>
				<DrawerDescription>
					<p className="text-sm">The title labels the drawer content for assistive technologies.</p>
				</DrawerDescription>
			</DrawerContent>
		</Drawer>
	),
};
