import { ArrowLeft, ArrowRight } from '@signozhq/icons';
import type { ReactNode, RefObject } from 'react';
import { Button } from '../../button/button.js';
import { partTestId } from '../../lib/utils.js';
import styles from '../pagination.module.scss';

/**
 * @access private
 */
export type PaginationCompactControlsProps = {
	hasPrevious: boolean;
	hasNext: boolean;
	disabled: boolean;
	disabledTooltip: ReactNode;
	testId: string | undefined;
	previousRef: RefObject<HTMLButtonElement>;
	nextRef: RefObject<HTMLButtonElement>;
	onPrevious: () => void;
	onNext: () => void;
};

/**
 * @access private
 */
export function PaginationCompactControls({
	hasPrevious,
	hasNext,
	disabled,
	disabledTooltip,
	testId,
	previousRef,
	nextRef,
	onPrevious,
	onNext,
}: PaginationCompactControlsProps): ReactNode {
	return (
		<div className={styles['pagination__compact']}>
			<Button
				ref={previousRef}
				data-slot="pagination-previous"
				data-hidden={!hasPrevious || undefined}
				testId={partTestId(testId, 'previous')}
				variant="ghost"
				color="secondary"
				size="md"
				prefix={<ArrowLeft />}
				disabled={disabled}
				disabledTooltip={disabledTooltip}
				onClick={onPrevious}
			>
				Previous
			</Button>
			<span
				data-slot="pagination-divider"
				data-hidden={!hasPrevious || !hasNext || undefined}
				data-testid={partTestId(testId, 'divider')}
				aria-hidden="true"
				className={styles['pagination__divider']}
			/>
			<Button
				ref={nextRef}
				data-slot="pagination-next"
				data-hidden={!hasNext || undefined}
				testId={partTestId(testId, 'next')}
				variant="ghost"
				color="secondary"
				size="md"
				suffix={<ArrowRight />}
				disabled={disabled}
				disabledTooltip={disabledTooltip}
				onClick={onNext}
			>
				Next
			</Button>
		</div>
	);
}
