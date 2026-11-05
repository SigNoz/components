import { Button as BaseUiButton } from '@base-ui/react/button';
import type { ReactNode } from 'react';
import styles from '../pagination.module.scss';
import { PaginationControlTooltip } from './pagination-control-tooltip.js';

/**
 * @access private
 */
export type PaginationPageButtonProps = {
	page: number;
	current: boolean;
	disabled: boolean;
	disabledTooltip: ReactNode;
	testId: string | undefined;
	onSelect: (page: number) => void;
	registerPage: (page: number, node: HTMLElement | null) => void;
};

/**
 * @access private
 */
export function PaginationPageButton({
	page,
	current,
	disabled,
	disabledTooltip,
	testId,
	onSelect,
	registerPage,
}: PaginationPageButtonProps): ReactNode {
	return (
		<PaginationControlTooltip disabledTooltip={disabledTooltip} active={disabled}>
			<BaseUiButton
				ref={(node) => registerPage(page, node)}
				data-slot="pagination-page"
				data-current={current || undefined}
				aria-label={`Page ${page}`}
				aria-current={current ? 'page' : undefined}
				disabled={disabled}
				focusableWhenDisabled
				className={styles['pagination__page']}
				onClick={() => onSelect(page)}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			>
				{page}
			</BaseUiButton>
		</PaginationControlTooltip>
	);
}
