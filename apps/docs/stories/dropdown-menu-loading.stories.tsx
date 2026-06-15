import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLoading,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DropdownMenuLoading> = {
	title: 'Primitive Components/DropdownMenu/DropdownMenuLoading',
	component: DropdownMenuLoading,
	argTypes: {
		text: {
			control: 'text',
			description: 'The loading text to display.',
			table: { category: 'Content', defaultValue: { summary: 'Loading...' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for the loading container.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuLoading>;

export const Default: Story = {
	args: {
		text: 'Loading...',
	},
	render: (args) => (
		<div style={{ padding: '2rem' }}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="solid" color="secondary">
						Open menu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLoading {...args} />
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};

export const Preview: Story = {
	render: () => (
		<div
			style={{
				padding: '2rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '2.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Custom Text
				</h3>
				<div style={{ padding: '2rem' }}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="solid" color="secondary">
								Open menu
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLoading text="Fetching options..." />
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</section>
		</div>
	),
};
