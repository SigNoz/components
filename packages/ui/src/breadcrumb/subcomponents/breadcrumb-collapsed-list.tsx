import type { KeyboardEvent, ReactElement, ReactNode } from 'react';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import styles from '../breadcrumb.module.scss';
import { BREADCRUMB_ELLIPSIS_GROUP_VALUE } from '../constants.js';
import type { BreadcrumbEllipsisOptions, BreadcrumbResolvedItem } from '../types.js';
import { getNextRowIndex } from '../utils.js';
import { BreadcrumbCollapsedRow } from './breadcrumb-collapsed-row.js';

const FOCUSABLE_ROW_SELECTOR = '[data-slot="breadcrumb-ellipsis-row"]:not([data-kind="text"])';

/**
 * @access private
 */
export type BreadcrumbCollapsedListProps = {
	collapsed: BreadcrumbResolvedItem[];
	heading: ReactNode;
	/**
	 * The id the heading takes, which the popup and the group that hold the rows are named by.
	 */
	headingId: string;
	rowSuffix: BreadcrumbEllipsisOptions['rowSuffix'];
	/**
	 * The test id of the `...` crumb, which the group under the heading is named from.
	 */
	testId: string | undefined;
	/**
	 * Runs once a row has done its work, so the popup that holds the list can close.
	 */
	onPick: () => void;
};

/**
 * What the `...` crumb opens by default: the collapsed crumbs in path order, one row each, under
 * the `heading` when it renders anything. The arrow keys, `Home` and `End` move the focus between
 * the rows, which `Tab` reaches too.
 *
 * @access private
 */
export function BreadcrumbCollapsedList({
	collapsed,
	heading,
	headingId,
	rowSuffix,
	testId,
	onPick,
}: BreadcrumbCollapsedListProps): ReactElement {
	const hasHeading = hasRenderableContent(heading);

	// On the capture phase, so a row that opens a menu does not take the arrow keys first. Keys that
	// come from inside that menu, which React bubbles through its portal, are not the list's.
	function handleKeyDownCapture(event: KeyboardEvent<HTMLDivElement>): void {
		const rows = Array.from(
			event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE_ROW_SELECTOR),
		);
		const current = rows.indexOf(event.target as HTMLElement);

		if (current === -1) {
			return;
		}

		const next = getNextRowIndex(event.key, current, rows.length);

		if (next !== undefined) {
			event.preventDefault();
			event.stopPropagation();
			rows[next]?.focus();
		}
	}

	return (
		<div
			data-slot="breadcrumb-ellipsis-content"
			className={styles['breadcrumb__ellipsis']}
			onKeyDownCapture={handleKeyDownCapture}
			{...(hasHeading
				? {
						role: 'group',
						'aria-labelledby': headingId,
						'data-testid': partTestId(testId, `group-${BREADCRUMB_ELLIPSIS_GROUP_VALUE}`),
					}
				: {})}
		>
			{hasHeading && (
				<div
					id={headingId}
					data-slot="breadcrumb-ellipsis-heading"
					className={styles['breadcrumb__ellipsis-heading']}
				>
					{heading}
				</div>
			)}
			<ul data-slot="breadcrumb-ellipsis-list" className={styles['breadcrumb__ellipsis-list']}>
				{collapsed.map((resolved) => (
					<li key={resolved.index} className={styles['breadcrumb__ellipsis-list-item']}>
						<BreadcrumbCollapsedRow resolved={resolved} rowSuffix={rowSuffix} onPick={onPick} />
					</li>
				))}
			</ul>
		</div>
	);
}
