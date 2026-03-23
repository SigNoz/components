import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';

export type DropdownMenuGroupProps = React.ComponentProps<typeof DropdownMenuPrimitive.Group>;

/**
 * Groups related menu items together.
 * Use with `DropdownMenuLabel` to provide a heading for the group.
 *
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuGroup>
 *     <DropdownMenuLabel>Account</DropdownMenuLabel>
 *     <DropdownMenuItem>Profile</DropdownMenuItem>
 *     <DropdownMenuItem>Settings</DropdownMenuItem>
 *   </DropdownMenuGroup>
 *   <DropdownMenuSeparator />
 *   <DropdownMenuGroup>
 *     <DropdownMenuLabel>Actions</DropdownMenuLabel>
 *     <DropdownMenuItem>New Team</DropdownMenuItem>
 *   </DropdownMenuGroup>
 * </DropdownMenuContent>
 * ```
 */
export const DropdownMenuGroup = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Group>,
	DropdownMenuGroupProps
>((props, ref) => {
	return <DropdownMenuPrimitive.Group ref={ref} data-slot="dropdown-menu-group" {...props} />;
});

DropdownMenuGroup.displayName = 'DropdownMenuGroup';
