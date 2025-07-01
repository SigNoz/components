import './index.css';
import * as React from 'react';
import { cn } from './lib/utils';
import { TooltipProvider } from '@signozhq/tooltip';

// Types for the new items-based API
export interface BreadcrumbItemType {
	title: React.ReactNode;
	href?: string;
	onClick?: (e: React.MouseEvent) => void;
	className?: string;
}

export interface BreadcrumbProps extends React.ComponentProps<'nav'> {
	items?: BreadcrumbItemType[];
	separator?: React.ReactNode;
	className?: string;
}

function Breadcrumb({
	items,
	separator = '/',
	className,
	...props
}: BreadcrumbProps) {
	if (items) {
		return (
			<nav
				aria-label="breadcrumb"
				data-slot="breadcrumb"
				className={className}
				{...props}
			>
				<BreadcrumbList>
					{items.map((item, index) => {
						const isLast = index === items.length - 1;

						return (
							<React.Fragment key={index}>
								<BreadcrumbItem>
									{isLast ? (
										<BreadcrumbPage>{item.title}</BreadcrumbPage>
									) : (
										<BreadcrumbLink href={item.href} onClick={item.onClick}>
											{item.title}
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
								{!isLast && (
									<BreadcrumbSeparator isLast={false}>{separator}</BreadcrumbSeparator>
								)}
							</React.Fragment>
						);
					})}
				</BreadcrumbList>
			</nav>
		);
	}

	// Fallback to the original verbose API
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
	className,
	children,
	...props
}: React.ComponentProps<'a'>) {
	// Truncate text if it's longer than 24 characters
	const truncatedChildren =
		typeof children === 'string' && children.length > 24
			? `${children.slice(0, 12)}...${children.slice(-9)}`
			: children;

	return (
		<a
			data-slot="breadcrumb-link"
			className={cn(' transition-colors ', className)}
			{...props}
		>
			<div className="text-slate-50 dark:text-vanilla-400 hover:text-ink-500 dark:hover:text-vanilla-100 text-sm leading-5 cursor-pointer">
				{truncatedChildren}
			</div>
		</a>
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

export default Breadcrumb;
