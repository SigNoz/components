import { type PopupHandle, usePopupHandle } from '../lib/popup-handle.js';

/**
 * Creates a handle that shows and hides a `Popover` from application state.
 *
 * Use it for the surfaces a trigger press cannot produce: a menu at the point of a chart click, a
 * suggestion list opened by an input taking focus, a hover card that walks a list of rows. Also
 * for the opposite problem: a form inside a popover that must close itself once its save
 * succeeds.
 *
 * Pass the handle to `Popover`, then call `showAt` with the element, `DOMRect` or point to place
 * it against, and the payload to render. Pass `children` as a function to receive that payload.
 *
 * `onOpenChange` reports every open and close, whichever caused it: `showAt`, `close`, a press
 * on the popover's own trigger, Escape, or an outside press. Use it to reset the content a
 * closed popup leaves behind, or to mirror the state a sibling control has to read.
 *
 * @example
 * ```tsx
 * const menu = usePopoverHandle<DrilldownData>();
 *
 * <Popover handle={menu} side="bottom" align="start">
 *   {(data) => <DrilldownMenu data={data} onPick={() => menu.close()} />}
 * </Popover>;
 *
 * // from a chart click, where no element exists at the pointer
 * onPointClick={(event, data) => menu.showAt({ x: event.clientX, y: event.clientY }, data)}
 * ```
 *
 * @example
 * ```tsx
 * // a form that closes itself once the mutation lands
 * const saveView = usePopoverHandle();
 *
 * <Popover handle={saveView} trigger={<Button>Save view</Button>} nativeButton side="bottom" align="end">
 *   <SaveViewForm onSaved={() => saveView.close()} />
 * </Popover>;
 * ```
 */
export function usePopoverHandle<Payload = void>(
	onOpenChange?: (open: boolean) => void,
): PopupHandle<Payload> {
	return usePopupHandle<Payload>(onOpenChange);
}
