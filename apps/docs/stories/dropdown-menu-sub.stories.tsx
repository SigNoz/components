import { Link, Settings } from '@signozhq/icons';
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

function SubMenuFrame({
	subProps,
	children,
}: {
	subProps: { defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void };
	children: React.ReactNode;
}) {
	return (
		<div style={{ padding: '2rem' }}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="solid" color="secondary">
						Open menu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
					<DropdownMenuSub {...subProps}>{children}</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function ControlledSubMenu() {
	const [open, setOpen] = React.useState(false);
	return (
		<SubMenuFrame subProps={{ open, onOpenChange: setOpen }}>
			<DropdownMenuSubTrigger leftIcon={<Settings size={16} />}>
				More Options
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent sideOffset={4}>
				<DropdownMenuItem leftIcon={<Link size={16} />}>Sub Item 1</DropdownMenuItem>
				<DropdownMenuItem>Sub Item 2</DropdownMenuItem>
				<DropdownMenuItem>Sub Item 3</DropdownMenuItem>
			</DropdownMenuSubContent>
		</SubMenuFrame>
	);
}

const meta: Meta<typeof DropdownMenuSub> = {
	title: 'Primitive Components/DropdownMenu/DropdownMenuSub',
	component: DropdownMenuSub,
	argTypes: {
		defaultOpen: {
			control: 'boolean',
			description: 'The open state of the submenu when initially rendered.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		open: {
			control: 'boolean',
			description: 'The controlled open state. Must be used together with onOpenChange.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		children: {
			control: false,
			description: 'DropdownMenuSubTrigger and DropdownMenuSubContent.',
			table: { category: 'Content' },
		},
		onOpenChange: { control: false, table: { category: 'Events' } },
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuSub>;

export const Default: Story = {
	args: {
		defaultOpen: false,
	},
	render: (args) => (
		<SubMenuFrame
			subProps={{
				defaultOpen: args.defaultOpen,
			}}
		>
			<DropdownMenuSubTrigger leftIcon={<Settings size={16} />}>
				More Options
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent sideOffset={4}>
				<DropdownMenuItem leftIcon={<Link size={16} />}>Sub Item 1</DropdownMenuItem>
				<DropdownMenuItem>Sub Item 2</DropdownMenuItem>
				<DropdownMenuItem>Sub Item 3</DropdownMenuItem>
			</DropdownMenuSubContent>
		</SubMenuFrame>
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
					Default Open
				</h3>
				<SubMenuFrame subProps={{ defaultOpen: true }}>
					<DropdownMenuSubTrigger leftIcon={<Settings size={16} />}>
						More Options
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent sideOffset={4}>
						<DropdownMenuItem leftIcon={<Link size={16} />}>Sub Item 1</DropdownMenuItem>
						<DropdownMenuItem>Sub Item 2</DropdownMenuItem>
						<DropdownMenuItem>Sub Item 3</DropdownMenuItem>
					</DropdownMenuSubContent>
				</SubMenuFrame>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Controlled
				</h3>
				<ControlledSubMenu />
			</section>
		</div>
	),
};
