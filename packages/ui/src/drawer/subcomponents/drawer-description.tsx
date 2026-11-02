import type * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../drawer.module.scss';

export type DrawerDescriptionProps = Pick<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * Test ID for the drawer description.
	 */
	testId?: string;
};

/**
 * Secondary text region that provides additional context for a drawer.
 * Place body copy or explanatory text here to complement `DrawerTitle`.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Confirm action</DrawerTitle>
 *     </DrawerHeader>
 *     <DrawerDescription>
 *       <p>Are you sure you want to proceed? This action cannot be undone.</p>
 *     </DrawerDescription>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export const DrawerDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	DrawerDescriptionProps
>(({ className, testId, ...props }, ref) => (
	<div
		ref={ref}
		data-slot="drawer-description"
		data-testid={testId}
		className={cn(styles.drawer__description, className)}
		{...props}
	/>
));
DrawerDescription.displayName = 'DrawerDescription';
