import { useEffect } from 'react';

interface ClosableHandle {
	close: () => void;
	getSnapshot: () => unknown;
}

// How many mounted dialogs use each handle. Kept per handle, not per dialog, so a dialog that
// replaces another one on the same handle, such as one with a new `key`, keeps it open.
const mountedDialogs = new WeakMap<ClosableHandle, number>();

/**
 * Closes the handle when the last `Dialog` or `AlertDialog` it was given unmounts while it is
 * open, such as a child that closes with its parent. Without it the handle stays open with nothing
 * on screen, so the dialog appears at once the next time it mounts, and `onOpenChange` never hears
 * of a close.
 *
 * The close waits a microtask and is dropped when a dialog is mounted with the same handle by
 * then: Strict Mode mounts, unmounts and mounts every effect again on purpose, a handle opened on
 * mount must stay open through it, and a dialog remounted with a new `key` takes over the handle.
 * It is also dropped when the handle changed in the meantime, such as a `handle.open(...)` right
 * after the unmount: that call is newer than the unmount and wins.
 *
 * @access private
 */
export function useCloseHandleOnUnmount(handle: ClosableHandle | undefined): void {
	useEffect(() => {
		if (!handle) {
			return;
		}

		mountedDialogs.set(handle, (mountedDialogs.get(handle) ?? 0) + 1);

		return () => {
			mountedDialogs.set(handle, (mountedDialogs.get(handle) ?? 1) - 1);

			const stateAtUnmount = handle.getSnapshot();
			queueMicrotask(() => {
				if (mountedDialogs.get(handle) === 0 && handle.getSnapshot() === stateAtUnmount) {
					handle.close();
				}
			});
		};
	}, [handle]);
}
