import { OpenStateStore } from '../lib/popup-handle.js';
import type { DialogHandleOpenArgs, DialogHandleState } from './types.js';

/**
 * The state of a handle that was never opened, and of a `Dialog` without a handle.
 *
 * @access private
 */
export const DIALOG_HANDLE_CLOSED: DialogHandleState<never> = { open: false, payload: undefined };

/**
 * Opens a `Dialog` from application state, and closes it from inside its content.
 *
 * `open(payload)` shows the dialog and renders `payload` through its `children`; `close()`
 * dismisses it. A close request from the dialog itself (`Esc`, the backdrop, the close button)
 * closes it through the handle too.
 */
export class DialogHandle<Payload = void> extends OpenStateStore<DialogHandleState<Payload>> {
	constructor() {
		super(DIALOG_HANDLE_CLOSED as DialogHandleState<Payload>);
	}

	/**
	 * Shows the dialog, rendering `payload` through its `children`.
	 *
	 * Calling it again while open swaps the payload, and the dialog stays where it is.
	 */
	open(...args: DialogHandleOpenArgs<Payload>): void {
		this.set({ open: true, payload: args[0] as Payload });
	}
}
