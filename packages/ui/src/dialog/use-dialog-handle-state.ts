import { useOpenStateSnapshot } from '../lib/popup-handle.js';
import { DIALOG_HANDLE_CLOSED, type DialogHandle } from './dialog-handle.js';
import type { DialogHandleState } from './types.js';

/**
 * Subscribes to a handle's state, or reports a closed dialog when there is no handle.
 *
 * @access private
 */
export function useDialogHandleState<Payload>(
	handle: DialogHandle<Payload> | undefined,
): DialogHandleState<Payload> {
	return useOpenStateSnapshot(handle, DIALOG_HANDLE_CLOSED as DialogHandleState<Payload>);
}
