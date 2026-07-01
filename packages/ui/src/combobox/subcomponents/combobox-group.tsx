import * as React from 'react';
import { CommandGroup } from '../../command/index.js';

export type ComboboxGroupProps = React.ComponentPropsWithoutRef<typeof CommandGroup>;

/**
 * Groups related combobox items.
 *
 * @example
 * ```tsx
 * <ComboboxGroup heading="Frameworks">
 *   <ComboboxItem value="react">React</ComboboxItem>
 *   <ComboboxItem value="vue">Vue</ComboboxItem>
 * </ComboboxGroup>
 * ```
 */
export const ComboboxGroup = React.forwardRef<
	React.ElementRef<typeof CommandGroup>,
	ComboboxGroupProps
>(({ children, ...props }, ref) => (
	<CommandGroup ref={ref} data-slot="combobox-group" {...props}>
		{children}
	</CommandGroup>
));
ComboboxGroup.displayName = 'ComboboxGroup';
