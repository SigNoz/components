import { LoaderCircle } from '@signozhq/icons';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import styles from '../select.module.scss';

export type SelectLoadingProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'id' | 'className'> & {
	/**
	 * Additional CSS classes to apply to the loading container.
	 */
	className?: string;
	/**
	 * Inline styles for the loading container.
	 */
	style?: React.CSSProperties;
	/**
	 * Unique identifier for the element.
	 */
	id?: string;
	/**
	 * Test identifier for testing libraries.
	 */
	testId?: string;
	/**
	 * The loading content to display.
	 * @default "Loading..."
	 */
	children?: React.ReactNode;
};

/**
 * A loading state indicator for the select dropdown.
 * Use when select items are being fetched asynchronously.
 *
 * @example
 * ```tsx
 * <SelectContent>
 *   {isLoading ? (
 *     <SelectLoading>Fetching options...</SelectLoading>
 *   ) : (
 *     items.map((item) => (
 *       <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
 *     ))
 *   )}
 * </SelectContent>
 * ```
 */
export const SelectLoading = React.forwardRef<HTMLDivElement, SelectLoadingProps>(
	({ className, style, id, testId, children = 'Loading...', ...props }, ref) => {
		return (
			<div
				ref={ref}
				data-slot="select-loading"
				data-testid={testId}
				id={id}
				style={style}
				className={cn(styles['select__loading'], className)}
				{...props}
			>
				<LoaderCircle className={styles['select__loading-spinner']} />
				<span>{children}</span>
			</div>
		);
	}
);

SelectLoading.displayName = 'SelectLoading';
