import * as React from 'react';
import { CommandEmpty } from '../../command/index.js';

export type ComboboxEmptyProps = React.ComponentPropsWithoutRef<typeof CommandEmpty>;

/**
 * Fallback content shown when there are no matching results.
 *
 * Place inside `ComboboxList` to customize the empty state.
 *
 * @example
 * ```tsx
 * <ComboboxList>
 *   {items.map(...)}
 *   <ComboboxEmpty>No framework found. Try a different search.</ComboboxEmpty>
 * </ComboboxList>
 * ```
 */
export const ComboboxEmpty = React.forwardRef<
	React.ElementRef<typeof CommandEmpty>,
	ComboboxEmptyProps
>((props, ref) => <CommandEmpty ref={ref} data-slot="combobox-empty" {...props} />);
ComboboxEmpty.displayName = 'ComboboxEmpty';
