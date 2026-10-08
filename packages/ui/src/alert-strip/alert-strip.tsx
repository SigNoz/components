import { forwardRef } from 'react';
import { hasRenderableContent, type RejectedProps } from '../lib/utils.js';
import { AlertStripButton } from './subcomponents/alert-strip-button.js';
import { AlertStripCloseable } from './subcomponents/alert-strip-closeable.js';
import { AlertStripCloseablePersisted } from './subcomponents/alert-strip-closeable-persisted.js';
import { AlertStripFrame } from './subcomponents/alert-strip-frame.js';
import { AlertStripLink } from './subcomponents/alert-strip-link.js';
import type { AlertStripProps } from './types.js';

/**
 * A full-width strip for a state of the account or the instance that holds until someone fixes it:
 * billing, quota, license and degradation notices. Use `AlertStrip.Closeable` and
 * `AlertStrip.CloseablePersisted` for a message the user can dismiss, `AlertStrip.Button` for an
 * action and `AlertStrip.Link` for a navigation. The actions go in `suffix`, at the end of the
 * region, and a link can also sit inside the content. `prefix` takes an icon before the content.
 *
 * The plain strip cannot be closed, since a billing or license notice must stay until the
 * condition is fixed.
 *
 * Every `aria-*` and any `data-*` are forwarded. There is no `className` or `style`.
 *
 * Visual values are `--alert-strip-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Placement
 *
 * It renders in normal flow at the full width of its parent, so it pushes the content around it
 * aside. It is not a portal, not sticky and not fixed. `side` names the edge of the page it sits on
 * and draws the bar along that edge, but does not move the strip there. Where it renders, and which
 * strip shows when several conditions apply, belong to the consumer.
 *
 * ### Measuring it
 *
 * The `ref` reaches the root on every variant, and the root spans the whole strip, bar included.
 * Observe it with a `ResizeObserver` to keep the page clear of a strip that floats over it, since a
 * second line makes it taller. The ref is `null` while the strip renders nothing, empty or closed.
 *
 * ### Live region
 *
 * `color` picks the role, and there is no prop to change it. A strip on the page at first render
 * is not announced by most screen readers, it is read in document order.
 *
 * ### Overflow
 *
 * The content sits in a centered region, which shrinks with a narrower parent. It never scrolls.
 *
 * ### Asserting on it
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `alert-strip` | the root, carries `testId` |
 * | `alert-strip-prefix` | the prefix, only when set |
 * | `alert-strip-content` | the content |
 * | `alert-strip-suffix` | the suffix, only when set |
 *
 * The root also carries `data-color` and `data-side`. Use those, never the hashed class names.
 *
 * @example
 * ```tsx
 * <AlertStrip
 *   color="danger"
 *   side="bottom"
 *   suffix={
 *     <AlertStrip.Button prefix={<CreditCard />} onClick={payBill}>
 *       Pay the bill
 *     </AlertStrip.Button>
 *   }
 * >
 *   Danger: your last payment failed. Contact{' '}
 *   <AlertStrip.Link href="mailto:cloud-support@signoz.io">cloud support</AlertStrip.Link> for help.
 * </AlertStrip>
 * ```
 */
const AlertStripRoot = forwardRef<HTMLDivElement, AlertStripProps>(function AlertStrip(
	{ children, ...props }: AlertStripProps & RejectedProps,
	ref,
) {
	if (!hasRenderableContent(children)) {
		return null;
	}

	return (
		<AlertStripFrame {...props} ref={ref}>
			{children}
		</AlertStripFrame>
	);
});

export const AlertStrip = Object.assign(AlertStripRoot, {
	Closeable: AlertStripCloseable,
	CloseablePersisted: AlertStripCloseablePersisted,
	Button: AlertStripButton,
	Link: AlertStripLink,
});
