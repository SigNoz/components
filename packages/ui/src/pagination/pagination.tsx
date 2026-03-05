import './index.css';
import { ChevronLeft, ChevronRight, Minus } from '@signozhq/icons';
import type * as React from 'react';
import { type MouseEvent, useEffect, useState } from 'react';
import { ButtonSize, type ButtonSizeValue, buttonVariants } from '../button/index.js';
import { cn } from '../lib/utils.js';
import styles from './pagination.module.css';
import { renderPageNumbers } from './utils.js';

// Define alignment options
type PaginationAlign = 'start' | 'center' | 'end';

function PaginationContainer({
	className,
	align = 'start',
	...props
}: React.ComponentProps<'nav'> & { align?: PaginationAlign }) {
	return (
		<nav
			aria-label="pagination"
			data-slot="pagination"
			data-align={align}
			className={cn(styles['pagination'], className)}
			{...props}
		/>
	);
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
	return (
		<ul
			data-slot="pagination-content"
			className={cn(styles['pagination__content'], className)}
			{...props}
		/>
	);
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
	return <li data-slot="pagination-item" className={styles['pagination__item']} {...props} />;
}

type PaginationLinkProps = {
	isActive?: boolean;
	size?: ButtonSizeValue;
	disabled?: boolean;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & Omit<React.ComponentProps<'button'>, 'onClick'>;

function PaginationLink({
	className,
	isActive,
	size = ButtonSize.Icon,
	disabled,
	children,
	...props
}: PaginationLinkProps) {
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled) {
			e.preventDefault();
		} else if (props.onClick) {
			props.onClick(e);
		}
	};

	return (
		<button
			aria-current={isActive ? 'page' : undefined}
			tabIndex={disabled ? -1 : undefined}
			data-slot="pagination-link"
			data-active={isActive}
			className={cn(
				buttonVariants({
					variant: isActive ? 'solid' : 'ghost',
					size,
				}),
				styles['pagination__link'],
				className
			)}
			onClick={handleClick}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	);
}

type PaginationNavProps = Omit<PaginationLinkProps, 'children' | 'isActive' | 'href' | 'size'> & {
	className?: string;
};

function PaginationPrevious({ className, disabled, ...props }: PaginationNavProps) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			size={ButtonSize.Icon}
			className={cn(className)}
			disabled={disabled}
			{...props}
		>
			<ChevronLeft className="w-full" size={16} />
		</PaginationLink>
	);
}

function PaginationNext({ className, disabled, ...props }: PaginationNavProps) {
	return (
		<PaginationLink
			aria-label="Go to next page"
			size={ButtonSize.Icon}
			className={cn(className)}
			disabled={disabled}
			{...props}
		>
			<ChevronRight className="w-full" size={16} />
		</PaginationLink>
	);
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
	return (
		<span
			aria-hidden
			data-slot="pagination-ellipsis"
			className={cn(styles['pagination__ellipsis'], className)}
			{...props}
		>
			<Minus height="100%" width={32} /> {/* for the time being */}
			<span className={styles['pagination__ellipsis-sr']}>More pages</span>
		</span>
	);
}

interface PaginationProps extends React.ComponentProps<typeof PaginationContainer> {
	total: number;
	pageSize?: number;
	current?: number;
	defaultCurrent?: number;
	onPageChange?: (page: number) => void;
	align?: PaginationAlign;
}

function Pagination({
	total,
	pageSize = 10,
	current: controlledCurrent,
	defaultCurrent = 1,
	onPageChange,
	className,
	align = 'start',
	...props
}: PaginationProps) {
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
		<PaginationContainer className={className} align={align} {...props}>
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

export default Pagination;
