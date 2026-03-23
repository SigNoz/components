import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import styles from '../dropdown-menu.module.scss';

export type DropdownMenuItemProps = Omit<
	React.ComponentProps<typeof DropdownMenuPrimitive.Item>,
	'asChild'
> & {
	/**
	 * Additional CSS classes to apply to the item.
	 */
	className?: string;
	/**
	 * When `true`, adds additional left padding.
	 */
	inset?: boolean;
	/**
	 * Optional icon to display before the label.
	 */
	leftIcon?: React.ReactNode;
	/**
	 * Optional icon to display after the label.
	 */
	rightIcon?: React.ReactNode;
	/**
	 * When `true`, the item will be styled as destructive (e.g., delete actions).
	 */
	destructive?: boolean;
	/**
	 * When `true`, prevents the user from interacting with the item.
	 */
	disabled?: boolean;
	/**
	 * Event handler called when the user selects an item (via mouse or keyboard).
	 * Calling `event.preventDefault` in this handler will prevent the dropdown
	 * menu from closing when selecting that item.
	 */
	onSelect?: (event: Event) => void;
	/**
	 * Optional text used for typeahead purposes.
	 * By default the typeahead behavior will use the `.textContent` of the item.
	 * Use this when the content is complex, or you have non-textual content inside.
	 */
	textValue?: string;
};

/**
 * A selectable item in the dropdown menu.
 * Handle the `onSelect` callback to react when the user activates the item.
 *
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuItem onSelect={() => console.log('Profile clicked')}>
 *     Profile
 *   </DropdownMenuItem>
 *   <DropdownMenuItem onSelect={() => console.log('Settings clicked')}>
 *     Settings
 *   </DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 *
 * @example
 * ```tsx
 * // With icons
 * <DropdownMenuItem leftIcon={<UserIcon />} rightIcon={<ChevronRight />}>
 *   Profile
 * </DropdownMenuItem>
 * ```
 *
 * @example
 * ```tsx
 * // Destructive action
 * <DropdownMenuItem destructive onSelect={() => handleDelete()}>
 *   Delete
 * </DropdownMenuItem>
 * ```
 */
export const DropdownMenuItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Item>,
	DropdownMenuItemProps
>(({ className, inset, leftIcon, rightIcon, destructive, children, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		data-slot="dropdown-menu-item"
		data-destructive={destructive ? '' : undefined}
		className={cn(
			styles['dropdown-menu__item'],
			inset && styles['dropdown-menu__item--inset'],
			destructive && styles['dropdown-menu__item--destructive'],
			className
		)}
		{...props}
	>
		{leftIcon && <span className={styles['dropdown-menu__item-icon']}>{leftIcon}</span>}
		{children}
		{rightIcon && <span className={styles['dropdown-menu__item-right-icon']}>{rightIcon}</span>}
	</DropdownMenuPrimitive.Item>
));

DropdownMenuItem.displayName = 'DropdownMenuItem';
