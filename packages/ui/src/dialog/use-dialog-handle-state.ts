import { useState } from 'react';
import { useOpenStateSnapshot } from '../lib/popup-handle.js';
import { DIALOG_HANDLE_CLOSED, type DialogHandle } from './dialog-handle.js';
import type { DialogHandleState } from './types.js';

/**
 * Subscribes to a handle's state, or reports a closed dialog when there is no handle.
 *
 * While closed, `payload` is the one the dialog last showed open, so the exit animation still has
 * it after the dialog is given another handle, or none. The handle it now has may never have been
 * opened, and its payload is `undefined`.
 *
 * @access private
 */
export function useDialogHandleState<Payload>(
	handle: DialogHandle<Payload> | undefined,
): DialogHandleState<Payload> {
	const state = useOpenStateSnapshot(handle, DIALOG_HANDLE_CLOSED as DialogHandleState<Payload>);
	const [shown, setShown] = useState(() => shownState(state));

	if (state.open && state !== shown.last) {
		setShown(shownState(state));
	}

	if (state.open || state.payload === shown.last.payload) {
		return state;
	}

	// The same object on every render, never a new one: `AlertDialog` compares the state it gets
	// with the one it had, and a fresh object each render would set its state on every render.
	return shown.closed;
}

function shownState<Payload>(state: DialogHandleState<Payload>): {
	last: DialogHandleState<Payload>;
	closed: DialogHandleState<Payload>;
} {
	return { last: state, closed: { open: false, payload: state.payload } };
}
