import './index.css';
import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontalIcon } from 'lucide-react';

import { cn } from './lib/utils';
import { buttonVariants } from '@signozhq/button';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
	return (
		<nav
			role="navigation"
			aria-label="pagination"
			data-slot="pagination"
			className={cn('mx-auto flex w-full justify-center', className)}
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
} & React.ComponentProps<'a'>;

function PaginationLink({
	className,
	isActive,
	children,
	...props
}: PaginationLinkProps) {
	return (
		<a
			aria-current={isActive ? 'page' : undefined}
			data-slot="pagination-link"
			data-active={isActive}
			className={cn(
				buttonVariants({
					variant: isActive ? 'solid' : 'ghost',
				}),
				'm-0 hover:bg-secondary hover:text-secondary-foreground cursor-pointer',
				isActive &&
					'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
				className,
			)}
			{...props}
		>
			{children}
		</a>
	);
}

type PaginationNavProps = Omit<
	PaginationLinkProps,
	'children' | 'isActive' | 'href'
> & {
	className?: string;
};

function PaginationPrevious({ className, ...props }: PaginationNavProps) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			className={cn(className)}
			{...props}
		>
			<ChevronLeft size={16} />
		</PaginationLink>
	);
}

function PaginationNext({ className, ...props }: PaginationNavProps) {
	return (
		<PaginationLink
			aria-label="Go to next page"
			className={cn(className)}
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
			className={cn('flex size-6 items-center justify-center', className)}
			{...props}
		>
			<MoreHorizontalIcon className="size-4" />
			<span className="sr-only">More pages</span>
		</span>
	);
}

export {
	Pagination,
	PaginationContent,
	PaginationLink,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
};
