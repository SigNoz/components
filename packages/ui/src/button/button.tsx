import './index.css';

import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import React, { forwardRef } from 'react';
import { cn } from '../lib/utils.js';
import buttonVariants from './button-variants.js';

export const ButtonVariant = {
	Solid: 'solid',
	Outlined: 'outlined',
	Dashed: 'dashed',
	Ghost: 'ghost',
	Link: 'link',
	Action: 'action',
} as const;

export const ButtonSize = {
	XS: 'xs',
	SM: 'sm',
	MD: 'md',
	LG: 'lg',
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
} as const;

export type ButtonVariantValue = (typeof ButtonVariant)[keyof typeof ButtonVariant];
export type ButtonSizeValue = (typeof ButtonSize)[keyof typeof ButtonSize];
export type ButtonBackgroundValue = (typeof ButtonBackground)[keyof typeof ButtonBackground];
export type ButtonColorValue = (typeof ButtonColor)[keyof typeof ButtonColor] | (string & {});

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	variant?: ButtonVariantValue;
	color?: ButtonColorValue;
	width?: string;
	prefixIcon?: React.ReactElement;
	suffixIcon?: React.ReactElement;
	size?: ButtonSizeValue;
	loading?: boolean;
	background?: ButtonBackgroundValue;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = ButtonVariant.Solid,
			color,
			size = ButtonSize.MD,
			width,
			prefixIcon,
			suffixIcon,
			asChild = false,
			disabled,
			loading = false,
			background,
			children,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button';

		const iconSizes: Record<ButtonSizeValue, number> = {
			[ButtonSize.XS]: 10,
			[ButtonSize.SM]: 16,
			[ButtonSize.MD]: 16,
			[ButtonSize.LG]: 20,
			[ButtonSize.Icon]: 16,
		};

		return (
			<Comp
				data-color={color}
				data-background={variant === ButtonVariant.Action ? background : undefined}
				className={cn(
					buttonVariants({ variant, size, className }),
					'font-inter',
					width && `w-${width}`,
					loading && 'cursor-wait'
				)}
				disabled={disabled || loading}
				ref={ref}
				{...props}
			>
				{loading ? (
					<Loader2 size={iconSizes[size]} className="animate-fast-spin" />
				) : (
					prefixIcon &&
					React.cloneElement(prefixIcon, {
						...(!prefixIcon.props.size && {
							size: iconSizes[size],
							className: 'flex-shrink-0',
						}),
					})
				)}
				{children}
				{!loading &&
					suffixIcon &&
					React.cloneElement(suffixIcon, {
						...(!suffixIcon.props.size && {
							size: iconSizes[size],
							className: 'flex-shrink-0',
						}),
					})}
			</Comp>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
