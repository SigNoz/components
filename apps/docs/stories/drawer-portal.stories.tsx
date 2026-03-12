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

const meta: Meta<typeof DrawerPortal> = {
	title: 'Components/Drawer/DrawerPortal',
	component: DrawerPortal,
	argTypes: {
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the portal container.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: false,
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrawerPortal>;

export const Default: Story = {
	render: (args) => (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open drawer
				</Button>
			</DrawerTrigger>
			<DrawerPortal {...args}>
				<DrawerOverlay />
				<DrawerContent type="drawer">
					<DrawerHeader>
						<DrawerTitle>Drawer portal</DrawerTitle>
					</DrawerHeader>
					<DrawerDescription>
						<p className="text-sm">
							The portal renders the drawer content and overlay outside the regular DOM tree.
						</p>
					</DrawerDescription>
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	),
};

