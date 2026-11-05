import type { ReactElement } from 'react';
import { Dropdown } from '../../dropdown/dropdown.js';
import styles from '../breadcrumb.module.scss';
import { BREADCRUMB_ELLIPSIS_LABEL } from '../constants.js';
import type { BreadcrumbResolvedItem } from '../types.js';
import { toCollapsedRow } from '../utils.js';

/**
 * @access private
 */
export type BreadcrumbEllipsisProps = {
	collapsed: BreadcrumbResolvedItem[];
	testId: string | undefined;
};

/**
 * The `...` crumb and the menu it opens, listing the collapsed crumbs in path order. No tooltip:
 * it has a menu, and the two would race on the same hover.
 *
 * @access private
 */
export function BreadcrumbEllipsis({ collapsed, testId }: BreadcrumbEllipsisProps): ReactElement {
	const count = collapsed.length;

	return (
		<li data-slot="breadcrumb-ellipsis" className={styles['breadcrumb__item']}>
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				// Portalled to the body, so the token is read on the page, not on an ancestor of the
				// trail.
				contentMaxWidth="var(--breadcrumb-menu-max-width, 20rem)"
				items={collapsed.map(toCollapsedRow)}
				{...(testId === undefined ? {} : { testId })}
			>
				<button
					type="button"
					aria-label={`Show ${count} hidden ${count === 1 ? 'item' : 'items'}`}
					data-kind="ellipsis"
					data-slot="breadcrumb-ellipsis-trigger"
					className={styles['breadcrumb__content']}
				>
					{BREADCRUMB_ELLIPSIS_LABEL}
				</button>
			</Dropdown>
		</li>
	);
}
