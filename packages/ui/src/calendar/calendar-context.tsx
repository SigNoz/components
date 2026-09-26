import { createContext, type Ref, useContext } from 'react';
import { useDayPicker } from 'react-day-picker';

/**
 * What the parts react-day-picker owns need from the calendar around them.
 *
 * react-day-picker builds `Root`, the arrows, the dropdowns and every day itself, so neither the
 * ref a consumer hands `Calendar` nor its `testId` can be passed down as a prop. Going through a
 * context keeps those parts module-level components: handing react-day-picker a new one on every
 * render would remount the whole grid.
 *
 * @access private
 */
export type CalendarContextValue = {
	/**
	 * The ref the consumer gave `Calendar`, to be merged onto the root element.
	 */
	rootRef: Ref<HTMLDivElement> | undefined;
	/**
	 * The `testId` the consumer gave `Calendar`. Every part below derives its own from it, so one
	 * prop names the whole calendar.
	 */
	testId: string | undefined;
};

/**
 * @access private
 */
export const CalendarContext = createContext<CalendarContextValue>({
	rootRef: undefined,
	testId: undefined,
});

/**
 * What the parts inside one month grid need to know about which month they are in.
 *
 * react-day-picker renders a caption, a week number and a day button per displayed month, so with
 * `numberOfMonths` above one the same `testId` would be handed to several elements. `Month` is the
 * only ancestor all of them share, so it is where the index comes from.
 *
 * @access private
 */
export type CalendarMonthContextValue = {
	/**
	 * Which of the displayed months this is, counting from zero, as react-day-picker numbers them.
	 */
	displayIndex: number;
};

/**
 * @access private
 */
export const CalendarMonthContext = createContext<CalendarMonthContextValue>({ displayIndex: 0 });

/**
 * The stem every part below a month derives its `data-testid` from, or `undefined` when the
 * calendar has no `testId`.
 *
 * It is the calendar's own `testId` while one month is displayed, and `{testId}-month-{n}` while
 * several are, so a single-month calendar keeps the short names and a multi-month one stays
 * addressable a month at a time.
 *
 * @access private
 */
export function useCalendarTestIdStem(): string | undefined {
	const { testId } = useContext(CalendarContext);
	const { displayIndex } = useContext(CalendarMonthContext);
	const { months } = useDayPicker();

	if (testId === undefined) {
		return undefined;
	}

	return months.length > 1 ? `${testId}-month-${displayIndex + 1}` : testId;
}
