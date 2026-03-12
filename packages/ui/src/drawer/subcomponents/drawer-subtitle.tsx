import {
	DialogSubtitle as BaseDialogSubtitle,
	type DialogSubtitleProps as BaseDialogSubtitleProps,
} from '../../dialog/index.js';

export type DrawerSubtitleProps = BaseDialogSubtitleProps;

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
export function DrawerSubtitle(props: DrawerSubtitleProps) {
	return <BaseDialogSubtitle data-slot="drawer-subtitle" {...props} />;
}
