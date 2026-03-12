import {
	Button,
	ButtonColor,
	ButtonVariant,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DrawerClose> = {
	title: 'Components/Drawer/DrawerClose',
	component: DrawerClose,
	argTypes: {
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the close element.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		asChild: {
			control: 'boolean',
			description:
				'When true, the child element will be treated as the close control (no extra DOM wrapper).',
			table: { category: 'Behavior', type: { summary: 'boolean' } },
		},
		onClick: {
			control: false,
			description: 'Click handler invoked when the close element is activated.',
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
type Story = StoryObj<typeof DrawerClose>;

export const Default: Story = {
	args: {
		asChild: true,
	},
	render: (args) => (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open drawer
				</Button>
			</DrawerTrigger>
			<DrawerContent type="drawer">
				<DrawerHeader>
					<DrawerTitle>Drawer with custom close</DrawerTitle>
				</DrawerHeader>
				<DrawerDescription>
					<p className="text-sm">
						This drawer uses DrawerClose in the footer instead of an integrated close button.
					</p>
				</DrawerDescription>
				<DrawerFooter>
					<Button variant={ButtonVariant.Ghost} color="secondary">
						Cancel
					</Button>
					<DrawerClose {...args}>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
							Close
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	),
};

