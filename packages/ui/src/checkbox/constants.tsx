export const CheckboxColor = {
	Primary: 'primary',
	Secondary: 'secondary',
	Danger: 'danger',
	Warning: 'warning',
	Success: 'success',
	Info: 'info',
	Archive: 'archive',
	HighlightDanger: 'highlight-danger',
} as const;

export const CheckboxTextOverflow = {
	Hidden: 'hidden',
	Wrap: 'wrap',
	Visible: 'visible',
	Ellipsis: 'ellipsis',
} as const;

/**
 * The label shown when `children` is passed but renders nothing. A broken label stays visible
 * instead of silently hiding a form control. The `name` prop is tried first; this string is the
 * last resort.
 */
export const CHECKBOX_EMPTY_LABEL = '<No label>';
