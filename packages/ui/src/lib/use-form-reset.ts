import { type RefObject, useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

/**
 * Calls `onReset` after the form that owns `inputRef` resets, the form `form` names included. A
 * reset that a listener cancels with `preventDefault()` calls nothing.
 *
 * For a field that keeps its value in React state, which a form reset does not touch.
 *
 * @access private
 */
export function useFormReset(
	inputRef: RefObject<HTMLInputElement>,
	form: string | undefined,
	onReset: () => void,
): void {
	const onResetRef = useRef(onReset);

	useIsomorphicLayoutEffect(() => {
		onResetRef.current = onReset;
	});

	useEffect(() => {
		const owner = inputRef.current?.form;

		if (owner == null) {
			return undefined;
		}

		let pending: ReturnType<typeof setTimeout> | undefined;

		// This listener runs before React's `onReset` on the form, which can still cancel the reset,
		// so the reset is read once the event is over. A microtask would run between two listeners of
		// a reset the browser dispatches, before React's.
		function handleReset(event: Event): void {
			pending = setTimeout(() => {
				if (!event.defaultPrevented) {
					onResetRef.current();
				}
			});
		}

		owner.addEventListener('reset', handleReset);

		return () => {
			owner.removeEventListener('reset', handleReset);
			clearTimeout(pending);
		};
	}, [inputRef, form]);
}
