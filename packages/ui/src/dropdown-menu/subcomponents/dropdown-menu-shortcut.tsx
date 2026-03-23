import type * as React from 'react';

import { cn } from '../../lib/utils.js';
import styles from '../dropdown-menu.module.scss';

export type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement> & {
	/**
	 * Additional CSS classes to apply to the shortcut.
	 */
	className?: string;
};

/**
 * Right-aligned helper text, typically used to display keyboard shortcuts
 * next to a menu item label.
 *
 * @example
 * ```tsx
 * <DropdownMenuItem>
 *   New Tab
 *   <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
 * </DropdownMenuItem>
 * ```
 *
 * @example
 * ```tsx
 * <DropdownMenuItem>
 *   Save
 *   <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
 * </DropdownMenuItem>
 * ```
 */
export function DropdownMenuShortcut({ className, ...props }: DropdownMenuShortcutProps) {
	return (
		<span
			data-slot="dropdown-menu-shortcut"
			className={cn(styles['dropdown-menu__shortcut'], className)}
			{...props}
		/>
	);
}

DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';
