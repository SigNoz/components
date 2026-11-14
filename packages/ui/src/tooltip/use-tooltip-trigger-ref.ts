import * as React from 'react';
import { getElementRef, setRef } from '../lib/merge-refs.js';

/**
 * One callback ref for a trigger cloned from `child`: it reaches the ref of the child, the
 * forwarded `ref` and `onNode`.
 *
 * @access private
 */
export function useTooltipTriggerRef(
	child: React.ReactElement,
	ref: React.ForwardedRef<HTMLButtonElement>,
	onNode?: (node: HTMLElement | null) => void,
): React.RefCallback<HTMLButtonElement> {
	const childRef = getElementRef<HTMLButtonElement>(child);

	// `cloneElement` replaces the ref of the child, so the refs are merged first.
	return React.useCallback(
		(node: HTMLButtonElement | null) => {
			setRef(childRef, node);
			setRef(ref, node);
			onNode?.(node);
		},
		[childRef, ref, onNode],
	);
}
