/**
 * How long a tooltip waits on hover before it opens, in milliseconds, when no `TooltipProvider`
 * sets `delay`.
 */
export const TOOLTIP_DEFAULT_DELAY = 300;

/**
 * How long a tooltip waits before it closes once the pointer leaves, in milliseconds, when no
 * `TooltipProvider` sets `closeDelay`.
 */
export const TOOLTIP_DEFAULT_CLOSE_DELAY = 0;

/**
 * How long after the last tooltip closed the next one still opens at once, in milliseconds, when no
 * `TooltipProvider` sets `timeout`. The same as the default of Base UI.
 */
export const TOOLTIP_DEFAULT_TIMEOUT = 400;
