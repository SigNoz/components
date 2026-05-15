import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../breadcrumb.module.scss';

export type BreadcrumbPageProps = Pick<
	React.ComponentPropsWithoutRef<'span'>,
	| 'id'
	| 'className'
	| 'style'
	| 'children'
	| 'title'
	| 'aria-label'
	| 'aria-labelledby'
	| 'aria-describedby'
> & {
	/**
	 * The test ID to apply to the breadcrumb page.
	 */
	testId?: string;
	/**
	 * Icon to display before the page text.
	 */
	icon?: React.ReactNode;
};

/**
 * Non-clickable element representing the current page.
 * Should be the last item in the breadcrumb trail.
 *
 * @example
 * ```tsx
 * <BreadcrumbPage>Product Details</BreadcrumbPage>
 * ```
 *
 * @example
 * ```tsx
 * // With icon
 * <BreadcrumbPage icon={<FileIcon />}>Document.pdf</BreadcrumbPage>
 * ```
 */
export const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
	({ className, testId, icon, children, ...props }, ref) => {
		return (
			<span
				ref={ref}
				data-testid={testId}
				aria-current="page"
				data-slot="breadcrumb-page"
				className={cn(styles['breadcrumb-page'], className)}
				{...props}
			>
				{icon && <span className={styles['breadcrumb-icon']}>{icon}</span>}
				{children}
			</span>
		);
	}
);

BreadcrumbPage.displayName = 'BreadcrumbPage';
