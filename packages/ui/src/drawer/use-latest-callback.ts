import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';

/**
 * A function that calls the latest `callback` it was given. For code that runs after a `flushSync`
 * rendered the app again, where the `callback` of the render the code was built in may read state
 * that is gone by then.
 *
 * @access private
 */
export function useLatestCallback<Args extends unknown[]>(
	callback: ((...args: Args) => void) | undefined,
): (...args: Args) => void {
	const callbackRef = useRef(callback);
	useIsomorphicLayoutEffect(() => {
		callbackRef.current = callback;
	});

	return (...args) => {
		callbackRef.current?.(...args);
	};
}
