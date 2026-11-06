import { DialogHandle } from '../dialog/dialog-handle.js';
import { useOpenStateStore } from '../lib/popup-handle.js';
import type { DrawerHandleType } from './types.js';

/**
 * Creates a handle that opens and closes a `Drawer` from application state, with no `open` state
 * of your own.
 *
 * Use it when the press that opens the drawer is far from where the drawer is declared, such as a
 * row of a table. Declare one drawer, and call `open` with the row it is about. Pass `children` as
 * a function to receive that payload. Calling `open` again while the drawer is shown swaps the
 * payload in place, which is how ↑/↓ step through the rows.
 *
 * With a handle the drawer closes itself on `Esc`, the close button, a swipe and a press on the
 * backdrop of a `task`. `handle.close()` closes it from inside, such as a form after its save
 * succeeds. So `open` and `onClose` are never passed with a handle, and a drawer that must refuse
 * a close uses `open`.
 *
 * `onOpenChange` reports every open and close, whichever caused it.
 *
 * @example
 * ```tsx
 * const logDetails = useDrawerHandle<LogRow>();
 *
 * <Drawer handle={logDetails} type="inspector" title="Log details" width="extra-wide">
 *   {(log) => <LogDetails log={log} />}
 * </Drawer>;
 *
 * <TableRow onClick={() => logDetails.open(row)} />;
 * ```
 */
export function useDrawerHandle<Payload = void>(
	onOpenChange?: (open: boolean) => void,
): DrawerHandleType<Payload> {
	return useOpenStateStore(() => new DialogHandle<Payload>(), onOpenChange);
}
