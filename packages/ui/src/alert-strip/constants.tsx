/**
 * The values `color` takes on `AlertStrip` and its static members, the same names as `Badge` and
 * `Callout` use.
 */
export const AlertStripColor = {
	Primary: 'primary',
	Secondary: 'secondary',
	Success: 'success',
	Danger: 'danger',
	Warning: 'warning',
	Info: 'info',
	Archive: 'archive',
	HighlightDanger: 'highlight-danger',
} as const;

/**
 * The values `side` takes on `AlertStrip` and its static members: the edge of the page the strip
 * sits on.
 */
export const AlertStripSide = {
	Top: 'top',
	Bottom: 'bottom',
} as const;

/**
 * @access private
 */
export const ALERT_COLORS: ReadonlySet<string> = new Set([
	AlertStripColor.Danger,
	AlertStripColor.HighlightDanger,
]);
