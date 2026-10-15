import { type PopupHandle, usePopupHandle } from '../lib/popup-handle.js';

/**
 * Creates a handle that shows and hides a `Tooltip` from application state.
 *
 * A tooltip belongs to the pointer, so reach for this only when the surface is driven from
 * somewhere the tooltip cannot see: a row the pointer entered, a card positioned on a fixed rail
 * while the hover happens elsewhere.
 *
 * `handle.showAt(target, payload)` places the popup against an element, a `DOMRect` or a point
 * and renders `payload` through `title`; `handle.close()` hides it.
 *
 * @example
 * ```tsx
 * const card = useTooltipHandle<SpanRow>();
 *
 * <Tooltip handle={card} side="right" align="start" title={(row) => <SpanCard row={row} />}>
 *   <span className={styles.rail} />
 * </Tooltip>;
 *
 * onRowEnter={(row, el) => card.showAt(el, row)}
 * onRowLeave={() => card.close()}
 * ```
 */
export function useTooltipHandle<Payload = void>(
	onOpenChange?: (open: boolean) => void,
): PopupHandle<Payload> {
	return usePopupHandle<Payload>(onOpenChange);
}
