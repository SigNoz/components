import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../select.module.scss';

export type SelectSeparatorProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
};

/**
 * Visual separator between select items or groups.
 *
 * @example
 * ```tsx
 * <SelectContent>
 *   <SelectItem value="a">Option A</SelectItem>
 *   <SelectSeparator />
 *   <SelectItem value="b">Option B</SelectItem>
 * </SelectContent>
 * ```
 */
export const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	SelectSeparatorProps
>(({ className, style, id, testId, ...props }, ref) => (
	<SelectPrimitive.Separator
		ref={ref}
		id={id}
		className={cn(styles.select__separator, className)}
		style={style}
		data-slot="select-separator"
		data-testid={testId}
		{...props}
	/>
));
SelectSeparator.displayName = 'SelectSeparator';
