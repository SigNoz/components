import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check } from '@signozhq/icons';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import styles from '../dropdown-menu.module.scss';

export type DropdownMenuRadioItemProps = Omit<
	React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>,
	'asChild'
> & {
	/**
	 * Additional CSS classes to apply to the radio item.
	 */
	className?: string;
	/**
	 * The unique value of the item.
	 */
	value: string;
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
 * A radio item in the dropdown menu that can be checked.
 * Must be used inside `DropdownMenuRadioGroup`.
 * Only one item in the group can be selected at a time.
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = React.useState('system');
 *
 * <DropdownMenuContent>
 *   <DropdownMenuLabel>Theme</DropdownMenuLabel>
 *   <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
 *     <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
 *     <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
 *     <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
 *   </DropdownMenuRadioGroup>
 * </DropdownMenuContent>
 * ```
 */
export const DropdownMenuRadioItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
	DropdownMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
	<DropdownMenuPrimitive.RadioItem
		ref={ref}
		data-slot="dropdown-menu-radio-item"
		className={cn(styles['dropdown-menu__radio-item'], className)}
		{...props}
	>
		<span data-slot="radio-indicator" className={styles['dropdown-menu__radio-indicator']}>
			<DropdownMenuPrimitive.ItemIndicator>
				<Check size={14} />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.RadioItem>
));

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';
