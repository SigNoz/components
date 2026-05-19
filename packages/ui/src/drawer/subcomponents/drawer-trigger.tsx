import * as React from 'react';

import {
	DialogTrigger as BaseDialogTrigger,
	type DialogTriggerProps as BaseDialogTriggerProps,
} from '../../dialog/index.js';

export type DrawerTriggerProps = BaseDialogTriggerProps;

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
	React.ElementRef<typeof BaseDialogTrigger>,
	DrawerTriggerProps
>((props, ref) => <BaseDialogTrigger ref={ref} data-slot="drawer-trigger" {...props} />);
DrawerTrigger.displayName = 'DrawerTrigger';
