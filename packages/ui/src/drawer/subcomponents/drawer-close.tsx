import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../drawer.module.scss';

export type DrawerCloseProps = Pick<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>,
	'id' | 'className' | 'style' | 'onClick' | 'asChild' | 'children'
> & {
	/**
	 * Test ID for the drawer close.
	 */
	testId?: string;
};

/**
 * Element that closes the drawer when activated. Often used to wrap
 * a `Button` inside the drawer footer or to render a custom close
 * control in the header.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Drawer with footer close</DrawerTitle>
 *     </DrawerHeader>
 *     <DrawerDescription>
 *       <p>Use the footer button to close.</p>
 *     </DrawerDescription>
 *     <DrawerFooter>
 *       <DrawerClose asChild>
 *         <Button variant="solid" color="primary">Close</Button>
 *       </DrawerClose>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export const DrawerClose = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Close>,
	DrawerCloseProps
>(({ className, testId, ...props }, ref) => (
	<DialogPrimitive.Close
		ref={ref}
		data-slot="drawer-close"
		data-testid={testId}
		className={cn(styles.drawer__close, className)}
		{...props}
	/>
));
DrawerClose.displayName = 'DrawerClose';
