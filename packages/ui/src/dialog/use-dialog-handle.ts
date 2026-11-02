import { useOpenStateStore } from '../lib/popup-handle.js';
import { DialogHandle } from './dialog-handle.js';

/**
 * Creates a handle that opens and closes a `Dialog` from application state, with no `open` state
 * of your own.
 *
 * Use it when the press that opens the dialog is far from where the dialog is declared: a row
 * action in a table, a menu item, a keyboard shortcut. Declare one dialog, and call `open` with
 * the row it is about. Pass `children` as a function to receive that payload.
 *
 * With a handle the dialog closes itself on `Esc`, a backdrop press and the close button.
 * `handle.close()` closes it from inside, such as a form after its save succeeds. So `open` and
 * `onClose` are never passed with a handle, and a dialog that must refuse a close uses `open`.
 *
 * `onOpenChange` reports every open and close, whichever caused it.
 *
 * @example
 * ```tsx
 * const editAlert = useDialogHandle<AlertRule>();
 *
 * <Dialog handle={editAlert} title="Edit alert" width="wide">
 *   {(rule) => <EditAlertForm rule={rule} onSaved={() => editAlert.close()} />}
 * </Dialog>;
 *
 * <Button onClick={() => editAlert.open(row)}>Edit</Button>;
 * ```
 */
export function useDialogHandle<Payload = void>(
	onOpenChange?: (open: boolean) => void,
): DialogHandle<Payload> {
	return useOpenStateStore(() => new DialogHandle<Payload>(), onOpenChange);
}
