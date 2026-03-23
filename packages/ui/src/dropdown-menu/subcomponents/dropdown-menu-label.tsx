import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import styles from '../dropdown-menu.module.scss';

export type DropdownMenuLabelProps = Omit<
	React.ComponentProps<typeof DropdownMenuPrimitive.Label>,
	'asChild'
> & {
	/**
	 * Additional CSS classes to apply to the label.
	 */
	className?: string;
	/**
	 * When `true`, adds additional left padding.
	 */
	inset?: boolean;
};

/**
 * A label for a group of items.
 * Used to provide a heading for a group of related menu items.
 *
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuLabel>Account</DropdownMenuLabel>
 *   <DropdownMenuItem>Profile</DropdownMenuItem>
 *   <DropdownMenuItem>Settings</DropdownMenuItem>
 *   <DropdownMenuSeparator />
 *   <DropdownMenuLabel>Actions</DropdownMenuLabel>
 *   <DropdownMenuItem>New Team</DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 */
export const DropdownMenuLabel = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Label>,
	DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => (
	<DropdownMenuPrimitive.Label
		ref={ref}
		data-slot="dropdown-menu-label"
		className={cn(
			styles['dropdown-menu__label'],
			inset && styles['dropdown-menu__label--inset'],
			className
		)}
		{...props}
	/>
));

DropdownMenuLabel.displayName = 'DropdownMenuLabel';
