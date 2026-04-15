import { ChevronDown, ChevronLeft, ChevronRight } from '@signozhq/icons';
import * as React from 'react';
import {
	type ClassNames,
	type DayButton,
	DayPicker,
	type DayPickerProps,
	type Formatters,
	getDefaultClassNames,
} from 'react-day-picker';
import { Button, ButtonColor, type ButtonColorValue, buttonVariants } from '../button/index.js';
import { cn } from '../lib/utils.js';
import styles from './calendar.module.scss';

export type CalendarProps = React.ComponentProps<Exclude<typeof DayPicker, 'color'>> & {
	/**
	 * The testId associated with the calendar.
	 */
	testId?: string;
	/**
	 * The id of the calendar.
	 */
	id?: string;
};

const defaultClassNames = getDefaultClassNames();

/**
 * Calendar is a styled wrapper around [React DayPicker](https://daypicker.dev/).
 * It accepts the same props as DayPicker; see the [DayPicker API](https://daypicker.dev/api/interfaces/PropsBase) for the full list.
 *
 * @example
 * ```tsx
 * // Basic calendar (no selection)
 * <Calendar />
 * ```
 *
 * @example
 * ```tsx
 * // Single date selection
 * const [date, setDate] = React.useState<Date | undefined>();
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 * ```
 *
 * @example
 * ```tsx
 * // Date range selection
 * const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({});
 * <Calendar mode="range" selected={range} onSelect={setRange} />
 * ```
 *
 * @example
 * ```tsx
 * // Multiple dates selection
 * const [selected, setSelected] = React.useState<Date[]>([]);
 * <Calendar mode="multiple" selected={selected} onSelect={setSelected} />
 * ```
 *
 * @example
 * ```tsx
 * // Disable specific days (e.g. weekends)
 * <Calendar
 *   mode="single"
 *   selected={date}
 *   onSelect={setDate}
 *   disabled={[{ dayOfWeek: [0, 6] }]}
 * />
 * ```
 */
export function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = 'label',
	formatters,
	components,
	testId,
	id,
	...props
}: CalendarProps) {
	const calendarFormatters = React.useMemo<Partial<Formatters>>(() => {
		return {
			formatMonthDropdown: (date: Date) => date.toLocaleString('default', { month: 'short' }),
			...formatters,
		};
	}, [formatters]);

	const calendarClassNames = React.useMemo<Partial<ClassNames>>(() => {
		return {
			root: cn(styles['calendar__root'], 'periscope-calendar', defaultClassNames.root),
			months: cn(styles['calendar__months'], defaultClassNames.months),
			month: cn(styles['calendar__month'], defaultClassNames.month),
			nav: cn(styles['calendar__nav'], defaultClassNames.nav),
			button_previous: cn(
				buttonVariants({ variant: 'ghost' }),
				styles['calendar__button-nav'],
				'btn-previous',
				defaultClassNames.button_previous
			),
			button_next: cn(
				buttonVariants({ variant: 'ghost' }),
				styles['calendar__button-nav'],
				'btn-next',
				defaultClassNames.button_next
			),
			month_caption: cn(styles['calendar__month-caption'], defaultClassNames.month_caption),
			dropdowns: cn(styles['calendar__dropdowns'], defaultClassNames.dropdowns),
			dropdown_root: cn(styles['calendar__dropdown-root'], defaultClassNames.dropdown_root),
			dropdown: cn(styles['calendar__dropdown'], defaultClassNames.dropdown),
			caption_label: cn(
				styles['calendar__caption-label'],
				captionLayout === 'label'
					? styles['calendar__caption-label--label']
					: styles['calendar__caption-label--dropdown'],
				defaultClassNames.caption_label
			),
			table: cn(styles['calendar__table'], 'periscope-calendar-table'),
			weekdays: cn(
				styles['calendar__weekdays'],
				'periscope-calendar-weekdays',
				defaultClassNames.weekdays
			),
			weekday: cn(
				styles['calendar__weekday'],
				'periscope-calendar-weekday',
				defaultClassNames.weekday
			),
			week: cn(styles['calendar__week'], 'periscope-calendar-week', defaultClassNames.week),
			week_number_header: cn(
				styles['calendar__week-number-header'],
				'periscope-calendar-week-number-header',
				defaultClassNames.week_number_header
			),
			week_number: cn(
				styles['calendar__week-number'],
				'periscope-calendar-week-number',
				defaultClassNames.week_number
			),
			day: cn(styles['calendar__day'], 'group/day periscope-calendar-day', defaultClassNames.day),
			range_start: cn(
				styles['calendar__range-start'],
				'periscope-calendar-range-start',
				defaultClassNames.range_start
			),
			range_middle: cn(
				styles['calendar__range-middle'],
				'periscope-calendar-range-middle',
				defaultClassNames.range_middle
			),
			range_end: cn(
				styles['calendar__range-end'],
				'periscope-calendar-range-end',
				defaultClassNames.range_end
			),
			today: cn(styles['calendar__today'], 'periscope-calendar-today', defaultClassNames.today),
			outside: cn(
				styles['calendar__outside'],
				'periscope-calendar-outside',
				defaultClassNames.outside
			),
			disabled: cn(
				styles['calendar__disabled'],
				'periscope-calendar-disabled',
				defaultClassNames.disabled
			),
			hidden: cn(styles['calendar__hidden'], 'periscope-calendar-hidden', defaultClassNames.hidden),
			...classNames,
		};
	}, []);

	const calendarComponents = React.useMemo<DayPickerProps['components']>(() => {
		return {
			// eslint-disable-next-line react/prop-types
			Root: ({ className: rootClassName, rootRef, ...rootProps }) => {
				return (
					<div
						data-slot="calendar"
						data-testid={testId}
						id={id}
						ref={rootRef}
						className={cn(rootClassName)}
						{...rootProps}
					/>
				);
			},
			// eslint-disable-next-line react/prop-types
			Chevron: ({ className, orientation, ...props }) => {
				if (orientation === 'left') {
					return <ChevronLeft className={cn(styles['calendar__chevron'], className)} {...props} />;
				}

				if (orientation === 'right') {
					return <ChevronRight className={cn(styles['calendar__chevron'], className)} {...props} />;
				}

				return <ChevronDown className={cn(styles['calendar__chevron'], className)} {...props} />;
			},
			DayButton: CalendarDayButton,
			WeekNumber: ({ children, ...props }) => {
				return (
					<td {...props}>
						<div
							className={cn(styles['calendar__week-number-cell'], 'periscope-calendar-week-number')}
						>
							{children}
						</div>
					</td>
				);
			},
			...components,
		};
	}, [components]);

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(styles['calendar'], 'group/calendar', className)}
			captionLayout={captionLayout}
			formatters={calendarFormatters}
			classNames={calendarClassNames}
			components={calendarComponents}
			{...props}
		/>
	);
}

export type CalendarDayButtonProps = React.ComponentProps<
	Exclude<typeof DayButton, 'color' | 'suffix' | 'prefix'>
> & {
	color?: ButtonColorValue;
	suffix?: string;
	prefix?: string;
};

/**
 * Custom day cell button used by Calendar. Typically passed via `components.DayButton`;
 * can be overridden for custom day rendering.
 */
export function CalendarDayButton({
	className,
	day,
	modifiers,
	suffix,
	prefix,
	...props
}: CalendarDayButtonProps) {
	const ref = React.useRef<HTMLButtonElement>(null);
	React.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);

	const dataDay = React.useMemo(() => {
		return day.date.toLocaleDateString();
	}, [day.date]);

	return (
		<Button
			ref={ref}
			variant="ghost"
			size="icon"
			data-day={dataDay}
			data-selected-single={
				modifiers.selected &&
				!modifiers.range_start &&
				!modifiers.range_end &&
				!modifiers.range_middle
			}
			data-range-start={modifiers.range_start}
			data-range-end={modifiers.range_end}
			data-range-middle={modifiers.range_middle}
			color={ButtonColor.None}
			prefix={prefix ? <>{prefix}</> : undefined}
			suffix={suffix ? <>{suffix}</> : undefined}
			className={cn(styles['calendar__day-button'], defaultClassNames.day, className)}
			{...props}
		/>
	);
}
