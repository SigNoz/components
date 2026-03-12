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

const meta: Meta<typeof DrawerSubtitle> = {
	title: 'Components/Drawer/DrawerSubtitle',
	component: DrawerSubtitle,
	argTypes: {
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the subtitle.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description: 'The text content of the subtitle.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
	},
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
			<DrawerContent type="drawer">
				<DrawerHeader>
					<DrawerTitle>Drawer title</DrawerTitle>
					<DrawerSubtitle {...args} />
				</DrawerHeader>
			</DrawerContent>
		</Drawer>
	),
};

