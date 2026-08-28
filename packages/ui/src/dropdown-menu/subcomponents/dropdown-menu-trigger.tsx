import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import * as React from 'react';

export type DropdownMenuTriggerProps = Omit<
	React.ComponentProps<typeof MenuPrimitive.Trigger>,
	'render'
> & {
	/**
	 * When true, merges props onto the child element instead of rendering a wrapper.
	 */
	asChild?: boolean;
	/**
	 * The testId associated with the trigger.
	 */
	testId?: string;
};

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
export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
	({ testId, asChild, children, ...props }, ref) => {
		const child = asChild && React.isValidElement(children) ? children : undefined;

		return (
			<MenuPrimitive.Trigger
				ref={ref as React.ComponentProps<typeof MenuPrimitive.Trigger>['ref']}
				data-slot="dropdown-menu-trigger"
				data-testid={testId}
				render={child}
				{...props}
			>
				{child === undefined ? children : undefined}
			</MenuPrimitive.Trigger>
		);
	},
);

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';
