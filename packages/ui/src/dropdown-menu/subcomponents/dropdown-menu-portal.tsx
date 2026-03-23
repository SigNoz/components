import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type * as React from 'react';

export type DropdownMenuPortalProps = React.ComponentProps<typeof DropdownMenuPrimitive.Portal>;

/**
 * Portals the dropdown menu content into `document.body`.
 * Used internally by `DropdownMenuContent`.
 * Use directly when you need a custom `container` or `forceMount` behavior.
 *
 * @example
 * ```tsx
 * <DropdownMenuPortal container={customContainer}>
 *   <DropdownMenuContent>...</DropdownMenuContent>
 * </DropdownMenuPortal>
 * ```
 */
export function DropdownMenuPortal(props: DropdownMenuPortalProps) {
	return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}
