import * as React from 'react';
import { Command } from '../../command/index.js';

export type ComboboxCommandProps = React.ComponentPropsWithoutRef<typeof Command>;

/**
 * Command root used inside the combobox for filtering and keyboard navigation.
 *
 * Wraps `Command` with combobox-specific data attributes. Use `shouldFilter={false}`
 * when implementing custom filtering (e.g. async search).
 *
 * @example
 * ```tsx
 * <ComboboxContent>
 *   <ComboboxCommand shouldFilter={false}>
 *     <ComboboxInput placeholder="Search..." onValueChange={setQuery} />
 *     <ComboboxList>
 *       {filteredItems.map((item) => (
 *         <ComboboxItem key={item.value} value={item.value} onSelect={() => setValue(item.value)}>
 *           {item.label}
 *         </ComboboxItem>
 *       ))}
 *     </ComboboxList>
 *   </ComboboxCommand>
 * </ComboboxContent>
 * ```
 */
export const ComboboxCommand = React.forwardRef<
	React.ElementRef<typeof Command>,
	ComboboxCommandProps
>((props, ref) => <Command ref={ref} data-slot="combobox-command" {...props} />);
ComboboxCommand.displayName = 'ComboboxCommand';
