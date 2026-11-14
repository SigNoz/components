import { type KeyboardEvent, type MouseEvent, useState } from 'react';
import { isDateSelected, selectDate, type SelectionState } from './selection.js';
import type { Modifiers } from './types.js';

type CalendarSelectionOptions = {
	/**
	 * What the consumer says is selected. Read as the starting selection while it is uncontrolled.
	 */
	selected: SelectionState;
	required: boolean;
	/**
	 * Called with the selection after a pick. With one, the calendar is controlled by `selected`.
	 */
	onSelect:
		| ((
				next: SelectionState,
				triggerDate: Date,
				modifiers: Modifiers,
				event: MouseEvent | KeyboardEvent,
		  ) => void)
		| undefined;
};

/**
 * What is selected and what picking a day does to it.
 *
 * Without `onSelect` the calendar keeps the selection itself, starting from `selected`. With one,
 * `selected` is the selection and a pick only reports the new one.
 *
 * @access private
 */
export function useCalendarSelection({ selected, required, onSelect }: CalendarSelectionOptions): {
	selection: SelectionState;
	isSelected: (date: Date) => boolean;
	select: (date: Date, modifiers: Modifiers, event: MouseEvent | KeyboardEvent) => void;
} {
	const [uncontrolled, setUncontrolled] = useState(selected);
	const selection = onSelect === undefined ? uncontrolled : selected;

	const select = (date: Date, modifiers: Modifiers, event: MouseEvent | KeyboardEvent): void => {
		const next = selectDate(selection, date, required);

		if (next === undefined) {
			return;
		}

		if (onSelect === undefined) {
			setUncontrolled(next);
		} else {
			onSelect(next, date, modifiers, event);
		}
	};

	return { selection, isSelected: (date) => isDateSelected(selection, date), select };
}
