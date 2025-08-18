import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '@signozhq/calendar';
import { generateDocs } from '../utils/generateDocs';
import type { DateRange } from 'react-day-picker';

const CalendarExamples = [
	`// Calendar with Dropdown Navigation
import { useState } from 'react';
import { Calendar } from '@signozhq/calendar';

export default function DropdownCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      selected={date}
      onSelect={setDate}
      startMonth={new Date(1960, 0)}
      endMonth={new Date(2030, 11)}
      className="rounded-md border"
    />
  );
}`,

	`// Range Selection Calendar
import { useState } from 'react';
import { Calendar } from '@signozhq/calendar';

export default function RangeCalendar() {
  const [dateRange, setDateRange] = useState();

  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      selected={dateRange}
      onSelect={setDateRange}
      className="rounded-md border"
    />
  );
}`,
];

const CalendarDocs = generateDocs({
	packageName: '@signozhq/calendar',
	description: `A flexible calendar component built on top of react-day-picker with beautiful styling and extensive customization options.

## Features

- **Single & Range Selection**: Pick individual dates or date ranges
- **Dropdown Navigation**: Quick month/year selection with dropdowns
- **Multiple Layouts**: Label or dropdown caption layouts
- **Button Variants**: Customize navigation button styles
- **Accessible**: Full keyboard navigation and screen reader support
- **Customizable**: Extensive styling and behavior customization
- **Date Constraints**: Disable specific dates, past dates, or date ranges`,
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
	argTypes: {
		mode: {
			control: { type: 'radio' },
			options: ['single', 'range'],
			description: 'The selection mode of the calendar',
		},
		captionLayout: {
			control: { type: 'radio' },
			options: ['label', 'dropdown'],
			description: 'Layout of the month caption',
		},
		numberOfMonths: {
			control: { type: 'number', min: 1, max: 3 },
			description: 'Number of months to display',
		},
		showOutsideDays: {
			control: { type: 'boolean' },
			description: 'Show days from adjacent months',
		},
		disabled: {
			control: false,
			description: 'Function to disable specific dates',
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes',
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

// Interactive Calendar with All Controls
export const Default: Story = {
	render: (args) => {
		const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
		const [dateRange, setDateRange] = useState<DateRange | undefined>();

		const mode = args.mode || 'single';
		const isRangeMode = mode === 'range';

		return (
			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-semibold mb-2">
						{isRangeMode ? 'Range Selection' : 'Single Date Selection'} Calendar
					</h3>
					<p className="text-sm text-muted-foreground mb-4">
						{isRangeMode
							? 'Click and drag to select a date range. Use the controls below to test different configurations.'
							: 'Click on any date to select it. Use the controls below to test different configurations.'}
						<span className="block mt-2 font-medium">
							{isRangeMode
								? dateRange?.from && dateRange?.to
									? `Selected Range: ${dateRange.from.toDateString()} - ${dateRange.to.toDateString()}`
									: 'No range selected'
								: singleDate
									? `Selected Date: ${singleDate.toDateString()}`
									: 'No date selected'}
						</span>
					</p>
					{isRangeMode ? (
						<Calendar
							{...args}
							mode="range"
							selected={dateRange}
							onSelect={setDateRange}
						/>
					) : (
						<Calendar
							{...args}
							mode="single"
							selected={singleDate}
							onSelect={setSingleDate}
						/>
					)}
				</div>
			</div>
		);
	},
	args: {
		mode: 'single',
		captionLayout: 'dropdown',
		numberOfMonths: 1,
		showOutsideDays: true,
		className: 'rounded-md border shadow-sm',
	},
};
