import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import { DropdownMenuGroupMarker } from './dropdown-menu-group.js';
import styles from '../dropdown-menu.module.scss';

export type DropdownMenuLabelProps = Pick<
	React.ComponentProps<'div'>,
	'id' | 'style' | 'children'
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
export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
	({ className, inset, ...props }, ref) => {
		const insideGroup = React.useContext(DropdownMenuGroupMarker);
		const elementProps = {
			'data-slot': 'dropdown-menu-label',
			className: cn(
				styles['dropdown-menu__label'],
				inset && styles['dropdown-menu__label--inset'],
				className,
			),
			...props,
		};

		if (insideGroup) {
			return <MenuPrimitive.GroupLabel ref={ref} {...elementProps} />;
		}

		return <div ref={ref} {...elementProps} />;
	},
);

DropdownMenuLabel.displayName = 'DropdownMenuLabel';
