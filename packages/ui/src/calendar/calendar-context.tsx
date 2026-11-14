import { createContext, type KeyboardEvent, type MouseEvent, useContext } from 'react';
import type { CalendarFormatter } from './formatting.js';
import type { GridDay, GridMonth } from './month-grid.js';
import type { CalendarCaptionLayoutType, Modifiers } from './types.js';

/**
 * What the parts of a calendar share, so a day nested five elements down needs neither the state
 * of the calendar nor a long chain of props.
 *
 * @access private
 */
export type CalendarContextValue = {
	/**
	 * The `testId` the consumer gave `Calendar`. Every part derives its own from it, so one prop
	 * names the whole calendar.
	 */
	testId: string | undefined;
	formatter: CalendarFormatter;
	mode: 'single' | 'multiple' | 'range';
	captionLayout: CalendarCaptionLayoutType;
	showWeekNumber: boolean;
	hideWeekdays: boolean;
	disableNavigation: boolean;
	/**
	 * A date for each weekday, from the first day of the week, to read the names off.
	 */
	weekdays: Date[];
	months: GridMonth[];
	navStart: Date | undefined;
	navEnd: Date | undefined;
	previousMonth: Date | undefined;
	nextMonth: Date | undefined;
	goToMonth: (date: Date) => void;
	getModifiers: (day: GridDay) => Modifiers;
	isFocusTarget: (day: GridDay) => boolean;
	onDayClick: (day: GridDay, modifiers: Modifiers, event: MouseEvent) => void;
	onDayFocus: (day: GridDay) => void;
	onDayBlur: () => void;
	onDayKeyDown: (event: KeyboardEvent) => void;
};

const CalendarContext = createContext<CalendarContextValue | undefined>(undefined);

/**
 * @access private
 */
export const CalendarContextProvider = CalendarContext.Provider;

/**
 * The state of the calendar around the part that calls it.
 *
 * @access private
 */
export function useCalendarContext(): CalendarContextValue {
	const value = useContext(CalendarContext);

	if (value === undefined) {
		throw new Error('A calendar part must be rendered inside a Calendar.');
	}

	return value;
}
