import * as React from 'react';
import { CommandLoading } from '../../command/index.js';

export type ComboboxLoadingProps = Omit<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className'
> & {
	/**
	 * Additional CSS classes to apply to the loading container.
	 */
	className?: string;
	/**
	 * Inline styles for the loading container.
	 */
	style?: React.CSSProperties;
	/**
	 * Unique identifier for the element.
	 */
	id?: string;
	/**
	 * Test identifier for testing libraries.
	 */
	testId?: string;
	/**
	 * The loading content to display.
	 * @default "Loading..."
	 */
	children?: React.ReactNode;
};

/**
 * Loading indicator shown while fetching or filtering items.
 *
 * Place inside `ComboboxList` when performing async operations.
 *
 * @example
 * ```tsx
 * <ComboboxList>
 *   {isLoading ? (
 *     <ComboboxLoading>Loading options...</ComboboxLoading>
 *   ) : (
 *     items.map(...)
 *   )}
 * </ComboboxList>
 * ```
 */
export const ComboboxLoading = React.forwardRef<
	React.ElementRef<typeof CommandLoading>,
	ComboboxLoadingProps
>((props, ref) => <CommandLoading ref={ref} data-slot="combobox-loading" {...props} />);
ComboboxLoading.displayName = 'ComboboxLoading';
