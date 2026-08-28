import { fireEvent } from '@testing-library/react';

/**
 * Activates an element by firing the full pointer → mouse → focus → click
 * sequence a real user generates.
 *
 * `fireEvent.click` alone dispatches only the final `click`, which is enough
 * for components that listen for it but silently does nothing for those that
 * select on `mousedown` (Radix `Tabs.Trigger`, `ToggleGroup.Item`) or on
 * `pointerdown`. Firing the whole sequence keeps a test asserting *behaviour*
 * rather than the particular event a primitive happens to listen for — which
 * matters when the primitive underneath may be replaced.
 */
export function activate(element: HTMLElement): void {
	fireEvent.pointerDown(element, { button: 0, ctrlKey: false });
	fireEvent.mouseDown(element, { button: 0 });
	element.focus();
	fireEvent.pointerUp(element, { button: 0 });
	fireEvent.mouseUp(element, { button: 0 });
	fireEvent.click(element);
}
