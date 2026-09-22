import { type ReactElement, useEffect, useMemo, useRef } from 'react';
import { useCalendarTestIdStem } from '../calendar-context.js';
import styles from '../calendar.module.scss';
import { CalendarButtonVariant } from '../constants.js';
import type { CalendarDayButtonProps } from '../types.js';
import { formatDayTestId } from '../utils.js';
import { CalendarButton } from './calendar-button.js';

/**
 * One date cell in the grid.
 *
 * `Calendar` passes it as `components.DayButton`. It takes focus itself whenever react-day-picker
 * marks the day `focused`, which is how arrow-key navigation moves across the grid.
 *
 * Pass it again through `components.DayButton` with a `prefix` or a `suffix` to mark a day, for
 * instance with a dot on the days that have data.
 *
 * @example
 * ```tsx
 * function MarkedDay(props: CalendarDayButtonProps) {
 *   return <CalendarDayButton {...props} suffix={hasData(props.day.date) ? <Dot /> : undefined} />;
 * }
 *
 * <Calendar mode="single" components={{ DayButton: MarkedDay }} />;
 * ```
 */
export function CalendarDayButton({
	className,
	day,
	modifiers,
	prefix,
	suffix,
	testId,
	children,
	...props
}: CalendarDayButtonProps): ReactElement {
	const ref = useRef<HTMLButtonElement>(null);
	const stem = useCalendarTestIdStem();

	// react-day-picker moves focus by flipping this modifier rather than by touching the DOM, so
	// the button it lands on is the one that has to call `focus()`.
	useEffect(() => {
		if (modifiers.focused) {
			ref.current?.focus();
		}
	}, [modifiers.focused]);

	const dayTestId = useMemo(() => {
		if (testId !== undefined) {
			return testId;
		}

		return stem === undefined ? undefined : `${stem}-button-${formatDayTestId(day.date)}`;
	}, [testId, stem, day.date]);

	// A range paints its own three positions, so a day inside one is not also "the selected day".
	const isSelectedSingle =
		modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle;

	return (
		<CalendarButton
			ref={ref}
			variant={CalendarButtonVariant.Day}
			// react-day-picker's own `yyyy-MM-dd`, read through the date library the `timeZone` prop
			// configures rather than off the raw `Date`.
			data-day={day.isoDate}
			data-today={modifiers.today || undefined}
			data-outside={day.outside || undefined}
			data-selected-single={isSelectedSingle || undefined}
			data-range-start={modifiers.range_start || undefined}
			data-range-middle={modifiers.range_middle || undefined}
			data-range-end={modifiers.range_end || undefined}
			className={className}
			testId={dayTestId}
			{...props}
		>
			{prefix !== undefined && (
				<span
					data-slot="calendar-day-button-prefix"
					className={styles['calendar__day-button-affix']}
				>
					{prefix}
				</span>
			)}
			<span data-slot="calendar-day-button-label" className={styles['calendar__day-button-label']}>
				{children}
			</span>
			{suffix !== undefined && (
				<span
					data-slot="calendar-day-button-suffix"
					className={styles['calendar__day-button-affix']}
				>
					{suffix}
				</span>
			)}
		</CalendarButton>
	);
}
