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

const meta: Meta<typeof DrawerContent> = {
	title: 'Components/Drawer/DrawerContent',
	component: DrawerContent,
	argTypes: {
		type: {
			control: 'select',
			options: ['drawer', 'panel'],
			description: 'Visual style of the content surface.',
			table: {
				category: 'Appearance',
				type: { summary: '"drawer" | "panel"' },
				defaultValue: { summary: 'drawer' },
			},
		},
		showOverlay: {
			control: 'boolean',
			description: 'Whether to render the overlay behind this content instance.',
			table: {
				category: 'Appearance',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the drawer content.',
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
type Story = StoryObj<typeof DrawerContent>;

export const Default: Story = {
	args: {
		type: 'drawer',
		showOverlay: true,
	},
	render: (args) => (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open drawer
				</Button>
			</DrawerTrigger>
			<DrawerContent {...args}>
				<DrawerHeader>
					<DrawerTitle>Drawer content</DrawerTitle>
				</DrawerHeader>
				<DrawerDescription>
					<p className="text-sm">
						This story focuses on the DrawerContent surface and its layout-related props.
					</p>
				</DrawerDescription>
				<DrawerFooter>
					<Button variant={ButtonVariant.Ghost} color="secondary">
						Secondary action
					</Button>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Primary action
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	),
};

