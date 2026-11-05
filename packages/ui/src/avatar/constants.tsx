export const AvatarSize = {
	Sm: 'sm',
	Md: 'md',
} as const;

export const AvatarColor = {
	Primary: 'primary',
	Secondary: 'secondary',
	Danger: 'danger',
	Warning: 'warning',
	Success: 'success',
	Info: 'info',
	Archive: 'archive',
	HighlightDanger: 'highlight-danger',
} as const;

export const AvatarShape = {
	Circle: 'circle',
	Square: 'square',
} as const;

export const AvatarImageStatus = {
	Loading: 'loading',
	Loaded: 'loaded',
	Error: 'error',
} as const;

/**
 * The accessible name of an avatar whose `name` is empty.
 *
 * @access private
 */
export const UNKNOWN_USER_LABEL = 'Unknown user';
