import {
	DialogCloseButton as BaseDialogCloseButton,
	type DialogCloseButtonProps as BaseDialogCloseButtonProps,
} from '../../dialog/index.js';

export type DrawerCloseButtonProps = BaseDialogCloseButtonProps;

/**
 * Icon button that closes the drawer. Renders an X icon by default.
 * Use in `DrawerHeader` when you need explicit control, or rely on
 * `DrawerWrapper` which renders it internally when `showCloseButton` is true.
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
 *       <DrawerCloseButton />
 *     </DrawerHeader>
 *     <DrawerDescription>
 *       <p>Drawer content goes here.</p>
 *     </DrawerDescription>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export function DrawerCloseButton(props: DrawerCloseButtonProps) {
	return <BaseDialogCloseButton {...props} />;
}
