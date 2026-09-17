export const TabsVariant = {
	Primary: 'primary',
	Secondary: 'secondary',
} as const;

export const TabsAlignment = {
	Left: 'left',
	Center: 'center',
	Right: 'right',
} as const;

export const TabsOrientation = {
	Horizontal: 'horizontal',
	Vertical: 'vertical',
} as const;

/**
 * What a tab shows when its `label` renders nothing.
 *
 * A label is hardcoded at nearly every call site, so an empty one is a bug rather than a state. The
 * tab still renders: hiding it would take a view out of the bar silently.
 */
export const TABS_EMPTY_LABEL = '<No label>';
