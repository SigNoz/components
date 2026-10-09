import type { ToastPositionType } from './types.js';

export const ToastVariant = {
	Success: 'success',
	Info: 'info',
	Warning: 'warning',
	Danger: 'danger',
	Loading: 'loading',
} as const;

export const ToastPosition = {
	TopLeft: 'top-left',
	TopCenter: 'top-center',
	TopRight: 'top-right',
	BottomLeft: 'bottom-left',
	BottomCenter: 'bottom-center',
	BottomRight: 'bottom-right',
} as const;

/**
 * Every position, each with a stack of its own.
 *
 * @access private
 */
export const TOAST_POSITIONS: readonly ToastPositionType[] = Object.values(ToastPosition);

/**
 * @access private
 */
export const DEFAULT_LIMIT = 3;

/**
 * @access private
 */
export const DEFAULT_TIMEOUT = 5000;

/**
 * The directions a toast is swiped toward to dismiss it: away from the edges it sits against.
 *
 * @access private
 */
export const SWIPE_DIRECTION = {
	'top-left': ['up', 'left'],
	'top-center': ['up'],
	'top-right': ['up', 'right'],
	'bottom-left': ['down', 'left'],
	'bottom-center': ['down'],
	'bottom-right': ['down', 'right'],
} as const satisfies Record<ToastPositionType, readonly ('up' | 'down' | 'left' | 'right')[]>;
