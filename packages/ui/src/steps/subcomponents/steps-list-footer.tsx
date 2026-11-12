import type { ReactNode } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../steps.module.scss';

/**
 * @access private
 */
export type StepsListFooterProps = {
	children: ReactNode;
	testId: string | undefined;
};

/**
 * The row after the last step of `Steps.List`: a dot in the marker column and the footer in the
 * content column.
 *
 * It is a `div` after the `ol`, not an `li` inside it, so a screen reader does not count it as a
 * step. It repeats the two columns of a step, so the dot sits under the markers.
 *
 * @access private
 */
export function StepsListFooter({ children, testId }: StepsListFooterProps): ReactNode {
	const footerTestId = partTestId(testId, 'footer');

	return (
		<div
			data-slot="steps-list-footer"
			className={styles['steps-list__footer']}
			data-testid={footerTestId}
		>
			<span className={styles['steps-list__footer-rail']}>
				<span
					aria-hidden="true"
					data-slot="steps-list-footer-connector"
					className={styles['steps-list__footer-connector']}
				/>
				<span
					aria-hidden="true"
					data-slot="steps-list-footer-marker"
					className={styles['steps-list__footer-marker']}
					data-testid={partTestId(footerTestId, 'marker')}
				/>
			</span>
			<div
				data-slot="steps-list-footer-content"
				className={styles['steps-list__footer-content']}
				data-testid={partTestId(footerTestId, 'content')}
			>
				{children}
			</div>
		</div>
	);
}
