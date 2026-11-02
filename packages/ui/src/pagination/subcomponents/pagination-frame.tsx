import {
	type AriaAttributes,
	type CSSProperties,
	forwardRef,
	type ReactNode,
	useMemo,
	useRef,
} from 'react';
import { mergeRefs } from '../../lib/merge-refs.js';
import { partTestId } from '../../lib/utils.js';
import { PAGINATION_DEFAULT_LABEL } from '../constants.js';
import styles from '../pagination.module.scss';
import type { PaginationAlign, PaginationPageSizePosition, PaginationVariant } from '../types.js';
import { usePaginationFocus } from '../use-pagination-focus.js';
import { digitsOf, type PaginationResolvedPageSizeOption } from '../utils.js';
import { PaginationCompactControls } from './pagination-compact-controls.js';
import { PaginationPageList } from './pagination-page-list.js';
import { PaginationPageSize } from './pagination-page-size.js';
import { PaginationPositionLabel } from './pagination-position-label.js';

/**
 * The `id`, `aria-*` and `data-*` of the consumer, forwarded to the `nav`.
 *
 * @access private
 */
export type PaginationRootAttributes = Omit<AriaAttributes, 'aria-label'> & {
	id?: string;
	[key: `data-${string}`]: unknown;
};

/**
 * @access private
 */
export type PaginationFrameProps = {
	rootProps: PaginationRootAttributes;
	ariaLabel: string | undefined;
	testId: string | undefined;
	variant: PaginationVariant;
	align: PaginationAlign;
	disabled: boolean;
	disabledTooltip: ReactNode;
	page: number;
	/**
	 * `null` for a list that does not know its last page.
	 */
	pageCount: number | null;
	hasNext: boolean;
	showTotal: boolean;
	totalText: string;
	totalSizerText: string;
	enablePageSize: boolean;
	pageSize: number;
	pageSizeOptions: PaginationResolvedPageSizeOption[];
	pageSizeLabel: string;
	pageSizePosition: PaginationPageSizePosition;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
};

/**
 * The bar shared by `Pagination` and `Pagination.Cursor`: the `nav`, the position label, the page
 * controls and the page size selector.
 *
 * @access private
 */
export const PaginationFrame = forwardRef<HTMLElement, PaginationFrameProps>(
	function PaginationFrame(
		{
			rootProps,
			ariaLabel,
			testId,
			variant,
			align,
			disabled,
			disabledTooltip,
			page,
			pageCount,
			hasNext,
			showTotal,
			totalText,
			totalSizerText,
			enablePageSize,
			pageSize,
			pageSizeOptions,
			pageSizeLabel,
			pageSizePosition,
			onPageChange,
			onPageSizeChange,
		},
		ref,
	) {
		const rootRef = useRef<HTMLElement | null>(null);
		const mergedRef = useMemo(() => mergeRefs(ref, rootRef), [ref]);
		const hasPrevious = page > 1;

		const { previousRef, nextRef, registerPage, follow } = usePaginationFocus({
			root: rootRef,
			variant,
			page,
			hasPrevious,
			hasNext,
			disabled,
		});

		function selectPage(next: number): void {
			if (disabled || next === page || next < 1) {
				return;
			}

			follow('page', next);
			onPageChange(next);
		}

		function goPrevious(): void {
			if (disabled || !hasPrevious) {
				return;
			}

			follow('previous', page - 1);
			onPageChange(page - 1);
		}

		function goNext(): void {
			if (disabled || !hasNext) {
				return;
			}

			follow('next', page + 1);
			onPageChange(page + 1);
		}

		const style = (
			pageCount === null ? undefined : { '--pagination-internal-digits': digitsOf(pageCount) }
		) as CSSProperties | undefined;

		const selector = enablePageSize ? (
			<PaginationPageSize
				label={pageSizeLabel}
				pageSize={pageSize}
				options={pageSizeOptions}
				disabled={disabled}
				disabledTooltip={disabledTooltip}
				testId={testId}
				onChange={onPageSizeChange}
			/>
		) : null;

		return (
			<nav
				{...rootProps}
				ref={mergedRef}
				aria-label={ariaLabel ?? PAGINATION_DEFAULT_LABEL}
				data-slot="pagination"
				data-variant={variant}
				data-align={align}
				data-disabled={disabled || undefined}
				className={styles['pagination']}
				style={style}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			>
				{showTotal ? (
					<PaginationPositionLabel
						text={totalText}
						sizerText={totalSizerText}
						testId={partTestId(testId, 'total')}
					/>
				) : null}
				<div className={styles['pagination__controls']}>
					{pageSizePosition === 'start' ? selector : null}
					{variant === 'numbered' && pageCount !== null ? (
						<PaginationPageList
							page={page}
							pageCount={pageCount}
							hasPrevious={hasPrevious}
							hasNext={hasNext}
							disabled={disabled}
							disabledTooltip={disabledTooltip}
							testId={testId}
							previousRef={previousRef}
							nextRef={nextRef}
							registerPage={registerPage}
							onSelectPage={selectPage}
							onPrevious={goPrevious}
							onNext={goNext}
						/>
					) : (
						<PaginationCompactControls
							hasPrevious={hasPrevious}
							hasNext={hasNext}
							disabled={disabled}
							disabledTooltip={disabledTooltip}
							testId={testId}
							previousRef={previousRef}
							nextRef={nextRef}
							onPrevious={goPrevious}
							onNext={goNext}
						/>
					)}
					{pageSizePosition === 'start' ? null : selector}
				</div>
			</nav>
		);
	},
);
