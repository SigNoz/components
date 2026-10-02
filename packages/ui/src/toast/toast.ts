import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import type { ReactNode } from 'react';
import { hasRenderableContent } from '../lib/utils.js';
import { ToastVariant } from './constants.js';
import type {
	ToastDangerOptions,
	ToastData,
	ToastOptions,
	ToastPromiseOptions,
	ToastVariantType,
} from './types.js';
import { managerOptions } from './utils.js';

/**
 * The one manager every `toast.*` call goes through and every `Toaster` subscribes to.
 *
 * @access private
 */
export const toastManager = ToastPrimitive.createToastManager<ToastData>();

function show(variant: ToastVariantType, title: ReactNode, options?: ToastOptions): string {
	// Nothing to read, so nothing to announce and no place taken in the stack.
	if (!hasRenderableContent(title) && !hasRenderableContent(options?.description)) {
		return '';
	}

	return toastManager.add({
		...managerOptions(variant, title, options),
		id: options?.id ?? (typeof title === 'string' ? `${variant}:${title}` : undefined),
	});
}

function promise<Value>(
	value: Promise<Value>,
	{ loading, success, error, errorAction, id, testId }: ToastPromiseOptions<Value>,
): Promise<Value> {
	// No `id` derived from the title: two requests with the same loading title are two toasts.
	let current = hasRenderableContent(loading)
		? toastManager.add({ ...managerOptions(ToastVariant.Loading, loading, { testId }), id })
		: undefined;

	const close = () => {
		if (current !== undefined) {
			toastManager.close(current);
		}
	};

	const settle = (variant: ToastVariantType, getTitle: () => ReactNode, options: ToastOptions) => {
		let title: ReactNode;
		try {
			title = getTitle();
		} catch (thrown) {
			// A title function that throws is a bug in the app and leaves nothing to show. Close the
			// toast, so a loading toast does not spin forever, and rethrow, so the bug is reported as
			// an unhandled rejection instead of lost.
			close();
			throw thrown;
		}

		// An empty toast is not rendered, but Base UI still counts it in the stack, so the toasts
		// behind it would look covered. Close it instead.
		if (!hasRenderableContent(title)) {
			close();
			return;
		}

		if (current === undefined) {
			current = toastManager.add({ ...managerOptions(variant, title, options), id });
		} else {
			toastManager.update(current, managerOptions(variant, title, options));
		}
	};

	// This chain rejects only when a title function throws. `value` has a handler, so its own
	// rejection is not reported as unhandled: the caller owns it only by awaiting `value`.
	value.then(
		(result) =>
			settle(
				ToastVariant.Success,
				() => (typeof success === 'function' ? success(result) : success),
				{ testId },
			),
		(reason: unknown) =>
			settle(ToastVariant.Danger, () => (typeof error === 'function' ? error(reason) : error), {
				testId,
				action: errorAction,
			}),
	);

	return value;
}

/**
 * Raises a toast from anywhere, hooks and plain modules included.
 *
 * It needs one `<Toaster />` mounted at the app root. A call made before the `Toaster` mounts,
 * or from an app that never mounts one, is lost without an error.
 *
 * ### Variants
 *
 * | Method | Icon | Closes on its own |
 * |---|---|---|
 * | `toast.success` | success | after the `timeout` of the `Toaster`, 5s by default |
 * | `toast.info` | info | same |
 * | `toast.warning` | warning | same |
 * | `toast.danger` | danger | never |
 * | `toast.loading` | spinner | never, it is replaced |
 *
 * A toast with an `action` also stays until it is dismissed. The timer pauses on hover and on
 * focus inside the stack. `toast.danger` is announced assertively, the rest politely.
 *
 * ### The button
 *
 * `action` is the button on the right, and it is also the close button: it runs `onClick`, then
 * closes the toast. An `onClick` that calls `event.preventDefault()` keeps the toast open.
 *
 * `toast.danger` requires an `action`, and `toast.promise` an `errorAction`, because a danger
 * toast never closes on its own and needs a way out from the keyboard. There is no default label,
 * so the app picks the word and its language. The other variants have no button unless they are
 * given one.
 *
 * ### Deduplication
 *
 * A call with the `id` of a visible toast updates that toast in place. Without an `id` it is
 * `<variant>:<title>` for a string title, so ten clicks on "Copied to clipboard" show one toast.
 *
 * Pass an `id` when two toasts share a title but must stay separate, or to replace a toast with
 * another variant, such as a `loading` toast by its result.
 *
 * ### Empty text
 *
 * A call with no title and no description shows nothing and returns `''`.
 *
 * ### Promises
 *
 * `toast.promise` returns the promise it was given, so `await toast.promise(save(), {...})`
 * rejects as `save()` does. Calling it without awaiting is safe: a rejection is reported by the
 * toast and not as an unhandled rejection. A toast dismissed while the promise is pending does not
 * come back when it settles.
 *
 * A `success` or `error` function that throws closes the toast, and its error is reported as an
 * unhandled rejection. The promise returned is not affected.
 *
 * An empty `loading` shows no toast until the promise settles. A toast that settles on an empty
 * title closes. `id` and `testId` work as on the other calls, and hold in every state.
 *
 * @example
 * ```tsx
 * toast.success('Panel saved');
 * ```
 *
 * @example
 * ```tsx
 * // A description under the title, and a way back. The button closes the toast too
 * toast.success('Panel deleted', {
 *   description: 'It is gone from the dashboard.',
 *   action: { label: 'Undo', onClick: restore },
 * });
 * ```
 *
 * @example
 * ```tsx
 * // A danger toast always names its button
 * toast.danger('Could not save the panel', { action: { label: 'Close' } });
 * ```
 *
 * @example
 * ```tsx
 * // One toast that follows the request
 * toast.promise(save(), {
 *   loading: 'Saving the panel',
 *   success: 'Panel saved',
 *   error: (reason) => `Could not save: ${String(reason)}`,
 *   errorAction: { label: 'Close' },
 * });
 * ```
 */
export const toast = {
	/** Something worked. Closes on its own. */
	success: (title: ReactNode, options?: ToastOptions) => show(ToastVariant.Success, title, options),
	/** Neutral news. Closes on its own. */
	info: (title: ReactNode, options?: ToastOptions) => show(ToastVariant.Info, title, options),
	/** Something to look at, nothing broke. Closes on its own. */
	warning: (title: ReactNode, options?: ToastOptions) => show(ToastVariant.Warning, title, options),
	/** Something failed. Stays until dismissed, so it requires an `action`. */
	danger: (title: ReactNode, options: ToastDangerOptions) =>
		show(ToastVariant.Danger, title, options),
	/** Work in flight. Stays until replaced, usually by the result with the same `id`. */
	loading: (title: ReactNode, options?: ToastOptions) => show(ToastVariant.Loading, title, options),
	/** One toast that goes from loading to success or danger as `value` settles. */
	promise,
	/** Closes the toast with this `id`, or every toast with no argument. */
	dismiss: (id?: string) => toastManager.close(id),
};
