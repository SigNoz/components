import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import * as React from 'react';

export type DropdownMenuRadioGroupProps = Omit<
	React.ComponentProps<typeof MenuPrimitive.RadioGroup>,
	'onValueChange'
> & {
	/** Called with the newly selected value. */
	onValueChange?: (value: string) => void;
};

/**
 * Groups multiple `DropdownMenuRadioItem` components together.
 * Only one item in the group can be selected at a time.
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = React.useState('system');
 *
 * <DropdownMenuContent>
 *   <DropdownMenuLabel>Theme</DropdownMenuLabel>
 *   <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
 *     <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
 *     <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
 *     <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
 *   </DropdownMenuRadioGroup>
 * </DropdownMenuContent>
 * ```
 */
export const DropdownMenuRadioGroup = React.forwardRef<HTMLDivElement, DropdownMenuRadioGroupProps>(
	(props, ref) => {
		const { onValueChange, ...rest } = props;

		return (
			<MenuPrimitive.RadioGroup
				ref={ref}
				data-slot="dropdown-menu-radio-group"
				// Base UI reports `(value, eventDetails)`; the public callback has
				// always taken just the value.
				onValueChange={(value) => onValueChange?.(value as string)}
				{...rest}
			/>
		);
	},
);

DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup';
