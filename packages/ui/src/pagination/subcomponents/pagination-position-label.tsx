import type { ReactNode } from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import styles from '../pagination.module.scss';

/**
 * @access private
 */
export type PaginationPositionLabelProps = {
	text: string;
	/**
	 * The longest text the label takes for the current total and page size. Stacked invisibly in
	 * the same cell, so the label keeps one width while the page changes.
	 */
	sizerText: string;
	testId: string | undefined;
};

/**
 * @access private
 */
export function PaginationPositionLabel({
	text,
	sizerText,
	testId,
}: PaginationPositionLabelProps): ReactNode {
	const [truncated, textRef] = useIsLabelTruncated(true);

	return (
		<TooltipAnchor content={truncated ? text : null}>
			<div
				data-slot="pagination-total"
				data-truncated={truncated || undefined}
				aria-live="polite"
				aria-atomic="true"
				// A tab stop only while the text is cut, so a keyboard user can open the tooltip that
				// holds the rest of it.
				// oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
				tabIndex={truncated ? 0 : undefined}
				className={styles['pagination__total']}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			>
				<span ref={textRef} className={styles['pagination__total-text']}>
					{text}
				</span>
				<span aria-hidden="true" className={styles['pagination__total-sizer']}>
					{sizerText}
				</span>
			</div>
		</TooltipAnchor>
	);
}
