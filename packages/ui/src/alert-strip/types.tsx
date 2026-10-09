import type { AriaAttributes, ReactNode } from 'react';
import type { AlertStripColor, AlertStripSide } from './constants.js';

/**
 * One of the values of {@link AlertStripColor}.
 */
export type AlertStripColorType = (typeof AlertStripColor)[keyof typeof AlertStripColor];

/**
 * One of the values of {@link AlertStripSide}.
 */
export type AlertStripSideType = (typeof AlertStripSide)[keyof typeof AlertStripSide];

export type AlertStripProps = {
	/**
	 * Forwarded to the strip as `data-testid`. The parts derive theirs from it, as
	 * `{testId}-prefix`, `{testId}-content`, `{testId}-suffix` and `{testId}-close`.
	 */
	testId?: string;
	/**
	 * Forwarded to the strip.
	 */
	id?: string;
	/**
	 * The color intent of the strip, which sets the fill and the live region role: `danger` and
	 * `highlight-danger` are `role="alert"`, every other color is `role="status"`.
	 */
	color: AlertStripColorType;
	/**
	 * The edge of the page the strip sits on. The bar runs along that edge, across the whole parent,
	 * and the region rises from it: up from the bar at the `bottom`, down from it at the `top`.
	 *
	 * @note It only draws the strip for that edge. The strip does not position itself, so render it
	 * at that edge.
	 */
	side: AlertStripSideType;
	/**
	 * The content of the strip: the message, with any `AlertStrip.Link` inside the sentence. Put the
	 * actions in `suffix`. It wraps to a second line and the strip grows to fit it.
	 *
	 * @note The strip has no severity icon, so the message names the severity in words.
	 *
	 * @note Keep it to two lines. The strip never cuts a third one, since a cut could hide the date
	 * or the action.
	 *
	 * @note `AlertStrip`, `AlertStrip.Closeable` and `AlertStrip.CloseablePersisted` render nothing
	 * while it is empty.
	 */
	children: ReactNode;
	/**
	 * Rendered before the content, at the start of the region, such as an icon. It never shrinks or
	 * wraps.
	 *
	 * @note The strip sets the size of an icon here, the one passed on the element is ignored. The
	 * icon inherits the text color of the strip through `currentColor`, and a `color` set on the icon
	 * element wins. The `Solid*` icons of `@signozhq/icons` paint their disc in the text color and
	 * their glyph in the fill of the strip.
	 *
	 * @note An icon here does not name the severity for a screen reader, the message still does.
	 */
	prefix?: ReactNode;
	/**
	 * Rendered after the content, at the end of the region and before the close button of
	 * `AlertStrip.Closeable`: the `AlertStrip.Button` or `AlertStrip.Link` the user acts on. It never
	 * shrinks or wraps, so the content wraps first.
	 */
	suffix?: ReactNode;
	/**
	 * Any `data-*` prop is accepted and forwarded to the strip.
	 */
	[key: `data-${string}`]: unknown;
} & AriaAttributes;
