import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../drawer.module.scss';

export type DrawerTitleProps = Pick<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * Test ID for the drawer title.
	 */
	testId?: string;
	/**
	 * The icon of the drawer title.
	 */
	icon?: React.ReactNode;
};

/**
 * Accessible title for a drawer. Renders text (and optional icon) and
 * labels the drawer content for screen readers.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Edit settings</DrawerTitle>
 *     </DrawerHeader>
 *     <DrawerDescription>
 *       <p>Drawer content goes here.</p>
 *     </DrawerDescription>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export const DrawerTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	DrawerTitleProps
>(({ className, icon, children, testId, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		data-slot="drawer-title"
		data-testid={testId}
		className={cn(styles.drawer__title, className)}
		{...props}
	>
		{icon}
		{children}
	</DialogPrimitive.Title>
));
DrawerTitle.displayName = 'DrawerTitle';
