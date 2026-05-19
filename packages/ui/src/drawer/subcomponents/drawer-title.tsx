import * as React from 'react';
import {
	DialogTitle as BaseDialogTitle,
	type DialogTitleProps as BaseDialogTitleProps,
} from '../../dialog/index.js';

export type DrawerTitleProps = BaseDialogTitleProps;

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
	React.ElementRef<typeof BaseDialogTitle>,
	DrawerTitleProps
>((props, ref) => <BaseDialogTitle ref={ref} data-slot="drawer-title" {...props} />);
DrawerTitle.displayName = 'DrawerTitle';
