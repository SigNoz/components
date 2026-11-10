import type { ReactElement } from 'react';
import { Popover } from '../../popover/popover.js';
import styles from '../breadcrumb.module.scss';
import {
	BREADCRUMB_ELLIPSIS_LABEL,
	BREADCRUMB_ELLIPSIS_PAYLOAD,
	BREADCRUMB_PREVIEW_CLOSE_DELAY,
} from '../constants.js';
import type { BreadcrumbPopupState } from '../use-breadcrumb-popup.js';

/**
 * @access private
 */
export type BreadcrumbEllipsisProps = {
	/**
	 * How many crumbs are collapsed into it, which its name says.
	 */
	count: number;
	popup: BreadcrumbPopupState;
	/**
	 * False when `ellipsis.render` renders nothing: the crumb is text then, with no popup to open.
	 */
	hasPopup: boolean;
	testId: string | undefined;
};

/**
 * The `...` crumb: the trigger of the list of the collapsed crumbs, or of the content of
 * `ellipsis.render`. No tooltip: it opens something, and the two would race on the same hover.
 *
 * @access private
 */
export function BreadcrumbEllipsis({
	count,
	popup,
	hasPopup,
	testId,
}: BreadcrumbEllipsisProps): ReactElement {
	const partProps = {
		'data-kind': 'ellipsis',
		'data-slot': 'breadcrumb-ellipsis-trigger',
		className: styles['breadcrumb__content'],
		...(testId === undefined ? {} : { 'data-testid': testId }),
	};

	return (
		<li data-slot="breadcrumb-ellipsis" className={styles['breadcrumb__item']}>
			{hasPopup ? (
				<Popover.Trigger
					handle={popup.handle}
					payload={BREADCRUMB_ELLIPSIS_PAYLOAD}
					nativeButton
					openOnHover
					closeDelay={BREADCRUMB_PREVIEW_CLOSE_DELAY}
				>
					<button
						id={popup.ellipsisTriggerId}
						type="button"
						aria-label={`Show ${count} hidden ${count === 1 ? 'item' : 'items'}`}
						{...partProps}
					>
						{BREADCRUMB_ELLIPSIS_LABEL}
					</button>
				</Popover.Trigger>
			) : (
				<span {...partProps}>{BREADCRUMB_ELLIPSIS_LABEL}</span>
			)}
		</li>
	);
}
