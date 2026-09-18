/**
 * How many buttons can be pressed at once.
 */
export const ToggleGroupType = {
	Single: 'single',
	Multiple: 'multiple',
} as const;

/**
 * The visual treatment of the bar.
 *
 * `outlined` is the only value the design spec draws. The prop is kept so the bar states its
 * treatment, the same way `Tabs` keeps `orientation`.
 */
export const ToggleGroupVariant = {
	Outlined: 'outlined',
} as const;

/**
 * The colour treatment, named after `Badge`'s own set so the two stay aligned as colours land.
 *
 * `secondary` is the only value the design spec draws today.
 */
export const ToggleGroupColor = {
	Secondary: 'secondary',
} as const;

/**
 * Height + padding token.
 *
 * Both sizes are 32px tall. `md` triples the horizontal padding, so it is for two- or three-option
 * bars with room to breathe, and `sm` is what goes in a toolbar or a panel header.
 */
export const ToggleGroupSize = {
	SM: 'sm',
	MD: 'md',
} as const;

/**
 * Which end of the bar a scroll button scrolls towards.
 *
 * Named start/end rather than left/right: each one mirrors under RTL.
 */
export const ToggleGroupScrollDirection = {
	Start: 'start',
	End: 'end',
} as const;

/**
 * What a button shows when its `label` renders nothing.
 *
 * An empty label is a bug rather than a state, but the button still renders: hiding it would take
 * an option out of the bar silently.
 */
export const TOGGLE_GROUP_EMPTY_LABEL = '<No label>';
