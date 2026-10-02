import { forwardRef } from 'react';
import { hasRenderableContent, type RejectedProps } from '../lib/utils.js';
import { CalloutCloseable } from './subcomponents/callout-closeable.js';
import { CalloutCloseablePersisted } from './subcomponents/callout-closeable-persisted.js';
import { CalloutExpandable } from './subcomponents/callout-expandable.js';
import { CalloutFrame } from './subcomponents/callout-frame.js';
import { CalloutLink } from './subcomponents/callout-link.js';
import type { CalloutProps } from './types.js';

/**
 * A static message with a severity: a tinted box with an icon and a description, always visible,
 * with no chevron. Use `Callout.Expandable` for a description the user can hide,
 * `Callout.Closeable` and `Callout.CloseablePersisted` for one the user can dismiss, and
 * `Callout.Link` for a link inside the description.
 *
 * Every `aria-*` and any `data-*` are forwarded. There is no `className` or `style`.
 *
 * Visual values are `--callout-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Live region
 *
 * `role="alert"` for `danger` and `highlight-danger`, `role="status"` for every other `color`.
 * There is no prop to change it. `Callout.Expandable` has no live role, so expanding it does not
 * read the callout again. A callout on the page at first render is not announced by most
 * screen readers, so use `danger` for a message that appears after a user action or a failed
 * request, not for a permanent note.
 *
 * ### Empty
 *
 * It renders nothing while `children` is empty, since a tinted box with only an icon carries no
 * message.
 *
 * ### Overflow
 *
 * Without `width` it fills its parent, and `maxWidth` caps it at `100%`. It has no outer margin,
 * the parent owns the spacing. The height grows with the content. Once `maxHeight` (default
 * `100%`) or `height` leaves no room, the description scrolls and the icon stays pinned.
 *
 * Text wraps first, so a long word never forces a horizontal scroll. The description is never
 * made focusable. Chromium and Firefox let a keyboard user focus a scrolling description on their
 * own (Chromium only while it holds no link), Safari does not.
 *
 * ### Asserting on it
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `callout` | the root, carries `testId` |
 * | `callout-icon` | the icon |
 * | `callout-description` | the description |
 *
 * The root also carries `data-color` and `data-size`.
 *
 * @example
 * ```tsx
 * <Callout color="danger" size="sm" icon={<SolidXCircle />}>
 *   The request failed. Try again in a moment.
 * </Callout>
 * ```
 *
 * @example
 * ```tsx
 * <Callout color="primary" size="md" icon={<SolidInfoCircle />}>
 *   Read the{' '}
 *   <Callout.Link href="https://signoz.io/docs" target="_blank">
 *     docs
 *   </Callout.Link>
 *   .
 * </Callout>
 * ```
 */
const CalloutRoot = forwardRef<HTMLDivElement, CalloutProps>(function Callout(
	{ children, ...props }: CalloutProps & RejectedProps,
	ref,
) {
	if (!hasRenderableContent(children)) {
		return null;
	}

	return (
		<CalloutFrame {...props} ref={ref}>
			{children}
		</CalloutFrame>
	);
});

export const Callout = Object.assign(CalloutRoot, {
	Expandable: CalloutExpandable,
	Closeable: CalloutCloseable,
	CloseablePersisted: CalloutCloseablePersisted,
	Link: CalloutLink,
});
