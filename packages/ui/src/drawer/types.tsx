/**
 * The side of the viewport a drawer slides in from.
 */
export type DrawerDirection = 'top' | 'right' | 'bottom' | 'left';

/**
 * The maximum width of a drawer that slides in from the left or the right.
 */
export type DrawerSize = 'narrow' | 'base' | 'wide' | 'extra-wide';

/**
 * How the drawer panel enters and leaves.
 * - `slide` moves it in from its `direction`.
 * - `fade` and `zoom` scale it up from a lower opacity, `zoom` starting smaller.
 */
export type DrawerAnimation = 'fade' | 'zoom' | 'slide';
