import './index.css';
import * as React from 'react';

import { cn } from './lib/utils';

type TableProps = React.ComponentProps<'table'> & {
	fixedHeight?: string | number;
	containerRef?: React.Ref<HTMLDivElement>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

function Table({
	className,
	fixedHeight,
	containerRef,
	containerProps,
	...props
}: TableProps) {
	return (
		<div
			ref={containerRef}
			data-slot="table-container"
			className={cn(
				'relative w-full overflow-x-auto',
				fixedHeight &&
					'overflow-y-auto table-scroll-container sticky-header-table-container',
				containerProps?.className,
			)}
			style={
				fixedHeight
					? {
							height:
								typeof fixedHeight === 'number' ? `${fixedHeight}px` : fixedHeight,
						}
					: undefined
			}
			onScroll={containerProps?.onScroll}
			role={containerProps?.role}
			aria-label={containerProps?.['aria-label']}
			tabIndex={containerProps?.tabIndex}
			onKeyDown={containerProps?.onKeyDown}
		>
			<table
				data-slot="table"
				className={cn(
					'w-full caption-bottom text-sm',
					fixedHeight && 'sticky-header-table',
					className,
				)}
				{...props}
			/>
		</div>
	);
}

function TableHeader({
	className,
	sticky,
	...props
}: React.ComponentProps<'thead'> & { sticky?: boolean }) {
	return (
		<thead
			data-slot="table-header"
			className={cn(
				'[&_tr]:border-b z-10 bg-[#1f2937] text-white',
				sticky && 'sticky-header',
				className,
			)}
			{...props}
		/>
	);
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
	return (
		<tbody
			data-slot="table-body"
			className={cn('[&_tr:last-child]:border-0', className)}
			{...props}
		/>
	);
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn(
				'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
				className,
			)}
			{...props}
		/>
	);
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
	return (
		<tr
			data-slot="table-row"
			className={cn(
				'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
				className,
			)}
			{...props}
		/>
	);
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
	return (
		<th
			data-slot="table-head"
			className={cn(
				'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
				className,
			)}
			{...props}
		/>
	);
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
	return (
		<td
			data-slot="table-cell"
			className={cn(
				'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
				className,
			)}
			{...props}
		/>
	);
}

function TableCaption({
	className,
	...props
}: React.ComponentProps<'caption'>) {
	return (
		<caption
			data-slot="table-caption"
			className={cn('text-muted-foreground mt-4 text-sm', className)}
			{...props}
		/>
	);
}

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
};
