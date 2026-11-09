import { type MutableRefObject, type RefObject, useCallback, useRef, useState } from 'react';
import { readPx } from '../lib/css-length.js';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import type {
	BreadcrumbCollapseFromType,
	BreadcrumbCrumbPart,
	BreadcrumbShrinkType,
	BreadcrumbTrailMeasure,
	RegisterBreadcrumbCrumb,
} from './types.js';
import { countCollapsed, getShrink, getTrailWidth } from './utils.js';

/**
 * How much a transform on the trail or an ancestor, such as `scale(0.9)`, stretches the rects: the
 * width a rect reports over the width the layout gives the trail. The room and the label widths are
 * in layout pixels, so a rect is divided by this before it is compared with them. Close to 1 with
 * no transform, and 1 when the trail has no width to compare.
 *
 * Both are border boxes, so a padding or a border on the trail is not read as a transform, which
 * the computed `width` would do under `box-sizing: content-box`.
 */
function getScale(root: HTMLElement): number {
	const scale = root.getBoundingClientRect().width / root.offsetWidth;

	return Number.isFinite(scale) && scale > 0 ? scale : 1;
}

function getWidth(element: Element, scale: number): number {
	return element.getBoundingClientRect().width / scale;
}

/**
 * The width the layout gives the label before its own cap: the room in its crumb once the padding
 * and the other parts of the crumb are out, which is the width of the label when nothing cuts it.
 */
function getLabelRoom(label: HTMLElement, scale: number): number {
	const content = label.parentElement;

	if (!content) {
		return label.clientWidth;
	}

	const style = getComputedStyle(content);
	const others = Array.from(content.children).filter((child) => child !== label);

	return (
		getWidth(content, scale) -
		readPx(style.paddingLeft) -
		readPx(style.paddingRight) -
		readPx(style.borderLeftWidth) -
		readPx(style.borderRightWidth) -
		others.length * readPx(style.columnGap) -
		others.reduce((sum, other) => sum + getWidth(other, scale), 0)
	);
}

/**
 * The width a crumb takes at its own size, read even while it is shortened. The label is the only
 * part that shrinks, so the hidden part of the label is added back, up to the cap of the label.
 *
 * A cap that is a percentage, which the computed style keeps as written, is a share of the crumb
 * itself. The crumb sizes itself as if the label had no cap, then the cap cuts the label inside the
 * crumb and leaves the rest of the crumb empty. So the label is read as uncapped, and what it
 * misses is measured against the room it has, not against its own width.
 */
function getCrumbWidth(crumb: HTMLElement, label: HTMLElement | undefined, scale: number): number {
	const width = getWidth(crumb, scale);

	if (!label) {
		return width;
	}

	const { maxWidth } = getComputedStyle(label);
	const relative = maxWidth.includes('%');
	const cap = Number.parseFloat(maxWidth);
	const full = relative || Number.isNaN(cap) ? label.scrollWidth : Math.min(label.scrollWidth, cap);
	const shown = relative
		? Math.max(label.clientWidth, getLabelRoom(label, scale))
		: label.clientWidth;

	return width + Math.max(0, full - shown);
}

type CollapseState = {
	collapsedCount: number;
	/**
	 * Every crumb side by side, `undefined` until the first measure.
	 */
	fullWidth: number | undefined;
	/**
	 * Which crumbs shorten once only the first and the last are left, `undefined` while more show.
	 */
	shrink: BreadcrumbShrinkType | undefined;
};

const INITIAL_STATE: CollapseState = { collapsedCount: 0, fullWidth: undefined, shrink: undefined };

type CrumbNodes = Partial<Record<BreadcrumbCrumbPart, HTMLElement>>;

type BreadcrumbCollapse = CollapseState & {
	rootRef: RefObject<HTMLElement | null>;
	listRef: MutableRefObject<HTMLOListElement | null>;
	separatorRef: MutableRefObject<HTMLSpanElement | null>;
	ellipsisRef: MutableRefObject<HTMLSpanElement | null>;
	floorRef: MutableRefObject<HTMLSpanElement | null>;
	registerCrumb: RegisterBreadcrumbCrumb;
};

/**
 * Measures the crumbs and reports how many of the middle ones collapse, then which of the first
 * and the last crumb shorten.
 *
 * Collapsed crumbs stay mounted out of the flow, so each is measured as it renders. The trail
 * writes `fullWidth` on its measuring row, so it shrinks only with its container and grows back
 * with it.
 *
 * The trail puts `rootRef`, `listRef` and the refs of the three measuring spans on its own
 * elements, and each crumb reports its nodes through `registerCrumb`. Turn `enabled` off while
 * the trail renders none of them.
 *
 * @access private
 */
export function useBreadcrumbCollapse({
	enabled,
	itemsKey,
	minCollapsed,
	collapseFrom,
}: {
	enabled: boolean;
	itemsKey: string;
	minCollapsed: number;
	collapseFrom: BreadcrumbCollapseFromType;
}): BreadcrumbCollapse {
	const [state, setState] = useState<CollapseState>(INITIAL_STATE);
	const rootRef = useRef<HTMLElement | null>(null);
	const listRef = useRef<HTMLOListElement | null>(null);
	const separatorRef = useRef<HTMLSpanElement | null>(null);
	const ellipsisRef = useRef<HTMLSpanElement | null>(null);
	const floorRef = useRef<HTMLSpanElement | null>(null);
	const collapsedRef = useRef(0);
	const minCollapsedRef = useRef(minCollapsed);
	const collapseFromRef = useRef(collapseFrom);
	const observerRef = useRef<ResizeObserver | null>(null);
	// Keyed by the index of the crumb in `items`, which grows with the path, so the sorted keys are
	// the order of the trail.
	const crumbsRef = useRef(new Map<number, CrumbNodes>());

	const registerCrumb = useCallback<RegisterBreadcrumbCrumb>((index, part, node) => {
		const nodes = crumbsRef.current.get(index) ?? {};
		const previous = nodes[part] ?? null;

		if (previous === node) {
			return;
		}

		const observer = observerRef.current;

		if (previous) {
			observer?.unobserve(previous);
		}

		if (node) {
			nodes[part] = node;
			observer?.observe(node);
		} else {
			delete nodes[part];
		}

		if (nodes.crumb || nodes.label) {
			crumbsRef.current.set(index, nodes);
		} else {
			crumbsRef.current.delete(index);
		}
	}, []);

	const measure = useCallback((): void => {
		const root = rootRef.current;
		const list = listRef.current;
		const separator = separatorRef.current;
		const ellipsis = ellipsisRef.current;
		const floor = floorRef.current;

		if (!root || !list || !separator || !ellipsis || !floor) {
			return;
		}

		// Everything is in layout pixels: `clientWidth` and the label widths already are, and the rects
		// are put there, so a transform on an ancestor does not change what fits.
		const scale = getScale(root);
		const listStyle = getComputedStyle(list);
		const trail: BreadcrumbTrailMeasure = {
			collapseFrom: collapseFromRef.current,
			widths: Array.from(crumbsRef.current)
				.sort(([a], [b]) => a - b)
				.flatMap(([, { crumb, label }]) => (crumb ? [getCrumbWidth(crumb, label, scale)] : [])),
			separatorWidth: getWidth(separator, scale),
			ellipsisWidth: getWidth(ellipsis, scale),
			gap: readPx(listStyle.columnGap),
			available: list.clientWidth - readPx(listStyle.paddingLeft) - readPx(listStyle.paddingRight),
		};

		const collapsedCount = countCollapsed(trail, collapsedRef.current, minCollapsedRef.current);
		const next: CollapseState = {
			collapsedCount,
			fullWidth: getTrailWidth(trail, 0),
			shrink: getShrink(trail, collapsedCount, getWidth(floor, scale)),
		};

		collapsedRef.current = next.collapsedCount;
		setState((current) =>
			current.collapsedCount === next.collapsedCount &&
			current.fullWidth === next.fullWidth &&
			current.shrink === next.shrink
				? current
				: next,
		);
	}, []);

	// Read through a ref, so a new `minCollapsed` or `collapseFrom` does not make a new `measure`,
	// which would restart the observer and observe every crumb and label again. It comes first, so
	// the measures below read the new value.
	useIsomorphicLayoutEffect(() => {
		minCollapsedRef.current = minCollapsed;
		collapseFromRef.current = collapseFrom;
	}, [minCollapsed, collapseFrom]);

	// Each crumb is observed too: a crumb that changes size moves the thresholds without the trail
	// changing width. The ones that mount later are observed as they register.
	useIsomorphicLayoutEffect(() => {
		if (!enabled) {
			collapsedRef.current = 0;
			return;
		}

		if (typeof ResizeObserver === 'undefined') {
			return;
		}

		const observer = new ResizeObserver(measure);
		const nodes = [
			rootRef.current,
			separatorRef.current,
			ellipsisRef.current,
			floorRef.current,
			...Array.from(crumbsRef.current.values(), ({ crumb, label }) => [crumb, label]).flat(),
		];

		for (const node of nodes) {
			if (node) {
				observer.observe(node);
			}
		}

		observerRef.current = observer;

		return () => {
			observer.disconnect();
			observerRef.current = null;
		};
	}, [enabled, measure]);

	// Measures before the paint when the items change, where the observer would report a frame late.
	useIsomorphicLayoutEffect(() => {
		if (enabled) {
			measure();
		}
	}, [enabled, itemsKey, minCollapsed, collapseFrom, measure]);

	const refs = { rootRef, listRef, separatorRef, ellipsisRef, floorRef, registerCrumb };

	if (!enabled) {
		return { ...INITIAL_STATE, ...refs };
	}

	// `maxVisible` needs no layout, so it holds on the server and before the first measure.
	return {
		...state,
		collapsedCount: Math.max(state.collapsedCount, minCollapsed),
		...refs,
	};
}
