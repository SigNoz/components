import './index.css';
import * as React from 'react';
import { Input } from '@signozhq/input';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { Calendar } from '@signozhq/calendar';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { cn } from './lib/utils';
import { ALL_TIMEZONES } from './constants';

// Extend dayjs with timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export interface DatePickerProps {
	/** The selected date */
	date?: Date;
	/** Callback when date changes */
	onDateChange?: (date: Date | undefined) => void;
	/** The selected time in HH:mm:ss format */
	time?: string;
	/** Callback when time changes */
	onTimeChange?: (time: string) => void;
	/** The selected timezone */
	timezone?: string;
	/** Callback when timezone changes */
	onTimezoneChange?: (timezone: string) => void;
	/** Available timezones */
	timezones?: readonly { value: string; label: string }[];
	/** Whether to show timezone selection */
	showTimezone?: boolean;
	/** Whether to show time selection */
	showTime?: boolean;
	/** Placeholder text */
	placeholder?: string;
	/** Whether the picker is disabled */
	disabled?: boolean;
	/** Additional CSS classes */
	className?: string;
	/** Button variant */
	buttonVariant?: 'default' | 'outline' | 'ghost';
	/** Button size */
	buttonSize?: 'sm' | 'md' | 'lg';
	/** Calendar props */
	calendarProps?: Omit<
		React.ComponentProps<typeof Calendar>,
		'mode' | 'selected' | 'onSelect'
	>;
	/** Whether to close popover on date selection */
	closeOnSelect?: boolean;
	/** Custom trigger element */
	trigger?: React.ReactNode;
	/** Whether to show action buttons (Cancel/OK) */
	showActions?: boolean;
	/** Custom action buttons */
	actions?: React.ReactNode;
}

export const TIMEZONES = ALL_TIMEZONES.map((tz) => ({
	value: tz,
	label: tz,
}));

export function DatePicker({
	date,
	onDateChange,
	time = '12:00:00',
	onTimeChange,
	timezone = 'UTC',
	onTimezoneChange,
	timezones = TIMEZONES,
	showTimezone = false,
	showTime = false,
	placeholder = 'Pick a date',
	disabled = false,
	className,
	buttonVariant = 'outline',
	buttonSize = 'sm',
	calendarProps,
	closeOnSelect = true,
	trigger,
	showActions = false,
	actions,
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false);
	const [localDate, setLocalDate] = React.useState<Date | undefined>(date);
	const [localTime, setLocalTime] = React.useState(time);
	const [localTimezone, setLocalTimezone] = React.useState(timezone);

	// Update local state when props change
	React.useEffect(() => {
		setLocalDate(date);
	}, [date]);

	React.useEffect(() => {
		setLocalTime(time);
	}, [time]);

	React.useEffect(() => {
		setLocalTimezone(timezone);
	}, [timezone]);

	// Format date for display
	const formatDisplayDate = (
		date: Date | undefined,
		tz: string,
		timeStr: string,
	) => {
		if (!date) return placeholder;

		// If only date is needed
		if (!showTime && !showTimezone) {
			return dayjs(date).format('MMM DD, YYYY');
		}

		// If time is included
		if (showTime && !showTimezone) {
			return `${dayjs(date).format('MMM DD, YYYY')} at ${timeStr}`;
		}

		// If timezone is included
		if (showTimezone) {
			try {
				// Create a date with the selected time
				const [hours, minutes, seconds] = timeStr.split(':').map(Number);
				const dateWithTime = new Date(date);
				dateWithTime.setHours(hours, minutes, seconds || 0);

				// Format in the selected timezone using dayjs
				const formattedDate = dayjs(dateWithTime).tz(tz).format('MMM DD, YYYY');
				const formattedTime = dayjs(dateWithTime).tz(tz).format('HH:mm:ss');

				return `${formattedDate} at ${formattedTime} (${tz})`;
			} catch {
				// Fallback to local formatting
				return `${dayjs(date).format('MMM DD, YYYY')} at ${timeStr}`;
			}
		}

		return dayjs(date).format('MMM DD, YYYY');
	};

	// Handle date selection
	const handleDateSelect = (selectedDate: Date | undefined) => {
		setLocalDate(selectedDate);
		if (onDateChange) {
			onDateChange(selectedDate);
		}
		if (closeOnSelect && !showTime && !showTimezone) {
			setOpen(false);
		}
	};

	// Handle time change
	const handleTimeChange = (newTime: string) => {
		setLocalTime(newTime);
		if (onTimeChange) {
			onTimeChange(newTime);
		}
	};

	// Handle timezone change
	const handleTimezoneChange = (newTimezone: string) => {
		setLocalTimezone(newTimezone);
		if (onTimezoneChange) {
			onTimezoneChange(newTimezone);
		}
	};

	// Handle OK button click
	const handleOk = () => {
		setOpen(false);
	};

	// Handle Cancel button click
	const handleCancel = () => {
		// Reset local state to original values
		setLocalDate(date);
		setLocalTime(time);
		setLocalTimezone(timezone);
		setOpen(false);
	};

	// Get button classes based on variant and size
	const getButtonClasses = () => {
		const baseClasses = 'justify-between font-normal';

		const variantClasses = {
			default: 'bg-primary text-primary-foreground hover:bg-primary/90',
			outline:
				'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
		};

		const sizeClasses = {
			sm: 'h-8 px-3 text-sm',
			md: 'h-10 px-4 py-2',
			lg: 'h-12 px-6 text-lg',
		};

		return cn(
			'inline-flex items-center gap-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
			variantClasses[buttonVariant],
			sizeClasses[buttonSize],
			baseClasses,
			className,
		);
	};

	const defaultTrigger = (
		<button
			type="button"
			className={getButtonClasses()}
			onClick={() => setOpen(!open)}
			disabled={disabled}
		>
			<CalendarIcon className="h-4 w-4" />
			<span className="flex-1 text-left">
				{formatDisplayDate(localDate, localTimezone, localTime)}
			</span>
			<ChevronDown className="h-4 w-4" />
		</button>
	);

	const defaultActions = (
		<div className="flex justify-end gap-2 pt-3 border-t">
			<button
				type="button"
				onClick={handleCancel}
				className="px-3 py-2 text-sm border border-input rounded-md hover:bg-accent"
			>
				Cancel
			</button>
			<button
				type="button"
				onClick={handleOk}
				className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
			>
				OK
			</button>
		</div>
	);

	return (
		<div className="relative periscope-date-picker">
			{trigger || defaultTrigger}

			{open && (
				<div className="absolute top-full left-0 mt-2 z-50 bg-background border border-border rounded-md shadow-lg p-4 min-w-[320px]">
					<div className="space-y-4">
						<div className="calendar-container">
							<Calendar
								mode="single"
								selected={localDate}
								onSelect={handleDateSelect}
								className="rounded-md border"
								{...calendarProps}
							/>
						</div>

						{/* Time and Timezone Selection */}
						{(showTime || showTimezone) && (
							<div className="space-y-3 pt-3 flex flex-col gap-2">
								{/* Time Selection */}
								{showTime && (
									<div className="flex flex-row  items-center justify-between gap-2 time-selector">
										<label className="text-xs font-normal block">Time</label>
										<Input
											type="time"
											id="time-picker"
											value={localTime}
											onChange={(e) => handleTimeChange(e.target.value)}
											step="1"
											className="w-1/2 px-3 px-2 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
										/>
									</div>
								)}

								{/* Timezone Selection */}
								{showTimezone && (
									<div className="flex flex-row items-center justify-between gap-2 timezone-selector">
										<label className="text-xs font-normal block">Timezone</label>
										<select
											value={localTimezone}
											onChange={(e) => handleTimezoneChange(e.target.value)}
											className="w-1/2 px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
										>
											{timezones.map((tz) => (
												<option key={tz.value} value={tz.value}>
													{tz.label}
												</option>
											))}
										</select>
									</div>
								)}
							</div>
						)}

						{/* Action Buttons */}
						{showActions && (actions || defaultActions)}
					</div>
				</div>
			)}
		</div>
	);
}

export { DatePicker as default };
