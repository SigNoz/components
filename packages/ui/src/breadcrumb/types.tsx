import type { AriaAttributes, ComponentProps, MouseEvent, ReactElement, ReactNode } from 'react';
import type {
	BreadcrumbItemKind,
	BreadcrumbPosition,
	BreadcrumbShrink,
	BreadcrumbTextOverflow,
} from './constants.js';

export type BreadcrumbTextOverflowType =
	(typeof BreadcrumbTextOverflow)[keyof typeof BreadcrumbTextOverflow];

/**
 * @access private
 */
export type BreadcrumbPositionType = (typeof BreadcrumbPosition)[keyof typeof BreadcrumbPosition];

/**
 * @access private
 */
export type BreadcrumbShrinkType = (typeof BreadcrumbShrink)[keyof typeof BreadcrumbShrink];

/**
 * @access private
 */
export type BreadcrumbItemKindType = (typeof BreadcrumbItemKind)[keyof typeof BreadcrumbItemKind];

/**
 * Where a crumb or a menu entry navigates, with the same props as `Callout.Link` and the `link` row
 * of `Dropdown`.
 */
export interface BreadcrumbLinkProps {
	/**
	 * The destination of a plain link. Not needed when `render` is a router link that has its own
	 * destination, such as `to`.
	 */
	href?: string;
	/**
	 * Where the link opens. `_blank`, here or on the `render` element, adds `noopener` and
	 * `noreferrer` to the `rel` of the link, which keeps its other values. A `target` on the
	 * `render` element wins.
	 */
	target?: string;
	/**
	 * The element that renders the link, such as the `Link` of the router the consumer uses. It
	 * takes the `className`, `data-*`, `href`, `target`, `rel`, `onClick`, `ref` and `aria-*` of the
	 * link, merged as the `render` prop of Base UI merges them: a prop set on the element wins, its
	 * `className` and `ref` are kept next to the ones of the link, and its `onClick` runs first. An
	 * `href` or `target` the element leaves `undefined` takes the one here. The router element keeps
	 * its own props like `to`, and it should forward the rest to the `a` it renders.
	 *
	 * @note Its children are replaced by the `title`, so leave it without any.
	 *
	 * @note A `render` element that does not render an `a` loses the link role.
	 *
	 * @default <a /> when `href` is set
	 */
	render?: ReactElement;
	/**
	 * Runs when the user clicks, after the handler of the `render` element. The breadcrumb never
	 * calls `preventDefault`, so the router decides if the navigation is client-side. Without an
	 * `href` or a `render`, a crumb is a `<button>` that runs it and a menu entry is an action row
	 * that runs it.
	 */
	onClick?: (event: MouseEvent) => void;
}

/**
 * One entry of the menu a crumb opens through its `menu`. It is a link row with an `href` or a
 * `render`, and an action row otherwise.
 */
export interface BreadcrumbDropdownItem extends BreadcrumbLinkProps {
	/**
	 * The label of the menu row.
	 */
	title: ReactNode;
}

/**
 * One crumb of the trail. With a `menu` it is the trigger of that menu. Without one it is a link
 * with an `href` or a `render`, a `<button>` with only an `onClick`, and plain text with none of
 * them.
 */
export interface BreadcrumbItemType extends BreadcrumbLinkProps {
	/**
	 * The label of the crumb. The trail leaves out a crumb whose title renders nothing (`null`, `''`,
	 * only whitespace).
	 */
	title: ReactNode;
	/**
	 * Shown before the title.
	 */
	icon?: ReactNode;
	/**
	 * Turns the crumb into the trigger of a menu of these entries, such as the siblings of the
	 * current page. Its `href`, `render` and `onClick` are not used then. An empty array leaves the
	 * crumb as it would be without `menu`.
	 */
	menu?: BreadcrumbDropdownItem[];
}

/**
 * The rule below is the one the props cannot express. It is an object whose single required key is
 * the sentence the compiler should print.
 */
interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which also names every crumb': never;
}

/**
 * A string prop cannot refuse a word, so the call site does, and the message says what to pass
 * instead.
 */
interface TheChevronSeparatorIsGone {
	'`separator` draws the text it is given, so `chevron` prints the word: pass a character such as `›`': never;
}

/**
 * The message names `render` on the item instead of giving the bare unknown-prop error.
 */
interface TheItemRenderPropIsGone {
	'`itemRender` is gone: pass `render` on the item, such as `{ title, render: <Link to="/services" /> }`': never;
}

/**
 * The old `Breadcrumb` was the root of `BreadcrumbList` and the other parts, and took them as
 * children, so a migrated call site gets told where the crumbs went.
 */
interface TheCrumbsComeFromItems {
	'`children` is gone: the crumbs come from `items`, such as `items={[{ title: "Home", href: "/" }]}`': never;
}

/**
 * `params` only fed the arguments of `itemRender`, so its message points at the same place.
 */
interface TheParamsPropIsGone {
	'`params` went with `itemRender`: use the route params where the items are built, in the `href` or `render` of each crumb': never;
}

/**
 * Extra constraints layered on top of {@link BreadcrumbProps} at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to
 * a rule object when they are not. `Separator` is the literal type of the `separator` prop, which
 * the props alone widen to `string`.
 */
export type ValidateBreadcrumbProps<T, Separator extends string = string> = (T extends {
	'data-testid': unknown;
}
	? TheTestIdPropIsCalledTestId
	: unknown) &
	(T extends { itemRender: unknown } ? TheItemRenderPropIsGone : unknown) &
	(T extends { params: unknown } ? TheParamsPropIsGone : unknown) &
	(T extends { children: unknown } ? TheCrumbsComeFromItems : unknown) &
	(string extends Separator
		? unknown
		: 'chevron' extends Separator
			? TheChevronSeparatorIsGone
			: unknown);

export interface BreadcrumbProps extends Pick<ComponentProps<'nav'>, 'id'>, AriaAttributes {
	/**
	 * The crumbs, root first and the current page last. With no crumb left, nothing renders.
	 */
	items: BreadcrumbItemType[];
	/**
	 * Drawn between two crumbs, as written: pass a character such as `›`. The literal `'chevron'`
	 * is a type error, and a `string` that holds it, which the types cannot see, logs a warning and
	 * still prints the word.
	 *
	 * @default '/'
	 */
	separator?: string;
	/**
	 * Keeps the trail on one line. Middle crumbs collapse into a `...` crumb when the trail does
	 * not fit, then the last and the first crumb shorten. With `false`, every crumb stays and the
	 * trail wraps onto more lines.
	 *
	 * @default true
	 */
	truncate?: boolean;
	/**
	 * The most crumbs shown at once, the first and the last included, so a trail in a narrow panel
	 * collapses before it runs out of room. A value below 2 counts as 2. Only applies while
	 * `truncate` is set.
	 */
	maxVisible?: number;
	/**
	 * What a crumb's label does when it does not fit. `ellipsis` cuts it with `…` and shows the
	 * full title in a tooltip, `hidden` clips it.
	 *
	 * @default 'ellipsis'
	 */
	textOverflow?: BreadcrumbTextOverflowType;
	/**
	 * Forwarded to the `<nav>` as `data-testid`, and the stem every part is named from:
	 * `` `${testId}-item-${index}` `` for a crumb, `` `${testId}-item-separator-${index}` `` for
	 * the separator before it, and `` `${testId}-ellipsis` `` for the `...` crumb.
	 */
	testId?: string;
	/**
	 * Any `data-*` prop except `data-testid` is forwarded to the `<nav>`. Pass `testId` instead of
	 * `data-testid`.
	 */
	[key: `data-${string}`]: unknown;
}

/**
 * A crumb that made it into the trail, with what every part of the trail reads off it.
 *
 * @access private
 */
export type BreadcrumbResolvedItem = {
	item: BreadcrumbItemType;
	/**
	 * Its index in `items`, before the empty crumbs were left out, so a test id does not move when a
	 * title before it empties.
	 */
	index: number;
	kind: BreadcrumbItemKindType;
	testId: string | undefined;
};

/**
 * What the collapse planner reads off the trail. Every width is in pixels.
 *
 * @access private
 */
export type BreadcrumbTrailMeasure = {
	/**
	 * The width of each crumb at its own size, its label capped at `--breadcrumb-item-max-width` but
	 * never shortened to fit.
	 */
	widths: number[];
	separatorWidth: number;
	ellipsisWidth: number;
	/**
	 * The gap of the list, which sits on both sides of every separator.
	 */
	gap: number;
	available: number;
};

/**
 * The node a crumb hands the collapse hook: the crumb itself, or the label inside it.
 *
 * @access private
 */
export type BreadcrumbCrumbPart = 'crumb' | 'label';

/**
 * Hands the hook the node of a crumb, or of the label inside it, once it mounts, and `null` once
 * it unmounts. `index` is the place of the crumb in `items`.
 *
 * @access private
 */
export type RegisterBreadcrumbCrumb = (
	index: number,
	part: BreadcrumbCrumbPart,
	node: HTMLElement | null,
) => void;
