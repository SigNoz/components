import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../breadcrumb.module.scss';

export type BreadcrumbListProps = Pick<
	React.ComponentPropsWithoutRef<'ol'>,
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
	 * The test ID to apply to the breadcrumb list.
	 */
	testId?: string;
};

/**
 * Ordered list wrapper for breadcrumb items. Use inside `Breadcrumb`.
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Current</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
export const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
	({ className, testId, ...props }, ref) => {
		return (
			<ol
				ref={ref}
				data-testid={testId}
				data-slot="breadcrumb-list"
				className={cn(styles['breadcrumb-list'], className)}
				{...props}
			/>
		);
	}
);

BreadcrumbList.displayName = 'BreadcrumbList';
