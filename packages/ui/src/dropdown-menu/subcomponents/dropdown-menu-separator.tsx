import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import styles from '../dropdown-menu.module.scss';

export type DropdownMenuSeparatorProps = Omit<
	React.ComponentProps<typeof DropdownMenuPrimitive.Separator>,
	'asChild'
> & {
	/**
	 * Additional CSS classes to apply to the separator.
	 */
	className?: string;
};

/**
 * A visual divider between sections in the dropdown menu.
 * Use to separate groups of related items.
 *
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuItem>Profile</DropdownMenuItem>
 *   <DropdownMenuItem>Settings</DropdownMenuItem>
 *   <DropdownMenuSeparator />
 *   <DropdownMenuItem>Logout</DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 */
export const DropdownMenuSeparator = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
	DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Separator
		ref={ref}
		data-slot="dropdown-menu-separator"
		className={cn(styles['dropdown-menu__separator'], className)}
		{...props}
	/>
));

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
