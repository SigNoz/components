export const CollapseVariant = {
	Outlined: 'outlined',
	Ghost: 'ghost',
} as const;

export const CollapseSize = {
	Sm: 'sm',
} as const;

export const CollapseTextOverflow = {
	Ellipsis: 'ellipsis',
	Wrap: 'wrap',
} as const;

/**
 * What the title shows when `title` renders nothing.
 *
 * An empty title is a bug rather than a state, but the section still renders: the header is the
 * only part left once it is collapsed, and hiding it would hide a broken section.
 */
export const COLLAPSE_EMPTY_TITLE = '<No title>';

/**
 * What the open panel shows when `children` renders nothing, for the same reason as
 * `COLLAPSE_EMPTY_TITLE`.
 */
export const COLLAPSE_EMPTY_CONTENT = '<No content>';

/**
 * Past this many items, the panels of a `Collapse.Group` drop `role="region"`, since many regions
 * crowd the landmark list.
 *
 * @access private
 */
export const COLLAPSE_GROUP_MAX_REGIONS = 6;

/**
 * @access private
 */
export const COLLAPSE_DEFAULT_HEADING_LEVEL = 3;
