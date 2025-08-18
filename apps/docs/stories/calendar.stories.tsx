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

export const WithTimezone: Story = {
	args: {
		showOutsideDays: true,
		captionLayout: 'label',
		buttonVariant: 'ghost',
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date());
		const [timezone, setTimezone] = React.useState('UTC');
		const [time, setTime] = React.useState('12:00:00');

		// Common timezones
		const timezones = [
			{ value: 'UTC', label: 'UTC' },
			{ value: 'America/New_York', label: 'Eastern Time' },
			{ value: 'America/Chicago', label: 'Central Time' },
			{ value: 'America/Denver', label: 'Mountain Time' },
			{ value: 'America/Los_Angeles', label: 'Pacific Time' },
			{ value: 'Europe/London', label: 'London' },
			{ value: 'Europe/Paris', label: 'Paris' },
			{ value: 'Asia/Tokyo', label: 'Tokyo' },
			{ value: 'Asia/Shanghai', label: 'Shanghai' },
			{ value: 'Australia/Sydney', label: 'Sydney' },
		];

		// Format date and time in selected timezone
		const formatDateTimeInTimezone = (
			date: Date | undefined,
			tz: string,
			timeStr: string,
		) => {
			if (!date) return 'No date selected';

			try {
				// Create a date with the selected time
				const [hours, minutes, seconds] = timeStr.split(':').map(Number);
				const dateWithTime = new Date(date);
				dateWithTime.setHours(hours, minutes, seconds || 0);

				// Format in the selected timezone
				return new Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					timeZone: tz,
				}).format(dateWithTime);
			} catch {
				return `${date.toLocaleDateString()} at ${timeStr}`;
			}
		};

		// Get current time in selected timezone
		const getCurrentTimeInTimezone = (tz: string) => {
			try {
				return new Intl.DateTimeFormat('en-US', {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					timeZone: tz,
				}).format(new Date());
			} catch {
				return new Date().toLocaleTimeString();
			}
		};

		return (
			<div className="space-y-6">
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<h3 className="text-sm font-medium mb-2">Timezone Selection:</h3>
							<select
								value={timezone}
								onChange={(e) => setTimezone(e.target.value)}
								className="w-full px-3 py-2 border border-input rounded-md text-sm"
							>
								{timezones.map((tz) => (
									<option key={tz.value} value={tz.value}>
										{tz.label}
									</option>
								))}
							</select>
						</div>

						<div>
							<h3 className="text-sm font-medium mb-2">Time Selection:</h3>
							<input
								type="time"
								value={time}
								onChange={(e) => setTime(e.target.value)}
								step="1"
								className="w-full px-3 py-2 border border-input rounded-md text-sm"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<h3 className="text-sm font-medium mb-2">Selected Date & Time:</h3>
							<div className="space-y-2">
								<p className="text-sm text-muted-foreground">
									<strong>Local:</strong>{' '}
									{date ? `${date.toLocaleDateString()} at ${time}` : 'No date selected'}
								</p>
								<p className="text-sm text-muted-foreground">
									<strong>{timezone}:</strong>{' '}
									{formatDateTimeInTimezone(date, timezone, time)}
								</p>
							</div>
						</div>

						<div>
							<h3 className="text-sm font-medium mb-2">Current Time:</h3>
							<div className="space-y-2">
								<p className="text-sm text-muted-foreground">
									<strong>Local:</strong> {new Date().toLocaleTimeString()}
								</p>
								<p className="text-sm text-muted-foreground">
									<strong>{timezone}:</strong> {getCurrentTimeInTimezone(timezone)}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div>
					<h3 className="text-sm font-medium mb-2">Calendar:</h3>
					<Calendar
						{...args}
						mode="single"
						selected={date}
						onSelect={setDate}
						className="rounded-md border shadow-sm"
					/>
				</div>

				<div className="p-4 bg-muted rounded-md">
					<h4 className="text-sm font-medium mb-2">Date & Time with Timezone:</h4>
					<p className="text-xs text-muted-foreground">
						This example demonstrates how to handle dates and times with different
						timezones. The selected date and time are displayed in both local time and
						the chosen timezone. This shows how you can combine calendar selection
						with time input and timezone conversion for comprehensive datetime
						handling in your applications.
					</p>
				</div>
			</div>
		);
	},
};
