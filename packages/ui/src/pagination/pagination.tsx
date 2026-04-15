import { ChevronLeft, ChevronRight, Minus } from '@signozhq/icons';
import * as React from 'react';
import { type MouseEvent, useEffect, useState } from 'react';
import { Button, type ButtonProps, ButtonSize } from '../button/index.js';
import { cn } from '../lib/utils.js';
import styles from './pagination.module.scss';
import { renderPageNumbers } from './utils.js';

export type PaginationAlign = 'start' | 'center' | 'end';

export type PaginationContainerProps = Pick<
	React.ComponentPropsWithoutRef<'nav'>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * The alignment of the pagination container.
	 * @default 'start'
	 */
	align?: PaginationAlign;
	/**
	 * The test ID to apply to the pagination container.
	 */
	testId?: string;
};

/**
 * Root component for building custom pagination layouts. Compose it with
 * `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`,
 * `PaginationNext` and `PaginationEllipsis`. For most use cases, prefer the
 * all-in-one `Pagination` component instead.
 *
 * @example
 * ```tsx
 * const [current, setCurrent] = React.useState(1);
 * const totalPages = 10;
 *
 * return (
 *   <PaginationContainer align="center">
 *     <PaginationContent>
 *       <PaginationItem>
 *         <PaginationPrevious
 *           onClick={() => setCurrent((p) => Math.max(1, p - 1))}
 *           disabled={current === 1}
 *         />
 *       </PaginationItem>
 *       <PaginationItem>
 *         <PaginationLink
 *           isActive
 *           onClick={() => setCurrent(1)}
 *         >
 *           1
 *         </PaginationLink>
 *       </PaginationItem>
 *       <PaginationItem>
 *         <PaginationNext
 *           onClick={() => setCurrent((p) => Math.min(totalPages, p + 1))}
 *           disabled={current === totalPages}
 *         />
 *       </PaginationItem>
 *     </PaginationContent>
 *   </PaginationContainer>
 * );
 * ```
 */
export const PaginationContainer = React.forwardRef<HTMLElement, PaginationContainerProps>(
	({ className, testId, align = 'start', ...props }, ref) => {
		return (
			<nav
				ref={ref}
				data-testid={testId}
				aria-label="pagination"
				data-slot="pagination"
				data-align={align}
				className={cn(styles['pagination-root'], className)}
				{...props}
			/>
		);
	}
);

export type PaginationContentProps = Pick<
	React.ComponentPropsWithoutRef<'ul'>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * The test ID to apply to the pagination content.
	 */
	testId?: string;
};

/**
 * Wrapper for the list of pagination items. Use inside `PaginationContainer`.
 */
export const PaginationContent = React.forwardRef<HTMLUListElement, PaginationContentProps>(
	({ className, testId, ...props }, ref) => {
		return (
			<ul
				ref={ref}
				data-testid={testId}
				data-slot="pagination-content"
				className={cn(styles['pagination-content'], className)}
				{...props}
			/>
		);
	}
);

export type PaginationItemProps = Pick<
	React.ComponentPropsWithoutRef<'li'>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * The test ID to apply to the pagination item.
	 */
	testId?: string;
};

/**
 * Wraps each pagination control (link, previous/next button, or ellipsis).
 * Use inside `PaginationContent`.
 */
export const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
	({ className, testId, ...props }, ref) => {
		return (
			<li
				ref={ref}
				data-testid={testId}
				data-slot="pagination-item"
				className={cn(styles['pagination-item'], className)}
				{...props}
			/>
		);
	}
);

export type PaginationLinkProps = {
	/**
	 * If the link is active, the button will be styled as a solid button.
	 * If the link is not active, the button will be styled as a ghost button.
	 */
	isActive?: boolean;
} & ButtonProps;

/**
 * Button for a specific page number. Set `isActive` when it represents the
 * current page. Accepts all `Button` props.
 */
export const PaginationLink = React.forwardRef<HTMLButtonElement, PaginationLinkProps>(
	({ className, testId, isActive, size = ButtonSize.Icon, disabled, children, ...props }, ref) => {
		return (
			<Button
				ref={ref}
				data-testid={testId}
				aria-current={isActive ? 'page' : undefined}
				tabIndex={disabled ? -1 : undefined}
				data-slot="pagination-link"
				variant={isActive ? 'solid' : 'ghost'}
				color={isActive ? 'primary' : 'none'}
				size={size}
				className={styles['pagination-link']}
				disabled={disabled}
				{...props}
			>
				{children}
			</Button>
		);
	}
);

export type PaginationNavProps = Omit<PaginationLinkProps, 'children' | 'isActive'>;

/**
 * Button to navigate to the previous page. Disable when on the first page.
 */
export const PaginationPrevious = React.forwardRef<HTMLButtonElement, PaginationNavProps>(
	({ className, testId, disabled, size = 'icon', ...props }, ref) => {
		return (
			<PaginationLink
				ref={ref}
				data-testid={testId}
				aria-label="Go to previous page"
				size={size}
				className={cn(className)}
				disabled={disabled}
				{...props}
			>
				<ChevronLeft className={styles['pagination-nav-icon']} size={16} />
			</PaginationLink>
		);
	}
);

/**
 * Button to navigate to the next page. Disable when on the last page.
 */
export const PaginationNext = React.forwardRef<HTMLButtonElement, PaginationNavProps>(
	({ className, testId, disabled, size, ...props }, ref) => {
		return (
			<PaginationLink
				ref={ref}
				data-testid={testId}
				aria-label="Go to next page"
				size={size}
				className={cn(className)}
				disabled={disabled}
				{...props}
			>
				<ChevronRight className={styles['pagination-nav-icon']} size={16} />
			</PaginationLink>
		);
	}
);

export type PaginationEllipsisProps = Pick<
	React.ComponentPropsWithoutRef<'span'>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * The test ID to apply to the pagination ellipsis.
	 */
	testId?: string;
};

/**
 * Placeholder for omitted page numbers when there are many pages.
 * Renders a visual indicator (e.g. "...") between page links.
 */
export const PaginationEllipsis = React.forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
	({ className, testId, ...props }, ref) => {
		return (
			<span
				ref={ref}
				data-testid={testId}
				aria-hidden
				data-slot="pagination-ellipsis"
				className={cn(styles['pagination-ellipsis'], className)}
				{...props}
			>
				<Minus height="100%" width={32} /> {/* for the time being */}
				<span className={styles['pagination-sr-only']}>More pages</span>
			</span>
		);
	}
);

export type PaginationProps = PaginationContainerProps & {
	/**
	 * The total number of items.
	 */
	total: number;
	/**
	 * The number of items per page.
	 * @default 10
	 */
	pageSize?: number;
	/**
	 * The current page.
	 */
	current?: number;
	/**
	 * The default current page.
	 * @default 1
	 */
	defaultCurrent?: number;
	/**
	 * The function to call when the page changes.
	 */
	onPageChange?: (page: number) => void;
};

/**
 * All-in-one pagination component that renders previous/next buttons and page
 * numbers. Use when you need standard pagination with minimal setup.
 *
 * @example
 * ```tsx
 * // Uncontrolled pagination
 * <Pagination total={100} pageSize={10} defaultCurrent={1} />
 * ```
 *
 * @example
 * ```tsx
 * // Controlled pagination
 * const [current, setCurrent] = React.useState(1);
 *
 * return (
 *   <Pagination
 *     total={100}
 *     pageSize={10}
 *     current={current}
 *     onPageChange={setCurrent}
 *   />
 * );
 * ```
 *
 * @example
 * ```tsx
 * // When you don't need to control the current page, use PaginationUrl instead
 * <PaginationUrl
 *   urlKey="page"
 *   total={100}
 *   pageSize={10}
 * />
 * ```
 */
export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
	(
		{
			total,
			pageSize = 10,
			current: controlledCurrent,
			defaultCurrent = 1,
			onPageChange,
			className,
			align = 'start',
			testId,
			...props
		},
		ref
	) => {
		const totalPages = Math.ceil(total / pageSize);

		const [internalCurrent, setInternalCurrent] = useState(controlledCurrent ?? defaultCurrent);

		useEffect(() => {
			if (controlledCurrent !== undefined) {
				setInternalCurrent(controlledCurrent);
			}
		}, [controlledCurrent]);

		const current = controlledCurrent ?? internalCurrent;

		const handlePageChange = (e: MouseEvent<HTMLButtonElement>, page: number) => {
			e.preventDefault();
			if (page < 1 || page > totalPages || page === current) {
				return;
			}

			if (onPageChange) {
				onPageChange(page);
			} else {
				setInternalCurrent(page);
			}
		};

		const pageNumbers = renderPageNumbers(totalPages, current);

		if (totalPages <= 1) {
			return null;
		}

		return (
			<PaginationContainer ref={ref} className={className} align={align} testId={testId} {...props}>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={(e) => handlePageChange(e, current - 1)}
							disabled={current === 1}
						/>
					</PaginationItem>

					{pageNumbers.map((page, idx) => (
						<PaginationItem key={page === 'ellipsis' ? `ellipsis-${idx}` : page}>
							{page === 'ellipsis' ? (
								<PaginationEllipsis />
							) : (
								<PaginationLink
									onClick={(e) => handlePageChange(e, page)}
									isActive={page === current}
									key={page}
								>
									{page}
								</PaginationLink>
							)}
						</PaginationItem>
					))}

					<PaginationItem>
						<PaginationNext
							onClick={(e) => handlePageChange(e, current + 1)}
							disabled={current === totalPages}
						/>
					</PaginationItem>
				</PaginationContent>
			</PaginationContainer>
		);
	}
);
