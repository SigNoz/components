import { Button as BaseUiButton } from '@base-ui/react/button';
import { ChevronLeft, ChevronRight } from '@signozhq/icons';
import type { ReactNode, RefObject } from 'react';
import styles from '../pagination.module.scss';
import { PaginationControlTooltip } from './pagination-control-tooltip.js';

/**
 * @access private
 */
export type PaginationArrowProps = {
	direction: 'previous' | 'next';
	/**
	 * The end of the range: nothing to go to, so the arrow is disabled. It shows no tooltip unless
	 * `blocked` is true too.
	 */
	atEnd: boolean;
	/**
	 * `disabled` on the pagination: the arrow stays focusable and shows `disabledTooltip`.
	 */
	blocked: boolean;
	disabledTooltip: ReactNode;
	testId: string | undefined;
	buttonRef: RefObject<HTMLButtonElement>;
	onPress: () => void;
};

/**
 * @access private
 */
export function PaginationArrow({
	direction,
	atEnd,
	blocked,
	disabledTooltip,
	testId,
	buttonRef,
	onPress,
}: PaginationArrowProps): ReactNode {
	const Icon = direction === 'previous' ? ChevronLeft : ChevronRight;

	return (
		<PaginationControlTooltip disabledTooltip={disabledTooltip} active={blocked}>
			<BaseUiButton
				ref={buttonRef}
				data-slot={`pagination-${direction}`}
				aria-label={direction === 'previous' ? 'Previous page' : 'Next page'}
				disabled={atEnd || blocked}
				focusableWhenDisabled={blocked}
				className={styles['pagination__arrow']}
				onClick={onPress}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			>
				<Icon size={16} />
			</BaseUiButton>
		</PaginationControlTooltip>
	);
}
