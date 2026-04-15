import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../select.module.scss';

export type SelectGroupProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** The group items and optional label. */
	children?: React.ReactNode;
};

/**
 * Groups related select items together.
 *
 * @example
 * ```tsx
 * <SelectGroup>
 *   <SelectLabel>Fruits</SelectLabel>
 *   <SelectItem value="apple">Apple</SelectItem>
 *   <SelectItem value="banana">Banana</SelectItem>
 * </SelectGroup>
 * ```
 */
export const SelectGroup = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Group>,
	SelectGroupProps
>(({ className, style, id, testId, ...props }, ref) => (
	<SelectPrimitive.Group
		ref={ref}
		id={id}
		className={cn(styles.select__group, className)}
		style={style}
		data-slot="select-group"
		data-testid={testId}
		{...props}
	/>
));
SelectGroup.displayName = 'SelectGroup';

export type SelectLabelProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** The label text. */
	children?: React.ReactNode;
};

/**
 * Label for a group of select items.
 *
 * @example
 * ```tsx
 * <SelectGroup>
 *   <SelectLabel>Fruits</SelectLabel>
 *   <SelectItem value="apple">Apple</SelectItem>
 * </SelectGroup>
 * ```
 */
export const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	SelectLabelProps
>(({ className, style, id, testId, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ref}
		id={id}
		className={cn(styles.select__label, className)}
		style={style}
		data-slot="select-label"
		data-testid={testId}
		{...props}
	/>
));
SelectLabel.displayName = 'SelectLabel';
