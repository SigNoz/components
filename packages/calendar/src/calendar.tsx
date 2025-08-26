import './index.css';
import * as React from 'react';
import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from 'lucide-react';
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';

import { cn } from './lib/utils';
import { Button, buttonVariants } from '@signozhq/button';

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = 'label',
	buttonVariant = 'ghost',
	formatters,
	components,
	...props
}: React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
	const defaultClassNames = getDefaultClassNames();

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				'bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
				String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
				String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
				className,
			)}
			captionLayout={captionLayout}
			formatters={{
				formatMonthDropdown: (date) =>
					date.toLocaleString('default', { month: 'short' }),
				...formatters,
			}}
			classNames={{
				root: cn('w-fit periscope-calendar', defaultClassNames.root),
				months: cn(
					'flex gap-4 flex-col md:flex-row relative',
					defaultClassNames.months,
				),
				month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
				nav: cn(
					'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
					defaultClassNames.nav,
				),
				button_previous: cn(
					buttonVariants({ variant: buttonVariant }),
					'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none btn-previous',
					defaultClassNames.button_previous,
				),
				button_next: cn(
					buttonVariants({ variant: buttonVariant }),
					'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none btn-next',
					defaultClassNames.button_next,
				),
				month_caption: cn(
					'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
					defaultClassNames.month_caption,
				),
				dropdowns: cn(
					'w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5',
					defaultClassNames.dropdowns,
				),
				dropdown_root: cn(
					'relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md',
					defaultClassNames.dropdown_root,
				),
				dropdown: cn(
					'absolute bg-popover inset-0 opacity-0',
					defaultClassNames.dropdown,
				),
				caption_label: cn(
					'select-none font-medium',
					captionLayout === 'label'
						? 'text-sm'
						: 'rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5',
					defaultClassNames.caption_label,
				),
				table: 'w-full border-collapse periscope-calendar-table',
				weekdays: cn(
					'flex periscope-calendar-weekdays mb-2',
					defaultClassNames.weekdays,
				),
				weekday: cn(
					'text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none periscope-calendar-weekday',
					defaultClassNames.weekday,
				),
				week: cn(
					'flex gap-2 w-full periscope-calendar-week',
					defaultClassNames.week,
				),
				week_number_header: cn(
					'select-none w-(--cell-size) periscope-calendar-week-number-header',
					defaultClassNames.week_number_header,
				),
				week_number: cn(
					'text-[0.8rem] select-none text-muted-foreground periscope-calendar-week-number',
					defaultClassNames.week_number,
				),
				day: cn(
					'relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none periscope-calendar-day cursor-pointer',
					defaultClassNames.day,
				),
				range_start: cn(
					'rounded-l-md bg-accent periscope-calendar-range-start',
					defaultClassNames.range_start,
				),
				range_middle: cn(
					'rounded-none periscope-calendar-range-middle',
					defaultClassNames.range_middle,
				),
				range_end: cn(
					'rounded-r-md bg-accent periscope-calendar-range-end',
					defaultClassNames.range_end,
				),
				today: cn(
					'bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none periscope-calendar-today',
					defaultClassNames.today,
				),
				outside: cn(
					'text-muted-foreground aria-selected:text-muted-foreground periscope-calendar-outside',
					defaultClassNames.outside,
				),
				disabled: cn(
					'text-muted-foreground opacity-50 periscope-calendar-disabled',
					defaultClassNames.disabled,
				),
				hidden: cn('invisible periscope-calendar-hidden', defaultClassNames.hidden),
				...classNames,
			}}
			components={{
				// eslint-disable-next-line react/prop-types
				Root: ({ className, rootRef, ...props }) => {
					return (
						<div
							data-slot="calendar"
							ref={rootRef}
							className={cn(className)}
							{...props}
						/>
					);
				},
				// eslint-disable-next-line react/prop-types
				Chevron: ({ className, orientation, ...props }) => {
					if (orientation === 'left') {
						return (
							<ChevronLeftIcon
								className={cn('size-4 cursor-pointer', className)}
								{...props}
							/>
						);
					}

					if (orientation === 'right') {
						return (
							<ChevronRightIcon
								className={cn('size-4 cursor-pointer', className)}
								{...props}
							/>
						);
					}

					return (
						<ChevronDownIcon
							className={cn('size-4 cursor-pointer', className)}
							{...props}
						/>
					);
				},
				DayButton: CalendarDayButton,
				WeekNumber: ({ children, ...props }) => {
					return (
						<td {...props}>
							<div className="flex size-(--cell-size) items-center justify-center text-center periscope-calendar-week-number">
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
	...props
}: React.ComponentProps<typeof DayButton>) {
	const defaultClassNames = getDefaultClassNames();

	const ref = React.useRef<HTMLButtonElement>(null);
	React.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);

	return (
		<Button
			ref={ref}
			variant="ghost"
			size="icon"
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
			className={cn(
				'data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70',
				defaultClassNames.day,
				className,
			)}
			{...props}
		/>
	);
}

export { Calendar, CalendarDayButton };
