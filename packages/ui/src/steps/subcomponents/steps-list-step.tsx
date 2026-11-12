import type { ReactNode } from 'react';
import { isBlankText } from '../../lib/blank-text.js';
import { partTestId } from '../../lib/utils.js';
import styles from '../steps.module.scss';
import type { StepsListItem } from '../types.js';

/**
 * @access private
 */
export type StepsListStepProps = {
	item: StepsListItem;
	/** The step number, from 1. */
	step: number;
	isLast: boolean;
	testId: string | undefined;
};

/**
 * One step of `Steps.List`: the marker and the line down to the next marker, then the label and
 * the content of the step.
 *
 * @access private
 */
export function StepsListStep({ item, step, isLast, testId }: StepsListStepProps): ReactNode {
	const itemTestId = partTestId(testId, `item-${step}`);

	return (
		<li data-slot="steps-list-item" className={styles['steps-list__item']} data-testid={itemTestId}>
			<span className={styles['steps-list__rail']}>
				<span
					aria-hidden="true"
					data-slot="steps-list-marker"
					className={styles['steps-list__marker']}
					data-testid={partTestId(itemTestId, 'marker')}
				>
					{step}
				</span>
				{!isLast && (
					<span
						aria-hidden="true"
						data-slot="steps-list-connector"
						className={styles['steps-list__connector']}
					/>
				)}
			</span>
			<div className={styles['steps-list__body']}>
				{!isBlankText(item.label) && (
					<div
						data-slot="steps-list-label"
						className={styles['steps-list__label']}
						data-testid={partTestId(itemTestId, 'label')}
					>
						{item.label}
					</div>
				)}
				<div
					data-slot="steps-list-content"
					className={styles['steps-list__content']}
					data-testid={partTestId(itemTestId, 'content')}
				>
					{item.children}
				</div>
			</div>
		</li>
	);
}
