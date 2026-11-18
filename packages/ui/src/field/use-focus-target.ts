import { type Ref, type RefCallback, useCallback, useRef } from 'react';
import { setRef } from '../lib/merge-refs.js';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';

/**
 * The `focusTarget` a field shorthand hands its control: a callback that points `ref` at the
 * element the control names, and that stays the same function for the life of the shorthand.
 *
 * It cannot follow `ref`. Base UI's `RadioGroup` calls the `inputRef` it was given only when a radio
 * registers or its `checked` or `disabled` changes, so a callback that changed with `ref` would
 * never be called again: the new `ref` would stay empty and the old one would keep the element. So
 * the callback keeps the element, and a layout effect on `ref` gives it to the new `ref` and takes
 * it back from the old one. A layout effect, because that is when a plain `ref` is set.
 *
 * Pass `null` when the shorthand sends its `ref` to the control instead.
 *
 * @access private
 */
export function useFocusTarget<T>(ref: Ref<T> | null): RefCallback<HTMLElement> {
	const nodeRef = useRef<T | null>(null);
	const activeRef = useRef<Ref<T> | null>(null);

	useIsomorphicLayoutEffect(() => {
		activeRef.current = ref;
		setRef(ref, nodeRef.current);

		return () => {
			activeRef.current = null;
			setRef(ref, null);
		};
	}, [ref]);

	return useCallback((node: HTMLElement | null) => {
		nodeRef.current = node as T | null;
		setRef(activeRef.current, node as T | null);
	}, []);
}
