import { useState } from 'react';
import { calculateFocusTarget, getNextFocus, type MoveBy, type MoveDirection } from './focus.js';
import { type GridDay, isSameGridDay } from './month-grid.js';
import type { CalendarWeekdayType, Matcher, Modifiers } from './types.js';

type CalendarFocusOptions = {
	days: GridDay[];
	getModifiers: (day: GridDay) => Modifiers;
	isSelected: (date: Date) => boolean;
	navStart: Date | undefined;
	navEnd: Date | undefined;
	weekStartsOn: CalendarWeekdayType;
	disabled: Matcher | Matcher[] | undefined;
	disableNavigation: boolean | undefined;
	goToDay: (day: GridDay) => void;
};

type CalendarFocus = {
	/**
	 * The day that holds the focus, `undefined` while the focus is outside the grid.
	 */
	focused: GridDay | undefined;
	isFocusTarget: (day: GridDay) => boolean;
	setFocused: (day: GridDay) => void;
	blur: () => void;
	moveFocus: (moveBy: MoveBy, direction: MoveDirection) => void;
};

/**
 * Which day is the tab stop of the grid, which day holds the focus, and how the keyboard moves it.
 *
 * Focus is state rather than a call on the DOM: a day button focuses itself once it is marked
 * `focused`, so a move that lands in another month waits for that month to render.
 *
 * @access private
 */
export function useCalendarFocus(options: CalendarFocusOptions): CalendarFocus {
	const { days, navStart, navEnd, weekStartsOn, disabled, disableNavigation, goToDay } = options;
	const [lastFocused, setLastFocused] = useState<GridDay>();
	const [focused, setFocused] = useState<GridDay>();
	const focusTarget = calculateFocusTarget(
		days,
		options.getModifiers,
		options.isSelected,
		lastFocused,
	);

	const blur = (): void => {
		setLastFocused(focused);
		setFocused(undefined);
	};

	const moveFocus = (moveBy: MoveBy, direction: MoveDirection): void => {
		if (focused === undefined) {
			return;
		}

		const next = getNextFocus({
			moveBy,
			direction,
			from: focused,
			navStart,
			navEnd,
			weekStartsOn,
			disabled,
		});

		if (next === undefined) {
			return;
		}

		if (disableNavigation && !days.some((day) => isSameGridDay(day, next))) {
			return;
		}

		goToDay(next);
		setFocused(next);
	};

	return {
		focused,
		isFocusTarget: (day) => focusTarget !== undefined && isSameGridDay(focusTarget, day),
		setFocused,
		blur,
		moveFocus,
	};
}
