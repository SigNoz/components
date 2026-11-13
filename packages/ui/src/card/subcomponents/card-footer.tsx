import type { ReactNode } from 'react';
import { partTestId } from '../../lib/utils.js';
import { Skeleton } from '../../skeleton/skeleton.js';
import styles from '../card.module.scss';
import { CardSkeletonLine } from './card-skeleton-line.js';

/**
 * @access private
 */
export type CardFooterProps = {
	testId: string | undefined;
	prefix: ReactNode;
	hasPrefix: boolean;
	suffix: ReactNode;
	hasSuffix: boolean;
	loading: boolean;
};

/**
 * The footer of a card: `footerPrefix` at the start, `footerSuffix` at the end. While `loading`, each
 * one that is set is a `Skeleton` of the same shape.
 *
 * @access private
 */
export function CardFooter({
	testId,
	prefix,
	hasPrefix,
	suffix,
	hasSuffix,
	loading,
}: CardFooterProps) {
	return (
		<div
			data-slot="card-footer"
			data-loading={loading || undefined}
			data-testid={partTestId(testId, 'footer')}
			className={styles['card__footer']}
		>
			{hasPrefix && (
				<div
					data-slot="card-footer-prefix"
					data-testid={partTestId(testId, 'footer-prefix')}
					className={styles['card__footer-prefix']}
				>
					{loading ? <CardSkeletonLine line="text" width="40%" /> : prefix}
				</div>
			)}
			{hasSuffix && (
				<div
					data-slot="card-footer-suffix"
					data-testid={partTestId(testId, 'footer-suffix')}
					className={styles['card__footer-suffix']}
				>
					{loading ? <Skeleton.Button active size="md" /> : suffix}
				</div>
			)}
		</div>
	);
}
