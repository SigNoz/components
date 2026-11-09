import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../drawer.module.scss';

export type DrawerTriggerProps = Pick<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>,
	'id' | 'className' | 'onClick' | 'asChild' | 'children'
> & {
	/**
	 * Test ID for the drawer trigger.
	 */
	testId?: string;
};

/**
 * Button-like element that toggles a `Drawer` open when interacted with.
 * Usually wraps a `Button` or icon button using `asChild`.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Settings</DrawerTitle>
 *     </DrawerHeader>
 *     <DrawerDescription>
 *       <p>Drawer content goes here.</p>
 *     </DrawerDescription>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export const DrawerTrigger = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Trigger>,
	DrawerTriggerProps
>(({ className, testId, ...props }, ref) => (
	<DialogPrimitive.Trigger
		ref={ref}
		data-slot="drawer-trigger"
		data-testid={testId}
		className={cn(styles.drawer__trigger, className)}
		{...props}
	/>
));
DrawerTrigger.displayName = 'DrawerTrigger';
