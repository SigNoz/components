import type { MouseEvent } from 'react';

/**
 * A click on the info icon of `labelTooltip` bubbles to the `<label>` around the text, which would
 * toggle the checkbox. The icon only explains the checkbox, so the click stops there.
 *
 * @access private
 */
export function keepInfoIconFromToggling(event: MouseEvent<HTMLElement>): void {
	if (
		event.target instanceof Element &&
		event.target.closest('[data-slot="field-label-tooltip"]')
	) {
		event.preventDefault();
	}
}
