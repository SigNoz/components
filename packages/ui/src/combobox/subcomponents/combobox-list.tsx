import * as React from 'react';
import { CommandList } from '../../command/index.js';

export type ComboboxListProps = React.ComponentPropsWithoutRef<typeof CommandList>;

/**
 * Scrollable list container for combobox items.
 *
 * Use inside `ComboboxCommand` to render the selectable options.
 *
 * @example
 * ```tsx
 * <ComboboxList>
 *   <ComboboxGroup heading="Frameworks">
 *     <ComboboxItem value="react">React</ComboboxItem>
 *     <ComboboxItem value="vue">Vue</ComboboxItem>
 *   </ComboboxGroup>
 *   <ComboboxEmpty>No results.</ComboboxEmpty>
 * </ComboboxList>
 * ```
 */
export const ComboboxList = React.forwardRef<
	React.ElementRef<typeof CommandList>,
	ComboboxListProps
>((props, ref) => <CommandList ref={ref} data-slot="combobox-list" {...props} />);
ComboboxList.displayName = 'ComboboxList';
