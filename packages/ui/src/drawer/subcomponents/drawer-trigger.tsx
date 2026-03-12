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
export function DrawerTrigger(props: DrawerTriggerProps) {
	return <BaseDialogTrigger data-slot="drawer-trigger" {...props} />;
}
