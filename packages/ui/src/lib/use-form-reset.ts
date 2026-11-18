import { type RefObject, useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

/**
 * The form an element belongs to when the reset happens: the `form` an input or a button reports,
 * which follows a `form` attribute, or the `<form>` around any other element.
 */
function ownerForm(element: Element): HTMLFormElement | null {
	return element instanceof HTMLInputElement || element instanceof HTMLButtonElement
		? element.form
		: element.closest('form');
}

/**
 * Calls `onReset` after the form that owns the element of `elementRef` resets, a form an input's
 * `form` attribute names included, even one that mounts after the field. A reset that a listener
 * cancels with `preventDefault()` calls nothing. Without a ref it listens to nothing.
 *
 * For a field that keeps its value in React state, which a form reset does not touch.
 *
 * @access private
 */
export function useFormReset(
	elementRef: RefObject<Element | null> | undefined,
	onReset: () => void,
): void {
	const onResetRef = useRef(onReset);

	useIsomorphicLayoutEffect(() => {
		onResetRef.current = onReset;
	});

	useEffect(() => {
		if (elementRef === undefined) {
			return undefined;
		}

		const ref = elementRef;
		// Heard on the root, and matched against the form the element belongs to when the reset
		// happens: a form named by `form` can mount after the field, or be swapped for another one
		// with the same id, and neither changes a prop this effect could follow. The element is read
		// then too, since a tooltip anchor that comes or goes replaces it, and Base UI hands over the
		// input of a group that mounts disabled only once it is enabled. `reset` bubbles, and capture
		// keeps a form that stops it from hiding it.
		const root = ref.current?.getRootNode() ?? document;
		let pending: ReturnType<typeof setTimeout> | undefined;

		// This listener runs before React's `onReset` on the form, which can still cancel the reset,
		// so the reset is read once the event is over. A microtask would run between two listeners of
		// a reset the browser dispatches, before React's.
		function handleReset(event: Event): void {
			const element = ref.current;
			const form = element == null ? null : ownerForm(element);

			if (form == null || event.target !== form) {
				return;
			}

			pending = setTimeout(() => {
				if (!event.defaultPrevented) {
					onResetRef.current();
				}
			});
		}

		root.addEventListener('reset', handleReset, true);

		return () => {
			root.removeEventListener('reset', handleReset, true);
			clearTimeout(pending);
		};
	}, [elementRef]);
}
