import './index.css';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from './lib/utils';
import { Tooltip, TooltipProvider } from '@signozhq/tooltip';

function Breadcrumb({ ...props }: React.ComponentProps<'nav'>) {
	return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
	return (
		<TooltipProvider>
			<ol
				data-slot="breadcrumb-list"
				className={cn(
					'text-muted-foreground flex flex-wrap items-center gap-2 text-sm break-words',
					className,
				)}
				{...props}
			/>{' '}
		</TooltipProvider>
	);
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
	return (
		<li
			data-slot="breadcrumb-item"
			className={cn(
				'inline-flex items-center gap-2 text-slate-50 dark:text-vanilla-100  font-inter text-sm font-normal leading-5 tracking-[-0.14px] px-0.5 rounded-sm hover:dark:text-vanilla-100 hover:text-ink-500 hover:bg-[#3E44631A] dark:hover:bg-white/10 hover:rounded-xs',
				className,
			)}
			{...props}
		/>
	);
}

function BreadcrumbLink({
	asChild,
	className,
	children,
	...props
}: React.ComponentProps<'a'> & {
	asChild?: boolean;
}) {
	const Comp = asChild ? Slot : 'a';

	// Truncate text if it's longer than 24 characters
	const truncatedChildren =
		typeof children === 'string' && children.length > 24
			? `${children.slice(0, 12)}...${children.slice(-9)}`
			: children;

	console.log(truncatedChildren);

	return (
		<Comp
			data-slot="breadcrumb-link"
			className={cn(' transition-colors ', className)}
			{...props}
		>
			<div className="text-slate-50 dark:text-vanilla-400 hover:text-ink-500 dark:hover:text-vanilla-100 text-sm leading-5">
				{truncatedChildren !== children ? (
					<Tooltip title={children}>
						<span>{truncatedChildren}</span>
					</Tooltip>
				) : (
					children
				)}
			</div>
		</Comp>
	);
}

function BreadcrumbPage({
	className,
	children,
	...props
}: React.ComponentProps<'span'>) {
	// Truncate text if it's longer than 24 characters
	const truncatedChildren =
		typeof children === 'string' && children.length > 24
			? `${children.slice(0, 12)}...${children.slice(-9)}`
			: children;

	return (
		<span
			data-slot="breadcrumb-page"
			role="link"
			aria-disabled="true"
			aria-current="page"
			className={cn(
				'text-ink-500 dark:text-vanilla-100 font-normal leading-5 tracking-[-0.14px] cursor-default',
				className,
			)}
			{...props}
		>
			{truncatedChildren}
		</span>
	);
}

function BreadcrumbSeparator({
	children,
	className,
	isLast,
	...props
}: React.ComponentProps<'li'> & { isLast?: boolean }) {
	return (
		<li
			data-slot="breadcrumb-separator"
			role="presentation"
			aria-hidden="true"
			className={cn(
				'text-sm leading-5',
				isLast
					? 'text-ink-500 dark:text-vanilla-100'
					: 'text-slate-50 dark:text-vanilla-400 ',
				className,
			)}
			{...props}
		>
			{children ?? '/'}
		</li>
	);
}

function BreadcrumbEllipsis({
	className,
	...props
}: React.ComponentProps<'span'>) {
	return (
		<span
			data-slot="breadcrumb-ellipsis"
			role="presentation"
			aria-hidden="true"
			className={cn(' text-sm leading-5', className)}
			{...props}
		>
			...
			<span className="sr-only">More</span>
		</span>
	);
}

export {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbEllipsis,
};
