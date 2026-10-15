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
