import { useRender } from '@base-ui/react/use-render';
import { ChevronRight } from '@signozhq/icons';
import { createElement, type MouseEvent, type ReactElement } from 'react';
import { Dropdown } from '../../dropdown/dropdown.js';
import { isPlainClick } from '../../lib/is-plain-click.js';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import styles from '../breadcrumb.module.scss';
import { BreadcrumbItemKind } from '../constants.js';
import type { BreadcrumbEllipsisOptions, BreadcrumbResolvedItem } from '../types.js';
import { getRowRender, toMenuRows } from '../utils.js';

/**
 * @access private
 */
export type BreadcrumbCollapsedRowProps = {
	resolved: BreadcrumbResolvedItem;
	rowSuffix: BreadcrumbEllipsisOptions['rowSuffix'];
	/**
	 * Runs once the row has done its work, so the popup that lists it can close.
	 */
	onPick: () => void;
};

/**
 * One collapsed crumb in the list the `...` crumb opens: the icon of the crumb, its title, and the
 * `rowSuffix` element at the end. A link or `render` crumb is a link, one with only an `onClick` is
 * a `<button>`, one with a `menu` is a `<button>` that opens a `Dropdown` of its entries, and any
 * other is plain text. The row carries the test id the crumb has while it is visible.
 *
 * @access private
 */
export function BreadcrumbCollapsedRow({
	resolved,
	rowSuffix,
	onPick,
}: BreadcrumbCollapsedRowProps): ReactElement {
	const { item, index, kind, testId } = resolved;
	const isLink = kind === BreadcrumbItemKind.Link;
	const isMenu = kind === BreadcrumbItemKind.Menu;
	const suffix = isMenu ? undefined : rowSuffix?.(item, index);

	const children = (
		<>
			{hasRenderableContent(item.icon) && (
				<span
					data-slot="breadcrumb-ellipsis-row-icon"
					className={styles['breadcrumb__ellipsis-row-icon']}
				>
					{item.icon}
				</span>
			)}
			<span
				data-slot="breadcrumb-ellipsis-row-label"
				className={styles['breadcrumb__ellipsis-row-label']}
			>
				{item.title}
			</span>
			{isMenu && (
				<span
					data-slot="breadcrumb-ellipsis-row-chevron"
					className={styles['breadcrumb__ellipsis-row-affix']}
				>
					<ChevronRight />
				</span>
			)}
			{suffix !== undefined && (
				<span
					data-slot="breadcrumb-ellipsis-row-suffix"
					className={styles['breadcrumb__ellipsis-row-affix']}
				>
					{suffix}
				</span>
			)}
		</>
	);

	const handleClick = (event: MouseEvent<HTMLElement>): void => {
		if (isPlainClick(event)) {
			onPick();
		}
	};
	const ownProps = {
		'data-kind': kind,
		'data-slot': 'breadcrumb-ellipsis-row',
		...(testId === undefined ? {} : { 'data-testid': testId }),
	};
	const rowProps = { ...ownProps, className: styles['breadcrumb__ellipsis-row'] };

	// The element of a `render` crumb handles its own click first, then the one of the crumb, and the
	// row's last, with the click the browser made: the handler of a crumb may read its modifier keys
	// and cancel it. The crumb stays mounted in the trail, so the row leaves the `ref` of its element
	// to the copy that is there. The props of the element win the merge, so the ones that name the
	// row go on the element itself.
	const link = useRender({
		enabled: isLink,
		render: getRowRender(item, { dropRef: true, props: ownProps }) ?? createElement('a'),
		props: { ...rowProps, onClick: handleClick, children },
	});

	if (link !== null) {
		return link;
	}

	if (isMenu) {
		return (
			<Dropdown
				nativeButton
				side="right"
				align="start"
				items={toMenuRows(item.menu ?? [], partTestId(testId, 'menu'), onPick)}
			>
				<button type="button" {...rowProps}>
					{children}
				</button>
			</Dropdown>
		);
	}

	if (kind === BreadcrumbItemKind.Button) {
		return (
			<button
				type="button"
				{...rowProps}
				onClick={(event) => {
					item.onClick?.(event);
					handleClick(event);
				}}
			>
				{children}
			</button>
		);
	}

	return <span {...rowProps}>{children}</span>;
}
