import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverContent, PopoverTrigger } from '@signozhq/popover';
import { ChevronDown } from 'lucide-react';
import { Button } from '@signozhq/button';
import { Input } from '@signozhq/input';
import { Calendar } from '@signozhq/calendar';
import { generateDocs } from '../utils/generateDocs';

const PopoverExamples = [
	`import { Popover, PopoverContent, PopoverTrigger } from '@signozhq/popover';
import { Button } from '@signozhq/button';
import { Input } from '@signozhq/input';

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Dimensions</h4>
            <p className="text-muted-foreground text-sm">
              Set the dimensions for the layer.
            </p>
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
  );
}`,
	`import { Popover, PopoverContent, PopoverTrigger } from '@signozhq/popover';
import { Button } from '@signozhq/button';
import { Calendar } from '@signozhq/calendar';
import { Input } from '@signozhq/input';

export default function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState('12:00');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
          {date ? (
            <>
              {date.toLocaleDateString()} at {time}
            </>
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
        <div className="p-3 border-t">
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}`,
];

const PopoverDocs = generateDocs({
	packageName: '@signozhq/popover',
	description: 'Displays rich content in a portal, triggered by a button.',
	examples: PopoverExamples,
});

const meta: Meta<typeof Popover> = {
	title: 'Components/Popover',
	component: Popover,
	parameters: {
		docs: {
			description: {
				component: PopoverDocs,
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outlined">Open popover</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="leading-none font-medium">Dimensions</h4>
							<p className="text-muted-foreground text-sm">
								Set the dimensions for the layer.
							</p>
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

export const DateAndTimePicker: Story = {
	render: () => {
		const [date, setDate] = React.useState<Date | undefined>(new Date());
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
								variant="outlined"
								id="date-picker"
								className="w-[280px] justify-between font-normal"
							>
								{date ? date.toLocaleDateString() + ' : ' + time : 'Select date'}
								<ChevronDown size={16} />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto overflow-hidden p-0" align="start">
							<Calendar
								mode="single"
								selected={date}
								onSelect={(date) => {
									setDate(date);
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
