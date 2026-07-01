import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ChevronDown } from '@signozhq/icons';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../combobox.module.scss';

export type ComboboxTriggerProps = Omit<
	React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>,
	'value' | 'id' | 'className'
> & {
	/**
	 * The id of the combobox trigger.
	 */
	id?: string;
	/**
	 * The class name of the combobox trigger.
	 */
	className?: string;
	/**
	 * The testId associated with the combobox trigger.
	 */
	testId?: string;
	placeholder?: React.ReactNode;
	value?: React.ReactNode;
	/**
	 * When true, renders child element as trigger instead of default button.
	 * Use when trigger needs to contain interactive elements like pill remove buttons.
	 */
	asChild?: boolean;
};

/**
 * Trigger button that opens the combobox popover and displays the selected value.
 *
 * Use `placeholder` when no value is selected and `value` to show the current selection.
 *
 * @example
 * ```tsx
 * <Combobox>
 *   <ComboboxTrigger placeholder="Select a framework..." value={selectedLabel} />
 *   <ComboboxContent>
 *     ...
 *   </ComboboxContent>
 * </Combobox>
 * ```
 */
export const ComboboxTrigger = React.forwardRef<
	React.ElementRef<typeof PopoverPrimitive.Trigger>,
	ComboboxTriggerProps
>(({ className, placeholder, value, testId, id, asChild, children, ...props }, ref) => {
	if (asChild) {
		return (
			<PopoverPrimitive.Trigger ref={ref} asChild {...props}>
				{children}
			</PopoverPrimitive.Trigger>
		);
	}
	return (
		<PopoverPrimitive.Trigger
			ref={ref}
			className={cn(styles['combobox__trigger'], className)}
			data-slot="combobox-trigger"
			data-testid={testId}
			id={id}
			{...props}
		>
			<span data-slot="combobox-value" className={styles['combobox__trigger-value']}>
				{value || placeholder || 'Select an option...'}
			</span>
			<ChevronDown data-slot="combobox-icon" className={styles['combobox__trigger-icon']} />
		</PopoverPrimitive.Trigger>
	);
});
ComboboxTrigger.displayName = 'ComboboxTrigger';
