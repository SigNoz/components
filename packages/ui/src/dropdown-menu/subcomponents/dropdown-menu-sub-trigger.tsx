import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronRight } from '@signozhq/icons';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import styles from '../dropdown-menu.module.scss';

export type DropdownMenuSubTriggerProps = Omit<
	React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>,
	'asChild'
> & {
	/**
	 * Additional CSS classes to apply to the sub trigger.
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
	 * When `true`, prevents the user from interacting with the item.
	 */
	disabled?: boolean;
	/**
	 * Optional text used for typeahead purposes.
	 * By default the typeahead behavior will use the `.textContent` of the item.
	 * Use this when the content is complex, or you have non-textual content inside.
	 */
	textValue?: string;
};

/**
 * An item that opens a submenu.
 * Must be rendered inside `DropdownMenuSub`.
 *
 * @example
 * ```tsx
 * <DropdownMenuSub>
 *   <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
 *   <DropdownMenuSubContent>
 *     <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
 *     <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
 *   </DropdownMenuSubContent>
 * </DropdownMenuSub>
 * ```
 *
 * @example
 * ```tsx
 * // With left icon
 * <DropdownMenuSubTrigger leftIcon={<SettingsIcon />}>
 *   Settings
 * </DropdownMenuSubTrigger>
 * ```
 */
export const DropdownMenuSubTrigger = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
	DropdownMenuSubTriggerProps
>(({ className, inset, leftIcon, children, ...props }, ref) => (
	<DropdownMenuPrimitive.SubTrigger
		ref={ref}
		data-slot="dropdown-menu-sub-trigger"
		className={cn(
			styles['dropdown-menu__sub-trigger'],
			inset && styles['dropdown-menu__sub-trigger--inset'],
			className
		)}
		{...props}
	>
		{leftIcon && <span className={styles['dropdown-menu__sub-trigger-icon']}>{leftIcon}</span>}
		{children}
		<ChevronRight className={styles['dropdown-menu__sub-trigger-chevron']} />
	</DropdownMenuPrimitive.SubTrigger>
));

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';
