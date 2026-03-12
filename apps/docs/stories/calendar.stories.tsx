/* eslint-disable @typescript-eslint/no-explicit-any */

import { Calendar } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof Calendar> = {
	title: 'Components/Calendar',
	component: Calendar,
	argTypes: {
		mode: {
			control: { type: 'select' },
			options: ['single', 'range', 'multiple'],
			description:
				'Enable selection of a single day, multiple days, or a range of days. See https://daypicker.dev/docs/selection-modes',
			table: { category: 'Selection', type: { summary: "'single' | 'range' | 'multiple'" } },
		},
		required: {
			control: 'boolean',
			description: 'Whether the selection is required.',
			table: { category: 'Selection', type: { summary: 'boolean' } },
		},
		showOutsideDays: {
			control: 'boolean',
			description: 'Show the outside days (days falling in the next or the previous month).',
			table: {
				category: 'Display',
				defaultValue: { summary: 'true' },
				type: { summary: 'boolean' },
			},
		},
		captionLayout: {
			control: { type: 'select' },
			options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
			description:
				'Show dropdowns to navigate between months or years. "label" displays month/year as text.',
			table: {
				category: 'Display',
				defaultValue: { summary: 'label' },
				type: { summary: "'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'" },
			},
		},
		numberOfMonths: {
			control: { type: 'number', min: 1 },
			description: 'The number of displayed months.',
			table: { category: 'Display', defaultValue: { summary: '1' }, type: { summary: 'number' } },
		},
		fixedWeeks: {
			control: 'boolean',
			description: 'Display always 6 weeks per month.',
			table: { category: 'Display', type: { summary: 'boolean' } },
		},
		hideWeekdays: {
			control: 'boolean',
			description: 'Hide the row displaying the weekday names.',
			table: { category: 'Display', type: { summary: 'boolean' } },
		},
		showWeekNumber: {
			control: 'boolean',
			description: 'Show the week numbers column.',
			table: { category: 'Display', type: { summary: 'boolean' } },
		},
		hideNavigation: {
			control: 'boolean',
			description: 'Hide the navigation buttons (prev/next month).',
			table: { category: 'Navigation', type: { summary: 'boolean' } },
		},
		disableNavigation: {
			control: 'boolean',
			description: 'Disable navigation between months.',
			table: { category: 'Navigation', type: { summary: 'boolean' } },
		},
		pagedNavigation: {
			control: 'boolean',
			description: 'Paginate month navigation by numberOfMonths.',
			table: { category: 'Navigation', type: { summary: 'boolean' } },
		},
		reverseMonths: {
			control: 'boolean',
			description: 'Render months in reversed order when numberOfMonths > 1.',
			table: { category: 'Navigation', type: { summary: 'boolean' } },
		},
		navLayout: {
			control: { type: 'select' },
			options: ['around', 'after'],
			description: 'Position of the navigation buttons relative to the caption.',
			table: { category: 'Navigation', type: { summary: "'around' | 'after'" } },
		},
		animate: {
			control: 'boolean',
			description: 'Animate navigating between months.',
			table: { category: 'Display', type: { summary: 'boolean' } },
		},
		defaultMonth: {
			control: false,
			description: 'The initial month to show. Use with uncontrolled calendar.',
			table: { category: 'Navigation', type: { summary: 'Date' } },
		},
		month: {
			control: false,
			description: 'The displayed month (controlled). Use with onMonthChange.',
			table: { category: 'Navigation', type: { summary: 'Date' } },
		},
		startMonth: {
			control: false,
			description: 'The earliest month for navigation.',
			table: { category: 'Navigation', type: { summary: 'Date' } },
		},
		endMonth: {
			control: false,
			description: 'The latest month for navigation.',
			table: { category: 'Navigation', type: { summary: 'Date' } },
		},
		disabled: {
			control: false,
			description: 'Matcher(s) for disabled days. Disabled days cannot be selected.',
			table: { category: 'Selection', type: { summary: 'Matcher | Matcher[]' } },
		},
		hidden: {
			control: false,
			description: 'Matcher(s) for hidden days. Hidden days are not displayed.',
			table: { category: 'Display', type: { summary: 'Matcher | Matcher[]' } },
		},
		today: {
			control: false,
			description: "The date to use as 'today' for styling.",
			table: { category: 'Display', type: { summary: 'Date' } },
		},
		locale: {
			control: false,
			description: 'Locale object for localization. Pass a locale from react-day-picker/locale.',
			table: { category: 'Localization', type: { summary: 'DayPickerLocale' } },
		},
		weekStartsOn: {
			control: { type: 'select' },
			options: [0, 1, 2, 3, 4, 5, 6],
			description: 'The index of the first day of the week (0 = Sunday).',
			table: { category: 'Localization', type: { summary: '0 | 1 | 2 | 3 | 4 | 5 | 6' } },
		},
		timeZone: {
			control: 'text',
			description: 'IANA time zone or UTC offset for the calendar (experimental).',
			table: { category: 'Localization', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Class name for the root element.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		selected: {
			control: false,
			description: 'Selected date(s) or range. Type depends on mode.',
			table: { category: 'Selection' },
		},
		onSelect: {
			control: false,
			description: 'Called when selection changes.',
			table: { category: 'Events' },
		},
		onMonthChange: {
			control: false,
			description: 'Called when the user navigates between months.',
			table: { category: 'Events' },
		},
		footer: {
			control: 'text',
			description: 'Footer content (e.g. for screen readers).',
			table: { category: 'Accessibility', type: { summary: 'ReactNode | string' } },
		},
	},
};

export default meta;
type Story = StoryObj<typeof Calendar>;

const fixedDate = 1771949360343;

export const Default: Story = {
	args: {
		mode: 'single',
		showOutsideDays: true,
		captionLayout: 'label',
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));
		const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({});
		const [multiple, setMultiple] = React.useState<Date[]>([]);
		const mode = args.mode ?? 'single';
		const selected = mode === 'range' ? range : mode === 'multiple' ? multiple : date;
		const onSelect = mode === 'range' ? setRange : mode === 'multiple' ? setMultiple : setDate;
		return (
			<Calendar
				{...args}
				mode={mode}
				selected={selected as any}
				onSelect={onSelect as any}
				className="rounded-md border shadow-sm"
			/>
		);
	},
};

export const SingleDateSelection: Story = {
	args: {
		mode: 'single',
		showOutsideDays: true,
		captionLayout: 'label',
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));

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
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));

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
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));

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
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));

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
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));
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
		const formatDateTimeInTimezone = (date: Date | undefined, tz: string, timeStr: string) => {
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
				}).format(new Date(fixedDate));
			} catch {
				return new Date(fixedDate).toLocaleTimeString();
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
									<strong>{timezone}:</strong> {formatDateTimeInTimezone(date, timezone, time)}
								</p>
							</div>
						</div>

						<div>
							<h3 className="text-sm font-medium mb-2">Current Time:</h3>
							<div className="space-y-2">
								<p className="text-sm text-muted-foreground">
									<strong>Local:</strong> {new Date(fixedDate).toLocaleTimeString()}
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
						This example demonstrates how to handle dates and times with different timezones. The
						selected date and time are displayed in both local time and the chosen timezone. This
						shows how you can combine calendar selection with time input and timezone conversion for
						comprehensive datetime handling in your applications.
					</p>
				</div>
			</div>
		);
	},
};
