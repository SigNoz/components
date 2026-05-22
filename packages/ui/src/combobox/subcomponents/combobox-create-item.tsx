import * as React from 'react';
import { CommandItem, type CommandItemProps } from '../../command/index.js';
import { cn } from '../../lib/utils.js';
import styles from '../combobox.module.scss';

export type ComboboxCreateItemProps = Omit<CommandItemProps, 'children'> & {
	/** The input value to create. */
	inputValue: string;
	/** Custom render function for the create option. */
	children?: React.ReactNode;
};

/**
 * Option to create a new item from the current input value.
 *
 * @example
 * ```tsx
 * <ComboboxCreateItem inputValue={inputValue} onSelect={handleCreate}>
 *   Create "{inputValue}"
 * </ComboboxCreateItem>
 * ```
 */
export const ComboboxCreateItem = React.forwardRef<
	React.ElementRef<typeof CommandItem>,
	ComboboxCreateItemProps
>(({ inputValue, children, className, ...props }, ref) => (
	<CommandItem
		ref={ref}
		data-slot="combobox-create-item"
		className={cn(styles['combobox__create-item'], className)}
		{...props}
	>
		{children ?? `Create "${inputValue}"`}
	</CommandItem>
));
ComboboxCreateItem.displayName = 'ComboboxCreateItem';
