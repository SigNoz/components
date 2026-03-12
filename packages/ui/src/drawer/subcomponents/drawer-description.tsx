import {
	DialogDescription as BaseDialogDescription,
	type DialogDescriptionProps as BaseDialogDescriptionProps,
} from '../../dialog/index.js';

export type DrawerDescriptionProps = BaseDialogDescriptionProps;

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
export function DrawerDescription(props: DrawerDescriptionProps) {
	return <BaseDialogDescription data-slot="drawer-description" {...props} />;
}
