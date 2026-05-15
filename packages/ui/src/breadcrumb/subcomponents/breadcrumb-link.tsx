import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../breadcrumb.module.scss';

export type BreadcrumbLinkProps = Pick<
	React.ComponentPropsWithoutRef<'a'>,
	| 'id'
	| 'className'
	| 'style'
	| 'children'
	| 'href'
	| 'onClick'
	| 'title'
	| 'target'
	| 'rel'
	| 'aria-label'
	| 'aria-labelledby'
	| 'aria-describedby'
> & {
	/**
	 * The test ID to apply to the breadcrumb link.
	 */
	testId?: string;
	/**
	 * Icon to display before the link text.
	 */
	icon?: React.ReactNode;
};

/**
 * Clickable link for navigating to a breadcrumb level.
 * Use for all items except the current page.
 *
 * @example
 * ```tsx
 * <BreadcrumbLink href="/products">Products</BreadcrumbLink>
 * ```
 *
 * @example
 * ```tsx
 * // With icon
 * <BreadcrumbLink href="/" icon={<HomeIcon />}>Home</BreadcrumbLink>
 * ```
 *
 * @example
 * ```tsx
 * // External link
 * <BreadcrumbLink href="https://example.com" target="_blank" rel="noopener">
 *   External
 * </BreadcrumbLink>
 * ```
 */
export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
	({ className, testId, icon, children, ...props }, ref) => {
		return (
			<a
				ref={ref}
				data-testid={testId}
				data-slot="breadcrumb-link"
				className={cn(styles['breadcrumb-link'], className)}
				{...props}
			>
				{icon && <span className={styles['breadcrumb-icon']}>{icon}</span>}
				{children}
			</a>
		);
	}
);

BreadcrumbLink.displayName = 'BreadcrumbLink';
