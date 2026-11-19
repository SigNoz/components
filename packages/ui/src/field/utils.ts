import type { MouseEvent } from 'react';

/**
 * A click on the label focuses the control without clicking it. The browser already handles
 * `<input>`, `<textarea>` and `<select>`; on a `<button>` trigger it clicks the button, which
 * opens a Select, and a non-labelable element (`<span role="switch">`) gets nothing.
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
