type OnResize = () => void;

// Every caller shares one observer. An observer per caller is an object, a callback and a
// disconnect per caller, which each drawer panel, drawer viewport and toast stack would pay.
const callbacks = new Map<Element, Set<OnResize>>();
let observer: ResizeObserver | null = null;

// One batch can hold several elements of one caller, such as a drawer's viewport and the root
// element as the window resizes. Each caller measures once per batch, as with its own observer.
function onResize(entries: ResizeObserverEntry[]): void {
	const pending = new Set<OnResize>();

	for (const entry of entries) {
		callbacks.get(entry.target)?.forEach((callback) => pending.add(callback));
	}

	for (const callback of pending) {
		callback();
	}
}

function noop(): void {}

/**
 * Calls `callback` each time `element` resizes, until the returned function is called. Does
 * nothing where there is no `ResizeObserver`, such as jsdom.
 *
 * The first caller for an element is also called once as the observer starts on it. A later one
 * is not, so a caller measures once on its own.
 *
 * @access private
 */
export function observeResize(element: Element, callback: OnResize): () => void {
	if (typeof ResizeObserver === 'undefined') {
		return noop;
	}

	observer ??= new ResizeObserver(onResize);

	let elementCallbacks = callbacks.get(element);

	if (!elementCallbacks) {
		elementCallbacks = new Set();
		callbacks.set(element, elementCallbacks);
		observer.observe(element);
	}

	elementCallbacks.add(callback);

	return (): void => {
		elementCallbacks.delete(callback);

		if (elementCallbacks.size === 0 && callbacks.get(element) === elementCallbacks) {
			callbacks.delete(element);
			observer?.unobserve(element);
		}

		if (callbacks.size === 0) {
			observer?.disconnect();
			observer = null;
		}
	};
}
