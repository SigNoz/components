import {
	Button,
	ButtonColor,
	ButtonVariant,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { popoverArgTypes } from './shared/popover-arg-types.js';

const meta: Meta<typeof Popover> = {
	title: 'Primitive Components/Popover/Popover',
	component: Popover,
	argTypes: popoverArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
	args: {
		defaultOpen: false,
	},
	render: (args) => {
		const [open, setOpen] = React.useState<boolean | undefined>(args.open ?? args.defaultOpen);

		return (
			<Popover
				{...args}
				open={args.open ?? open}
				onOpenChange={(next) => {
					setOpen(next);
					args.onOpenChange?.(next);
				}}
			>
				<PopoverTrigger asChild>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Open popover
					</Button>
				</PopoverTrigger>
				<PopoverContent style={{ width: '20rem' }}>
					<div style={{ display: 'grid', gap: '1rem' }}>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<h4 style={{ lineHeight: 1, fontWeight: 500, marginTop: '0' }}>Dimensions</h4>
							<p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
								Set the dimensions for the layer.
							</p>
						</div>
						<div style={{ display: 'grid', gap: '0.5rem' }}>
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
									alignItems: 'center',
									gap: '1rem',
								}}
							>
								<label htmlFor="width">Width</label>
								<Input
									id="width"
									defaultValue="100%"
									style={{ gridColumn: 'span 2', height: '2rem' }}
								/>
							</div>
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
									alignItems: 'center',
									gap: '1rem',
								}}
							>
								<label htmlFor="maxWidth">Max. width</label>
								<Input
									id="maxWidth"
									defaultValue="300px"
									style={{ gridColumn: 'span 2', height: '2rem' }}
								/>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		);
	},
};
