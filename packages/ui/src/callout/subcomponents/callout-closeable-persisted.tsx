import { forwardRef } from 'react';
import { saveDismissal, useDismissed } from '../../lib/dismissal-store.js';
import { CalloutCloseable, type CalloutCloseableProps } from './callout-closeable.js';

export type CalloutCloseablePersistedProps = Omit<CalloutCloseableProps, 'closed' | 'onClose'> & {
	/**
	 * Persists the dismissed state of this callout in `localStorage` under this key. The callout
	 * stays hidden after a reload until the entry is cleared.
	 */
	storageKey: string;
	/**
	 * Runs after the user clicks the close button, once the dismissal is saved. The callout hides
	 * itself, so this is only for side effects. Focus it moves stays where it was put.
	 */
	onClose?: () => void;
};

/**
 * A `Callout.Closeable` that stays hidden after a reload. Reached as `Callout.CloseablePersisted`,
 * not imported on its own.
 *
 * Unlike `Callout.Closeable` it owns its state, so it takes no `closed`. The dismissal is written to
 * `localStorage` under `storageKey` as `"true"`, the value the app already uses, so a hand-rolled
 * dismissal migrates without showing the callout again. Where storage is blocked it stays hidden
 * for the rest of the session.
 *
 * It follows the entry: closing one callout hides every other one with the same `storageKey`, in
 * this tab and in the others, and a new `storageKey` shows or hides it according to its own entry.
 * A server render shows the callout, which hides right after hydration when the entry says so.
 *
 * @example
 * ```tsx
 * <Callout.CloseablePersisted
 *   storageKey="license-callout-dismissed"
 *   color="primary"
 *   size="sm"
 *   icon={<SolidInfoCircle />}
 * >
 *   Add a license key to unlock all features.
 * </Callout.CloseablePersisted>
 * ```
 */
export const CalloutCloseablePersisted = forwardRef<HTMLDivElement, CalloutCloseablePersistedProps>(
	function CalloutCloseablePersisted({ storageKey, onClose, ...props }, ref) {
		const closed = useDismissed(storageKey);

		return (
			<CalloutCloseable
				{...props}
				ref={ref}
				closed={closed}
				onClose={() => {
					saveDismissal(storageKey);
					onClose?.();
				}}
			/>
		);
	},
);
CalloutCloseablePersisted.displayName = 'Callout.CloseablePersisted';
