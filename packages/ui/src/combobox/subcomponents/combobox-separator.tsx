import * as React from 'react';
import { CommandSeparator } from '../../command/index.js';

export type ComboboxSeparatorProps = React.ComponentPropsWithoutRef<typeof CommandSeparator>;

/**
 * Visual divider between groups inside the combobox list.
 *
 * @example
 * ```tsx
 * <ComboboxList>
 *   <ComboboxGroup heading="Frameworks">
 *     <ComboboxItem value="react">React</ComboboxItem>
 *   </ComboboxGroup>
 *   <ComboboxSeparator />
 *   <ComboboxGroup heading="Languages">
 *     <ComboboxItem value="ts">TypeScript</ComboboxItem>
 *   </ComboboxGroup>
 * </ComboboxList>
 * ```
 */
export const ComboboxSeparator = React.forwardRef<
	React.ElementRef<typeof CommandSeparator>,
	ComboboxSeparatorProps
>((props, ref) => <CommandSeparator ref={ref} data-slot="combobox-separator" {...props} />);
ComboboxSeparator.displayName = 'ComboboxSeparator';
