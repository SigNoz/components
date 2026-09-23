import type { Ref } from 'react';

/**
 * Point several refs at the same node, for a component that keeps a ref of its own on the element
 * the consumer's `ref` has to reach too.
 *
 * @access private
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): (node: T | null) => void {
	return (node) => {
		for (const ref of refs) {
			if (typeof ref === 'function') {
				ref(node);
			} else if (ref != null) {
				(ref as { current: T | null }).current = node;
			}
		}
	};
}
