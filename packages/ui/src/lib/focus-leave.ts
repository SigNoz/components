import type { FocusEvent } from 'react';

/**
 * Whether `node` is `root` or inside it. `false` for no node, which is what the `relatedTarget` of
 * a blur is when the focus goes nowhere.
 *
 * @access private
 */
export function containsNode(root: Element | null | undefined, node: EventTarget | null): boolean {
	return node instanceof Node && root?.contains(node) === true;
}

/**
 * `onBlur` of a control made of several focusable parts (the radios of a group, the buttons of a
 * bar, the thumbs of a range), as a handler for its root: it runs only when the focus leaves the
 * root, not when it moves between the parts. The handler goes on the root, where the `blur` of
 * every part arrives as it bubbles.
 *
 * It runs on the blur itself. A blur with no `relatedTarget`, which is what switching to another
 * window reports, counts as leaving, where `useControlBlur` waits a task and reads the active
 * element, which a window switch leaves inside the control.
 *
 * @access private
 */
export function onFocusLeave(
	onBlur: ((event: FocusEvent<HTMLElement>) => void) | undefined,
): ((event: FocusEvent<HTMLElement>) => void) | undefined {
	if (onBlur === undefined) {
		return undefined;
	}

	return (event) => {
		if (containsNode(event.currentTarget, event.relatedTarget)) {
			return;
		}

		onBlur(event);
	};
}
