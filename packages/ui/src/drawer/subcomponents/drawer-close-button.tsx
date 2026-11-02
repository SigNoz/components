import { X } from '@signozhq/icons';
import { forwardRef } from 'react';
import { InternalButton } from '../../button/button.js';
import type { ButtonStyleProps } from '../../button/types.js';
import {
	type ButtonProps,
	type ColorType,
	type SizeType,
	type VariantColorType,
	type VariantType,
} from '../../button/index.js';
import { cn } from '../../lib/utils.js';
import styles from '../drawer.module.scss';
import { DrawerClose } from './drawer-close.js';

export type DrawerCloseButtonProps = Omit<
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
	| 'noLoadingEffect'
> &
	ButtonStyleProps & {
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
		 * When true, the button does not close the drawer on click.
		 */
		disabled?: boolean;
		/**
		 * Reason shown in a tooltip while the button is disabled.
		 */
		disabledTooltip?: React.ReactNode;
	};

/**
 * Icon button that closes the drawer. Renders an X icon by default.
 * Use in `DrawerHeader` when you need explicit control, or rely on
 * `DrawerWrapper` which renders it internally when `showCloseButton` is true.
 *
 * @important Always use this component inside `DrawerContent`.
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
 *
 * @example
 * ```tsx
 * // Custom aria-label for accessibility
 * <DrawerCloseButton ariaLabel="Dismiss drawer" />
 * ```
 *
 * @example
 * ```tsx
 * // Custom icon
 * <DrawerCloseButton icon={<CustomCloseIcon />} />
 * ```
 */
export const DrawerCloseButton = forwardRef<HTMLButtonElement, DrawerCloseButtonProps>(
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
			style,
			...buttonProps
		},
		ref,
	) => {
		return (
			<DrawerClose asChild>
				<InternalButton
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
					// Apps select on this value, so it stays what the close button rendered before it moved here.
					data-slot="dialog-close-button"
					className={cn(styles.drawer__close__icon_button, className)}
					style={{
						'--button-variant-ghost-position': 'absolute',
						'--button-variant-dashed-position': 'absolute',
						'--button-variant-outlined-disabled-position': 'absolute',
						...style,
					}}
					{...buttonProps}
				>
					{icon}
				</InternalButton>
			</DrawerClose>
		);
	},
);

DrawerCloseButton.displayName = 'DrawerCloseButton';
