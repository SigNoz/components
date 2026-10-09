import { forwardRef } from 'react';
import { saveDismissal, useDismissed } from '../../lib/dismissal-store.js';
import { AlertStripCloseable, type AlertStripCloseableProps } from './alert-strip-closeable.js';

export type AlertStripCloseablePersistedProps = Omit<
	AlertStripCloseableProps,
	'closed' | 'onClose'
> & {
	/**
	 * Persists the dismissed state of this strip in `localStorage` under this key. The strip stays
	 * hidden after a reload until the entry is cleared.
	 */
	storageKey: string;
	/**
	 * Runs after the user clicks the close button, once the dismissal is saved. The strip hides
	 * itself, so this is only for side effects.
	 */
	onClose?: () => void;
};

/**
 * An `AlertStrip.Closeable` that stays hidden after a reload. Reached as
 * `AlertStrip.CloseablePersisted`, not imported on its own.
 *
 * Unlike `AlertStrip.Closeable` it owns its state, so it takes no `closed`. The dismissal is
 * written to `localStorage` under `storageKey` as `"true"`. Where storage is blocked the strip
 * shows, and the close button hides it until the next reload.
 *
 * On the client it reads `storageKey` on the first render, so a dismissed strip never flashes in.
 * A server render shows the strip, which hides right after hydration when the entry says so.
 *
 * It follows the entry: closing one strip hides every other one with the same `storageKey`, in
 * this tab and in the others, and a new `storageKey` shows or hides it according to its own entry.
 *
 * @example
 * ```tsx
 * <AlertStrip.CloseablePersisted storageKey="no-auth-banner-v1" color="warning" side="bottom">
 *   Warning: you are in impersonation mode.
 * </AlertStrip.CloseablePersisted>
 * ```
 */
export const AlertStripCloseablePersisted = forwardRef<
	HTMLDivElement,
	AlertStripCloseablePersistedProps
>(function AlertStripCloseablePersisted({ storageKey, onClose, ...props }, ref) {
	const closed = useDismissed(storageKey);

	return (
		<AlertStripCloseable
			{...props}
			ref={ref}
			closed={closed}
			onClose={() => {
				saveDismissal(storageKey);
				onClose?.();
			}}
		/>
	);
});
AlertStripCloseablePersisted.displayName = 'AlertStrip.CloseablePersisted';
