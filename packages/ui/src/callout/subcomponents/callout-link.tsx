import { forwardRef } from 'react';
import { type RenderLinkProps, useRenderLink } from '../../lib/use-render-link.js';
import styles from '../callout.module.scss';

export type CalloutLinkProps = RenderLinkProps;

/**
 * A navigation the user can take about the message, for use inside the `children` of a callout.
 * Reached as `Callout.Link`, not imported on its own.
 *
 * It draws in the link color of the callout around it and inherits its type, so it never drifts
 * from it. There is no `className`, `style` or `nativeButton`: the link takes its look from the
 * callout.
 *
 * ### Router links
 *
 * The callout imports no router. `render={<Link to="/alerts" />}` renders the router link, so the
 * click is a client-side navigation and a modified click still opens a new tab. The link needs
 * the consumer's router context at render time.
 *
 * The `ref` reaches the rendered element, and so does a `ref` on the `render` element.
 *
 * A link with neither `href` nor a destination on the `render` element is a bug: it renders plain
 * text and warns on the console.
 *
 * ### Asserting on it
 *
 * `data-slot="callout-link"`, and `testId` as `data-testid`.
 *
 * @example
 * ```tsx
 * <Callout color="primary" size="sm" icon={<SolidInfoCircle />}>
 *   Read the <Callout.Link href="https://signoz.io/docs" target="_blank">docs</Callout.Link>.
 * </Callout>
 * ```
 */
export const CalloutLink = forwardRef<HTMLElement, CalloutLinkProps>(
	function CalloutLink(props, ref) {
		return useRenderLink(props, ref, {
			slot: 'callout-link',
			className: styles['callout__link'],
			name: 'Callout.Link',
		});
	},
);
CalloutLink.displayName = 'Callout.Link';
