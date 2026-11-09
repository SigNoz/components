import { type ReactElement, useCallback } from 'react';
import { Dropdown } from '../../dropdown/dropdown.js';
import { partTestId } from '../../lib/utils.js';
import styles from '../breadcrumb.module.scss';
import { BreadcrumbItemKind, BreadcrumbPosition } from '../constants.js';
import type {
	BreadcrumbPositionType,
	BreadcrumbResolvedItem,
	BreadcrumbTextOverflowType,
	RegisterBreadcrumbCrumb,
} from '../types.js';
import type { BreadcrumbPopupState } from '../use-breadcrumb-popup.js';
import { INERT_PROPS, toMenuRows } from '../utils.js';
import { BreadcrumbItemContent } from './breadcrumb-item-content.js';

/**
 * @access private
 */
export type BreadcrumbItemProps = {
	resolved: BreadcrumbResolvedItem;
	position: BreadcrumbPositionType;
	textOverflow: BreadcrumbTextOverflowType;
	/**
	 * True while the crumb sits in the list of the `...` crumb. It stays mounted, out of the flow,
	 * invisible and inert, so the trail measures it as it would render.
	 */
	collapsed: boolean;
	/**
	 * Reports the nodes the trail measures, the crumb and its label, under the index of the crumb.
	 */
	registerCrumb: RegisterBreadcrumbCrumb;
	popup: BreadcrumbPopupState;
};

/**
 * One crumb of the trail, and the menu it opens when it has a `menu`.
 *
 * @access private
 */
export function BreadcrumbItem({
	resolved,
	position,
	textOverflow,
	collapsed,
	registerCrumb,
	popup,
}: BreadcrumbItemProps): ReactElement {
	const { item, kind, testId, index } = resolved;
	const crumbRef = useCallback(
		(node: HTMLLIElement | null): void => registerCrumb(index, 'crumb', node),
		[registerCrumb, index],
	);
	const labelRef = useCallback(
		(node: HTMLSpanElement | null): void => registerCrumb(index, 'label', node),
		[registerCrumb, index],
	);
	const menuTestId = partTestId(testId, 'menu');
	const content = (
		<BreadcrumbItemContent
			item={item}
			kind={kind}
			current={position === BreadcrumbPosition.End}
			textOverflow={textOverflow}
			collapsed={collapsed}
			labelRef={labelRef}
			popup={popup}
			index={index}
		/>
	);
	// A collapsed crumb leaves its `testId` to its menu row, and opens no menu of its own.
	const collapsedProps = collapsed ? { 'aria-hidden': true, ...INERT_PROPS } : {};

	return (
		<li
			ref={crumbRef}
			data-slot="breadcrumb-item"
			data-position={position}
			data-kind={kind}
			data-collapsed={collapsed || undefined}
			className={styles['breadcrumb__item']}
			{...collapsedProps}
			{...(testId === undefined || collapsed ? {} : { 'data-testid': testId })}
		>
			{kind === BreadcrumbItemKind.Menu && !collapsed ? (
				<Dropdown
					nativeButton
					side="bottom"
					align="start"
					items={toMenuRows(item.menu ?? [])}
					{...(menuTestId === undefined ? {} : { testId: menuTestId })}
				>
					{content}
				</Dropdown>
			) : (
				content
			)}
		</li>
	);
}
