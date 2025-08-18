import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '@signozhq/calendar';
import { generateDocs } from '../utils/generateDocs';

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
];

const CalendarDocs = generateDocs({
	packageName: '@signozhq/calendar',
	description: `A flexible calendar component built on top of react-day-picker with beautiful styling and dropdown navigation for quick month/year selection.

## Features

- **Dropdown Navigation**: Quick month/year selection with dropdowns
- **Single Date Selection**: Pick individual dates with ease
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
		buttonVariant: {
			control: { type: 'select' },
			options: ['solid', 'outlined', 'dashed', 'ghost', 'link', 'action'],
			description: 'Variant of the navigation buttons',
		},
		showOutsideDays: {
			control: { type: 'boolean' },
			description: 'Show days from adjacent months',
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

// Default Calendar with Dropdown Navigation
export const Default: Story = {
	render: (args) => {
		const [date, setDate] = useState<Date | undefined>(new Date());

		return (
			<Calendar
				{...args}
				mode="single"
				captionLayout="dropdown"
				selected={date}
				onSelect={setDate}
				startMonth={new Date(1960, 0)}
				endMonth={new Date(2030, 11)}
			/>
		);
	},
	args: {
		className: 'rounded-md border shadow-sm',
	},
};
