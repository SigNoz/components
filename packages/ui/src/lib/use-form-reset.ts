import { type RefObject, useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

/**
 * Calls `onReset` after the form that owns `inputRef` resets, a form its `form` attribute names
 * included, even one that mounts after the field. A reset that a listener cancels with
 * `preventDefault()` calls nothing.
 *
 * For a field that keeps its value in React state, which a form reset does not touch.
 *
 * @access private
 */
export function useFormReset(inputRef: RefObject<HTMLInputElement>, onReset: () => void): void {
	const onResetRef = useRef(onReset);

	useIsomorphicLayoutEffect(() => {
		onResetRef.current = onReset;
	});

	useEffect(() => {
		const input = inputRef.current;

		if (input == null) {
			return undefined;
		}

		// Heard on the root, and matched against the form the input belongs to when the reset
		// happens: a form named by `form` can mount after the field, or be swapped for another one
		// with the same id, and neither changes a prop this effect could follow. `reset` bubbles, and
		// capture keeps a form that stops it from hiding it.
		const root = input.getRootNode();
		let pending: ReturnType<typeof setTimeout> | undefined;

		// This listener runs before React's `onReset` on the form, which can still cancel the reset,
		// so the reset is read once the event is over. A microtask would run between two listeners of
		// a reset the browser dispatches, before React's.
		function handleReset(event: Event): void {
			if (input?.form == null || event.target !== input.form) {
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
	}, [inputRef]);
}
