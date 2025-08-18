/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '@signozhq/calendar';
import { generateDocs } from '../utils/generateDocs';

const CalendarExamples = [
	`import { Calendar } from '@signozhq/calendar';

export default function MyComponent() {
  return (
    <Calendar />
  );
}`,
	`import { Calendar } from '@signozhq/calendar';

export default function SingleDatePicker() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm"
    />
  );
}`,
	`import { Calendar } from '@signozhq/calendar';

export default function RangePicker() {
  const [range, setRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      className="rounded-md border shadow-sm"
    />
  );
}`,
	`import { Calendar } from '@signozhq/calendar';

export default function MultiplePicker() {
  const [selected, setSelected] = React.useState<Date[]>([]);

  return (
    <Calendar
      mode="multiple"
      selected={selected}
      onSelect={setSelected}
      className="rounded-md border shadow-sm"
    />
  );
}`,
];

const CalendarDocs = generateDocs({
	packageName: '@signozhq/calendar',
	description:
		'A date field component that allows users to enter and edit dates. Built on top of React DayPicker.',
	examples: CalendarExamples,
});

const meta: Meta<typeof Calendar> = {
	title: 'Components/Calendar',
	component: Calendar,
	parameters: {
		docs: {
			description: {
				component: CalendarDocs,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		mode: {
			control: { type: 'select' },
			options: ['single', 'range', 'multiple'],
			description: 'The selection mode of the calendar',
		},
		showOutsideDays: {
			control: { type: 'boolean' },
			description: 'Show days outside the current month',
		},
		captionLayout: {
			control: { type: 'select' },
			options: ['label', 'dropdown'],
			description: 'Layout of the month/year caption',
		},
		buttonVariant: {
			control: { type: 'select' },
			options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
			description: 'Variant of the navigation buttons',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
	args: {
		mode: 'single',
		showOutsideDays: true,
		captionLayout: 'label',
		buttonVariant: 'ghost',
	},
};

export const SingleDateSelection: Story = {
	args: {
		mode: 'single',
		showOutsideDays: true,
		captionLayout: 'label',
		buttonVariant: 'ghost',
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date());

		return (
			<div className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-2">Selected Date:</h3>
					<p className="text-sm text-muted-foreground">
						{date ? date.toLocaleDateString() : 'No date selected'}
					</p>
				</div>
				<Calendar
					{...args}
					mode="single"
					selected={date}
					onSelect={setDate}
					className="rounded-md border shadow-sm"
				/>
			</div>
		);
	},
};

export const DateRangeSelection: Story = {
	args: {
		showOutsideDays: true,
		captionLayout: 'label',
		buttonVariant: 'ghost',
	},
	render: (args) => {
		const [range, setRange] = React.useState<any>({
			from: undefined,
			to: undefined,
		});

		return (
			<div className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-2">Selected Range:</h3>
					<p className="text-sm text-muted-foreground">
						{range.from && range.to
							? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
							: range.from
								? `${range.from.toLocaleDateString()} - Select end date`
								: 'Select start date'}
					</p>
				</div>
				<Calendar
					{...args}
					mode="range"
					selected={range}
					onSelect={setRange}
					className="rounded-md border shadow-sm"
				/>
			</div>
		);
	},
};

export const MultipleDateSelection: Story = {
	args: {
		showOutsideDays: true,
		captionLayout: 'label',
		buttonVariant: 'ghost',
	},
	render: (args) => {
		const [selected, setSelected] = React.useState<any>([]);

		return (
			<div className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-2">Selected Dates:</h3>
					<p className="text-sm text-muted-foreground">
						{selected.length > 0
							? selected.map((date: Date) => date.toLocaleDateString()).join(', ')
							: 'No dates selected'}
					</p>
				</div>
				<Calendar
					{...args}
					mode="multiple"
					selected={selected}
					onSelect={setSelected}
					className="rounded-md border shadow-sm"
				/>
			</div>
		);
	},
};

export const WithDropdownNavigation: Story = {
	args: {
		showOutsideDays: true,
		captionLayout: 'dropdown',
		buttonVariant: 'ghost',
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date());

		return (
			<div className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-2">Selected Date:</h3>
					<p className="text-sm text-muted-foreground">
						{date ? date.toLocaleDateString() : 'No date selected'}
					</p>
				</div>
				<Calendar
					{...args}
					mode="single"
					selected={date}
					onSelect={setDate}
					className="rounded-md border shadow-sm"
				/>
			</div>
		);
	},
};

export const HideOutsideDays: Story = {
	args: {
		showOutsideDays: false,
		captionLayout: 'label',
		buttonVariant: 'ghost',
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date());

		return (
			<Calendar
				{...args}
				mode="single"
				selected={date}
				onSelect={setDate}
				className="rounded-md border shadow-sm"
			/>
		);
	},
};

export const CustomButtonVariant: Story = {
	args: {
		showOutsideDays: true,
		captionLayout: 'label',
		buttonVariant: 'outline',
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date());

		return (
			<Calendar
				{...args}
				mode="single"
				selected={date}
				onSelect={setDate}
				className="rounded-md border shadow-sm"
			/>
		);
	},
};

export const DisabledDates: Story = {
	args: {
		showOutsideDays: true,
		captionLayout: 'label',
		buttonVariant: 'ghost',
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date());

		// Disable weekends
		const disabledDays = [
			{ dayOfWeek: [0, 6] }, // Sunday and Saturday
		];

		return (
			<div className="space-y-4">
				<div>
					<p className="text-sm text-muted-foreground mb-2">
						Weekends are disabled in this example
					</p>
				</div>
				<Calendar
					{...args}
					mode="single"
					selected={date}
					onSelect={setDate}
					disabled={disabledDays}
					className="rounded-md border shadow-sm"
				/>
			</div>
		);
	},
};
