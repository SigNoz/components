import './index.css';
import * as React from 'react';
import { useState, useEffect, MouseEvent } from 'react';
import { ChevronLeft, ChevronRight, PaginationDivider } from '@signozhq/icons';

import { cn } from './lib/utils';
import { buttonVariants } from '../../button/src/button';
import type { ButtonSize } from '../../button/src/button';
import { renderPageNumbers } from './utils';

// Define alignment options
type PaginationAlign = 'start' | 'center' | 'end';

function PaginationContainer({
	className,
	align = 'start',
	...props
}: React.ComponentProps<'nav'> & { align?: PaginationAlign }) {
	return (
		<nav
			role="navigation"
			aria-label="pagination"
			data-slot="pagination"
			className={cn(
				'flex',
				{
					'justify-start': align === 'start',
					'justify-center': align === 'center',
					'justify-end': align === 'end',
				},
				className,
			)}
			{...props}
		/>
	);
}

function PaginationContent({
	className,
	...props
}: React.ComponentProps<'ul'>) {
	return (
		<ul
			data-slot="pagination-content"
			className={cn('flex flex-row items-center gap-2.5', className)}
			{...props}
		/>
	);
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
	return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
	isActive?: boolean;
	size?: ButtonSize;
	disabled?: boolean;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & Omit<React.ComponentProps<'button'>, 'onClick'>;

function PaginationLink({
	className,
	isActive,
	size = 'icon',
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
			className={cn(
				buttonVariants({
					variant: isActive ? 'solid' : 'ghost',
					size,
				}),
				'm-0 hover:bg-secondary hover:text-secondary-foreground cursor-pointer',
				isActive &&
					'bg-primary  text-primary-foreground hover:bg-primary hover:text-primary-foreground',
				className,
			)}
			onClick={handleClick}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	);
}

type PaginationNavProps = Omit<
	PaginationLinkProps,
	'children' | 'isActive' | 'href' | 'size'
> & {
	className?: string;
};

function PaginationPrevious({
	className,
	disabled,
	...props
}: PaginationNavProps) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			size="icon"
			className={cn(className)}
			disabled={disabled}
			{...props}
		>
			<ChevronLeft size={16} />
		</PaginationLink>
	);
}

function PaginationNext({ className, disabled, ...props }: PaginationNavProps) {
	return (
		<PaginationLink
			aria-label="Go to next page"
			size="icon"
			className={cn(className)}
			disabled={disabled}
			{...props}
		>
			<ChevronRight size={16} />
		</PaginationLink>
	);
}

function PaginationEllipsis({
	className,
	...props
}: React.ComponentProps<'span'>) {
	return (
		<span
			aria-hidden
			data-slot="pagination-ellipsis"
			className={cn('flex h-9 w-9 items-center justify-center', className)}
			{...props}
		>
			<PaginationDivider
				height={1}
				width={32}
				viewBox="0 0 32 1"
				className="text-inherit"
			/>
			<span className="sr-only">More pages</span>
		</span>
	);
}

interface PaginationProps
	extends React.ComponentProps<typeof PaginationContainer> {
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

	const [internalCurrent, setInternalCurrent] = useState(
		controlledCurrent ?? defaultCurrent,
	);

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
