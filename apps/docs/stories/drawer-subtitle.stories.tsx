import {
	Button,
	ButtonColor,
	ButtonVariant,
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerSubtitle,
	DrawerTitle,
	DrawerTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { subtitleArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DrawerSubtitle> = {
	title: 'Components/Drawer/DrawerSubtitle',
	component: DrawerSubtitle,
	argTypes: subtitleArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrawerSubtitle>;

export const Default: Story = {
	args: {
		children: 'Use DrawerSubtitle for supporting text under the title.',
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
					<DrawerTitle>Drawer title</DrawerTitle>
					<DrawerSubtitle {...args} />
				</DrawerHeader>
			</DrawerContent>
		</Drawer>
	),
};
