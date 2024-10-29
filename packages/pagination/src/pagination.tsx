import './index.css';

import { type VariantProps } from 'class-variance-authority';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import React, { ComponentProps, MouseEvent, useEffect, useState } from 'react';

import { cn } from './lib/utils';
import PaginationDivider from '../assets/PaginationDivider';
import {
	PaginationContentProps,
	PaginationEllipsisProps,
	PaginationItemProps,
	PaginationLinkProps,
	PaginationNextProps,
	PaginationPreviousProps,
	PaginationProps,
} from './types';
import { paginationItemVariants, paginationWrapperVariants } from './variants';

interface PaginationWrapperProps
	extends ComponentProps<'nav'>,
		VariantProps<typeof paginationWrapperVariants> {
	className?: string;
}

// Base wrapper component for pagination
function PaginationWrapper({
	className,
	align,
	...props
}: PaginationWrapperProps) {
	return (
		<nav
			role="navigation"
			aria-label="pagination"
			className={cn(paginationWrapperVariants({ align }), className)}
			{...props}
		/>
	);
}

function PaginationContent({ className, ...props }: PaginationContentProps) {
	return (
		<ul
			className={cn('flex flex-row items-center gap-1', className)}
			{...props}
		/>
	);
}

function PaginationItem({ className, ...props }: PaginationItemProps) {
	return <li className={cn('', className)} {...props} />;
}

function PaginationLink({
	className,
	isActive,
	disabled,
	variant = 'link',
	...props
}: PaginationLinkProps) {
	return (
		<a
			aria-current={isActive ? 'page' : undefined}
			className={cn(
				paginationItemVariants({
					variant: isActive ? 'active' : variant,
					disabled,
				}),
				className,
			)}
			{...props}
		/>
	);
}

function PaginationPrevious({
	className,
	isDisabled,
	...props
}: PaginationPreviousProps) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			variant="nav"
			disabled={isDisabled}
			className={cn('gap-1 pl-2.5', className)}
			{...props}
		>
			<ChevronLeftIcon className="h-4 w-4" />
		</PaginationLink>
	);
}

function PaginationNext({
	className,
	isDisabled,
	...props
}: PaginationNextProps) {
	return (
		<PaginationLink
			aria-label="Go to next page"
			variant="nav"
			disabled={isDisabled}
			className={cn('gap-1 pr-2.5', className)}
			{...props}
		>
			<ChevronRightIcon className="h-4 w-4" />
		</PaginationLink>
	);
}

function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
	return (
		<span
			aria-hidden
			className={cn(paginationItemVariants({ variant: 'divider' }), className)}
			{...props}
		>
			<PaginationDivider />
			<span className="sr-only">More pages</span>
		</span>
	);
}

// Main pagination component with controlled/uncontrolled state handling
function Pagination({
	current: controlledCurrent,
	total,
	pageSize = 10,
	defaultCurrent = 1,
	onPageChange,
	className,
	align = 'start',
	...props
}: PaginationProps) {
	const totalPages = Math.ceil(total / pageSize);

	// Initialize with defaultCurrent only if controlledCurrent is undefined
	const [internalCurrent, setInternalCurrent] = useState(
		controlledCurrent ?? defaultCurrent,
	);

	// Only sync if component is controlled
	useEffect(() => {
		if (controlledCurrent !== undefined) {
			setInternalCurrent(controlledCurrent);
		}
	}, [controlledCurrent]);

	// Use controlled value if provided, otherwise use internal state
	const current = controlledCurrent ?? internalCurrent;

	// Generate page numbers with divider based on current position
	const renderPageNumbers = () => {
		const pages: (number | 'divider')[] = [];
		pages.push(1); // Always show first page

		if (current <= 3) {
			// Near start: show first 3 pages + divider + last
			for (let i = 2; i <= 3; i++) {
				if (i < totalPages) {
					pages.push(i);
				}
			}
			if (totalPages > 4) {
				pages.push('divider');
			}
		} else if (current > totalPages - 3) {
			// Near end: show first + divider + last 3 pages
			pages.push('divider');
			for (let i = totalPages - 2; i <= totalPages - 1; i++) {
				if (i > 1) {
					pages.push(i);
				}
			}
		} else {
			// In middle: show first + divider + current±1 + divider + last
			pages.push('divider');
			pages.push(current - 1);
			pages.push(current);
			pages.push(current + 1);
			if (current + 1 < totalPages - 1) {
				pages.push('divider');
			}
		}

		// Always show last page if more than one page
		if (totalPages > 1 && !pages.includes(totalPages)) {
			pages.push(totalPages);
		}

		return Array.from(new Set(pages));
	};

	// Handle page change with validation
	const handlePageChange = (e: MouseEvent<HTMLAnchorElement>, page: number) => {
		if (page >= 1 && page <= totalPages && page !== current) {
			e.preventDefault();
			if (onPageChange) {
				onPageChange(page);
			} else {
				setInternalCurrent(page);
			}
		}
	};

	// Don't render if only one page
	if (totalPages <= 1) {
		return null;
	}

	return (
		<PaginationWrapper className={className} align={align} {...props}>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={(e) => handlePageChange(e, current - 1)}
						tabIndex={current === 1 ? -1 : 0}
						aria-disabled={current === 1}
						isDisabled={current === 1}
					/>
				</PaginationItem>
				{renderPageNumbers().map((page, idx) => (
					<PaginationItem key={page === 'divider' ? `divider-${idx}` : page}>
						{page === 'divider' ? (
							<PaginationDivider />
						) : (
							<PaginationLink
								href="#"
								onClick={(e) => handlePageChange(e, page)}
								isActive={page === current}
							>
								{page}
							</PaginationLink>
						)}
					</PaginationItem>
				))}
				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={(e) => handlePageChange(e, current + 1)}
						tabIndex={current === totalPages ? -1 : 0}
						aria-disabled={current === totalPages}
						isDisabled={current === totalPages}
					/>
				</PaginationItem>
			</PaginationContent>
		</PaginationWrapper>
	);
}

export {
	PaginationWrapper,
	Pagination,
	PaginationContent,
	PaginationLink,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
};
