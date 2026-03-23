import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';

export type DropdownMenuTriggerProps = React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>;

/**
 * The button that toggles the dropdown menu.
 * Use `asChild` to delegate to a child element (e.g. a Button).
 * By default, `DropdownMenuContent` positions itself against the trigger.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild>
 *     <Button variant="outline">Open menu</Button>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent>...</DropdownMenuContent>
 * </DropdownMenu>
 * ```
 *
 * @example
 * ```tsx
 * // Without asChild - renders as a button
 * <DropdownMenuTrigger>Click me</DropdownMenuTrigger>
 * ```
 */
export const DropdownMenuTrigger = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
	DropdownMenuTriggerProps
>((props, ref) => {
	return <DropdownMenuPrimitive.Trigger ref={ref} data-slot="dropdown-menu-trigger" {...props} />;
});

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';
