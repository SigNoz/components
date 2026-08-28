import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import * as React from 'react';

export type DropdownMenuGroupProps = React.ComponentProps<typeof MenuPrimitive.Group>;

/**
 * Marks that a group is present above the label.
 *
 * Base UI's `GroupLabel` throws unless a `Group` or `RadioGroup` is above it —
 * it wires `aria-labelledby` between the two. Radix's `Label` had no such
 * requirement and was used on its own, so the label falls back to a plain
 * element when it is not inside a group.
 */
export const DropdownMenuGroupMarker = React.createContext(false);

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
export const DropdownMenuGroup = React.forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
	(props, ref) => {
		return (
			<DropdownMenuGroupMarker.Provider value={true}>
				<MenuPrimitive.Group ref={ref} data-slot="dropdown-menu-group" {...props} />
			</DropdownMenuGroupMarker.Provider>
		);
	},
);

DropdownMenuGroup.displayName = 'DropdownMenuGroup';
