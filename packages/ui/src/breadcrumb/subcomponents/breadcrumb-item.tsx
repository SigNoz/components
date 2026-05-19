import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../breadcrumb.module.scss';

export type BreadcrumbItemProps = Pick<
	React.ComponentPropsWithoutRef<'li'>,
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
	 * The test ID to apply to the breadcrumb item.
	 */
	testId?: string;
};

/**
 * Wraps each breadcrumb element (link, page, separator, or ellipsis).
 * Use inside `BreadcrumbList`.
 *
 * @example
 * ```tsx
 * <BreadcrumbItem>
 *   <BreadcrumbLink href="/products">Products</BreadcrumbLink>
 * </BreadcrumbItem>
 * ```
 *
 * @example
 * ```tsx
 * // Current page (last item)
 * <BreadcrumbItem>
 *   <BreadcrumbPage>Details</BreadcrumbPage>
 * </BreadcrumbItem>
 * ```
 */
export const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
	({ className, testId, ...props }, ref) => {
		return (
			<li
				ref={ref}
				data-testid={testId}
				data-slot="breadcrumb-item"
				className={cn(styles['breadcrumb-item'], className)}
				{...props}
			/>
		);
	}
);

BreadcrumbItem.displayName = 'BreadcrumbItem';
