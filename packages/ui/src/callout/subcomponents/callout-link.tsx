import * as React from 'react';
import {
	createElement,
	forwardRef,
	isValidElement,
	useEffect,
	useMemo,
	type AriaAttributes,
	type MouseEvent,
	type MouseEventHandler,
	type ReactElement,
	type ReactNode,
} from 'react';
import { getElementRef, setRef } from '../../lib/merge-refs.js';
import { cn, type RejectedProps } from '../../lib/utils.js';
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
	 * `noreferrer` to the `rel` of the `render` element, which keeps its other values.
	 */
	target?: string;
	/**
	 * The element that renders the link, such as the link of the router the consumer uses. The
	 * callout clones it and passes it `className`, `data-slot`, `target`, `rel`, `onClick`, `ref`,
	 * `aria-*` and `children`. Its own `className` and `ref` are kept next to the ones of the
	 * callout. The router element keeps its own props like `to`, and it should forward the rest to
	 * the `a` it renders.
	 *
	 * @note A `render` element that does not render an `a` loses the link role.
	 *
	 * @default <a />
	 */
	render?: ReactElement;
	/**
	 * Runs when the user clicks the link, before the handler of the `render` element. The callout
	 * never calls `preventDefault`, so the router decides if the navigation is client-side.
	 */
	onClick?: MouseEventHandler<HTMLElement>;
	/**
	 * The text of the link, which is its label. It replaces the children of the `render` element.
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
	const renderProps = element.props;
	const elementRef = getElementRef<HTMLElement>(element);
	// `cloneElement` below replaces the ref of the `render` element, so the two are merged first.
	const mergedRef = useMemo(
		() =>
			ref == null || elementRef == null
				? (ref ?? elementRef)
				: (node: HTMLElement | null) => {
						setRef(ref, node);
						setRef(elementRef, node);
					},
		[ref, elementRef],
	);
	const hasDestination = href != null || renderProps['href'] != null || renderProps['to'] != null;
	const resolvedTarget = target ?? (renderProps['target'] as string | undefined);
	const sharedProps = {
		'data-slot': 'callout-link',
		...(testId === undefined ? {} : { 'data-testid': testId }),
	};

	useEffect(() => {
		if (!hasDestination) {
			console.warn('Callout.Link needs an `href`, or a `render` element with its own destination.');
		}
	}, [hasDestination]);

	if (!hasDestination) {
		return <span {...sharedProps}>{children}</span>;
	}

	const ownOnClick = renderProps['onClick'] as MouseEventHandler<HTMLElement> | undefined;

	// The ref is only handed to the rendered element, never read here. The React Compiler treats a
	// ref passed to the named `cloneElement` import as read during render and skips the component,
	// so the call goes through the `React` namespace, as the tooltip trigger does.
	return React.cloneElement(
		element,
		// eslint-disable-next-line react/refs
		{
			...aria,
			...sharedProps,
			className: cn(styles['callout__link'], renderProps['className'] as string | undefined),
			...(href == null ? {} : { href }),
			...(resolvedTarget == null ? {} : { target: resolvedTarget }),
			...(resolvedTarget === '_blank'
				? {
						rel: withBlankTargetRel(renderProps['rel'] as string | undefined),
					}
				: {}),
			...(mergedRef == null ? {} : { ref: mergedRef }),
			onClick: (event: MouseEvent<HTMLElement>) => {
				onClick?.(event);
				ownOnClick?.(event);
			},
		},
		children,
	);
});
CalloutLink.displayName = 'Callout.Link';
