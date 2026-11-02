/**
 * What a crumb's label does when it does not fit.
 */
export const BreadcrumbTextOverflow = {
	Hidden: 'hidden',
	Ellipsis: 'ellipsis',
} as const;

/**
 * Where a crumb sits in the trail, named after the positional variants of `_Breadcrumb Item` in the
 * design spec. A single crumb is the current page, so it is the `end`.
 *
 * @access private
 */
export const BreadcrumbPosition = {
	Start: 'start',
	Middle: 'middle',
	End: 'end',
} as const;

/**
 * What a crumb renders as, and so whether it reacts to hover and focus. Only `link`, `button` and
 * `menu` are interactive.
 *
 * @access private
 */
export const BreadcrumbItemKind = {
	Link: 'link',
	Button: 'button',
	Menu: 'menu',
	Text: 'text',
} as const;

/**
 * Which crumbs shorten once only the first and the last crumb are left. `end`: the last one, while
 * the first keeps its width. `start`: the last one sits at the floor and the first one shortens.
 * `floor`: both sit at the floor and the trail overflows its container.
 *
 * @access private
 */
export const BreadcrumbShrink = {
	End: 'end',
	Start: 'start',
	Floor: 'floor',
} as const;

/**
 * @access private
 */
export const BREADCRUMB_DEFAULT_SEPARATOR = '/';

/**
 * @access private
 */
export const BREADCRUMB_DEFAULT_ARIA_LABEL = 'Breadcrumb';

/**
 * @access private
 */
export const BREADCRUMB_ELLIPSIS_LABEL = '...';

/**
 * The fewest crumbs a trail needs before any can collapse: the first, the last, and one between
 * them.
 *
 * @access private
 */
export const BREADCRUMB_MIN_COLLAPSIBLE_ITEMS = 3;

/**
 * Two crumbs always stay: the first and the last.
 *
 * @access private
 */
export const BREADCRUMB_MIN_VISIBLE_ITEMS = 2;

/**
 * Extra room a collapsed trail needs before it expands again. Without it, a trail sitting on the
 * boundary flips between collapsed and expanded on every sub-pixel resize.
 *
 * @access private
 */
export const BREADCRUMB_COLLAPSE_HYSTERESIS_PX = 4;

/**
 * Joins the crumb titles into the key that restarts collapse measurement. NUL does not show up in
 * a real title, so two different trails never join to the same key.
 *
 * @access private
 */
export const BREADCRUMB_ITEMS_KEY_SEPARATOR = '\u0000';
