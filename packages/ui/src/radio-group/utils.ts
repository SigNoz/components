import type { MouseEvent } from 'react';

/**
 * A press on an item's text, or on the space around its radio, keeps the focus where it is, and
 * the click that follows moves it to that item's radio. The text cannot take the focus, so
 * without this the press moves the focus to `<body>` first: the radio that had it blurs with no
 * `relatedTarget`, which the group's `onBlur` counts as the focus leaving the group. A press on
 * the radio itself is left alone, it takes the focus on its own.
 *
 * @access private
 */
export function keepFocusOnTextPress(event: MouseEvent<HTMLLabelElement>): void {
	const control = event.currentTarget.querySelector('[data-slot="radio-group-control"]');

	if (event.target instanceof Node && control?.contains(event.target)) {
		return;
	}

	event.preventDefault();
}
