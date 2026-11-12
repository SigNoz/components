import { forwardRef } from 'react';
import { type RenderLinkProps, useRenderLink } from '../../lib/use-render-link.js';
import styles from '../alert-strip.module.scss';

export type AlertStripLinkProps = RenderLinkProps;

/**
 * A navigation or an inline action the user can take about the message, in the `suffix` of a strip
 * or inside the sentence. Reached as `AlertStrip.Link`, not imported on its own. It has the same
 * props as `Callout.Link`.
 *
 * It draws in the text color of the strip around it, underlined, and inherits its type, so it never
 * drifts from it. There is no `className`, `style` or `nativeButton`: the link takes its look from
 * the strip.
 *
 * ### Router links
 *
 * The strip imports no router. `render={<Link to="/billing" />}` renders the router link, so the
 * click is a client-side navigation and a modified click still opens a new tab. The link needs the
 * consumer's router context at render time.
 *
 * The `ref` reaches the rendered element, and so does a `ref` on the `render` element.
 *
 * ### Actions
 *
 * A link with an `onClick` and no destination, neither `href` nor one on the `render` element, is
 * an action, such as the "Upgrade" of "Your trial ends soon." that opens a checkout. It renders the
 * `render` element when given, a native `<button type="button">` otherwise, drawn exactly like the
 * anchor with the same class, `data-slot`, `testId`, `aria-*` props and `ref`. A native button never
 * wraps across lines, so keep the label short.
 *
 * A link with neither a destination nor an `onClick` is a mistake: it renders plain text and warns
 * on the console.
 *
 * ### Asserting on it
 *
 * `data-slot="alert-strip-link"`, and `testId` as `data-testid`.
 *
 * @example
 * ```tsx
 * <AlertStrip color="warning" side="bottom">
 *   Warning: your trial ends in 3 days.{' '}
 *   <AlertStrip.Link render={<Link to="/billing" />}>Upgrade</AlertStrip.Link>
 * </AlertStrip>
 * ```
 *
 * @example
 * ```tsx
 * <AlertStrip color="warning" side="bottom">
 *   Your trial ends soon.{' '}
 *   <AlertStrip.Link onClick={upgrade}>
 *     Upgrade
 *   </AlertStrip.Link>
 * </AlertStrip>
 * ```
 */
export const AlertStripLink = forwardRef<HTMLElement, AlertStripLinkProps>(
	function AlertStripLink(props, ref) {
		return useRenderLink(props, ref, {
			slot: 'alert-strip-link',
			className: styles['alert-strip__link'],
			name: 'AlertStrip.Link',
			allowAction: true,
		});
	},
);
AlertStripLink.displayName = 'AlertStrip.Link';
