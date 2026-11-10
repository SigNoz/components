import { createDate } from './date-math.js';
import type { CalendarWeekdayType } from './types.js';

/**
 * Everything the calendar writes for a date or a number, in one language.
 *
 * @access private
 */
export type CalendarFormatter = {
	/**
	 * The day a week starts on in the locale.
	 */
	weekStartsOn: CalendarWeekdayType;
	/**
	 * Which of the month and the year is written first in a caption.
	 */
	monthYearOrder: 'month-first' | 'year-first';
	/**
	 * The month and the year of a month, `September 2026`.
	 */
	caption: (date: Date) => string;
	/**
	 * The month as a short name, `Sep`.
	 */
	monthShort: (date: Date) => string;
	/**
	 * The year, `2026`.
	 */
	year: (date: Date) => string;
	/**
	 * The weekday of a date as a short name, `Su` in English.
	 */
	weekdayShort: (date: Date) => string;
	/**
	 * The weekday of a date in full, `Sunday`.
	 */
	weekdayLong: (date: Date) => string;
	/**
	 * The number of the day, `7`.
	 */
	day: (date: Date) => string;
	/**
	 * The number of a week, padded to two digits, `07`.
	 */
	weekNumber: (weekNumber: number) => string;
	/**
	 * The whole date, `Monday, September 7th, 2026`.
	 */
	fullDate: (date: Date) => string;
};

type WeekInfo = { firstDay: number };

type LocaleWithWeekInfo = Intl.Locale & {
	getWeekInfo?: () => WeekInfo;
	weekInfo?: WeekInfo;
};

// Sunday to Saturday, 2024-01-07 being a Sunday, for the names of the weekdays.
const REFERENCE_SUNDAY = createDate(2024, 0, 7);
const AMERICAN_WEEK: WeekInfo = { firstDay: 7 };
const SHORT_ENGLISH_WEEKDAY_LENGTH = 2;

/**
 * The same day as noon UTC. A date of the calendar is its local fields, so it is formatted from
 * those in UTC: the browser's zone then cannot move the day, and neither can a clock change that
 * skips the date, or a zone set after the formatter was built.
 */
function toUtcNoon(date: Date): Date {
	const utc = new Date(0);

	utc.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
	utc.setUTCHours(12);

	return utc;
}

function getWeekInfo(locale: string): WeekInfo {
	const intlLocale: LocaleWithWeekInfo = new Intl.Locale(locale);

	// `getWeekInfo()` is the standard form, `weekInfo` the one older engines shipped.
	return intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo ?? AMERICAN_WEEK;
}

/**
 * `1st`, `2nd`, `3rd`, `4th`, `11th`, `21st`.
 */
function toEnglishOrdinal(day: number): string {
	const lastTwo = day % 100;

	if (lastTwo > 20 || lastTwo < 10) {
		switch (lastTwo % 10) {
			case 1:
				return `${day}st`;
			case 2:
				return `${day}nd`;
			case 3:
				return `${day}rd`;
		}
	}

	return `${day}th`;
}

function createFormatter(locale: string): CalendarFormatter {
	const isEnglish = new Intl.Locale(locale).language === 'en';
	// Every English region reads the same: the words are the American ones.
	const formatLocale = isEnglish ? 'en-US' : locale;
	// Always the Gregorian calendar, the one the grid is laid out in.
	const dateFormat = (options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat =>
		new Intl.DateTimeFormat(formatLocale, { calendar: 'gregory', timeZone: 'UTC', ...options });

	const captionFormat = dateFormat({ month: 'long', year: 'numeric' });
	const monthShortFormat = dateFormat({ month: 'short' });
	const yearFormat = dateFormat({ year: 'numeric' });
	const weekdayShortFormat = dateFormat({ weekday: 'short' });
	const weekdayLongFormat = dateFormat({ weekday: 'long' });
	const monthLongFormat = dateFormat({ month: 'long' });
	const fullDateFormat = dateFormat({ dateStyle: 'full' });
	const dayFormat = new Intl.NumberFormat(formatLocale, { useGrouping: false });
	const weekNumberFormat = new Intl.NumberFormat(formatLocale, {
		useGrouping: false,
		minimumIntegerDigits: 2,
	});

	const weekInfo = getWeekInfo(locale);
	const parts = captionFormat.formatToParts(toUtcNoon(REFERENCE_SUNDAY)).map((part) => part.type);

	return {
		weekStartsOn: (weekInfo.firstDay % 7) as CalendarWeekdayType,
		monthYearOrder: parts.indexOf('year') < parts.indexOf('month') ? 'year-first' : 'month-first',
		caption: (date) => captionFormat.format(toUtcNoon(date)),
		monthShort: (date) => monthShortFormat.format(toUtcNoon(date)),
		year: (date) => yearFormat.format(toUtcNoon(date)),
		weekdayShort: (date) => {
			const name = weekdayShortFormat.format(toUtcNoon(date));

			return isEnglish ? name.slice(0, SHORT_ENGLISH_WEEKDAY_LENGTH) : name;
		},
		weekdayLong: (date) => weekdayLongFormat.format(toUtcNoon(date)),
		day: (date) => dayFormat.format(date.getDate()),
		weekNumber: (weekNumber) => weekNumberFormat.format(weekNumber),
		fullDate: (date) => {
			const noon = toUtcNoon(date);

			return isEnglish
				? `${weekdayLongFormat.format(noon)}, ${monthLongFormat.format(noon)} ${toEnglishOrdinal(date.getDate())}, ${yearFormat.format(noon)}`
				: fullDateFormat.format(noon);
		},
	};
}

const formatters = new Map<string, CalendarFormatter>();

/**
 * The formatter of a locale, built once. A `Intl.DateTimeFormat` is slow to create and a month
 * writes a few hundred dates.
 *
 * @access private
 */
export function getCalendarFormatter(locale: string): CalendarFormatter {
	let formatter = formatters.get(locale);

	if (formatter === undefined) {
		formatter = createFormatter(locale);
		formatters.set(locale, formatter);
	}

	return formatter;
}

/**
 * The seven days of the reference week that fall on each weekday, from the one the week starts on.
 * They are only dates to read a weekday name off.
 *
 * @access private
 */
export function getWeekdayDates(weekStartsOn: CalendarWeekdayType): Date[] {
	return Array.from({ length: 7 }, (_, index) =>
		createDate(2024, 0, 7 + ((weekStartsOn + index) % 7)),
	);
}
