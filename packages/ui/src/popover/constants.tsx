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
