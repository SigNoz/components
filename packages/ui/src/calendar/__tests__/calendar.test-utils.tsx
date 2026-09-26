/** A Wednesday in the middle of a month, so a week has days on both sides of it. */
export const JUNE_11_2025 = new Date(2025, 5, 11);

/** Another day in the same week, for the tests that need two. */
export function june(date: number): Date {
	return new Date(2025, 5, date);
}

/** The day as `YYYY-MM-DD`, the format `CalendarDayButton` writes to `data-day`. */
export function isoDay(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${date.getFullYear()}-${month}-${day}`;
}

/** The date cell for one day, found by the attribute `CalendarDayButton` writes. */
export function dayButton(date: Date): HTMLButtonElement {
	const button = document.querySelector<HTMLButtonElement>(
		`[data-slot="calendar-button"][data-variant="day"][data-day="${isoDay(date)}"]`,
	);

	if (button === null) {
		throw new Error(`No day button for ${isoDay(date)}`);
	}

	return button;
}

/** Both month arrows, found by the direction they carry. */
export function navButtons(): { previous: HTMLButtonElement; next: HTMLButtonElement } {
	const previous = document.querySelector<HTMLButtonElement>('[data-direction="previous"]');
	const next = document.querySelector<HTMLButtonElement>('[data-direction="next"]');

	if (previous === null || next === null) {
		throw new Error('The month arrows are not rendered');
	}

	return { previous, next };
}
