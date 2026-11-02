import type { ReactNode, RefObject } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../pagination.module.scss';
import { getPageSlots } from '../utils.js';
import { PaginationArrow } from './pagination-arrow.js';
import { PaginationPageButton } from './pagination-page-button.js';
import { PaginationSeparator } from './pagination-separator.js';

/**
 * @access private
 */
export type PaginationPageListProps = {
	page: number;
	pageCount: number;
	hasPrevious: boolean;
	hasNext: boolean;
	disabled: boolean;
	disabledTooltip: ReactNode;
	testId: string | undefined;
	previousRef: RefObject<HTMLButtonElement>;
	nextRef: RefObject<HTMLButtonElement>;
	registerPage: (page: number, node: HTMLElement | null) => void;
	onSelectPage: (page: number) => void;
	onPrevious: () => void;
	onNext: () => void;
};

/**
 * @access private
 */
export function PaginationPageList({
	page,
	pageCount,
	hasPrevious,
	hasNext,
	disabled,
	disabledTooltip,
	testId,
	previousRef,
	nextRef,
	registerPage,
	onSelectPage,
	onPrevious,
	onNext,
}: PaginationPageListProps): ReactNode {
	const slots = getPageSlots(pageCount, page);

	return (
		<div className={styles['pagination__pages']}>
			<PaginationArrow
				direction="previous"
				atEnd={!hasPrevious}
				blocked={disabled}
				disabledTooltip={disabledTooltip}
				testId={partTestId(testId, 'previous')}
				buttonRef={previousRef}
				onPress={onPrevious}
			/>
			{slots.map((slot) =>
				slot.type === 'page' ? (
					<PaginationPageButton
						key={`page-${slot.page}`}
						page={slot.page}
						current={slot.page === page}
						disabled={disabled}
						disabledTooltip={disabledTooltip}
						testId={partTestId(testId, `page-${slot.page}`)}
						onSelect={onSelectPage}
						registerPage={registerPage}
					/>
				) : (
					<PaginationSeparator
						key={`separator-${slot.position}`}
						testId={partTestId(testId, `separator-${slot.position}`)}
					/>
				),
			)}
			<PaginationArrow
				direction="next"
				atEnd={!hasNext}
				blocked={disabled}
				disabledTooltip={disabledTooltip}
				testId={partTestId(testId, 'next')}
				buttonRef={nextRef}
				onPress={onNext}
			/>
		</div>
	);
}
