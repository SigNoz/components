import type * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import { PopoverContent, type PopoverContentProps } from '../../popover/index.js';
import styles from '../combobox.module.scss';

export type ComboboxContentProps = PopoverContentProps;

/**
 * Popover content container that wraps the combobox command and list.
 *
 * Renders in a portal and positions relative to the trigger.
 *
 * @example
 * ```tsx
 * <ComboboxContent>
 *   <ComboboxCommand>
 *     <ComboboxInput placeholder="Search..." />
 *     <ComboboxList>
 *       <ComboboxItem value="react">React</ComboboxItem>
 *     </ComboboxList>
 *   </ComboboxCommand>
 * </ComboboxContent>
 * ```
 */
export const ComboboxContent = React.forwardRef<
	React.ElementRef<typeof PopoverPrimitive.Content>,
	ComboboxContentProps
>(({ className, ...props }, ref) => (
	<PopoverContent
		ref={ref}
		data-slot="combobox-content"
		className={cn(className, styles.combobox__content)}
		{...props}
	/>
));
ComboboxContent.displayName = 'ComboboxContent';
