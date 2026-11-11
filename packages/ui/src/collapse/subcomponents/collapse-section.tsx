import { Accordion } from '@base-ui/react/accordion';
import { Collapsible } from '@base-ui/react/collapsible';
import { ChevronRight } from '@signozhq/icons';
import { type AriaAttributes, type ReactNode, useId } from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { hasRenderableContent, joinIdRefs, partTestId } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import styles from '../collapse.module.scss';
import {
	COLLAPSE_DEFAULT_HEADING_LEVEL,
	COLLAPSE_EMPTY_CONTENT,
	COLLAPSE_EMPTY_TITLE,
	CollapseTextOverflow,
} from '../constants.js';
import type {
	CollapseHeadingLevel,
	CollapseSectionProps,
	CollapseTextOverflowType,
} from '../types.js';
import { useCollapseFocusReturn } from '../use-collapse-focus-return.js';

/**
 * @access private
 */
export type CollapseSectionInternalProps = CollapseSectionProps & {
	/**
	 * `collapsible` renders the header and the panel of a Base UI collapsible, for `Collapse`.
	 * `accordion` renders them for an item of a Base UI accordion, for `Collapse.Group`.
	 */
	kind: 'collapsible' | 'accordion';
	open: boolean;
	testId: string | undefined;
	keepMounted: boolean;
	noContentPadding: boolean;
	textOverflow: CollapseTextOverflowType | undefined;
	headingLevel: CollapseHeadingLevel | undefined;
	/**
	 * Whether the panel is a `region` landmark.
	 */
	isRegion: boolean;
	/**
	 * The `aria-*` the call site passed for the header button.
	 */
	toggleAria?: AriaAttributes;
};

/**
 * The header row and the panel of one section, shared by `Collapse` and every item of
 * `Collapse.Group`. The root (a collapsible or an accordion item) belongs to the caller.
 *
 * @access private
 */
export function CollapseSection({
	kind,
	open,
	testId,
	keepMounted,
	noContentPadding,
	textOverflow = CollapseTextOverflow.Ellipsis,
	headingLevel = COLLAPSE_DEFAULT_HEADING_LEVEL,
	isRegion,
	toggleAria,
	title,
	description,
	prefix,
	headerSuffix,
	children,
}: CollapseSectionInternalProps): ReactNode {
	const baseId = useId();
	const titleId = `${baseId}-title`;
	const descriptionId = `${baseId}-description`;
	const panelId = `${baseId}-panel`;
	const isEllipsis = textOverflow === CollapseTextOverflow.Ellipsis;
	const [isTruncated, labelRef] = useIsLabelTruncated(isEllipsis);
	const { triggerRef, panelRef, panelFocusProps } = useCollapseFocusReturn(open);

	const hasTitle = hasRenderableContent(title);
	const hasDescription = hasRenderableContent(description);
	const titleContent = hasTitle ? title : COLLAPSE_EMPTY_TITLE;
	const { 'aria-describedby': describedBy, ...restAria } = toggleAria ?? {};

	const triggerProps = {
		...restAria,
		ref: triggerRef,
		'data-slot': 'collapse-toggle',
		className: styles['collapse__toggle'],
		'data-testid': partTestId(testId, 'toggle'),
		'aria-labelledby': titleId,
		'aria-describedby': joinIdRefs(hasDescription ? descriptionId : undefined, describedBy),
		// Base UI points `aria-controls` at the panel only while open. A kept panel is in the DOM
		// while collapsed too, so it stays pointed at.
		...(keepMounted ? { 'aria-controls': panelId } : {}),
	};

	const triggerContent = (
		<>
			<span data-slot="collapse-chevron" className={styles['collapse__chevron']} aria-hidden="true">
				<ChevronRight />
			</span>
			{prefix != null && (
				<span
					data-slot="collapse-prefix"
					className={styles['collapse__prefix']}
					data-testid={partTestId(testId, 'prefix')}
					aria-hidden="true"
				>
					{prefix}
				</span>
			)}
			<span className={styles['collapse__heading-text']}>
				<span
					ref={labelRef}
					id={titleId}
					data-slot="collapse-title"
					data-truncated={isTruncated || undefined}
					data-empty-title={!hasTitle || undefined}
					className={styles['collapse__title']}
					data-testid={partTestId(testId, 'title')}
				>
					{titleContent}
				</span>
				{hasDescription && (
					<span
						id={descriptionId}
						data-slot="collapse-description"
						className={styles['collapse__description']}
						data-testid={partTestId(testId, 'description')}
					>
						{description}
					</span>
				)}
			</span>
		</>
	);

	// The tooltip sits on the button, so keyboard focus opens it, not only a hover.
	const toggle = (
		<TooltipAnchor content={isTruncated ? titleContent : null}>
			{kind === 'accordion' ? (
				<Accordion.Trigger {...triggerProps}>{triggerContent}</Accordion.Trigger>
			) : (
				<Collapsible.Trigger {...triggerProps}>{triggerContent}</Collapsible.Trigger>
			)}
		</TooltipAnchor>
	);

	const HeadingTag = `h${headingLevel}` as const;

	const panelProps = {
		...panelFocusProps,
		ref: panelRef,
		id: panelId,
		'data-slot': 'collapse-panel',
		'data-no-content-padding': noContentPadding || undefined,
		className: styles['collapse__panel'],
		'data-testid': partTestId(testId, 'panel'),
		role: isRegion ? 'region' : undefined,
		'aria-labelledby': isRegion ? titleId : undefined,
		hiddenUntilFound: keepMounted,
	};

	const panelContent = (
		<div className={styles['collapse__content']}>
			{hasRenderableContent(children) ? children : COLLAPSE_EMPTY_CONTENT}
		</div>
	);

	return (
		<>
			<div data-slot="collapse-header" className={styles['collapse__header']}>
				{kind === 'accordion' ? (
					<Accordion.Header render={<HeadingTag />} className={styles['collapse__heading']}>
						{toggle}
					</Accordion.Header>
				) : (
					<HeadingTag className={styles['collapse__heading']}>{toggle}</HeadingTag>
				)}
				{hasRenderableContent(headerSuffix) && (
					<div
						data-slot="collapse-header-suffix"
						className={styles['collapse__header-suffix']}
						data-testid={partTestId(testId, 'header-suffix')}
					>
						{headerSuffix}
					</div>
				)}
			</div>
			{kind === 'accordion' ? (
				<Accordion.Panel {...panelProps}>{panelContent}</Accordion.Panel>
			) : (
				<Collapsible.Panel {...panelProps}>{panelContent}</Collapsible.Panel>
			)}
		</>
	);
}
