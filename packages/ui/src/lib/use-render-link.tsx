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
	type Ref,
} from 'react';
import { getLinkProps } from './link-props.js';
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
	 *
	 * On a component that supports actions, a link with an `onClick` and no destination is an
	 * action: an inline control that runs code instead of navigating. It renders the `render`
	 * element, or a native `<button type="button">` without one.
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
 * Renders a {@link RenderLinkProps} link with the `data-slot` and the class of the component that
 * owns it. A link with neither `href` nor a destination on the `render` element is a bug: it
 * renders plain text and warns on the console, naming the component as `name`.
 *
 * With `allowAction`, a link with an `onClick` and no destination is an action instead: it renders
 * the `render` element, or a native `<button type="button">` without one, with the same `props`,
 * class, `ref` and `onClick` as the link.
 *
 * `props` go on the link and on the plain text, merged the same way as the `data-slot`. The plain
 * text takes `fallbackClassName` instead of `className`, and keeps the `ref`, the `id` and the
 * `aria-*` and `data-*` props of the link. It drops `onClick`: text that goes nowhere is not
 * clickable.
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
	ref: ForwardedRef<HTMLElement> | Array<Ref<HTMLElement>>,
	{
		slot,
		className,
		name,
		props: ownProps,
		fallbackClassName,
		allowAction = false,
	}: {
		slot: string;
		className: string | undefined;
		name: string;
		props?: Record<string, unknown>;
		fallbackClassName?: string;
		allowAction?: boolean;
	},
): ReactElement | null {
	const element = (isValidElement(render) ? render : createElement('a')) as ReactElement<
		Record<string, unknown>
	>;
	const elementProps = element.props;
	const { props: linkProps, hasDestination } = getLinkProps(element, { href, target });
	const isAction = allowAction && !hasDestination && onClick != null;
	const isText = !hasDestination && !isAction;
	const sharedProps = {
		...ownProps,
		'data-slot': slot,
		...(testId === undefined ? {} : { 'data-testid': testId }),
	};

	useEffect(() => {
		if (isText) {
			console.warn(
				`${name} needs ${
					allowAction
						? 'an `href`, an `onClick`, or a `render` element with its own destination'
						: 'an `href`, or a `render` element with its own destination'
				}.`,
			);
		}
	}, [isText, allowAction, name]);

	const link = useRender({
		enabled: hasDestination,
		// The props of the element win over the ones below, an `undefined` one too. So `href`,
		// `target` and `children` go on the element itself, where the ones it leaves `undefined` take
		// the ones of the link.
		render: cloneElement(element, {
			...linkProps,
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

	const action = useRender({
		enabled: isAction,
		render: isValidElement(render)
			? cloneElement(element, { children: elementProps['children'] ?? children })
			: undefined,
		defaultTagName: 'button',
		ref,
		props: {
			...aria,
			...sharedProps,
			// Only the default button: a `type` on the caller's element would mean something else.
			...(isValidElement(render) ? {} : { type: 'button' }),
			className,
			onClick,
			children,
		},
	});

	const text = useRender({
		enabled: isText,
		render: <span />,
		ref,
		props: {
			...aria,
			...sharedProps,
			className: fallbackClassName,
			children,
		},
	});

	return link ?? action ?? text;
}
