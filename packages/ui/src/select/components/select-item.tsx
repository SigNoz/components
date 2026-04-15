import * as SelectPrimitive from '@radix-ui/react-select';
import { Check } from '@signozhq/icons';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../select.module.scss';
import { useSelectContext } from './select-context.js';

export type SelectItemProps = {
	/** Additional CSS class names for the item text container. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** The value of the item (used for selection). */
	value: string;
	/** The content to render inside the item. */
	children?: React.ReactNode;
	/** Whether the item is disabled. */
	disabled?: boolean;
	/** Text value for typeahead. By default uses trimmed text content. */
	textValue?: string;
	/** Additional CSS class names for the item container. */
	containerClassname?: string;
	/** Additional CSS class names for the check indicator. */
	indicatorClassname?: string;
};

/**
 * Selectable item within the dropdown.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SelectItem value="react">React</SelectItem>
 *
 * // With icon
 * <SelectItem value="react" textValue="React">
 *   <Code className="mr-2 h-4 w-4" />
 *   React
 * </SelectItem>
 *
 * // With test ID
 * <SelectItem value="react" testId="select-item-react">React</SelectItem>
 * ```
 */
export const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	SelectItemProps
>(
	(
		{ className, style, id, testId, containerClassname, indicatorClassname, children, ...props },
		ref
	) => {
		const context = useSelectContext();
		const isSelected = context?.value.includes(props.value) ?? false;

		// For multi-select, prevent Radix from closing and handle selection ourselves
		const handlePointerUp = (e: React.PointerEvent) => {
			if (context?.multiple && !props.disabled) {
				e.preventDefault();
				context.onValueChange(props.value);
			}
		};

		return (
			<SelectPrimitive.Item
				ref={ref}
				id={id}
				className={cn(styles.select__item, containerClassname)}
				style={style}
				data-slot="select-item"
				data-testid={testId}
				data-selected={isSelected}
				data-multiple={context?.multiple || undefined}
				onPointerUp={handlePointerUp}
				{...props}
			>
				{context?.multiple && (
					<span
						className={cn(styles['select__item-indicator'], indicatorClassname, {
							'opacity-0': !isSelected,
						})}
					>
						<SelectPrimitive.ItemIndicator>
							<Check />
						</SelectPrimitive.ItemIndicator>
						{isSelected && !props.disabled && <Check />}
					</span>
				)}
				<SelectPrimitive.ItemText>
					<span className={cn(styles.select__item__container, className)}>{children}</span>
				</SelectPrimitive.ItemText>
			</SelectPrimitive.Item>
		);
	}
);
SelectItem.displayName = 'SelectItem';

export type SelectItemTextProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** The text content. */
	children?: React.ReactNode;
};

/**
 * Text content within a select item.
 *
 * @example
 * ```tsx
 * <SelectItem value="react">
 *   <SelectItemText>React</SelectItemText>
 * </SelectItem>
 * ```
 */
export const SelectItemText = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ItemText>,
	SelectItemTextProps
>(({ className, style, id, testId, ...props }, ref) => (
	<SelectPrimitive.ItemText
		ref={ref}
		id={id}
		className={className}
		style={style}
		data-slot="select-item-text"
		data-testid={testId}
		{...props}
	/>
));
SelectItemText.displayName = 'SelectItemText';

export type SelectItemIndicatorProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** Custom indicator content. */
	children?: React.ReactNode;
};

/**
 * Indicator shown when an item is selected.
 *
 * @example
 * ```tsx
 * <SelectItem value="react">
 *   <SelectItemIndicator>
 *     <Check />
 *   </SelectItemIndicator>
 *   React
 * </SelectItem>
 * ```
 */
export const SelectItemIndicator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ItemIndicator>,
	SelectItemIndicatorProps
>(({ className, style, id, testId, ...props }, ref) => (
	<SelectPrimitive.ItemIndicator
		ref={ref}
		id={id}
		className={className}
		style={style}
		data-slot="select-item-indicator"
		data-testid={testId}
		{...props}
	/>
));
SelectItemIndicator.displayName = 'SelectItemIndicator';
