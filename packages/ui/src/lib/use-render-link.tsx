import { useRender } from '@base-ui/react/use-render';
import {
	cloneElement,
	createElement,
	isValidElement,
	useEffect,
	type AriaAttributes,
	type ForwardedRef,
	type MouseEventHandler,
	type ReactElement,
	type ReactNode,
} from 'react';
import type { RejectedProps } from './utils.js';

/**
 * The props of a link that takes its look from the component around it, such as `Callout.Link`
 * and `AlertStrip.Link`.
 *
 * @access private
 */
export type RenderLinkProps = {
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
	 * `children` of the link, merged as the `render` prop of Base UI merges them: a prop set on
	 * the element wins, its `className` and `ref` are kept next to the ones of the link, and its
	 * `onClick` runs first. An `href`, `target` or `children` the element leaves `undefined` takes
	 * the one of the link. The router element keeps its own props like `to`, and it should forward
	 * the rest to the `a` it renders.
	 *
	 * @note A `render` element that does not render an `a` loses the link role.
	 *
	 * @default <a />
	 */
	render?: ReactElement;
	/**
	 * Runs when the user clicks the link, after the handler of the `render` element. The link never
	 * calls `preventDefault`, so the router decides if the navigation is client-side.
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
 * `rel` with `noopener` and `noreferrer` added, for a link that opens in a new tab. The values it
 * already holds are kept.
 */
function withBlankTargetRel(rel: string | undefined): string {
	const values = new Set(rel?.split(/\s+/).filter(Boolean));

	values.add('noopener');
	values.add('noreferrer');

	return [...values].join(' ');
}

/**
 * Renders a {@link RenderLinkProps} link with the `data-slot` and the class of the component that
 * owns it. A link with neither `href` nor a destination on the `render` element is a bug: it
 * renders plain text and warns on the console, naming the component as `name`.
 *
 * @access private
 */
export function useRenderLink(
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
	}: RenderLinkProps & RejectedProps,
	ref: ForwardedRef<HTMLElement>,
	{ slot, className, name }: { slot: string; className: string | undefined; name: string },
): ReactElement {
	const element = (isValidElement(render) ? render : createElement('a')) as ReactElement<
		Record<string, unknown>
	>;
	const elementProps = element.props;
	const resolvedHref = (elementProps['href'] as string | undefined) ?? href;
	const resolvedTarget = (elementProps['target'] as string | undefined) ?? target;
	const hasDestination = resolvedHref != null || elementProps['to'] != null;
	const sharedProps = {
		'data-slot': slot,
		...(testId === undefined ? {} : { 'data-testid': testId }),
	};

	useEffect(() => {
		if (!hasDestination) {
			console.warn(`${name} needs an \`href\`, or a \`render\` element with its own destination.`);
		}
	}, [hasDestination, name]);

	const link = useRender({
		enabled: hasDestination,
		// The props of the element win over the ones below, an `undefined` one too. So `href`,
		// `target` and `children` go on the element itself, where the ones it leaves `undefined` take
		// the ones of the link, and `noopener` and `noreferrer` join its `rel`. Only the props that are
		// set: an `undefined` one is still passed to the element, and a router link that spreads its
		// props after its own `href` would lose it.
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
			className,
			...(onClick == null ? {} : { onClick }),
		},
	});

	return link ?? <span {...sharedProps}>{children}</span>;
}
