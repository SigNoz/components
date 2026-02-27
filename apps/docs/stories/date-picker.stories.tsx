import { DatePicker } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { generateDocs } from '../utils/generateDocs.js';

const DatePickerExamples = [
	`import { DatePicker } from '@signozhq/ui';

export default function DateOnlyPicker() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <DatePicker
      date={date}
      onDateChange={setDate}
      placeholder="Pick a date"
    />
  );
}`,
	`import { DatePicker } from '@signozhq/ui';

export default function DateAndTimePicker() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState('12:00:00');

  return (
    <DatePicker
      date={date}
      onDateChange={setDate}
      time={time}
      onTimeChange={setTime}
      showTime={true}
      placeholder="Pick a date and time"
    />
  );
}`,
	`import { DatePicker } from '@signozhq/ui';

export default function DateTimeTimezonePicker() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState('12:00:00');
  const [timezone, setTimezone] = React.useState('UTC');

  return (
    <DatePicker
      date={date}
      onDateChange={setDate}
      time={time}
      onTimeChange={setTime}
      timezone={timezone}
      onTimezoneChange={setTimezone}
      showTime={true}
      showTimezone={true}
      showActions={true}
      placeholder="Pick a date, time, and timezone"
    />
  );
}`,
];

const DatePickerDocs = generateDocs({
	packageName: '@signozhq/ui',
	description:
		'A comprehensive and configurable date picker component that supports date, time, and timezone selection. All functionality is controlled through props for maximum flexibility.',
	examples: DatePickerExamples,
});

const meta: Meta<typeof DatePicker> = {
	title: 'Components/DatePicker',
	component: DatePicker,
	parameters: {
		docs: {
			description: {
				component: DatePickerDocs,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		buttonVariant: {
			control: { type: 'select' },
			options: ['default', 'outline', 'ghost'],
			description: 'The variant of the trigger button',
		},
		buttonSize: {
			control: { type: 'select' },
			options: ['sm', 'md', 'lg'],
			description: 'The size of the trigger button',
		},
		showTime: {
			control: { type: 'boolean' },
			description: 'Whether to show time selection',
		},
		showTimezone: {
			control: { type: 'boolean' },
			description: 'Whether to show timezone selection',
		},
		showActions: {
			control: { type: 'boolean' },
			description: 'Whether to show action buttons (Cancel/OK)',
		},
		closeOnSelect: {
			control: { type: 'boolean' },
			description: 'Whether to close popover on date selection',
		},
		disabled: {
			control: { type: 'boolean' },
			description: 'Whether the picker is disabled',
		},
	},
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

const fixedDate = 1771949360343; // 2026-02-24T16:09:20.343Z

export const Default: Story = {
	render: () => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));

		return (
			<div className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-2">Selected Date:</h3>
					<p className="text-sm text-muted-foreground">
						{date ? date.toLocaleDateString() : 'No date selected'}
					</p>
				</div>
				<DatePicker date={date} onDateChange={setDate} placeholder="Pick a date" />
			</div>
		);
	},
};

export const DateOnly: Story = {
	render: () => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));

		return (
			<div className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-2">Selected Date:</h3>
					<p className="text-sm text-muted-foreground">
						{date ? date.toLocaleDateString() : 'No date selected'}
					</p>
				</div>
				<DatePicker
					date={date}
					onDateChange={setDate}
					showTime={false}
					showTimezone={false}
					placeholder="Pick a date"
				/>
			</div>
		);
	},
};

export const DateAndTime: Story = {
	render: () => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));
		const [time, setTime] = React.useState('09:30:00');

		return (
			<div className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-2">Selected Date & Time:</h3>
					<p className="text-sm text-muted-foreground">
						{date ? `${date.toLocaleDateString()} at ${time}` : 'No date selected'}
					</p>
				</div>
				<DatePicker
					date={date}
					onDateChange={setDate}
					time={time}
					onTimeChange={setTime}
					showTime={true}
					showTimezone={false}
					placeholder="Pick a date and time"
				/>
			</div>
		);
	},
};

export const WithTimezone: Story = {
	render: () => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));
		const [time, setTime] = React.useState('15:45:00');
		const [timezone, setTimezone] = React.useState('America/New_York');

		return (
			<div className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-2">Selected Date & Time:</h3>
					<p className="text-sm text-muted-foreground">
						{date ? `${date.toLocaleDateString()} at ${time} (${timezone})` : 'No date selected'}
					</p>
				</div>
				<DatePicker
					date={date}
					onDateChange={setDate}
					time={time}
					onTimeChange={setTime}
					timezone={timezone}
					onTimezoneChange={setTimezone}
					showTime={true}
					showTimezone={true}
					placeholder="Pick a date, time, and timezone"
				/>
			</div>
		);
	},
};

export const WithActions: Story = {
	render: () => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));
		const [time, setTime] = React.useState('12:00:00');
		const [timezone, setTimezone] = React.useState('UTC');

		return (
			<div className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-2">Selected Date & Time:</h3>
					<p className="text-sm text-muted-foreground">
						{date ? `${date.toLocaleDateString()} at ${time} (${timezone})` : 'No date selected'}
					</p>
				</div>
				<DatePicker
					date={date}
					onDateChange={setDate}
					time={time}
					onTimeChange={setTime}
					timezone={timezone}
					onTimezoneChange={setTimezone}
					showTime={true}
					showTimezone={true}
					showActions={true}
					closeOnSelect={false}
					placeholder="Pick a date, time, and timezone"
				/>
			</div>
		);
	},
};

export const DifferentButtonVariants: Story = {
	render: () => {
		const [date1, setDate1] = React.useState<Date | undefined>(new Date(fixedDate));
		const [date2, setDate2] = React.useState<Date | undefined>(new Date(fixedDate));
		const [date3, setDate3] = React.useState<Date | undefined>(new Date(fixedDate));

		return (
			<div className="space-y-6">
				<div className="space-y-4">
					<h3 className="text-sm font-medium">Button Variants:</h3>

					<div className="space-y-2">
						<p className="text-xs text-muted-foreground">Default variant:</p>
						<DatePicker
							date={date1}
							onDateChange={setDate1}
							buttonVariant="default"
							showTime={false}
							showTimezone={false}
						/>
					</div>

					<div className="space-y-2">
						<p className="text-xs text-muted-foreground">Outline variant:</p>
						<DatePicker
							date={date2}
							onDateChange={setDate2}
							buttonVariant="outline"
							showTime={false}
							showTimezone={false}
						/>
					</div>

					<div className="space-y-2">
						<p className="text-xs text-muted-foreground">Ghost variant:</p>
						<DatePicker
							date={date3}
							onDateChange={setDate3}
							buttonVariant="ghost"
							showTime={false}
							showTimezone={false}
						/>
					</div>
				</div>
			</div>
		);
	},
};

export const DifferentButtonSizes: Story = {
	render: () => {
		const [date1, setDate1] = React.useState<Date | undefined>(new Date(fixedDate));
		const [date2, setDate2] = React.useState<Date | undefined>(new Date(fixedDate));
		const [date3, setDate3] = React.useState<Date | undefined>(new Date(fixedDate));

		return (
			<div className="space-y-6">
				<div className="space-y-4">
					<h3 className="text-sm font-medium">Button Sizes:</h3>

					<div className="space-y-2">
						<p className="text-xs text-muted-foreground">Small size:</p>
						<DatePicker
							date={date1}
							onDateChange={setDate1}
							buttonSize="sm"
							showTime={false}
							showTimezone={false}
						/>
					</div>

					<div className="space-y-2">
						<p className="text-xs text-muted-foreground">Medium size (default):</p>
						<DatePicker
							date={date2}
							onDateChange={setDate2}
							buttonSize="md"
							showTime={false}
							showTimezone={false}
						/>
					</div>

					<div className="space-y-2">
						<p className="text-xs text-muted-foreground">Large size:</p>
						<DatePicker
							date={date3}
							onDateChange={setDate3}
							buttonSize="lg"
							showTime={false}
							showTimezone={false}
						/>
					</div>
				</div>
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));

		return (
			<div className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-2">Disabled State:</h3>
					<p className="text-sm text-muted-foreground">
						The picker is disabled and cannot be interacted with.
					</p>
				</div>
				<DatePicker
					date={date}
					onDateChange={setDate}
					disabled={true}
					showTime={false}
					showTimezone={false}
				/>
			</div>
		);
	},
};
