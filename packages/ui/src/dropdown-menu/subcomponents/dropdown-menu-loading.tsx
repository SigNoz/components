import { Loader2 } from 'lucide-react';

import { cn } from '../../lib/utils.js';
import styles from '../dropdown-menu.module.scss';

export type DropdownMenuLoadingProps = {
	/**
	 * Additional CSS classes to apply to the loading container.
	 */
	className?: string;
	/**
	 * The loading text to display.
	 * @default "Loading..."
	 */
	text?: string;
};

/**
 * A loading state indicator for the dropdown menu.
 * Use when menu items are being fetched asynchronously.
 *
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   {isLoading ? (
 *     <DropdownMenuLoading />
 *   ) : (
 *     items.map((item) => (
 *       <DropdownMenuItem key={item.id}>{item.label}</DropdownMenuItem>
 *     ))
 *   )}
 * </DropdownMenuContent>
 * ```
 *
 * @example
 * ```tsx
 * // With custom text
 * <DropdownMenuLoading text="Fetching options..." />
 * ```
 */
export function DropdownMenuLoading({ className, text = 'Loading...' }: DropdownMenuLoadingProps) {
	return (
		<div
			data-slot="dropdown-menu-loading"
			className={cn(styles['dropdown-menu__loading'], className)}
		>
			<Loader2 className={styles['dropdown-menu__loading-spinner']} />
			<span>{text}</span>
		</div>
	);
}

DropdownMenuLoading.displayName = 'DropdownMenuLoading';
