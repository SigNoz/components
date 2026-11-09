export const SkeletonSize = {
	Sm: 'sm',
	Md: 'md',
} as const;

export const SkeletonAvatarShape = {
	Circle: 'circle',
	Square: 'square',
} as const;

/**
 * The rows `Skeleton` draws when `paragraph` does not set `rows`.
 *
 * @access private
 */
export const SKELETON_DEFAULT_ROWS = 3;
