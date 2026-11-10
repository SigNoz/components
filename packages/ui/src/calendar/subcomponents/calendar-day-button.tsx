import { type ReactElement, useEffect, useRef } from 'react';
import { useCalendarContext } from '../calendar-context.js';
import styles from '../calendar.module.scss';
import { CalendarButtonVariant, CalendarText } from '../constants.js';
import { isSameMonth } from '../date-math.js';
import type { GridDay } from '../month-grid.js';
import type { Modifiers } from '../types.js';
import { formatDayTestId } from '../utils.js';
import { CalendarButton } from './calendar-button.js';

/**
 * One date cell in the grid.
 *
 * It takes focus itself whenever its day is marked `focused`, which is how arrow-key navigation
 * moves across the grid.
 *
 * @access private
 */
export function CalendarDayButton({
	day,
	modifiers,
	testIdStem,
}: {
	day: GridDay;
	modifiers: Modifiers;
	testIdStem: string | undefined;
}): ReactElement {
	const ref = useRef<HTMLButtonElement>(null);
	const { formatter, months, isFocusTarget, onDayClick, onDayFocus, onDayBlur, onDayKeyDown } =
		useCalendarContext();

	// Focus moves by flipping this modifier rather than by touching the DOM, so the button it lands
	// on is the one that has to call `focus()`.
	useEffect(() => {
		if (modifiers.focused) {
			ref.current?.focus();
		}
	}, [modifiers.focused]);

	// A range paints its own three positions, so a day inside one is not also "the selected day".
	const isSelectedSingle =
		modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle;

	// An outside day whose own month is displayed too shows twice. Only the copy in its own month
	// paints a range, so the range is not drawn twice with a second end.
	const isDuplicate = day.outside && months.some((month) => isSameMonth(month.date, day.date));

	let label = formatter.fullDate(day.date);

	if (modifiers.today) {
		label = `${CalendarText.Today}, ${label}`;
	}

	if (modifiers.selected) {
		label = `${label}, ${CalendarText.Selected}`;
	}

	return (
		<CalendarButton
			variant={CalendarButtonVariant.Day}
			data-day={day.isoDate}
			data-today={modifiers.today || undefined}
			data-outside={day.outside || undefined}
			data-duplicate={isDuplicate || undefined}
			data-selected-single={isSelectedSingle || undefined}
			data-range-start={modifiers.range_start || undefined}
			data-range-middle={modifiers.range_middle || undefined}
			data-range-end={modifiers.range_end || undefined}
			ref={ref}
			testId={
				testIdStem === undefined ? undefined : `${testIdStem}-button-${formatDayTestId(day.date)}`
			}
			tabIndex={isFocusTarget(day) ? 0 : -1}
			// A disabled day is native-disabled, except the focused one: that stays reachable.
			disabled={(!modifiers.focused && modifiers.disabled) || undefined}
			aria-disabled={(modifiers.focused && modifiers.disabled) || undefined}
			aria-label={label}
			onClick={(event) => onDayClick(day, modifiers, event)}
			onFocus={() => onDayFocus(day)}
			onBlur={onDayBlur}
			onKeyDown={onDayKeyDown}
		>
			<span data-slot="calendar-day-button-label" className={styles['calendar__day-button-label']}>
				{formatter.day(day.date)}
			</span>
		</CalendarButton>
	);
}
