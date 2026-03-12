import { X } from '@signozhq/icons';
import { Button, type ButtonProps } from '../../button/index.js';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';
import { DialogClose } from './dialog-close.js';

export interface DialogCloseButtonProps extends Omit<ButtonProps, 'type' | 'aria-label'> {
	/**
	 * Accessible label for screen readers.
	 * @default "Close"
	 */
	ariaLabel?: string;
	/**
	 * Optional icon rendered inside the button. Defaults to a close icon.
	 */
	icon?: React.ReactNode;
}

/**
 * Icon button that closes the dialog. Renders an X icon by default.
 * Use in `DialogContent` when you need explicit control, or rely on
 * `showCloseButton` in `DialogWrapper` which renders it internally.
 *
 * @important Always use this component inside `DialogContent`.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button variant="solid" color="primary">Open dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent width="base">
 *     <DialogHeader>
 *       <DialogTitle>Settings</DialogTitle>
 *     </DialogHeader>
 *     <DialogDescription>
 *       <p>Dialog content goes here.</p>
 *     </DialogDescription>
 *     <DialogCloseButton />
 *   </DialogContent>
 * </Dialog>
 * ```
 *
 * @example
 * ```tsx
 * // Custom aria-label for accessibility
 * <DialogCloseButton ariaLabel="Dismiss dialog" />
 * ```
 *
 * @example
 * ```tsx
 * // Custom icon
 * <DialogCloseButton icon={<CustomCloseIcon />} />
 * ```
 *
 * @example
 * ```tsx
 * // With test ID for testing
 * <DialogCloseButton testId="dialog-close-btn" />
 * ```
 */
export function DialogCloseButton({
	className,
	ariaLabel = 'Close',
	icon = <X />,
	...buttonProps
}: DialogCloseButtonProps) {
	return (
		<DialogClose asChild>
			<Button
				type="button"
				aria-label={ariaLabel}
				variant="ghost"
				size="icon"
				color="none"
				data-slot="dialog-close-button"
				className={cn(styles.dialog__close__icon_button, className)}
				{...buttonProps}
			>
				{icon}
				<span className={styles.dialog__close__button_screenreader}>{ariaLabel}</span>
			</Button>
		</DialogClose>
	);
}
