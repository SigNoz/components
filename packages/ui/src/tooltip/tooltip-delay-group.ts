/**
 * The tooltips of one `TooltipProvider` that are open, and when the last of them closed. While one
 * is open, or within the provider's `timeout` of the last close, the next one opens without waiting
 * for the `delay`, the same as the delay group of Base UI.
 *
 * @access private
 */
export type TooltipDelayGroup = {
	/**
	 * Whether a tooltip that opens now skips the `delay`.
	 */
	isInstant: (timeout: number) => boolean;
	/**
	 * Records that the tooltip with this id opened or closed.
	 */
	setOpen: (id: string, open: boolean) => void;
	/**
	 * Records that hover or focus opened the tooltip with this id, and closes the one they opened
	 * before it, so a tooltip on an element inside the trigger of another never shows next to it.
	 */
	activate: (id: string, close: () => void) => void;
	/**
	 * Records that the tooltip hover or focus opened with this id closed.
	 */
	deactivate: (id: string) => void;
};

/**
 * @access private
 */
export function createTooltipDelayGroup(): TooltipDelayGroup {
	const openIds = new Set<string>();
	let closedAt = Number.NEGATIVE_INFINITY;
	let active: { id: string; close: () => void } | undefined;

	return {
		isInstant: (timeout) => openIds.size > 0 || performance.now() - closedAt < timeout,
		setOpen: (id, open) => {
			if (open) {
				openIds.add(id);
			} else if (openIds.delete(id) && openIds.size === 0) {
				closedAt = performance.now();
			}
		},
		activate: (id, close) => {
			const previous = active;
			active = { id, close };

			if (previous !== undefined && previous.id !== id) {
				previous.close();
			}
		},
		deactivate: (id) => {
			if (active?.id === id) {
				active = undefined;
			}
		},
	};
}
