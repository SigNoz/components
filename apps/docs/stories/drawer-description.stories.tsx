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

const meta: Meta<typeof DrawerDescription> = {
	title: 'Components/Drawer/DrawerDescription',
	component: DrawerDescription,
	argTypes: {
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the description container.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description: 'The descriptive text or content of the drawer.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrawerDescription>;

export const Default: Story = {
	args: {
		children: 'Are you sure you want to proceed? This action cannot be undone.',
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
					<DrawerTitle>Confirm action</DrawerTitle>
				</DrawerHeader>
				<DrawerDescription {...args} />
			</DrawerContent>
		</Drawer>
	),
};

