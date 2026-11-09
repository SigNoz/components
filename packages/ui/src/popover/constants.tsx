/**
 * Distance between the anchor and the popup, in pixels. Base UI takes it as a number on the
 * positioner, so a token could only reach it by reading computed style on every open. Not a prop:
 * a good default, not a knob.
 */
export const POPOVER_SIDE_OFFSET = 4;

/**
 * Offset along the aligned edge, in pixels. Fixed, as `POPOVER_SIDE_OFFSET`.
 */
export const POPOVER_ALIGN_OFFSET = 0;

/**
 * Milliseconds the pointer rests on the trigger before a hover popover opens. Base UI's own
 * default, restated so the component owns it.
 */
export const POPOVER_HOVER_DELAY = 300;

/**
 * Milliseconds after the pointer leaves before a hover popover closes.
 */
export const POPOVER_HOVER_CLOSE_DELAY = 0;

/**
 * What a Base UI popover trigger adds to its element that a preview trigger does not want, each
 * set to `undefined` so the element keeps what it was: the `button` role and the `tabindex` of a
 * trigger that is not a native button, and the `aria-haspopup`, `aria-expanded` and
 * `aria-controls` that announce a dialog. A preview opens a card about its element, not a dialog.
 *
 * @access private
 */
export const POPOVER_PREVIEW_TRIGGER_RESET = {
	role: undefined,
	tabIndex: undefined,
	'aria-haspopup': undefined,
	'aria-expanded': undefined,
	'aria-controls': undefined,
} as const;
