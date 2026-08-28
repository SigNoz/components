import * as React from 'react';

/**
 * Bridges Radix's cancellable auto-focus events onto Base UI's `initialFocus`
 * and `finalFocus`, which take the decision as a return value rather than
 * reporting it as a preventable event.
 *
 * `true` selects Base UI's normal focus target and `false` suppresses focusing
 * entirely — returning `undefined` suppresses it too, so a handler that does not
 * call `preventDefault()` must resolve to `true`.
 */
export function useAutoFocusBridge(
	handler: ((event: Event) => void) | undefined,
	type: string,
): (() => boolean) | undefined {
	return React.useMemo(() => {
		if (handler === undefined) {
			return undefined;
		}
		return () => {
			const event = new Event(type, { cancelable: true });
			handler(event);
			return !event.defaultPrevented;
		};
	}, [handler, type]);
}
