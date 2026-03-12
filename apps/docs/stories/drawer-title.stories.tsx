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

const meta: Meta<typeof DrawerTitle> = {
	title: 'Components/Drawer/DrawerTitle',
	component: DrawerTitle,
	argTypes: {
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the title.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description: 'The text content of the drawer title.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
	},
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
			<DrawerContent type="drawer">
				<DrawerHeader>
					<DrawerTitle {...args} />
				</DrawerHeader>
				<DrawerDescription>
					<p className="text-sm">
						The title labels the drawer content for assistive technologies.
					</p>
				</DrawerDescription>
			</DrawerContent>
		</Drawer>
	),
};

