import { describe, expect, it } from 'vitest';
import { getCalendarFormatter, getWeekdayDates } from '../formatting.js';

const SEPTEMBER_7_2026 = new Date(2026, 8, 7);

describe('calendar formatting in English', () => {
	const english = getCalendarFormatter('en-US');

	it('writes the month and the year of a caption in full', () => {
		const captions = Array.from({ length: 12 }, (_, month) =>
			english.caption(new Date(2026, month, 1)),
		);

		expect(captions).toEqual([
			'January 2026',
			'February 2026',
			'March 2026',
			'April 2026',
			'May 2026',
			'June 2026',
			'July 2026',
			'August 2026',
			'September 2026',
			'October 2026',
			'November 2026',
			'December 2026',
		]);
	});

	it('writes a month as three letters in the dropdown, and the year as a number', () => {
		expect(english.monthShort(SEPTEMBER_7_2026)).toBe('Sep');
		expect(english.monthShort(new Date(2026, 5, 1))).toBe('Jun');
		expect(english.year(SEPTEMBER_7_2026)).toBe('2026');
	});

	it('names a weekday with two letters, and in full for a screen reader', () => {
		const week = getWeekdayDates(0);

		expect(week.map((date) => english.weekdayShort(date))).toEqual([
			'Su',
			'Mo',
			'Tu',
			'We',
			'Th',
			'Fr',
			'Sa',
		]);
		expect(week.map((date) => english.weekdayLong(date))).toEqual([
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		]);
	});

	it('writes a whole date with an ordinal day', () => {
		expect(english.fullDate(SEPTEMBER_7_2026)).toBe('Monday, September 7th, 2026');
	});

	it('picks the ordinal suffix of every day of the month', () => {
		const suffixes = Array.from({ length: 31 }, (_, index) => {
			const text = english.fullDate(new Date(2026, 0, index + 1));

			return /(\d+)(st|nd|rd|th),/.exec(text)?.[0];
		});

		expect(suffixes).toEqual([
			'1st,',
			'2nd,',
			'3rd,',
			...[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((day) => `${day}th,`),
			'21st,',
			'22nd,',
			'23rd,',
			...[24, 25, 26, 27, 28, 29, 30].map((day) => `${day}th,`),
			'31st,',
		]);
	});

	it('writes the day without padding and a week number with two digits', () => {
		expect(english.day(SEPTEMBER_7_2026)).toBe('7');
		expect(english.day(new Date(2026, 8, 30))).toBe('30');
		expect(english.weekNumber(5)).toBe('05');
		expect(english.weekNumber(36)).toBe('36');
	});

	it('reads the same in every English region', () => {
		for (const locale of ['en', 'en-GB', 'en-AU', 'en-CA']) {
			const formatter = getCalendarFormatter(locale);

			expect(formatter.caption(SEPTEMBER_7_2026)).toBe('September 2026');
			expect(formatter.monthShort(SEPTEMBER_7_2026)).toBe('Sep');
			expect(formatter.weekdayShort(SEPTEMBER_7_2026)).toBe('Mo');
			expect(formatter.fullDate(SEPTEMBER_7_2026)).toBe('Monday, September 7th, 2026');
		}
	});
});

describe('calendar formatting in other languages', () => {
	it('follows the language for the names and the order of the whole date', () => {
		const portuguese = getCalendarFormatter('pt-BR');

		expect(portuguese.caption(SEPTEMBER_7_2026)).toBe('setembro de 2026');
		expect(portuguese.fullDate(SEPTEMBER_7_2026)).toBe('segunda-feira, 7 de setembro de 2026');
		expect(portuguese.weekdayLong(SEPTEMBER_7_2026)).toBe('segunda-feira');
	});

	it('writes the year first where the language does', () => {
		expect(getCalendarFormatter('en-US').monthYearOrder).toBe('month-first');
		expect(getCalendarFormatter('pt-BR').monthYearOrder).toBe('month-first');

		for (const locale of ['ja-JP', 'ko-KR', 'zh-CN', 'hu-HU']) {
			expect(getCalendarFormatter(locale).monthYearOrder, locale).toBe('year-first');
		}

		expect(getCalendarFormatter('ja-JP').caption(SEPTEMBER_7_2026)).toBe('2026年9月');
	});

	it('counts years in the Gregorian calendar, the one the grid is laid out in, whatever the tag asks', () => {
		expect(getCalendarFormatter('th-TH').year(SEPTEMBER_7_2026)).toBe('2026');
		expect(getCalendarFormatter('th-TH-u-ca-buddhist').year(SEPTEMBER_7_2026)).toBe('2026');
	});

	it('starts the week on the day the region does', () => {
		expect(getCalendarFormatter('en-US').weekStartsOn).toBe(0);
		expect(getCalendarFormatter('en').weekStartsOn).toBe(0);
		expect(getCalendarFormatter('pt-BR').weekStartsOn).toBe(0);
		expect(getCalendarFormatter('en-GB').weekStartsOn).toBe(1);
		expect(getCalendarFormatter('fr-FR').weekStartsOn).toBe(1);
		expect(getCalendarFormatter('de-DE').weekStartsOn).toBe(1);
	});

	it('builds a formatter once per locale', () => {
		expect(getCalendarFormatter('es-ES')).toBe(getCalendarFormatter('es-ES'));
	});
});

describe('getWeekdayDates', () => {
	it('lists the seven weekdays from the one the week starts on', () => {
		for (const weekStartsOn of [0, 1, 2, 3, 4, 5, 6] as const) {
			const days = getWeekdayDates(weekStartsOn).map((date) => date.getDay());

			expect(days).toEqual(Array.from({ length: 7 }, (_, index) => (weekStartsOn + index) % 7));
		}
	});
});
