/**
 * The visual treatment, the same five as `Button`. Set on the group, and per member on an item.
 *
 * `outlined` and `dashed` members share one hairline with each other, `solid` members are split by
 * a 1px seam, and a `ghost` or `link` member keeps its own corners with a gap on either side.
 */
export const ButtonGroupVariant = {
	Solid: 'solid',
	Outlined: 'outlined',
	Dashed: 'dashed',
	Ghost: 'ghost',
	Link: 'link',
} as const;

/**
 * The colour treatment, the same eight as `Button`. `solid` and `link` take any of them, the other
 * variants only `secondary`.
 */
export const ButtonGroupColor = {
	Primary: 'primary',
	Secondary: 'secondary',
	Danger: 'danger',
	Warning: 'warning',
	Success: 'success',
	Info: 'info',
	Archive: 'archive',
	HighlightDanger: 'highlight-danger',
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
 * How a member meets its neighbour, picked from the two variants. Sets the margin between them and
 * whether the corners they meet at stay rounded.
 *
 * - `shared`: two bordered members (`outlined`, `dashed`) sit flush and the second drops its start
 *   border, so the line between them is drawn once. Square corners.
 * - `seam`: a `solid` member next to another `solid`, `outlined` or `dashed` one, split by a 1px
 *   seam. Square corners.
 * - `gap`: a `ghost` member next to anything but a `link`, 4px apart. Rounded corners.
 * - `wide-gap`: a `link` member next to anything, 8px apart. Rounded corners.
 *
 * @access private
 */
export const ButtonGroupJoin = {
	Shared: 'shared',
	Seam: 'seam',
	Gap: 'gap',
	WideGap: 'wide-gap',
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
