import type { ReactNode } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../card.module.scss';

/**
 * @access private
 */
export type CardBodyProps = {
	testId: string | undefined;
	isFlush: boolean;
	hasSkeleton: boolean;
	children: ReactNode;
};

/**
 * The body of a card. `isFlush` is a body with no padding, which clips to the radius of the card
 * where it is the first or the last part. `hasSkeleton` is the default loading `Skeleton`, which
 * takes the padding of the header and the footer in place of the padding props.
 *
 * @access private
 */
export function CardBody({ testId, isFlush, hasSkeleton, children }: CardBodyProps) {
	return (
		<div
			data-slot="card-body"
			data-flush={isFlush || undefined}
			data-skeleton={hasSkeleton || undefined}
			data-testid={partTestId(testId, 'body')}
			className={styles['card__body']}
		>
			{children}
		</div>
	);
}
