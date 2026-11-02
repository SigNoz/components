import type { ReactElement } from 'react';
import styles from '../breadcrumb.module.scss';

/**
 * @access private
 */
export type BreadcrumbSeparatorProps = {
	separator: string;
	testId: string | undefined;
};

/**
 * The mark between two crumbs. Out of the accessibility tree: the list already says where one
 * crumb ends.
 *
 * @access private
 */
export function BreadcrumbSeparator({ separator, testId }: BreadcrumbSeparatorProps): ReactElement {
	return (
		<li
			role="presentation"
			aria-hidden="true"
			data-slot="breadcrumb-separator"
			className={styles['breadcrumb__separator']}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			{separator}
		</li>
	);
}
