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

const meta: Meta<typeof DrawerTrigger> = {
	title: 'Components/Drawer/DrawerTrigger',
	component: DrawerTrigger,
	argTypes: {
		id: {
			control: 'text',
			description: 'A unique identifier for the trigger element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the trigger.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		asChild: {
			control: 'boolean',
			description:
				'When true, the child element will be treated as the trigger (no extra DOM wrapper).',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		onClick: {
			control: false,
			description: 'Click handler for the trigger element.',
			table: { category: 'Events', type: { summary: '(event: MouseEvent) => void' } },
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
type Story = StoryObj<typeof DrawerTrigger>;

export const Default: Story = {
	args: {
		asChild: true,
	},
	render: (args) => (
		<Drawer>
			<DrawerTrigger {...args}>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open drawer
				</Button>
			</DrawerTrigger>
			<DrawerContent type="drawer">
				<DrawerHeader>
					<DrawerTitle>Drawer with custom trigger</DrawerTitle>
				</DrawerHeader>
				<DrawerDescription>
					Use DrawerTrigger asChild to wrap any interactive element that should open the
					drawer.
				</DrawerDescription>
			</DrawerContent>
		</Drawer>
	),
};

