export const TabsVariant = {
	Primary: 'primary',
	Secondary: 'secondary',
} as const;

/**
 * Where the tab list sits inside the bar.
 *
 * `start` is the left edge and `end` the right one, mirrored under RTL, which is why these are
 * not named left/right.
 */
export const TabsAlignment = {
	Start: 'start',
	Center: 'center',
	End: 'end',
} as const;

/**
 * The axis the bar runs on. Horizontal only: there is no vertical rail.
 */
export const TabsOrientation = {
	Horizontal: 'horizontal',
} as const;

/**
 * Which end of the bar a scroll button scrolls towards.
 *
 * {@link TabsAlignment}'s outer pair, and named start/end for the same reason: each one mirrors
 * under RTL.
 */
export const TabsScrollDirection = {
	Start: 'start',
	End: 'end',
} as const;

/**
 * What a tab shows when its `label` renders nothing.
 *
 * An empty label is a bug rather than a state, but the tab still renders: hiding it would take a
 * view out of the bar silently.
 */
export const TABS_EMPTY_LABEL = '<No label>';
