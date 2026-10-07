import { useRender } from '@base-ui/react/use-render';
import {
	cloneElement,
	createElement,
	forwardRef,
	isValidElement,
	useEffect,
	type AriaAttributes,
	type MouseEventHandler,
	type ReactElement,
	type ReactNode,
} from 'react';
import type { RejectedProps } from '../../lib/utils.js';
import styles from '../callout.module.scss';
import { withBlankTargetRel } from '../utils.js';

export type CalloutLinkProps = {
	/**
	 * The destination of a plain link. Not needed when `render` is a router link that has its own
	 * destination, such as `to`.
	 */
	href?: string;
	/**
	 * Where the link opens. `_blank`, here or on the `render` element, adds `noopener` and
	 * `noreferrer` to the `rel` of the `render` element, which keeps its other values. A `target`
	 * on the `render` element wins.
	 */
	target?: string;
	/**
	 * The element that renders the link, such as the link of the router the consumer uses. It
	 * takes the `className`, `data-slot`, `href`, `target`, `rel`, `onClick`, `ref`, `aria-*` and
	 * `children` of the callout, merged as the `render` prop of Base UI merges them: a prop set on
	 * the element wins, its `className` and `ref` are kept next to the ones of the callout, and its
	 * `onClick` runs first. An `href`, `target` or `children` the element leaves `undefined` takes
	 * the one of the callout. The router element keeps its own props like `to`, and it should forward
	 * the rest to the `a` it renders.
	 *
	 * @note A `render` element that does not render an `a` loses the link role.
	 *
	 * @default <a />
	 */
	render?: ReactElement;
	/**
	 * Runs when the user clicks the link, after the handler of the `render` element. The callout
	 * never calls `preventDefault`, so the router decides if the navigation is client-side.
	 */
	onClick?: MouseEventHandler<HTMLElement>;
	/**
	 * The text of the link, which is its label. Leave the `render` element without children, since
	 * its own would win.
	 */
	children: ReactNode;
	/**
	 * Forwarded to the link as `data-testid`.
	 */
	testId?: string;
} & AriaAttributes;

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
export const CalloutLink = forwardRef<HTMLElement, CalloutLinkProps>(function CalloutLink(
	{
		href,
		target,
		render,
		onClick,
		children,
		testId,
		className: _className,
		style: _style,
		...aria
	}: CalloutLinkProps & RejectedProps,
	ref,
) {
	const element = (isValidElement(render) ? render : createElement('a')) as ReactElement<
		Record<string, unknown>
	>;
	const elementProps = element.props;
	const resolvedHref = (elementProps['href'] as string | undefined) ?? href;
	const resolvedTarget = (elementProps['target'] as string | undefined) ?? target;
	const hasDestination = resolvedHref != null || elementProps['to'] != null;
	const sharedProps = {
		'data-slot': 'callout-link',
		...(testId === undefined ? {} : { 'data-testid': testId }),
	};

	useEffect(() => {
		if (!hasDestination) {
			console.warn('Callout.Link needs an `href`, or a `render` element with its own destination.');
		}
	}, [hasDestination]);

	const link = useRender({
		enabled: hasDestination,
		// The props of the element win over the ones below, an `undefined` one too. So `href`,
		// `target` and `children` go on the element itself, where the ones it leaves `undefined` take
		// the ones of the callout, and `noopener` and `noreferrer` join its `rel`. Only the props that
		// are set: an `undefined` one is still passed to the element, and a router link that spreads
		// its props after its own `href` would lose it.
		render: cloneElement(element, {
			...(resolvedHref == null ? {} : { href: resolvedHref }),
			...(resolvedTarget == null ? {} : { target: resolvedTarget }),
			...(resolvedTarget === '_blank'
				? { rel: withBlankTargetRel(elementProps['rel'] as string | undefined) }
				: {}),
			children: elementProps['children'] ?? children,
		}),
		ref,
		props: {
			...aria,
			...sharedProps,
			className: styles['callout__link'],
			...(onClick == null ? {} : { onClick }),
		},
	});

	return link ?? <span {...sharedProps}>{children}</span>;
});
CalloutLink.displayName = 'Callout.Link';
