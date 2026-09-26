import { X } from '@signozhq/icons';
import { forwardRef } from 'react';
import {
	Button,
	type ButtonProps,
	type ColorType,
	type SizeType,
	type VariantColorType,
	type VariantType,
} from '../../button/index.js';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.scss';
import { DialogClose } from './dialog-close.js';

export type DialogCloseButtonProps = Omit<
	ButtonProps,
	| 'type'
	| 'aria-label'
	| 'children'
	| 'icon'
	| 'prefix'
	| 'suffix'
	| 'variant'
	| 'size'
	| 'color'
	| 'disabled'
	| 'disabledTooltip'
> & {
	/**
	 * Accessible label for screen readers.
	 * @default "Close"
	 */
	ariaLabel?: string;
	/**
	 * Optional icon rendered inside the button. Defaults to a close icon.
	 */
	icon?: React.ReactElement;
	/**
	 * Visual style of the button.
	 * @default "ghost"
	 */
	variant?: VariantType;
	/**
	 * Height + padding token.
	 * @default "md"
	 */
	size?: SizeType;
	/**
	 * Color scheme applied to the variant. Only `solid` and `link` support colors
	 * other than `secondary`.
	 * @default "secondary"
	 */
	color?: ColorType;
	/**
	 * When true, the button does not close the dialog on click.
	 */
	disabled?: boolean;
	/**
	 * Reason shown in a tooltip while the button is disabled.
	 */
	disabledTooltip?: React.ReactNode;
};

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
export const DialogCloseButton = forwardRef<HTMLButtonElement, DialogCloseButtonProps>(
	(
		{
			className,
			ariaLabel = 'Close',
			icon = <X />,
			variant = 'ghost',
			size = 'md',
			color = 'secondary',
			disabled,
			disabledTooltip,
			...buttonProps
		},
		ref,
	) => {
		return (
			<DialogClose asChild>
				<Button
					ref={ref}
					type="button"
					aria-label={ariaLabel}
					// TypeScript cannot correlate the two destructured props back to the
					// variant/color union, so the pair is re-asserted here.
					{...({ variant, color } as VariantColorType)}
					size={size}
					icon
					disabled={disabled ?? false}
					disabledTooltip={disabledTooltip}
					data-slot="dialog-close-button"
					className={cn(styles.dialog__close__icon_button, className)}
					{...buttonProps}
				>
					{icon}
				</Button>
			</DialogClose>
		);
	},
);

DialogCloseButton.displayName = 'DialogCloseButton';
