import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../breadcrumb.module.scss';

export type BreadcrumbProps = Pick<
	React.ComponentPropsWithoutRef<'nav'>,
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
	 * The test ID to apply to the breadcrumb container.
	 */
	testId?: string;
};

/**
 * Root component for building custom breadcrumb layouts. Compose it with
 * `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`,
 * and `BreadcrumbSeparator`. For most use cases, prefer the all-in-one
 * `BreadcrumbSimple` component instead.
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparatorItem />
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/products">Products</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparatorItem />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Current Page</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
	({ className, testId, ...props }, ref) => {
		return (
			<nav
				ref={ref}
				data-testid={testId}
				aria-label="breadcrumb"
				data-slot="breadcrumb"
				className={cn(styles['breadcrumb-root'], className)}
				{...props}
			/>
		);
	}
);

Breadcrumb.displayName = 'Breadcrumb';
