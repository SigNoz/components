/**
 * The visual treatment of the group.
 *
 * `outlined` is the only value the design spec draws: a group shares one hairline between its
 * members, and the outlined variant is the only one with a border to share.
 */
export const ButtonGroupVariant = {
	Outlined: 'outlined',
} as const;

/**
 * The colour treatment. `secondary` is the only value the design spec draws today.
 */
export const ButtonGroupColor = {
	Secondary: 'secondary',
} as const;

/**
 * Height + padding token. `sm` is 24px tall, `md` is 32px, the same as `Button`.
 */
export const ButtonGroupSize = {
	SM: 'sm',
	MD: 'md',
} as const;

/**
 * What a member's label does when it does not fit.
 */
export const ButtonGroupTextOverflow = {
	Hidden: 'hidden',
	Visible: 'visible',
	Ellipsis: 'ellipsis',
} as const;

/**
 * Where a member sits in the visible row, named after the axis the Secondary Tab Bar and
 * Segmented Button pages use. Picks which corners stay rounded.
 */
export const ButtonGroupPosition = {
	Only: 'only',
	Start: 'start',
	Middle: 'middle',
	End: 'end',
} as const;

/**
 * What a member shows when its `label` renders nothing.
 *
 * An empty label is a bug rather than a state, but the member still renders: hiding it would take
 * an action out of the group silently.
 */
export const BUTTON_GROUP_EMPTY_LABEL = '<No label>';

/**
 * Joins the member values into the key that restarts overflow measurement.
 *
 * `items` is a new array on most renders, so the effect depends on this string instead of the
 * array identity. A printable separator lets two different lists join to the same key
 * (`['a,b', 'c']` and `['a', 'b,c']` both give `a,b,c`), and the group would keep observing the old
 * members. NUL does not show up in a real value, so each list gets its own key.
 *
 * @access private
 */
export const BUTTON_GROUP_ITEMS_KEY_SEPARATOR = '\u0000';
