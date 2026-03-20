import {
	Button,
	ButtonColor,
	ButtonVariant,
	Calendar,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { popoverArgTypes } from './shared/popover-arg-types.js';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;
const ALIGNS = ['start', 'center', 'end'] as const;

const meta: Meta<typeof Popover> = {
	title: 'Components/Popover',
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
		<div className="flex flex-col gap-4">
			<Popover {...args}>
				<PopoverTrigger asChild>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Open popover
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="leading-none font-medium !mt-0">Dimensions</h4>
							<p className="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
						</div>
						<div className="grid gap-2">
							<div className="grid grid-cols-3 items-center gap-4">
								<label htmlFor="width">Width</label>
								<Input id="width" defaultValue="100%" className="col-span-2 h-8" />
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<label htmlFor="maxWidth">Max. width</label>
								<Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<label htmlFor="height">Height</label>
								<Input id="height" defaultValue="25px" className="col-span-2 h-8" />
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<label htmlFor="maxHeight">Max. height</label>
								<Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
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
			<div className="container flex gap-4">
				<div className="flex flex-col gap-3">
					<label htmlFor="date-picker" className="px-1 text-xs">
						Date
					</label>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant={ButtonVariant.Solid}
								color={ButtonColor.Primary}
								id="date-picker"
								className="w-[360px] justify-between font-normal"
							>
								{date ? `${date.toLocaleDateString()} : ${time}` : 'Select date'}
								<ChevronDown size={16} />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto overflow-hidden p-0" align="start">
							<Calendar
								mode="single"
								selected={date}
								onSelect={(d) => {
									setDate(d);
									setOpen(false);
								}}
							/>
							<div className="flex flex-col gap-3 p-3 border-t">
								<label htmlFor="time-picker" className="px-1 text-xs">
									Time
								</label>
								<Input
									type="time"
									value={time}
									onChange={(e) => setTime(e.target.value)}
									id="time-picker"
									step="1"
									className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
		<div className="p-8 rounded-lg bg-vanilla-100 dark:bg-background min-h-[600px]">
			<div className="space-y-16">
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">Positions</h2>
					<div className="flex flex-wrap gap-8 items-center">
						{SIDES.map((side) => (
							<Popover key={side}>
								<PopoverTrigger asChild>
									<Button
										variant={ButtonVariant.Solid}
										color={ButtonColor.Secondary}
										className="capitalize"
									>
										{side}
									</Button>
								</PopoverTrigger>
								<PopoverContent side={side} arrow>
									<p className="text-sm">Popover on {side}</p>
								</PopoverContent>
							</Popover>
						))}
					</div>
				</div>

				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">Align variations</h2>
					<div className="flex flex-wrap gap-8">
						{ALIGNS.map((align) => (
							<Popover key={align}>
								<PopoverTrigger asChild>
									<Button
										variant={ButtonVariant.Solid}
										color={ButtonColor.Secondary}
										className="capitalize"
									>
										{align}
									</Button>
								</PopoverTrigger>
								<PopoverContent side="top" align={align} arrow>
									<p className="text-sm">Align {align}</p>
								</PopoverContent>
							</Popover>
						))}
					</div>
				</div>

				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">With / without arrow</h2>
					<div className="flex gap-4">
						<Popover>
							<PopoverTrigger asChild>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									Without arrow
								</Button>
							</PopoverTrigger>
							<PopoverContent arrow={false}>
								<p className="text-sm">No arrow</p>
							</PopoverContent>
						</Popover>
						<Popover>
							<PopoverTrigger asChild>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									With arrow
								</Button>
							</PopoverTrigger>
							<PopoverContent arrow>
								<p className="text-sm">With arrow</p>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">Default open</h2>
					<Popover defaultOpen>
						<PopoverTrigger asChild>
							<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
								Open by default
							</Button>
						</PopoverTrigger>
						<PopoverContent>
							<p className="text-sm">I am open by default</p>
						</PopoverContent>
					</Popover>
				</div>

				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">Custom content</h2>
					<Popover>
						<PopoverTrigger asChild>
							<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
								Rich content
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-64" arrow>
							<div className="space-y-2">
								<span className="font-medium">Custom popover</span>
								<p className="text-sm text-muted-foreground">
									With multiple lines and rich content.
								</p>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</div>
	),
};
