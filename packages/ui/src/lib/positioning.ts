/**
 * Positioning types owned by this package rather than re-exported from the
 * primitive. Base UI's own types reference `@floating-ui/utils`, which is a
 * transitive dependency and therefore not nameable in our published
 * declarations. These mirror the shapes callers already used.
 */

/** Padding between the popup and the boundary edges used for collision detection. */
export type CollisionPadding =
	| number
	| Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;

/** Element(s) treated as the collision boundary. Defaults to the viewport. */
export type CollisionBoundary = Element | Element[] | null;
