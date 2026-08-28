import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { Check } from '@signozhq/icons';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import { createSelectHandler } from './menu-select.js';
import styles from '../dropdown-menu.module.scss';

export type DropdownMenuCheckboxItemProps = Omit<
	React.ComponentProps<typeof MenuPrimitive.CheckboxItem>,
	'render' | 'onCheckedChange' | 'checked' | 'label'
> & {
	/**
	 * Additional CSS classes to apply to the checkbox item.
	 */
	className?: string;
	/**
	 * The controlled checked state of the item.
	 * Can be `true`, `false`, or `'indeterminate'`.
	 */
	checked?: boolean | 'indeterminate';
	/**
	 * Event handler called when the checked state changes.
	 */
	onCheckedChange?: (checked: boolean) => void;
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
 * A checkbox item in the dropdown menu that can be checked or unchecked.
 *
 * @example
 * ```tsx
 * const [showBookmarks, setShowBookmarks] = React.useState(true);
 * const [showUrls, setShowUrls] = React.useState(false);
 *
 * <DropdownMenuContent>
 *   <DropdownMenuCheckboxItem
 *     checked={showBookmarks}
 *     onCheckedChange={setShowBookmarks}
 *   >
 *     Show Bookmarks
 *   </DropdownMenuCheckboxItem>
 *   <DropdownMenuCheckboxItem
 *     checked={showUrls}
 *     onCheckedChange={setShowUrls}
 *   >
 *     Show Full URLs
 *   </DropdownMenuCheckboxItem>
 * </DropdownMenuContent>
 * ```
 */
export const DropdownMenuCheckboxItem = React.forwardRef<
	HTMLDivElement,
	DropdownMenuCheckboxItemProps
>(
	(
		{ className, children, checked, onSelect, onClick, onCheckedChange, textValue, ...props },
		ref,
	) => {
		return (
			<MenuPrimitive.CheckboxItem
				ref={ref}
				data-slot="dropdown-menu-checkbox-item"
				className={cn(styles['dropdown-menu__checkbox-item'], className)}
				// Base UI menu checkbox items are binary; an indeterminate value
				// reads as unchecked, as it did visually before.
				checked={checked === 'indeterminate' ? false : checked}
				onCheckedChange={(next) => onCheckedChange?.(next)}
				onClick={createSelectHandler(onSelect, onClick)}
				// Toggling a checkbox has always kept the menu open.
				closeOnClick={false}
				label={textValue}
				{...props}
			>
				<span
					data-slot="checkbox-indicator"
					className={styles['dropdown-menu__checkbox-indicator']}
				>
					<MenuPrimitive.CheckboxItemIndicator>
						<Check size={14} />
					</MenuPrimitive.CheckboxItemIndicator>
				</span>
				{children}
			</MenuPrimitive.CheckboxItem>
		);
	},
);

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';
