import { type ReactElement, type Ref, version } from 'react';

/**
 * Point several refs at the same node, for a component that keeps a ref of its own on the element
 * the consumer's `ref` has to reach too.
 *
 * @access private
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): (node: T | null) => void {
	return (node) => {
		for (const ref of refs) {
			setRef(ref, node);
		}
	};
}

/**
 * Point one ref at a node, from inside a callback ref that serves several.
 *
 * @access private
 */
export function setRef<T>(ref: Ref<T> | undefined, node: T | null): void {
	if (typeof ref === 'function') {
		ref(node);
	} else if (ref != null) {
		(ref as { current: T | null }).current = node;
	}
}

// React 18 keeps the ref of an element next to its props, React 19 inside them. Probing both
// flags it as accessed: React 18 warns on `props.ref`, React 19 on `element.ref`. So pick the
// one the running version owns instead.
const ReactMajor = Number.parseInt(version, 10);

/**
 * The `ref` an element was created with, for a component that clones the element with a ref of
 * its own: `cloneElement` replaces that ref, so the two have to be merged first.
 *
 * @access private
 */
export function getElementRef<T>(element: ReactElement): Ref<T> | undefined {
	if (ReactMajor >= 19) {
		return (element.props as { ref?: Ref<T> }).ref;
	}

	return (element as { ref?: Ref<T> }).ref;
}
