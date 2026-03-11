import {
	Button,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof CommandDialog> = {
	title: 'Components/Command/CommandDialog',
	component: CommandDialog,
	argTypes: {
		open: {
			control: 'boolean',
			description:
				'The controlled open state of the command dialog. Must be used together with onOpenChange.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		position: {
			control: 'select',
			options: ['center', 'top', 'custom'],
			description: 'The vertical position of the dialog on the screen.',
			table: {
				category: 'Layout',
				type: { summary: "'center' | 'top' | 'custom'" },
				defaultValue: { summary: 'center' },
			},
		},
		offset: {
			control: 'number',
			description: 'Offset from the top of the viewport when position is set to top.',
			table: {
				category: 'Layout',
				type: { summary: 'number' },
				defaultValue: { summary: '100' },
			},
		},
		contentClassName: {
			control: 'text',
			description: 'Additional CSS classes to apply to the dialog content container.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		onOpenChange: {
			control: false,
			description: 'Event handler called when the dialog open state changes.',
			table: {
				category: 'Events',
				type: { summary: '(open: boolean) => void' },
			},
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
type Story = StoryObj<typeof CommandDialog>;

export const Default: Story = {
	args: {
		position: 'top',
		offset: 110,
	},
	render: (args) => {
		const [open, setOpen] = React.useState<boolean | undefined>(args.open);

		return (
			<>
				<div style={{ margin: 12 }}>
					<Button type="button" variant="solid" onClick={() => setOpen(true)}>
						Open Command Dialog
					</Button>
				</div>

				<CommandDialog
					{...args}
					open={open}
					onOpenChange={(next) => {
						setOpen(next);
						args.onOpenChange?.(next);
					}}
				>
					<CommandInput placeholder="Search or run a command…" autoFocus={false} />
					<CommandList>
						<CommandGroup heading="Quick actions">
							<CommandItem onSelect={() => setOpen(false)}>Open settings</CommandItem>
							<CommandItem onSelect={() => setOpen(false)}>Toggle sidebar</CommandItem>
						</CommandGroup>
						<CommandEmpty>No results.</CommandEmpty>
					</CommandList>
				</CommandDialog>
			</>
		);
	},
};
