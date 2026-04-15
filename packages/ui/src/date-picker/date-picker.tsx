import { Calendar as CalendarIcon, ChevronDown } from '@signozhq/icons';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import * as React from 'react';
import {
	Button,
	type ButtonColorValue,
	type ButtonSizeValue,
	type ButtonVariantValue,
} from '../button/index.js';
import { Calendar } from '../calendar/index.js';
import { ComboboxSimple, type ComboboxSimpleItem } from '../combobox/index.js';
import { Input } from '../input/index.js';
import { cn } from '../lib/utils.js';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/index.js';
import { ALL_TIMEZONES } from './constants.js';
import styles from './date-picker.module.css';

// Extend dayjs with timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export type DatePickerProps = {
	/**
	 * The id of the date picker.
	 */
	id?: string;
	/**
	 * The selected date.
	 */
	date?: Date;
	/**
	 * Callback when date changes.
	 */
	onDateChange?: (date: Date | undefined) => void;
	/**
	 * The selected time in HH:mm:ss format.
	 * @default '12:00:00'
	 */
	time?: string;
	/**
	 * Callback when time changes.
	 */
	onTimeChange?: (time: string) => void;
	/**
	 * The selected timezone.
	 * @default 'UTC'
	 */
	timezone?: string;
	/**
	 * Callback when timezone changes.
	 */
	onTimezoneChange?: (timezone: string) => void;
	/**
	 * Available timezones.
	 */
	timezones?: readonly { value: string; label: string }[];
	/**
	 * Whether to show timezone selection.
	 * @default false
	 */
	showTimezone?: boolean;
	/**
	 * Whether to show time selection.
	 * @default false
	 */
	showTime?: boolean;
	/**
	 * Placeholder text.
	 * @default 'Pick a date'
	 */
	placeholder?: string;
	/**
	 * Whether the picker is disabled.
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Additional CSS classes.
	 */
	className?: string;
	/**
	 * Inline styles applied to the default trigger button. Ignored when using a custom `trigger`.
	 */
	style?: React.CSSProperties;
	/**
	 * Additional CSS classes for the popover content.
	 */
	popoverContentClassName?: string;
	/**
	 * Button variant.
	 * @default 'outlined'
	 */
	buttonVariant?: ButtonVariantValue;
	/**
	 * Button color.
	 * @default 'secondary'
	 */
	buttonColor?: ButtonColorValue;
	/**
	 * Button size.
	 * @default 'md'
	 */
	buttonSize?: ButtonSizeValue;
	/**
	 * Calendar props.
	 */
	calendarProps?: Omit<React.ComponentProps<typeof Calendar>, 'mode' | 'selected' | 'onSelect'>;
	/**
	 * Whether to close popover on date selection.
	 * @default true
	 */
	closeOnSelect?: boolean;
	/**
	 * Custom trigger element.
	 */
	trigger?: React.ReactNode;
	/**
	 * Whether to show action buttons (Cancel/OK).
	 * @default false
	 */
	showActions?: boolean;
	/**
	 * Custom action buttons.
	 */
	actions?: React.ReactNode;
	/**
	 * Test ID for the date picker.
	 */
	testId?: string;
};

export const TIMEZONES = ALL_TIMEZONES.map((tz) => ({
	value: tz,
	label: tz,
}));

/**
 * DatePicker component for selecting dates with optional time and timezone support.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [date, setDate] = React.useState<Date | undefined>();
 * <DatePicker date={date} onDateChange={setDate} />
 * ```
 *
 * @example
 * ```tsx
 * // With time selection
 * const [date, setDate] = React.useState<Date | undefined>();
 * const [time, setTime] = React.useState('12:00:00');
 * <DatePicker
 *   date={date}
 *   onDateChange={setDate}
 *   time={time}
 *   onTimeChange={setTime}
 *   showTime
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With timezone selection
 * const [date, setDate] = React.useState<Date | undefined>();
 * const [time, setTime] = React.useState('12:00:00');
 * const [tz, setTz] = React.useState('UTC');
 * <DatePicker
 *   date={date}
 *   onDateChange={setDate}
 *   time={time}
 *   onTimeChange={setTime}
 *   timezone={tz}
 *   onTimezoneChange={setTz}
 *   showTime
 *   showTimezone
 * />
 * ```
 */
export function DatePicker({
	id,
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
	style,
	popoverContentClassName,
	buttonVariant = 'outlined',
	buttonColor = 'secondary',
	buttonSize = 'md',
	calendarProps,
	closeOnSelect = true,
	trigger,
	showActions = false,
	actions,
	testId,
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

		// If timezone is included (with time)
		if (showTimezone && showTime) {
			// Display the date, time as entered, and timezone without conversion
			// The time represents the time in the selected timezone
			return `${dayjs(date).format('MMM DD, YYYY')} at ${timeStr} (${tz})`;
		}

		// If only timezone is included (without time)
		if (showTimezone && !showTime) {
			return `${dayjs(date).format('MMM DD, YYYY')} (${tz})`;
		}

		return dayjs(date).format('MMM DD, YYYY');
	};

	// Handle date selection
	const handleDateSelect = (selectedDate: Date | undefined) => {
		setLocalDate(selectedDate);
		// Only notify parent immediately if showActions is false
		if (!showActions && onDateChange) {
			onDateChange(selectedDate);
		}
		if (closeOnSelect && !showTime && !showTimezone && !showActions) {
			setOpen(false);
		}
	};

	// Handle time change
	const handleTimeChange = (newTime: string) => {
		setLocalTime(newTime);
		// Only notify parent immediately if showActions is false
		if (!showActions && onTimeChange) {
			onTimeChange(newTime);
		}
	};

	// Handle timezone change
	const handleTimezoneChange = (newTimezone: string) => {
		setLocalTimezone(newTimezone);
		// Only notify parent immediately if showActions is false
		if (!showActions && onTimezoneChange) {
			onTimezoneChange(newTimezone);
		}
	};

	// Handle OK button click
	const handleOk = () => {
		// When showActions is true, commit changes only on OK
		if (onDateChange && localDate !== date) {
			onDateChange(localDate);
		}
		if (onTimeChange && localTime !== time) {
			onTimeChange(localTime);
		}
		if (onTimezoneChange && localTimezone !== timezone) {
			onTimezoneChange(localTimezone);
		}
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

	// Convert timezones to ComboboxSimpleItem format
	const timezoneItems: ComboboxSimpleItem[] = React.useMemo(
		() =>
			timezones.map((tz) => ({
				value: tz.value,
				label: tz.label,
			})),
		[timezones]
	);

	const displayText = formatDisplayDate(localDate, localTimezone, localTime);
	const isPlaceholder = displayText === placeholder;

	const defaultTrigger = (
		<Button
			variant={buttonVariant}
			color={buttonColor}
			disabled={disabled}
			size={buttonSize}
			className={cn(styles['datePicker__trigger'], className)}
			style={style}
			testId={testId ? `${testId}-trigger` : undefined}
			prefix={<CalendarIcon className={styles['datePicker__triggerIcon']} />}
			suffix={<ChevronDown className={styles['datePicker__triggerIcon']} />}
		>
			<span
				className={cn(
					styles['datePicker__triggerText'],
					isPlaceholder && styles['datePicker__triggerText--placeholder']
				)}
			>
				{displayText}
			</span>
		</Button>
	);

	const defaultActions = (
		<div className={styles['datePicker__actions']}>
			<Button
				variant="outlined"
				color="secondary"
				size="sm"
				onClick={handleCancel}
				testId={testId ? `${testId}-cancel` : undefined}
			>
				Cancel
			</Button>
			<Button
				variant="solid"
				color="primary"
				size="sm"
				onClick={handleOk}
				testId={testId ? `${testId}-ok` : undefined}
			>
				OK
			</Button>
		</div>
	);

	return (
		<Popover open={open} onOpenChange={setOpen} testId={testId}>
			<PopoverTrigger asChild testId={testId ? `${testId}-popover-trigger` : undefined} id={id}>
				{trigger || defaultTrigger}
			</PopoverTrigger>
			<PopoverContent
				align="start"
				arrow
				className={cn(styles['datePicker__content'], popoverContentClassName)}
				testId={testId ? `${testId}-content` : undefined}
			>
				<div className={styles['datePicker__calendar']}>
					<Calendar
						mode="single"
						selected={localDate}
						onSelect={handleDateSelect}
						{...calendarProps}
					/>
				</div>

				{/* Time and Timezone Selection */}
				{(showTime || showTimezone) && (
					<div className={styles['datePicker__controls']}>
						{/* Time Selection */}
						{showTime && (
							<div className={styles['datePicker__fieldRow']}>
								<label className={styles['datePicker__fieldLabel']}>Time</label>
								<Input
									type="time"
									value={localTime}
									onChange={(e) => handleTimeChange(e.target.value)}
									step="1"
									className={styles['datePicker__timeInput']}
								/>
							</div>
						)}

						{/* Timezone Selection */}
						{showTimezone && (
							<div className={styles['datePicker__fieldRow']}>
								<label className={styles['datePicker__fieldLabel']}>Timezone</label>
								<div className={styles['datePicker__timezoneCombobox']}>
									<ComboboxSimple
										withPortal={false}
										items={timezoneItems}
										value={localTimezone}
										onChange={handleTimezoneChange}
										placeholder="Select timezone..."
									/>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Action Buttons */}
				{showActions && (actions || defaultActions)}
			</PopoverContent>
		</Popover>
	);
}

export { DatePicker as default };
