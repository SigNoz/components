import type { ReactNode } from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { partTestId } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import styles from '../card.module.scss';
import { CardTextOverflow } from '../constants.js';
import type { CardTextOverflowType } from '../types.js';

/**
 * @access private
 */
export type CardTitleProps = {
	id: string;
	testId: string | undefined;
	textOverflow: CardTextOverflowType;
	children: ReactNode;
};

/**
 * The title of a card. With `ellipsis` it cuts at the edge of its box and, while it is cut, a
 * tooltip on it shows the whole title.
 *
 * @access private
 */
export function CardTitle({ id, testId, textOverflow, children }: CardTitleProps) {
	const hasEllipsis = textOverflow === CardTextOverflow.Ellipsis;
	const [isTruncated, titleRef] = useIsLabelTruncated(hasEllipsis);

	const title = (
		<span
			ref={titleRef}
			id={id}
			data-slot="card-title"
			data-truncated={isTruncated || undefined}
			data-testid={partTestId(testId, 'title')}
			className={styles['card__title']}
		>
			{children}
		</span>
	);

	if (!hasEllipsis) {
		return title;
	}

	return (
		<TooltipAnchor
			content={isTruncated ? children : null}
			contentProps={{ className: styles['card__tooltip'] }}
		>
			{title}
		</TooltipAnchor>
	);
}
