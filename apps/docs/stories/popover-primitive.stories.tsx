import {
	Button,
	ButtonColor,
	ButtonVariant,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import styles from './popover-primitive.stories.module.css';
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
				<PopoverContent className="w-80">
					<div className="story-section">
						<div className="story-section-sm">
							<Typography as="h4" weight="medium" className={styles.headingTitle}>
								Dimensions
							</Typography>
							<Typography size="sm" color="muted">
								Set the dimensions for the layer.
							</Typography>
						</div>
						<div className="story-section-sm">
							<div className={styles.formGrid}>
								<label htmlFor="width">
									<Typography>Width</Typography>
								</label>
								<Input id="width" defaultValue="100%" className={styles.inputSmall} />
							</div>
							<div className={styles.formGrid}>
								<label htmlFor="maxWidth">
									<Typography>Max. width</Typography>
								</label>
								<Input id="maxWidth" defaultValue="300px" className={styles.inputSmall} />
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		);
	},
};
