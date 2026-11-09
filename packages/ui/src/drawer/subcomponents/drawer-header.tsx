import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../drawer.module.scss';

export type DrawerHeaderProps = Pick<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * Test ID for the drawer header.
	 */
	testId?: string;
};

/**
 * Layout wrapper for the top section of the drawer.
 * Typically contains `DrawerTitle` and optional close button or actions.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Delete this item</DrawerTitle>
 *     </DrawerHeader>
 *     <DrawerDescription>
 *       <p>This action cannot be undone.</p>
 *     </DrawerDescription>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
	({ className, testId, children, ...props }, ref) => (
		<div
			ref={ref}
			data-slot="drawer-header"
			data-testid={testId}
			className={cn(styles.drawer__header, className)}
			{...props}
		>
			{children}
		</div>
	),
);
DrawerHeader.displayName = 'DrawerHeader';
