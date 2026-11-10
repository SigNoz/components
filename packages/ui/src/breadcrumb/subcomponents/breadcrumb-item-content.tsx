import { useRender } from '@base-ui/react/use-render';
import { ChevronDown } from '@signozhq/icons';
import {
	cloneElement,
	createElement,
	forwardRef,
	type HTMLAttributes,
	type ReactElement,
	type Ref,
	type RefCallback,
	useMemo,
} from 'react';
import { getLinkProps } from '../../lib/link-props.js';
import { mergeRefs } from '../../lib/merge-refs.js';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { cn, hasRenderableContent } from '../../lib/utils.js';
import { Popover } from '../../popover/popover.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import styles from '../breadcrumb.module.scss';
import {
	BREADCRUMB_PREVIEW_CLOSE_DELAY,
	BreadcrumbItemKind,
	BreadcrumbTextOverflow,
} from '../constants.js';
import type {
	BreadcrumbItemKindType,
	BreadcrumbItemType,
	BreadcrumbTextOverflowType,
} from '../types.js';
import type { BreadcrumbPopupState } from '../use-breadcrumb-popup.js';
import { hasPreview } from '../utils.js';

/**
 * @access private
 */
export type BreadcrumbItemContentProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
	item: BreadcrumbItemType;
	kind: BreadcrumbItemKindType;
	/**
	 * Marks the crumb as the current page with `aria-current="page"`, unless its `render`
	 * element sets its own.
	 */
	current: boolean;
	textOverflow: BreadcrumbTextOverflowType;
	/**
	 * True while the crumb sits in the list of the `...` crumb. Nobody can hover it there, so its
	 * label is not measured and it carries no `data-truncated`.
	 */
	collapsed: boolean;
	/**
	 * Ref of the label, for the trail to measure it. The truncation check keeps its own.
	 */
	labelRef: RefCallback<HTMLSpanElement>;
	popup: BreadcrumbPopupState;
	/**
	 * The place of the crumb in `items`, which the popup reads the crumb by.
	 */
	index: number;
};

/**
 * The part of a crumb that takes hover and focus: the link, its `render` element or an `<a>`, a
 * `<button>`, or a `<span>` for a crumb that does nothing. Carries the tooltip with the full title
 * while the label is cut, or the card of its `preview` instead, which is the full title and more. Also
 * the trigger of a crumb's own menu, so every prop the menu merges in is forwarded to the element.
 *
 * @access private
 */
export const BreadcrumbItemContent = forwardRef<HTMLElement, BreadcrumbItemContentProps>(
	function BreadcrumbItemContent(
		{
			item,
			kind,
			current,
			textOverflow,
			collapsed,
			labelRef,
			popup,
			index,
			className,
			onClick,
			...props
		},
		ref,
	) {
		const [isLabelTruncated, truncationRef] = useIsLabelTruncated(
			textOverflow === BreadcrumbTextOverflow.Ellipsis && !collapsed,
		);
		const mergedLabelRef = useMemo(
			() => mergeRefs(labelRef, truncationRef),
			[labelRef, truncationRef],
		);

		const children = (
			<>
				{hasRenderableContent(item.icon) && (
					<span data-slot="breadcrumb-item-icon" className={styles['breadcrumb__icon']}>
						{item.icon}
					</span>
				)}
				<span
					ref={mergedLabelRef}
					data-slot="breadcrumb-item-label"
					className={styles['breadcrumb__label']}
				>
					{item.title}
				</span>
				{kind === BreadcrumbItemKind.Menu && (
					<span data-slot="breadcrumb-item-chevron" className={styles['breadcrumb__icon']}>
						<ChevronDown />
					</span>
				)}
			</>
		);

		const ownProps = { 'data-kind': kind, 'data-slot': 'breadcrumb-item-content' };
		// After the spread, so the menu's trigger props do not rename the part.
		const contentProps = {
			'data-truncated': isLabelTruncated || undefined,
			'aria-current': current ? ('page' as const) : undefined,
			className: cn(styles['breadcrumb__content'], className),
			...props,
			...ownProps,
		};
		const handleClick = onClick ?? item.onClick;
		const isLink = kind === BreadcrumbItemKind.Link;
		const linkElement = item.render ?? createElement('a');

		// The props of the `render` element win over the ones of the content, so `href` and `target`
		// go on the element itself, where the ones it leaves `undefined` take the ones of the crumb.
		// The children too: the label is the title, whatever the element holds. So do the props that
		// name the part, which a `data-slot` or `data-kind` of the element would otherwise replace.
		const link = useRender({
			enabled: isLink,
			render: isLink
				? cloneElement(linkElement, {
						...getLinkProps(linkElement, item).props,
						...ownProps,
						children,
					})
				: linkElement,
			ref,
			props: { ...contentProps, ...(handleClick === undefined ? {} : { onClick: handleClick }) },
		});

		let element: ReactElement;

		if (link !== null) {
			element = link;
		} else if (kind === BreadcrumbItemKind.Button || kind === BreadcrumbItemKind.Menu) {
			element = (
				<button
					ref={ref as Ref<HTMLButtonElement>}
					type="button"
					onClick={handleClick}
					{...contentProps}
				>
					{children}
				</button>
			);
		} else {
			element = (
				<span ref={ref as Ref<HTMLSpanElement>} {...contentProps}>
					{children}
				</span>
			);
		}

		// A collapsed crumb keeps its trigger, so it does not remount, and lose its focus, as the trail
		// collapses it. Nobody can reach it there, and the card closes if it was open for it.
		if (hasPreview({ item, kind })) {
			return (
				<Popover.Trigger
					handle={popup.handle}
					payload={index}
					nativeButton={kind === BreadcrumbItemKind.Button}
					preview
					closeDelay={BREADCRUMB_PREVIEW_CLOSE_DELAY}
				>
					{element}
				</Popover.Trigger>
			);
		}

		// The trigger stays mounted whether or not the label is cut, so the crumb never remounts, and
		// never drops its focus, when the tooltip appears.
		return (
			<TooltipAnchor
				content={isLabelTruncated ? item.title : null}
				contentProps={{ className: styles['breadcrumb__tooltip'] }}
			>
				{element}
			</TooltipAnchor>
		);
	},
);
