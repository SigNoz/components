import type { CSSProperties, ReactElement } from 'react';
import { cn } from '../../lib/utils.js';
import { useCalendarContext } from '../calendar-context.js';
import styles from '../calendar.module.scss';
import { CalendarText } from '../constants.js';
import {
	createDate,
	differenceInCalendarDays,
	endOfYear,
	startOfMonth,
	startOfYear,
} from '../date-math.js';
import type { GridMonth } from '../month-grid.js';
import { CalendarDropdown, type CalendarDropdownOption } from './calendar-dropdown.js';

const MONTHS_PER_YEAR = 12;

// The live region keeps the full caption for a screen reader while the dropdowns are what is seen.
const VISUALLY_HIDDEN: CSSProperties = {
	border: 0,
	clip: 'rect(0 0 0 0)',
	height: '1px',
	margin: '-1px',
	overflow: 'hidden',
	padding: 0,
	position: 'absolute',
	width: '1px',
	whiteSpace: 'nowrap',
	wordWrap: 'normal',
};

/**
 * The month and the year of a displayed month, as plain text or with a dropdown for either.
 *
 * @access private
 */
export function CalendarCaption({
	month,
	testIdStem,
}: {
	month: GridMonth;
	testIdStem: string | undefined;
}): ReactElement {
	const { captionLayout, formatter, disableNavigation, navStart, navEnd, goToMonth } =
		useCalendarContext();
	const caption = formatter.caption(month.date);

	if (!captionLayout.startsWith('dropdown')) {
		return (
			<span
				className={cn(styles['calendar__caption-label'], styles['calendar__caption-label--label'])}
				// eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- an <output> belongs to a form, this only announces the month.
				role="status"
				aria-live="polite"
			>
				{caption}
			</span>
		);
	}

	const year = month.date.getFullYear();
	const monthOptions: CalendarDropdownOption[] = Array.from(
		{ length: MONTHS_PER_YEAR },
		(_, index) => {
			const first = createDate(year, index, 1);

			return {
				value: index,
				label: formatter.monthShort(first),
				disabled:
					(navStart !== undefined && differenceInCalendarDays(first, startOfMonth(navStart)) < 0) ||
					(navEnd !== undefined && differenceInCalendarDays(first, startOfMonth(navEnd)) > 0),
			};
		},
	);
	const yearOptions =
		navStart === undefined || navEnd === undefined
			? undefined
			: Array.from(
					{
						length: endOfYear(navEnd).getFullYear() - startOfYear(navStart).getFullYear() + 1,
					},
					(_, index): CalendarDropdownOption => {
						const optionYear = startOfYear(navStart).getFullYear() + index;

						return {
							value: optionYear,
							label: formatter.year(createDate(optionYear, 0, 1)),
							disabled: false,
						};
					},
				);

	const monthControl =
		captionLayout === 'dropdown' || captionLayout === 'dropdown-months' ? (
			<CalendarDropdown
				key="month"
				label={CalendarText.ChooseMonth}
				options={monthOptions}
				value={month.date.getMonth()}
				disabled={disableNavigation}
				testId={testIdStem === undefined ? undefined : `${testIdStem}-dropdown-month`}
				onChange={(value) => goToMonth(createDate(year, value, 1))}
			/>
		) : (
			<span key="month">{formatter.monthShort(month.date)}</span>
		);
	const yearControl =
		captionLayout === 'dropdown' || captionLayout === 'dropdown-years' ? (
			<CalendarDropdown
				key="year"
				label={CalendarText.ChooseYear}
				options={yearOptions}
				value={year}
				disabled={disableNavigation}
				testId={testIdStem === undefined ? undefined : `${testIdStem}-dropdown-year`}
				onChange={(value) => goToMonth(createDate(value, month.date.getMonth(), 1))}
			/>
		) : (
			<span key="year">{formatter.year(month.date)}</span>
		);

	return (
		<div className={styles['calendar__dropdowns']}>
			{formatter.monthYearOrder === 'year-first'
				? [yearControl, monthControl]
				: [monthControl, yearControl]}
			{/* eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- an <output> belongs to a form, this only announces the month. */}
			<span role="status" aria-live="polite" style={VISUALLY_HIDDEN}>
				{caption}
			</span>
		</div>
	);
}
