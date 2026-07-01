import * as React from 'react';
import { CommandInput } from '../../command/index.js';

export type ComboboxInputProps = React.ComponentPropsWithoutRef<typeof CommandInput>;

/**
 * Search input inside the combobox.
 *
 * Renders a search icon and forwards props to the underlying command input.
 *
 * @example
 * ```tsx
 * <ComboboxCommand>
 *   <ComboboxInput
 *     placeholder="Search frameworks..."
 *     onValueChange={(value) => setQuery(value)}
 *   />
 *   <ComboboxList>...</ComboboxList>
 * </ComboboxCommand>
 * ```
 */
export const ComboboxInput = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
	(props, ref) => <CommandInput ref={ref} data-slot="combobox-input" {...props} />
);
ComboboxInput.displayName = 'ComboboxInput';
