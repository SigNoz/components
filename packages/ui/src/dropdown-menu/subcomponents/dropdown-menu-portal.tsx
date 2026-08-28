import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import type * as React from 'react';

export type DropdownMenuPortalProps = Omit<
	React.ComponentProps<typeof MenuPrimitive.Portal>,
	'keepMounted'
> & {
	/**
	 * Used to force mounting when more control is needed. Useful when
	 * controlling animation with React animation libraries.
	 */
	forceMount?: boolean;
};

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
	const { forceMount, ...rest } = props;

	return (
		<MenuPrimitive.Portal data-slot="dropdown-menu-portal" keepMounted={forceMount} {...rest} />
	);
}
