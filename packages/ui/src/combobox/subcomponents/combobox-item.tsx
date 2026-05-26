import { Check } from '@signozhq/icons';
import * as React from 'react';
import { CommandItem, type CommandItemProps } from '../../command/index.js';
import styles from '../combobox.module.scss';

export type ComboboxItemProps = CommandItemProps & {
	isSelected?: boolean;
	/**
	 * When true, inserts value into input instead of selecting it.
	 * Useful for hints/suggestions that provide a prefix for user to continue typing.
	 * @default false
	 */
	insertOnInput?: boolean;
	/**
	 * Callback when item is used to insert into input. Called with the value to insert.
	 * Only used when insertOnInput is true.
	 */
	onInsert?: (value: string) => void;
};

/**
 * Selectable item in the combobox list.
 *
 * Use `isSelected` to show a checkmark for the current value. Pass `prefix={null}`
 * to hide the default check icon.
 *
 * Set `insertOnInput` to insert value into the input field instead of selecting it.
 * This is useful for hint items that provide a prefix for the user to continue typing.
 *
 * @example
 * ```tsx
 * <ComboboxItem
 *   value="react"
 *   onSelect={() => setValue('react')}
 *   isSelected={value === 'react'}
 * >
 *   React
 * </ComboboxItem>
 * ```
 *
 * @example Hint item that inserts into input
 * ```tsx
 * <ComboboxItem
 *   value="status:"
 *   insertOnInput
 *   onInsert={(value) => setInputValue(value)}
 *   prefix={<HintIcon />}
 * >
 *   Filter by status...
 * </ComboboxItem>
 * ```
 */
export const ComboboxItem = React.forwardRef<
	React.ElementRef<typeof CommandItem>,
	ComboboxItemProps
>(
	(
		{ prefix, isSelected = false, insertOnInput = false, onInsert, onSelect, value, ...props },
		ref
	) => {
		const resolvedPrefix: React.ReactNode =
			prefix === undefined ? (
				<span
					data-slot="combobox-item-indicator"
					className={styles['combobox__item-check']}
					data-selected={isSelected}
				>
					<Check />
				</span>
			) : (
				prefix
			);

		const handleSelect = (currentValue: string) => {
			if (insertOnInput && onInsert) {
				onInsert(value ?? currentValue);
			} else if (onSelect) {
				onSelect(currentValue);
			}
		};

		return (
			<CommandItem
				ref={ref}
				data-slot="combobox-item"
				data-insert-on-input={insertOnInput}
				value={value}
				onSelect={handleSelect}
				{...props}
				prefix={resolvedPrefix}
			/>
		);
	}
);
ComboboxItem.displayName = 'ComboboxItem';
