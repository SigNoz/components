import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../drawer.module.scss';

export type DrawerFooterProps = Pick<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * Test ID for the drawer footer.
	 */
	testId?: string;
};

/**
 * Bottom action area of the drawer, typically used for primary and
 * secondary buttons like "Cancel" and "Confirm".
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
 *     <DrawerFooter>
 *       <Button variant="ghost" color="secondary">Cancel</Button>
 *       <Button variant="solid" color="danger">Delete</Button>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
	({ className, testId, ...props }, ref) => (
		<div
			ref={ref}
			data-slot="drawer-footer"
			data-testid={testId}
			className={cn(styles.drawer__footer, className)}
			{...props}
		/>
	),
);
DrawerFooter.displayName = 'DrawerFooter';
