import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../breadcrumb.module.scss';

export type BreadcrumbEllipsisProps = Pick<
	React.ComponentPropsWithoutRef<'span'>,
	'id' | 'className' | 'style' | 'title'
> & {
	/**
	 * The test ID to apply to the breadcrumb ellipsis.
	 */
	testId?: string;
};

/**
 * Placeholder for collapsed breadcrumb items when there are too many levels.
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
 *       <BreadcrumbEllipsis />
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Current</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
export const BreadcrumbEllipsis = React.forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
	({ className, testId, ...props }, ref) => {
		return (
			<span
				ref={ref}
				data-testid={testId}
				role="presentation"
				aria-hidden="true"
				data-slot="breadcrumb-ellipsis"
				className={cn(styles['breadcrumb-ellipsis'], className)}
				{...props}
			>
				&#8230;
				<span className={styles['breadcrumb-sr-only']}>More</span>
			</span>
		);
	}
);

BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';
