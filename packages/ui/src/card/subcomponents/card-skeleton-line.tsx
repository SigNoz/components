import { Skeleton } from '../../skeleton/skeleton.js';
import styles from '../card.module.scss';

/**
 * @access private
 */
export type CardSkeletonLineProps = {
	/**
	 * `title` is as tall as a line of the title, `text` as a line of the description or the footer.
	 */
	line: 'title' | 'text';
	width: string;
};

/**
 * One bar of `Skeleton` in a box as tall as the line of text it stands for, so the header and the
 * footer keep their height when the data arrives.
 *
 * @access private
 */
export function CardSkeletonLine({ line, width }: CardSkeletonLineProps) {
	return (
		<div data-line={line} className={styles['card__skeleton-line']}>
			<Skeleton active title={{ width }} paragraph={false} />
		</div>
	);
}
