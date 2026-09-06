import { Fragment, type ReactNode } from 'react';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../tooltip-content-stack-context.js';
import styles from '../tooltip.module.scss';

/**
 * @access private
 */
export type TooltipStackProps = {
	items: TooltipContentStackEntry[];
};

/**
 * @access private
 */
export function TooltipStack({ items }: TooltipStackProps): ReactNode {
	const filled = items.filter((item) => hasTooltipContent(item.content));

	if (filled.length === 0) {
		return null;
	}

	if (filled.length === 1) {
		return filled[0]?.content;
	}

	return (
		<div data-slot="tooltip-stack" className={styles['tooltip__stack']}>
			{filled.map((item, index) => (
				<Fragment key={item.id}>
					{index > 0 && (
						<div
							data-slot="tooltip-divider"
							aria-hidden="true"
							className={styles['tooltip__divider']}
						/>
					)}
					{item.content}
				</Fragment>
			))}
		</div>
	);
}
