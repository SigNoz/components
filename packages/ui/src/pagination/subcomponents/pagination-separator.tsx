import type { ReactNode } from 'react';
import styles from '../pagination.module.scss';

/**
 * @access private
 */
export type PaginationSeparatorProps = {
	testId: string | undefined;
};

/**
 * @access private
 */
export function PaginationSeparator({ testId }: PaginationSeparatorProps): ReactNode {
	return (
		<span
			data-slot="pagination-separator"
			aria-hidden="true"
			className={styles['pagination__separator']}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		/>
	);
}
