import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';

export type DropdownMenuRadioGroupProps = React.ComponentProps<
	typeof DropdownMenuPrimitive.RadioGroup
>;

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
export const DropdownMenuRadioGroup = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.RadioGroup>,
	DropdownMenuRadioGroupProps
>((props, ref) => {
	return (
		<DropdownMenuPrimitive.RadioGroup ref={ref} data-slot="dropdown-menu-radio-group" {...props} />
	);
});

DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup';
