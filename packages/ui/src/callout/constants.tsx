export const CalloutColor = {
	Primary: 'primary',
	Secondary: 'secondary',
	Success: 'success',
	Danger: 'danger',
	Warning: 'warning',
	Info: 'info',
	Archive: 'archive',
	HighlightDanger: 'highlight-danger',
} as const;

export const CalloutSize = {
	Sm: 'sm',
	Md: 'md',
} as const;

/**
 * What the title of `Callout.Expandable` shows when `title` renders nothing.
 *
 * An empty title is a bug rather than a state, but the callout still renders: the title row is
 * the only part left once it is collapsed, and hiding it would drop the message silently.
 */
export const CALLOUT_EMPTY_TITLE = '<No title>';

/**
 * What the description of `Callout.Expandable` shows when `children` renders nothing, for the
 * same reason as `CALLOUT_EMPTY_TITLE`.
 */
export const CALLOUT_EMPTY_DESCRIPTION = '<No description>';

/**
 * @access private
 */
export const ALERT_COLORS: ReadonlySet<string> = new Set([
	CalloutColor.Danger,
	CalloutColor.HighlightDanger,
]);
