export const TabsVariant = {
	Primary: 'primary',
	Secondary: 'secondary',
} as const;

/**
 * Where the tab list sits inside the bar, along the axis the bar runs on.
 *
 * `start` is the left edge while `orientation` is `horizontal` and the top edge while it is
 * `vertical`, which is why these are not named left/right.
 */
export const TabsAlignment = {
	Start: 'start',
	Center: 'center',
	End: 'end',
} as const;

export const TabsOrientation = {
	Horizontal: 'horizontal',
	Vertical: 'vertical',
} as const;

/**
 * Which end of the bar a scroll button scrolls towards.
 *
 * The same two values as {@link TabsAlignment}'s outer pair, and for the same reason: `start` is
 * left or top depending on the orientation.
 */
export const TabsScrollDirection = {
	Start: 'start',
	End: 'end',
} as const;

/**
 * What a tab shows when its `label` renders nothing.
 *
 * A label is hardcoded at nearly every call site, so an empty one is a bug rather than a state. The
 * tab still renders: hiding it would take a view out of the bar silently.
 */
export const TABS_EMPTY_LABEL = '<No label>';
