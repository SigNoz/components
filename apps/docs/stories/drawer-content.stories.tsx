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
import { contentArgTypes } from './shared/dialog-drawer-arg-types.js';

const { position: _, ...sharedContentArgTypes } = contentArgTypes ?? {};

const meta: Meta<typeof DrawerContent> = {
	title: 'Components/Drawer/DrawerContent',
	component: DrawerContent,
	argTypes: {
		...sharedContentArgTypes,
		direction: {
			control: 'select',
			options: ['left', 'right', 'top', 'bottom'],
			description: 'The side of the viewport from which the drawer appears.',
			table: {
				category: 'Appearance',
				type: { summary: '"left" | "right" | "top" | "bottom"' },
				defaultValue: { summary: 'right' },
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
