import { ChevronDown } from '@signozhq/icons';
import {
	Button,
	ButtonColor,
	ButtonVariant,
	Calendar,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import styles from './popover.stories.module.css';
import { popoverArgTypes } from './shared/popover-arg-types.js';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;
const ALIGNS = ['start', 'center', 'end'] as const;

const meta: Meta<typeof Popover> = {
	title: 'Primitive Components/Popover',
	component: Popover,
	argTypes: popoverArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
	args: {
		defaultOpen: false,
	},
	render: (args) => (
		<div className="story-column">
			<Popover {...args}>
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
							<div className={styles.formGrid}>
								<label htmlFor="height">
									<Typography>Height</Typography>
								</label>
								<Input id="height" defaultValue="25px" className={styles.inputSmall} />
							</div>
							<div className={styles.formGrid}>
								<label htmlFor="maxHeight">
									<Typography>Max. height</Typography>
								</label>
								<Input id="maxHeight" defaultValue="none" className={styles.inputSmall} />
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	),
};

const fixedDate = 1771949360343;

export const DateAndTimePicker: Story = {
	render: () => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));
		const [open, setOpen] = React.useState(false);
		const [time, setTime] = React.useState('10:30:00');

		return (
			<div className="story-row-lg">
				<div className={`story-column ${styles.datePickerColumn}`}>
					<label htmlFor="date-picker" className={styles.datePickerLabel}>
						<Typography size="xs">Date</Typography>
					</label>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant={ButtonVariant.Solid}
								color={ButtonColor.Primary}
								id="date-picker"
								className={styles.datePickerTrigger}
							>
								{date ? `${date.toLocaleDateString()} : ${time}` : 'Select date'}
								<ChevronDown size={16} />
							</Button>
						</PopoverTrigger>
						<PopoverContent className={styles.datePickerContent} align="start">
							<Calendar
								mode="single"
								selected={date}
								onSelect={(d) => {
									setDate(d);
									setOpen(false);
								}}
							/>
							<div className={`story-column ${styles.timePickerSection}`}>
								<label htmlFor="time-picker" className={styles.datePickerLabel}>
									<Typography size="xs">Time</Typography>
								</label>
								<Input
									type="time"
									value={time}
									onChange={(e) => setTime(e.target.value)}
									id="time-picker"
									step="1"
									className={styles.timePickerInput}
								/>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		);
	},
};

export const PopoverShowcase: Story = {
	parameters: {
		layout: 'fullscreen',
		docs: { story: { autoplay: true } },
	},
	render: () => (
		<div className={`story-container-full story-panel ${styles.showcaseContainer}`}>
			<div className={styles.showcaseLayout}>
				<div className="story-section">
					<Typography as="h2" size="base" weight="semibold">
						Positions
					</Typography>
					<div className="story-grid-lg">
						{SIDES.map((side) => (
							<Popover key={side}>
								<PopoverTrigger asChild>
									<Button
										variant={ButtonVariant.Solid}
										color={ButtonColor.Secondary}
										className={styles.capitalizedButton}
									>
										{side}
									</Button>
								</PopoverTrigger>
								<PopoverContent side={side} arrow>
									<Typography size="sm">Popover on {side}</Typography>
								</PopoverContent>
							</Popover>
						))}
					</div>
				</div>

				<div className="story-section">
					<Typography as="h2" size="base" weight="semibold">
						Align variations
					</Typography>
					<div className="story-grid-lg">
						{ALIGNS.map((align) => (
							<Popover key={align}>
								<PopoverTrigger asChild>
									<Button
										variant={ButtonVariant.Solid}
										color={ButtonColor.Secondary}
										className={styles.capitalizedButton}
									>
										{align}
									</Button>
								</PopoverTrigger>
								<PopoverContent side="top" align={align} arrow>
									<Typography size="sm">Align {align}</Typography>
								</PopoverContent>
							</Popover>
						))}
					</div>
				</div>

				<div className="story-section">
					<Typography as="h2" size="base" weight="semibold">
						With / without arrow
					</Typography>
					<div className="story-row-lg">
						<Popover>
							<PopoverTrigger asChild>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									Without arrow
								</Button>
							</PopoverTrigger>
							<PopoverContent arrow={false}>
								<Typography size="sm">No arrow</Typography>
							</PopoverContent>
						</Popover>
						<Popover>
							<PopoverTrigger asChild>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									With arrow
								</Button>
							</PopoverTrigger>
							<PopoverContent arrow>
								<Typography size="sm">With arrow</Typography>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				<div className="story-section">
					<Typography as="h2" size="base" weight="semibold">
						Default open
					</Typography>
					<Popover defaultOpen>
						<PopoverTrigger asChild>
							<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
								Open by default
							</Button>
						</PopoverTrigger>
						<PopoverContent>
							<Typography size="sm">I am open by default</Typography>
						</PopoverContent>
					</Popover>
				</div>

				<div className="story-section">
					<Typography as="h2" size="base" weight="semibold">
						Custom content
					</Typography>
					<Popover>
						<PopoverTrigger asChild>
							<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
								Rich content
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-64" arrow>
							<div className="story-section-sm">
								<Typography weight="medium">Custom popover</Typography>
								<Typography size="sm" color="muted">
									With multiple lines and rich content.
								</Typography>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</div>
	),
};
