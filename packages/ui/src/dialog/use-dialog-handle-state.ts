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
	const [shown, setShown] = useState(state);

	if (state.open && state !== shown) {
		setShown(state);
	}

	if (state.open || state.payload === shown.payload) {
		return state;
	}

	return { open: false, payload: shown.payload };
}
