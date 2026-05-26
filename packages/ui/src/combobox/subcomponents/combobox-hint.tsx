import * as React from 'react';
import { CommandItem, type CommandItemProps } from '../../command/index.js';
import { cn } from '../../lib/utils.js';
import styles from '../combobox.module.scss';

export type ComboboxHintProps = Omit<CommandItemProps, 'onSelect'> & {
	/** The value to insert into the input when this hint is selected. */
	insertValue: string;
	/** Callback when hint is selected. Called with the insertValue. */
	onInsert: (value: string) => void;
	/** Custom content for the hint. */
	children: React.ReactNode;
};

/**
 * Hint item that inserts a value into the input instead of selecting it.
 * Useful for providing suggestions that serve as prefixes for continued typing.
 *
 * @example
 * ```tsx
 * <ComboboxHint
 *   insertValue="status:"
 *   onInsert={(value) => setInputValue(value)}
 * >
 *   Filter by status...
 * </ComboboxHint>
 * ```
 */
export const ComboboxHint = React.forwardRef<
	React.ElementRef<typeof CommandItem>,
	ComboboxHintProps
>(({ insertValue, onInsert, children, className, prefix = null, ...props }, ref) => (
	<CommandItem
		ref={ref}
		data-slot="combobox-hint"
		className={cn(styles['combobox__hint-item'], className)}
		onSelect={() => onInsert(insertValue)}
		prefix={prefix}
		{...props}
	>
		{children}
	</CommandItem>
));
ComboboxHint.displayName = 'ComboboxHint';
