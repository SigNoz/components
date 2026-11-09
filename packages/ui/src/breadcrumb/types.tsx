import type { AriaAttributes, ComponentProps, MouseEvent, ReactElement, ReactNode } from 'react';
import type { PopoverHandle } from '../popover/popover-handle.js';
import type {
	BREADCRUMB_ELLIPSIS_PAYLOAD,
	BreadcrumbCollapseFrom,
	BreadcrumbItemKind,
	BreadcrumbPosition,
	BreadcrumbShrink,
	BreadcrumbTextOverflow,
	BreadcrumbVariant,
} from './constants.js';

export type BreadcrumbTextOverflowType =
	(typeof BreadcrumbTextOverflow)[keyof typeof BreadcrumbTextOverflow];

export type BreadcrumbVariantType = (typeof BreadcrumbVariant)[keyof typeof BreadcrumbVariant];

export type BreadcrumbCollapseFromType =
	(typeof BreadcrumbCollapseFrom)[keyof typeof BreadcrumbCollapseFrom];

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
	 * Shown before the title, and before the title of its row while the crumb is collapsed into the
	 * list of the `...` crumb.
	 */
	icon?: ReactNode;
	/**
	 * Turns the crumb into the trigger of a menu of these entries, such as the siblings of the
	 * current page. Its `href`, `render` and `onClick` are not used then. An empty array leaves the
	 * crumb as it would be without `menu`.
	 */
	menu?: BreadcrumbDropdownItem[];
	/**
	 * A card that opens below the crumb, such as a summary of the record the crumb stands for. It
	 * opens once the pointer has rested on the crumb for 300ms, or the keyboard focus reaches it, and
	 * closes 150ms after the pointer leaves the crumb and the card, or as the focus leaves the crumb.
	 * The crumb keeps its own click and its link: the card is extra, never the way to navigate.
	 *
	 * The pointer can use what the card holds, such as a link to follow or text to select. The
	 * keyboard cannot: the card never takes the focus, and `Tab` passes it by. So anything in it must
	 * also be reachable from the page.
	 *
	 * The card takes the place of the tooltip with the full title that a cut label shows, since the
	 * card is expected to name the crumb in full. A `preview` that renders nothing (`null`, `false`,
	 * an empty string) leaves the crumb with that tooltip.
	 *
	 * @note A crumb with a `menu` ignores it, and so does a crumb while it is collapsed into the list
	 * of the `...` crumb.
	 *
	 * @note A crumb that is plain text cannot take focus, so its card opens on hover only. Give it an
	 * `href` or an `onClick` for the keyboard to reach it.
	 *
	 * @note A click does not open it, only a keyboard focus (`:focus-visible`) does. `Escape` closes
	 * it, and the crumb keeps the focus. It is a hover card, not a dialog: it has no role, and screen
	 * readers do not announce it.
	 */
	preview?: ReactNode;
}

/**
 * A crumb that is collapsed into the `...` crumb, as `ellipsis.render` receives it.
 */
export interface BreadcrumbCollapsedCrumb {
	/**
	 * The crumb, as it was passed in `items`.
	 */
	item: BreadcrumbItemType;
	/**
	 * Its index in `items`, counted before the crumbs with an empty title were left out, so it is the
	 * same number the `testId` of the crumb carries.
	 */
	index: number;
}

/**
 * What the popup of the `...` crumb holds: the collapsed crumbs as a list, or content of your own.
 */
export interface BreadcrumbEllipsisOptions {
	/**
	 * A heading above the rows of the list, such as `Earlier steps`. It names the popup, in place of
	 * `Hidden items`, and the group the rows are in. It is not a row: the arrow keys pass over it.
	 *
	 * @note Only for the list. With `render` the content is yours, heading included. A heading that
	 * renders nothing (`null`, `false`, an empty string) adds none.
	 */
	heading?: ReactNode;
	/**
	 * The element at the end of a row, such as the number of the step the crumb stands for. `index` is
	 * the place of the crumb in `items`, counted before the crumbs with an empty title were left out,
	 * so a trail that starts at step one reads `index + 1`. Return `undefined` to leave a row without
	 * one.
	 *
	 * @note A crumb with a `menu` is a row that opens a menu, and its trailing slot is the chevron of
	 * that menu, so it gets no suffix and the function is not called for it.
	 *
	 * @note Only for the list. Nothing calls it with `render`.
	 */
	rowSuffix?: (item: BreadcrumbItemType, index: number) => ReactElement | undefined;
	/**
	 * Replaces the list with your own content, in the popup the `...` crumb opens. It receives the
	 * collapsed crumbs in path order, with the index of each in `items`. The content has no rows, no
	 * arrow key walk and no navigation of its own, so it links to what it lists and closes itself as
	 * it needs to.
	 *
	 * @note It is called while the breadcrumb renders, on every render with a crumb collapsed. Keep it
	 * a pure function that calls no hooks, and return an element, such as
	 * `<StepList steps={collapsed} />`, for content that holds state of its own.
	 *
	 * @note With it, `heading` and `rowSuffix` are not used, and the popup is named `Hidden items`.
	 *
	 * @note A function that returns nothing (`null`, `false`, an empty string) leaves the `...` crumb
	 * as text: a `<span>` that takes no focus and opens nothing, with the `data-slot`, `data-kind`
	 * and test id of the trigger. Otherwise the trigger, its name (`Show N hidden items`) and the way
	 * it opens are the ones the list has.
	 */
	render?: (collapsed: BreadcrumbCollapsedCrumb[]) => ReactNode;
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
	 * Which middle crumbs collapse first. `center` starts at the middle one and moves outward, so the
	 * `...` crumb sits in the middle of the trail. `start` starts at the crumb after the first one and
	 * moves toward the current page, so the trail reads first crumb, `...`, then the last crumbs, and
	 * the crumbs next to the current page stay the longest. Only applies while `truncate` is set, and
	 * the first and the last crumb never collapse either way.
	 *
	 * @default 'center'
	 */
	collapseFrom?: BreadcrumbCollapseFromType;
	/**
	 * What a crumb's label does when it does not fit. `ellipsis` cuts it with `…` and shows the
	 * full title in a tooltip, `hidden` clips it.
	 *
	 * @default 'ellipsis'
	 */
	textOverflow?: BreadcrumbTextOverflowType;
	/**
	 * How the crumbs are drawn. `plain` is text that fills on hover. `outlined` draws every crumb
	 * but the current page, and the `...` crumb, as a chip with a border, and leaves the current page
	 * as text in the primary colour. Both collapse and shorten the same way.
	 *
	 * @default 'plain'
	 */
	variant?: BreadcrumbVariantType;
	/**
	 * What the `...` crumb opens: the heading and the trailing element of the rows it lists, or
	 * content of your own in their place. It opens on hover and on a press either way. Only matters
	 * while a crumb is collapsed, since the `...` crumb renders only then.
	 */
	ellipsis?: BreadcrumbEllipsisOptions;
	/**
	 * Forwarded to the `<nav>` as `data-testid`, and the stem every part is named from:
	 * `` `${testId}-item-${index}` `` for a crumb, `` `${testId}-item-separator-${index}` `` for
	 * the separator before it, `` `${testId}-popup` `` for the popup of the cards and the list,
	 * and `` `${testId}-ellipsis` `` for the `...` crumb.
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
 * What a trigger hands the popup: the place in `items` of a crumb with a `preview`, or `'ellipsis'`
 * for the `...` crumb.
 *
 * @access private
 */
export type BreadcrumbPopupPayloadType = number | typeof BREADCRUMB_ELLIPSIS_PAYLOAD;

/**
 * @access private
 */
export type BreadcrumbPopupHandleType = PopoverHandle<BreadcrumbPopupPayloadType>;

/**
 * What the collapse planner reads off the trail. Every width is in pixels.
 *
 * @access private
 */
export type BreadcrumbTrailMeasure = {
	/**
	 * The order the crumbs collapse in, which decides the crumbs that are left at each step.
	 */
	collapseFrom: BreadcrumbCollapseFromType;
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
