import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import type React from 'react';
import { cloneElement, forwardRef } from 'react';
import { cn } from '../lib/utils.js';
import styles from './button.module.css';

export const ButtonVariant = {
	Solid: 'solid',
	Outlined: 'outlined',
	Dashed: 'dashed',
	Ghost: 'ghost',
	Link: 'link',
	Action: 'action',
} as const;

export const ButtonSize = {
	SM: 'sm',
	MD: 'md',
	Icon: 'icon',
} as const;

export const ButtonBackground = {
	Ink500: 'ink-500',
	Ink400: 'ink-400',
	Vanilla100: 'vanilla-100',
	Vanilla200: 'vanilla-200',
} as const;

export const ButtonColor = {
	Primary: 'primary',
	Destructive: 'destructive',
	Warning: 'warning',
	Secondary: 'secondary',
	None: 'none',
} as const;

export type ButtonVariantValue = (typeof ButtonVariant)[keyof typeof ButtonVariant];
export type ButtonSizeValue = (typeof ButtonSize)[keyof typeof ButtonSize];
export type ButtonBackgroundValue = (typeof ButtonBackground)[keyof typeof ButtonBackground];
export type ButtonColorValue = (typeof ButtonColor)[keyof typeof ButtonColor] | (string & {});

/**
 * Helper function to generate button class names for use in other components
 * This replaces the old CVA-based buttonVariants function
 */
export function buttonVariants({
	variant = 'outlined',
	size = 'md',
	className,
}: {
	variant?: ButtonVariantValue;
	size?: ButtonSizeValue;
	className?: string;
} = {}) {
	return cn(styles['button'], className);
}

export type ButtonProps = {
	variant?: ButtonVariantValue;
	size?: ButtonSizeValue;
	asChild?: boolean;
	color?: ButtonColorValue;
	prefix?: React.ReactElement;
	suffix?: React.ReactElement;
	loading?: boolean;
	background?: ButtonBackgroundValue;
	testId?: string;
} & Pick<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	| 'disabled'
	| 'onClick'
	| 'className'
	| 'children'
	| 'onDoubleClick'
	| 'type'
	| 'id'
	| 'tabIndex'
	| 'title'
> &
	React.AriaAttributes;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			color,
			size,
			prefix,
			suffix,
			asChild = false,
			disabled,
			loading = false,
			background,
			children,
			testId,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button';

		variant ??= ButtonVariant.Solid;
		size ??= ButtonSize.MD;
		color ??= ButtonColor.Primary;

		const iconSizes: Record<ButtonSizeValue, number> = {
			[ButtonSize.SM]: 12,
			[ButtonSize.MD]: 14,
			[ButtonSize.Icon]: 16,
		};

		if (asChild) {
			if (loading || prefix || suffix) {
				console.warn('Loading, prefix, and suffix are not supported when using asChild');
			}

			return (
				<Comp
					data-testid={testId}
					data-color={color}
					data-variant={variant}
					data-size={size}
					data-background={variant === ButtonVariant.Action ? background : undefined}
					className={cn(
						styles['button'],
						'font-inter',
						loading && styles['button--loading'],
						className
					)}
					disabled={disabled || loading}
					ref={ref}
					{...props}
				>
					{children}
				</Comp>
			);
		}

		return (
			<Comp
				data-testid={testId}
				data-color={color}
				data-variant={variant}
				data-size={size}
				data-background={variant === ButtonVariant.Action ? background : undefined}
				className={cn(styles['button'], loading && styles['button--loading'], className)}
				disabled={disabled || loading}
				ref={ref}
				{...props}
			>
				{loading ? (
					<Loader2 size={iconSizes[size]} className="animate-fast-spin" />
				) : (
					(prefix &&
						cloneElement(prefix, {
							...(!prefix.props.size && {
								size: iconSizes[size],
								className: styles['button__prefix'],
							}),
						})) ||
					null
				)}
				{children}
				{(!loading &&
					suffix &&
					cloneElement(suffix, {
						...(!suffix.props.size && {
							size: iconSizes[size],
							className: styles['button__suffix'],
						}),
					})) ||
					null}
			</Comp>
		);
	}
);
Button.displayName = 'Button';

export { Button };
