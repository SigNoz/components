import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { Calendar } from '../calendar/index.js';
import { Input } from '../input/index.js';
import { cn } from '../lib/utils.js';
import { ALL_TIMEZONES } from './constants.js';
import styles from './date-picker.module.css';

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
	calendarProps?: Omit<React.ComponentProps<typeof Calendar>, 'mode' | 'selected' | 'onSelect'>;
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
	const formatDisplayDate = (date: Date | undefined, tz: string, timeStr: string) => {
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

	const defaultTrigger = (
		<button
			type="button"
			className={cn(styles['date-picker__trigger'], className)}
			data-variant={buttonVariant}
			data-size={buttonSize}
			onClick={() => setOpen(!open)}
			disabled={disabled}
		>
			<CalendarIcon className={styles['date-picker__trigger-icon']} />
			<span className={styles['date-picker__trigger-text']}>
				{formatDisplayDate(localDate, localTimezone, localTime)}
			</span>
			<ChevronDown className={styles['date-picker__trigger-icon']} />
		</button>
	);

	const defaultActions = (
		<div className={styles['date-picker__actions']}>
			<button
				type="button"
				onClick={handleCancel}
				className={cn(
					styles['date-picker__action-button'],
					styles['date-picker__action-button--cancel']
				)}
			>
				Cancel
			</button>
			<button
				type="button"
				onClick={handleOk}
				className={cn(
					styles['date-picker__action-button'],
					styles['date-picker__action-button--ok']
				)}
			>
				OK
			</button>
		</div>
	);

	return (
		<div className={cn(styles['date-picker'], 'periscope-date-picker')}>
			{trigger || defaultTrigger}

			{open && (
				<div className={styles['date-picker__popover']}>
					<div className={styles['date-picker__content']}>
						<div>
							<Calendar
								mode="single"
								selected={localDate}
								onSelect={handleDateSelect}
								className={styles['date-picker__calendar']}
								{...calendarProps}
							/>
						</div>

						{/* Time and Timezone Selection */}
						{(showTime || showTimezone) && (
							<div className={styles['date-picker__controls']}>
								{/* Time Selection */}
								{showTime && (
									<div className={cn(styles['date-picker__control-row'], 'time-selector')}>
										<label className={styles['date-picker__control-label']}>Time</label>
										<Input
											type="time"
											id="time-picker"
											value={localTime}
											onChange={(e) => handleTimeChange(e.target.value)}
											step="1"
											className={styles['date-picker__time-input']}
										/>
									</div>
								)}

								{/* Timezone Selection */}
								{showTimezone && (
									<div className={cn(styles['date-picker__control-row'], 'timezone-selector')}>
										<label className={styles['date-picker__control-label']}>Timezone</label>
										<select
											value={localTimezone}
											onChange={(e) => handleTimezoneChange(e.target.value)}
											className={styles['date-picker__timezone-select']}
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
