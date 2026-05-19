import { ChevronRight } from '@signozhq/icons';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../breadcrumb.module.scss';

const DEFAULT_SEPARATOR = <ChevronRight size={14} />;

export type BreadcrumbSeparatorProps = Pick<
	React.ComponentPropsWithoutRef<'li'>,
	'id' | 'className' | 'style' | 'title'
> & {
	/**
	 * The test ID to apply to the breadcrumb separator.
	 */
	testId?: string;
	/**
	 * Custom separator content. If not provided, uses the parent's separator type.
	 */
	children?: React.ReactNode;
};

/**
 * Visual separator between breadcrumb items.
 * Defaults to chevron icon; pass children for custom separator.
 *
 * @example
 * ```tsx
 * // Default chevron
 * <BreadcrumbSeparator />
 * ```
 *
 * @example
 * ```tsx
 * // Custom separator
 * <BreadcrumbSeparator>/</BreadcrumbSeparator>
 * ```
 *
 * @example
 * ```tsx
 * // Arrow separator
 * <BreadcrumbSeparator>→</BreadcrumbSeparator>
 * ```
 */
export const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
	({ className, testId, children, ...props }, ref) => {
		return (
			<li
				ref={ref}
				data-testid={testId}
				role="presentation"
				aria-hidden="true"
				data-slot="breadcrumb-separator"
				className={cn(styles['breadcrumb-separator'], className)}
				{...props}
			>
				{children ?? DEFAULT_SEPARATOR}
			</li>
		);
	}
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
