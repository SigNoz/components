import './index.css';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';
import { type DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';
import {
	Button,
	ButtonColor,
	type ButtonColorValue,
	ButtonSize,
	ButtonVariant,
	buttonVariants,
} from '../button/index.js';
import { cn } from '../lib/utils.js';
import styles from './calendar.module.css';

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = 'label',
	buttonVariant = ButtonVariant.Ghost,
	formatters,
	components,
	...props
}: React.ComponentProps<Exclude<typeof DayPicker, 'color'>> & {
	buttonVariant?: React.ComponentProps<typeof Button>['variant'];
	color?: React.ComponentProps<typeof Button>['color'] & string;
}) {
	const defaultClassNames = getDefaultClassNames();

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(styles['calendar'], 'group/calendar', className)}
			captionLayout={captionLayout}
			formatters={{
				formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
				...formatters,
			}}
			classNames={{
				root: cn('w-fit periscope-calendar', defaultClassNames.root),
				months: cn(styles['calendar__months'], defaultClassNames.months),
				month: cn(styles['calendar__month'], defaultClassNames.month),
				nav: cn(styles['calendar__nav'], defaultClassNames.nav),
				button_previous: cn(
					buttonVariants({ variant: buttonVariant }),
					styles['calendar__button-nav'],
					'btn-previous',
					defaultClassNames.button_previous
				),
				button_next: cn(
					buttonVariants({ variant: buttonVariant }),
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
				hidden: cn(
					styles['calendar__hidden'],
					'periscope-calendar-hidden',
					defaultClassNames.hidden
				),
				...classNames,
			}}
			components={{
				// eslint-disable-next-line react/prop-types
				Root: ({ className, rootRef, ...props }) => {
					return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
				},
				// eslint-disable-next-line react/prop-types
				Chevron: ({ className, orientation, ...props }) => {
					if (orientation === 'left') {
						return (
							<ChevronLeftIcon className={cn(styles['calendar__chevron'], className)} {...props} />
						);
					}

					if (orientation === 'right') {
						return (
							<ChevronRightIcon className={cn(styles['calendar__chevron'], className)} {...props} />
						);
					}

					return (
						<ChevronDownIcon className={cn(styles['calendar__chevron'], className)} {...props} />
					);
				},
				DayButton: CalendarDayButton,
				WeekNumber: ({ children, ...props }) => {
					return (
						<td {...props}>
							<div
								className={cn(
									styles['calendar__week-number-cell'],
									'periscope-calendar-week-number'
								)}
							>
								{children}
							</div>
						</td>
					);
				},
				...components,
			}}
			{...props}
		/>
	);
}

function CalendarDayButton({
	className,
	day,
	modifiers,
	suffix,
	prefix,
	...props
}: React.ComponentProps<Exclude<typeof DayButton, 'color' | 'suffix' | 'prefix'>> & {
	color?: ButtonColorValue;
	suffix?: string;
	prefix?: string;
}) {
	const defaultClassNames = getDefaultClassNames();

	const ref = React.useRef<HTMLButtonElement>(null);
	React.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);

	return (
		<Button
			ref={ref}
			variant={ButtonVariant.Ghost}
			size={ButtonSize.Icon}
			data-day={day.date.toLocaleDateString()}
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

export { Calendar, CalendarDayButton };
