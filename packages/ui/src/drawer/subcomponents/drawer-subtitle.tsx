import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../drawer.module.scss';

export type DrawerSubtitleProps = Pick<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * Test ID for the drawer subtitle.
	 */
	testId?: string;
};

/**
 * Secondary text displayed below the drawer title.
 * Use for additional context or metadata.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Edit report</DrawerTitle>
 *       <DrawerSubtitle>Last updated 2 hours ago</DrawerSubtitle>
 *     </DrawerHeader>
 *     <DrawerDescription>
 *       <p>Drawer content goes here.</p>
 *     </DrawerDescription>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export const DrawerSubtitle = React.forwardRef<HTMLDivElement, DrawerSubtitleProps>(
	({ className, testId, ...props }, ref) => (
		<div
			ref={ref}
			data-slot="drawer-subtitle"
			data-testid={testId}
			className={cn(styles.drawer__subtitle, className)}
			{...props}
		/>
	),
);
DrawerSubtitle.displayName = 'DrawerSubtitle';
