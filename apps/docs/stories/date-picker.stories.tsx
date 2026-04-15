import { DatePicker } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof DatePicker> = {
	title: 'Components/DatePicker',
	component: DatePicker,
	tags: ['autodocs'],
	argTypes: {
		id: {
			control: 'text',
			description: 'A unique identifier for the date picker.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		date: {
			control: false,
			description: 'The selected date.',
			table: { category: 'State', type: { summary: 'Date | undefined' } },
		},
		onDateChange: {
			control: false,
			description: 'Callback when date changes.',
			table: { category: 'Events', type: { summary: '(date: Date | undefined) => void' } },
		},
		time: {
			control: 'text',
			description: 'The selected time in HH:mm:ss format.',
			table: {
				category: 'State',
				type: { summary: 'string' },
				defaultValue: { summary: "'12:00:00'" },
			},
		},
		onTimeChange: {
			control: false,
			description: 'Callback when time changes.',
			table: { category: 'Events', type: { summary: '(time: string) => void' } },
		},
		timezone: {
			control: 'text',
			description: 'The selected timezone.',
			table: {
				category: 'State',
				type: { summary: 'string' },
				defaultValue: { summary: "'UTC'" },
			},
		},
		onTimezoneChange: {
			control: false,
			description: 'Callback when timezone changes.',
			table: { category: 'Events', type: { summary: '(timezone: string) => void' } },
		},
		placeholder: {
			control: 'text',
			description: 'Placeholder text.',
			table: {
				category: 'Content',
				type: { summary: 'string' },
				defaultValue: { summary: "'Pick a date'" },
			},
		},
		showTime: {
			control: 'boolean',
			description: 'Whether to show time selection.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		showTimezone: {
			control: 'boolean',
			description: 'Whether to show timezone selection.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		showActions: {
			control: 'boolean',
			description: 'Whether to show action buttons (Cancel/OK).',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		closeOnSelect: {
			control: 'boolean',
			description: 'Whether to close popover on date selection.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the picker is disabled.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		buttonVariant: {
			control: 'select',
			options: ['solid', 'outlined', 'dashed', 'ghost', 'link', 'action'],
			description: 'Button variant for the trigger.',
			table: {
				category: 'Appearance',
				type: { summary: 'ButtonVariantValue' },
				defaultValue: { summary: "'outlined'" },
			},
		},
		buttonColor: {
			control: 'select',
			options: ['primary', 'destructive', 'warning', 'secondary', 'none'],
			description: 'Button color for the trigger.',
			table: {
				category: 'Appearance',
				type: { summary: 'ButtonColorValue' },
				defaultValue: { summary: "'secondary'" },
			},
		},
		buttonSize: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
			description: 'Button size for the trigger.',
			table: {
				category: 'Appearance',
				type: { summary: 'ButtonSizeValue' },
				defaultValue: { summary: "'md'" },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		popoverContentClassName: {
			control: 'text',
			description: 'Additional CSS classes for the popover content.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		trigger: {
			control: false,
			description: 'Custom trigger element.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		actions: {
			control: false,
			description: 'Custom action buttons.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		timezones: {
			control: false,
			description: 'Available timezones.',
			table: {
				category: 'Content',
				type: { summary: 'readonly { value: string; label: string }[]' },
			},
		},
		calendarProps: {
			control: false,
			description: 'Calendar props.',
			table: { category: 'Content', type: { summary: 'CalendarProps' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the date picker.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

const fixedDate = 1771949360343; // 2026-02-24T16:09:20.343Z

export const Default: Story = {
	args: {
		placeholder: 'Pick a date',
		showTime: false,
		showTimezone: false,
		showActions: false,
		closeOnSelect: true,
		disabled: false,
		buttonVariant: 'outlined',
		buttonColor: 'secondary',
		buttonSize: 'md',
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));
		const [time, setTime] = React.useState(args.time ?? '12:00:00');
		const [timezone, setTimezone] = React.useState(args.timezone ?? 'UTC');

		return (
			<div className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-2">Selected Date:</h3>
					<p className="text-sm text-muted-foreground">
						{date
							? args.showTime
								? `${date.toLocaleDateString()} at ${time}${args.showTimezone ? ` (${timezone})` : ''}`
								: date.toLocaleDateString()
							: 'No date selected'}
					</p>
				</div>
				<DatePicker
					{...args}
					date={date}
					onDateChange={setDate}
					time={time}
					onTimeChange={setTime}
					timezone={timezone}
					onTimezoneChange={setTimezone}
				/>
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
						<p className="text-xs text-muted-foreground">Solid variant:</p>
						<DatePicker
							date={date1}
							onDateChange={setDate1}
							buttonVariant="solid"
							showTime={false}
							showTimezone={false}
						/>
					</div>

					<div className="space-y-2">
						<p className="text-xs text-muted-foreground">Outlined variant:</p>
						<DatePicker
							date={date2}
							onDateChange={setDate2}
							buttonVariant="outlined"
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
