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

const meta: Meta<typeof DrawerHeader> = {
	title: 'Components/Drawer/DrawerHeader',
	component: DrawerHeader,
	argTypes: {
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the header container.',
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
type Story = StoryObj<typeof DrawerHeader>;

export const Default: Story = {
	render: (args) => (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open drawer
				</Button>
			</DrawerTrigger>
			<DrawerContent type="drawer">
				<DrawerHeader {...args}>
					<DrawerTitle>Drawer header</DrawerTitle>
				</DrawerHeader>
				<DrawerDescription>
					<p className="text-sm">
						The header typically contains the title and optional actions.
					</p>
				</DrawerDescription>
			</DrawerContent>
		</Drawer>
	),
};

