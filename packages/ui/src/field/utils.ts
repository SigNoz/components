import type { MouseEvent } from 'react';

/**
 * A click on the label moves the focus to the control, and does nothing else. The browser only
 * does this for an `<input>`: on a `<button>` trigger it clicks the button, which opens a Select,
 * and an element that is not labelable (a `<span role="switch">`) gets nothing at all.
 *
 * @access private
 */
export function focusLabelledControl(event: MouseEvent<HTMLLabelElement>): void {
	const label = event.currentTarget;
	const control =
		label.control ??
		(label.htmlFor === '' ? null : label.ownerDocument.getElementById(label.htmlFor));

	if (!(control instanceof HTMLElement) || control instanceof HTMLInputElement) {
		return;
	}

	if (control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement) {
		return;
	}

	event.preventDefault();
	control.focus({ focusVisible: true } as FocusOptions);
}

/**
 * The `claimControl` of a `Field.Group`, which has no single control for a `<label for>` to name.
 *
 * @access private
 */
export function claimNoControl(): void {}
