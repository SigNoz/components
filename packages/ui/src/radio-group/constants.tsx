export const RadioGroupColor = {
	Primary: 'primary',
	Secondary: 'secondary',
	Danger: 'danger',
	Warning: 'warning',
	Success: 'success',
	Info: 'info',
	Archive: 'archive',
	HighlightDanger: 'highlight-danger',
} as const;

export const RadioGroupTextOverflow = {
	Hidden: 'hidden',
	Wrap: 'wrap',
	Visible: 'visible',
	Ellipsis: 'ellipsis',
} as const;

/**
 * What a row shows when its `label` renders nothing.
 *
 * Labels are hardcoded at nearly every call site, so an empty one is a bug rather than a state. The
 * row still renders: hiding it would take an option out of the group silently, and a form control
 * that is quietly missing is worse than one that is visibly wrong.
 */
export const RADIO_GROUP_EMPTY_LABEL = '<No label>';
