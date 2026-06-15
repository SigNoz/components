/* eslint-disable @typescript-eslint/no-explicit-any */

import { Calendar } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof Calendar> = {
	title: 'Composed Components/Calendar',
	component: Calendar,
	argTypes: {
		testId: {
			control: 'text',
			description: 'Test ID for the calendar.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the calendar.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
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
		style: {
			control: false,
			description: 'Inline styles: class name for the root element.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
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
				style={{
					borderRadius: '0.375rem',
					border: '1px solid var(--border)',
					boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				}}
			/>
		);
	},
};

function DateRangeSelectionPreview() {
	const [range, setRange] = React.useState<any>({
		from: undefined,
		to: undefined,
	});

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<div>
				<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
					Selected Range:
				</h3>
				<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
					{range.from && range.to
						? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
						: range.from
							? `${range.from.toLocaleDateString()} - Select end date`
							: 'Select start date'}
				</p>
			</div>
			<Calendar
				showOutsideDays
				captionLayout="label"
				mode="range"
				selected={range}
				onSelect={setRange}
				style={{
					borderRadius: '0.375rem',
					border: '1px solid var(--border)',
					boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				}}
			/>
		</div>
	);
}

function MultipleDateSelectionPreview() {
	const [selected, setSelected] = React.useState<any>([]);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<div>
				<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
					Selected Dates:
				</h3>
				<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
					{selected.length > 0
						? selected.map((date: Date) => date.toLocaleDateString()).join(', ')
						: 'No dates selected'}
				</p>
			</div>
			<Calendar
				showOutsideDays
				captionLayout="label"
				mode="multiple"
				selected={selected}
				onSelect={setSelected}
				style={{
					borderRadius: '0.375rem',
					border: '1px solid var(--border)',
					boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				}}
			/>
		</div>
	);
}

function WithDropdownNavigationPreview() {
	const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<div>
				<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
					Selected Date:
				</h3>
				<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
					{date ? date.toLocaleDateString() : 'No date selected'}
				</p>
			</div>
			<Calendar
				showOutsideDays
				captionLayout="dropdown"
				mode="single"
				selected={date}
				onSelect={setDate}
				style={{
					borderRadius: '0.375rem',
					border: '1px solid var(--border)',
					boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				}}
			/>
		</div>
	);
}

function HideOutsideDaysPreview() {
	const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));

	return (
		<Calendar
			showOutsideDays={false}
			captionLayout="label"
			mode="single"
			selected={date}
			onSelect={setDate}
			style={{
				borderRadius: '0.375rem',
				border: '1px solid var(--border)',
				boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
			}}
		/>
	);
}

function DisabledDatesPreview() {
	const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));

	// Disable weekends
	const disabledDays = [
		{ dayOfWeek: [0, 6] }, // Sunday and Saturday
	];

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<div>
				<p
					style={{
						fontSize: '0.875rem',
						color: 'var(--muted-foreground)',
						marginBottom: '0.5rem',
					}}
				>
					Weekends are disabled in this example
				</p>
			</div>
			<Calendar
				showOutsideDays
				captionLayout="label"
				mode="single"
				selected={date}
				onSelect={setDate}
				disabled={disabledDays}
				style={{
					borderRadius: '0.375rem',
					border: '1px solid var(--border)',
					boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				}}
			/>
		</div>
	);
}

function WithTimezonePreview() {
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
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
						gap: '1rem',
					}}
				>
					<div>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
							Timezone Selection:
						</h3>
						<select
							value={timezone}
							onChange={(e) => setTimezone(e.target.value)}
							style={{
								width: '100%',
								paddingLeft: '0.75rem',
								paddingRight: '0.75rem',
								paddingTop: '0.5rem',
								paddingBottom: '0.5rem',
								border: '1px solid var(--border)',
								borderColor: 'var(--input)',
								borderRadius: '0.375rem',
								fontSize: '0.875rem',
							}}
						>
							{timezones.map((tz) => (
								<option key={tz.value} value={tz.value}>
									{tz.label}
								</option>
							))}
						</select>
					</div>

					<div>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
							Time Selection:
						</h3>
						<input
							type="time"
							value={time}
							onChange={(e) => setTime(e.target.value)}
							step="1"
							style={{
								width: '100%',
								paddingLeft: '0.75rem',
								paddingRight: '0.75rem',
								paddingTop: '0.5rem',
								paddingBottom: '0.5rem',
								border: '1px solid var(--border)',
								borderColor: 'var(--input)',
								borderRadius: '0.375rem',
								fontSize: '0.875rem',
							}}
						/>
					</div>
				</div>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
						gap: '1rem',
					}}
				>
					<div>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
							Selected Date & Time:
						</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
								<strong>Local:</strong>{' '}
								{date ? `${date.toLocaleDateString()} at ${time}` : 'No date selected'}
							</p>
							<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
								<strong>{timezone}:</strong> {formatDateTimeInTimezone(date, timezone, time)}
							</p>
						</div>
					</div>

					<div>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
							Current Time:
						</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
								<strong>Local:</strong> {new Date(fixedDate).toLocaleTimeString()}
							</p>
							<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
								<strong>{timezone}:</strong> {getCurrentTimeInTimezone(timezone)}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div>
				<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Calendar:</h3>
				<Calendar
					showOutsideDays
					captionLayout="label"
					mode="single"
					selected={date}
					onSelect={setDate}
					style={{
						borderRadius: '0.375rem',
						border: '1px solid var(--border)',
						boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
					}}
				/>
			</div>

			<div style={{ padding: '1rem', backgroundColor: 'var(--muted)', borderRadius: '0.375rem' }}>
				<h4 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
					Date & Time with Timezone:
				</h4>
				<p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
					This example demonstrates how to handle dates and times with different timezones. The
					selected date and time are displayed in both local time and the chosen timezone. This
					shows how you can combine calendar selection with time input and timezone conversion for
					comprehensive datetime handling in your applications.
				</p>
			</div>
		</div>
	);
}

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: () => (
		<div
			style={{
				padding: '2rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '2.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Date Range Selection
				</h3>
				<DateRangeSelectionPreview />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Multiple Date Selection
				</h3>
				<MultipleDateSelectionPreview />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Dropdown Navigation
				</h3>
				<WithDropdownNavigationPreview />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Hide Outside Days
				</h3>
				<HideOutsideDaysPreview />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Disabled Dates
				</h3>
				<DisabledDatesPreview />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Timezone
				</h3>
				<WithTimezonePreview />
			</section>
		</div>
	),
};
