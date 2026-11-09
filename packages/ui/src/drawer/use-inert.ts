import type { RefObject } from 'react';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';

/**
 * Makes the element of `ref` inert while `inert` is true: no pointer, no focus, hidden from
 * assistive technology, while it stays on screen.
 *
 * An element that turns inert with the focus inside drops it to `body`, so the focus moves to
 * `focusFallback` first, when one is given. Leave it out when something else takes the focus, such
 * as a nested drawer that opens over the element.
 *
 * Runs after every render, not on a change of `inert`, because the element mounts and unmounts
 * with the content of its slot. React 18 has no `inert` prop, so the property is set on the
 * element.
 *
 * @access private
 */
export function useInert(
	ref: RefObject<HTMLElement | null>,
	inert: boolean,
	focusFallback?: RefObject<HTMLElement | null>,
): void {
	useIsomorphicLayoutEffect(() => {
		const element = ref.current;
		if (!element || element.inert === inert) {
			return;
		}

		if (inert && element.contains(element.ownerDocument.activeElement)) {
			focusFallback?.current?.focus();
		}
		element.inert = inert;
	});
}
