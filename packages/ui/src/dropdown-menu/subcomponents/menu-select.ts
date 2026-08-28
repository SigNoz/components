/**
 * Base UI menu items have no `onSelect`: they report a plain click and close
 * themselves unless the handler opts out through `preventBaseUIHandler()`.
 * This rebuilds the contract callers already use — a cancellable select event
 * whose `preventDefault()` keeps the menu open.
 */
export function createSelectHandler<E extends { preventBaseUIHandler?: () => void }>(
	onSelect: ((event: Event) => void) | undefined,
	onClick: ((event: E) => void) | undefined,
): ((event: E) => void) | undefined {
	if (onSelect === undefined && onClick === undefined) {
		return undefined;
	}

	return (event: E) => {
		onClick?.(event);

		if (onSelect === undefined) {
			return;
		}

		const selectEvent = new Event('menuselect', { cancelable: true });
		onSelect(selectEvent);
		if (selectEvent.defaultPrevented) {
			event.preventBaseUIHandler?.();
		}
	};
}
