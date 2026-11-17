import { Check } from '@signozhq/icons';
import type { ReactNode } from 'react';
import { isBlankText } from '../../lib/blank-text.js';
import { cn, partTestId } from '../../lib/utils.js';
import { STEPS_DONE_TEXT, StepsStatus } from '../constants.js';
import styles from '../steps.module.scss';
import type { StepsItem, StepsStatusType } from '../types.js';
import { toStepLabel } from '../utils.js';
import { StepsText } from './steps-text.js';

/**
 * @access private
 */
export type StepsStepProps = {
	item: StepsItem;
	/** The step number, from 1. */
	step: number;
	status: StepsStatusType;
	isLast: boolean;
	/** True when a step of the row has a description, so this one keeps its line too. */
	reserveDescription: boolean;
	testId: string | undefined;
};

/**
 * One step of the row: the marker, the label and the description, then the line to the next
 * marker.
 *
 * @access private
 */
export function StepsStep({
	item,
	step,
	status,
	isLast,
	reserveDescription,
	testId,
}: StepsStepProps): ReactNode {
	const itemTestId = partTestId(testId, `item-${step}`);
	const isDone = status === StepsStatus.Done;
	const hasDescription = !isBlankText(item.description);

	return (
		<li
			data-slot="steps-item"
			data-status={status}
			aria-current={status === StepsStatus.Current ? 'step' : undefined}
			className={styles['steps__item']}
			data-testid={itemTestId}
		>
			<span
				aria-hidden="true"
				data-slot="steps-marker"
				className={styles['steps__marker']}
				data-testid={partTestId(itemTestId, 'marker')}
			>
				{isDone ? <Check className={styles['steps__done-mark']} /> : step}
			</span>
			<StepsText
				text={toStepLabel(item.label)}
				slot="steps-label"
				className={styles['steps__label']}
				testId={partTestId(itemTestId, 'label')}
			/>
			{isDone && <span className={styles['steps__hidden']}>{STEPS_DONE_TEXT}</span>}
			{hasDescription && (
				<StepsText
					text={item.description as string}
					slot="steps-description"
					className={styles['steps__description']}
					testId={partTestId(itemTestId, 'description')}
				/>
			)}
			{!hasDescription && reserveDescription && (
				<span
					aria-hidden="true"
					className={cn(styles['steps__description'], styles['steps__description-placeholder'])}
				>
					{'\u00a0'}
				</span>
			)}
			{!isLast && (
				<span
					aria-hidden="true"
					data-slot="steps-connector"
					className={styles['steps__connector']}
				/>
			)}
		</li>
	);
}
