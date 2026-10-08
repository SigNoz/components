import type { Toast as ToastPrimitive } from '@base-ui/react/toast';
import type { AriaAttributes, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { ToastPosition, ToastVariant } from './constants.js';

export type ToastVariantType = (typeof ToastVariant)[keyof typeof ToastVariant];
export type ToastPositionType = (typeof ToastPosition)[keyof typeof ToastPosition];

export interface ToasterProps
	extends Pick<ComponentPropsWithoutRef<'div'>, 'id' | 'className' | 'style'>, AriaAttributes {
	/**
	 * Where a toast raised with no `position` stacks. Each position keeps a stack of its own.
	 *
	 * @default 'top-right'
	 */
	position?: ToastPositionType;
	/**
	 * The distance between the stack and the edges of the window it sits against. Numbers are
	 * written as `px`.
	 *
	 * @default 16
	 */
	offset?: number | string;
	/**
	 * How many toasts the stack shows. The rest wait behind until one closes.
	 *
	 * @default 3
	 */
	limit?: number;
	/**
	 * How long `success`, `info` and `warning` toasts stay on screen, in milliseconds. `0` keeps
	 * them until they are dismissed. A `danger` or `loading` toast, and a toast with an `action`,
	 * stay until they are dismissed whatever this is.
	 *
	 * @default 5000
	 */
	timeout?: number;
	/**
	 * The element the toasts are portalled into. Defaults to the panel of the `Dialog` or
	 * `Drawer` the `Toaster` sits in, else `document.body`.
	 */
	container?: ComponentPropsWithoutRef<typeof ToastPrimitive.Portal>['container'];
	/**
	 * Alias for `data-testid`, set on the viewport of `position`. The viewport of another position
	 * gets `<testId>-<position>`. A toast gets `<testId>-toast-<id>`, and each part of it a further
	 * suffix (`-content`, `-icon`, `-title`, `-description`, `-action`).
	 */
	testId?: string;
	/**
	 * Any `data-*` attribute is forwarded to the viewport.
	 */
	[dataAttribute: `data-${string}`]: unknown;
}

export interface ToastAction {
	/**
	 * What the button says, such as `Undo` or `Cancel`. A `ReactNode`, so an icon fits next to the
	 * text.
	 */
	label: ReactNode;
	/**
	 * Runs when the button is activated, before the toast closes. Call `event.preventDefault()` to
	 * keep the toast open, such as when an undo failed.
	 */
	onClick?: ComponentPropsWithoutRef<'button'>['onClick'];
}

export interface ToastOptions {
	/**
	 * Secondary text under the title.
	 */
	description?: ReactNode;
	/**
	 * The button on the right. It closes the toast, after running `onClick`, so it is both the way
	 * out and the place to undo what the toast reports. Never put an irreversible action there,
	 * use a confirm dialog.
	 *
	 * A toast with an action stays until it is dismissed or replaced.
	 */
	action?: ToastAction;
	/**
	 * Identifies the toast. A call with the `id` of a visible toast updates it in place and adds
	 * no second one.
	 *
	 * @default `<variant>:<title>` when the title is a string
	 */
	id?: string;
	/**
	 * Alias for `data-testid`, set on the toast.
	 */
	testId?: string;
	/**
	 * How long the toast stays on screen, in milliseconds. `0` keeps it until it is dismissed.
	 *
	 * Not taken by `toast.danger` and `toast.loading`, which stay until dismissed or replaced.
	 *
	 * @default the `timeout` of the `Toaster`, or `0` for a toast with an `action`
	 */
	timeout?: number;
	/**
	 * The stack the toast goes to. Each position keeps a stack of its own.
	 *
	 * Without it, a toast with the `id` of a visible one stays where that one is. With it, that
	 * toast moves here.
	 *
	 * @default the `position` of the `Toaster`
	 */
	position?: ToastPositionType;
}

/**
 * No `timeout`: a `danger` toast stays until it is dismissed.
 */
export interface ToastDangerOptions extends Omit<ToastOptions, 'timeout'> {
	/**
	 * The button on the right, required: a `danger` toast never closes on its own, so it needs a
	 * way out from the keyboard. With no `onClick` it only closes the toast, so label it that way,
	 * `Close` or `Dismiss` in the language of the app.
	 */
	action: ToastAction;
}

export interface ToastPromiseOptions<Value> {
	/**
	 * The title while the promise is pending.
	 */
	loading: ReactNode;
	/**
	 * The title once the promise resolves. A function receives the resolved value.
	 */
	success: ReactNode | ((result: Value) => ReactNode);
	/**
	 * The title once the promise rejects. A function receives the rejection reason.
	 */
	error: ReactNode | ((error: unknown) => ReactNode);
	/**
	 * The button of the toast once the promise rejects. Required for the same reason as on
	 * `toast.danger`: the rejected toast never closes on its own.
	 */
	errorAction: ToastAction;
	/**
	 * Identifies the toast, as on the other calls. A visible toast with this `id` turns into the
	 * loading toast and follows the promise. Without it every call is a toast of its own.
	 */
	id?: string;
	/**
	 * Alias for `data-testid`, set on the toast in every state.
	 */
	testId?: string;
	/**
	 * The stack the toast goes to, in every state, as on the other calls.
	 *
	 * @default the `position` of the `Toaster`
	 */
	position?: ToastPositionType;
}

/**
 * What a toast carries beyond what Base UI knows about.
 *
 * @access private
 */
export type ToastData = {
	testId?: string;
	action?: ToastAction;
};
