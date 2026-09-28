import type { ReactElement } from 'react';
import { useDayPicker } from 'react-day-picker';
import { useCalendarTestIdStem } from '../calendar-context.js';
import type { CalendarDropdownProps } from '../types.js';

/**
 * A caption dropdown, rendered only while `captionLayout` asks for one.
 *
 * react-day-picker renders month and year through the same `Dropdown`, so the two are wrapped apart
 * here purely to tell them apart by `testId`. Everything else is upstream's: the `Dropdown` is read
 * off the day-picker context rather than imported, so a consumer replacing `components.Dropdown`
 * still wins.
 *
 * @access private
 */
function CalendarDropdown({
	part,
	...props
}: CalendarDropdownProps & { part: 'month' | 'year' }): ReactElement {
	const { components } = useDayPicker();
	const stem = useCalendarTestIdStem();

	return (
		<components.Dropdown
			{...props}
			{...(stem === undefined ? {} : { 'data-testid': `${stem}-dropdown-${part}` })}
		/>
	);
}

/**
 * The month dropdown in the caption.
 *
 * @access private
 */
export function CalendarMonthsDropdown(props: CalendarDropdownProps): ReactElement {
	return <CalendarDropdown {...props} part="month" />;
}

/**
 * The year dropdown in the caption.
 *
 * @access private
 */
export function CalendarYearsDropdown(props: CalendarDropdownProps): ReactElement {
	return <CalendarDropdown {...props} part="year" />;
}
