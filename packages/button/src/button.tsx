import './index.css';

import React from 'react';
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import buttonVariants from './button-variants';
import { cn } from './lib/utils';
import { Loader2 } from 'lucide-react';

export enum ButtonVariant {
	Solid = 'solid',
	Outlined = 'outlined',
	Dashed = 'dashed',
	Ghost = 'ghost',
	Link = 'link',
	Action = 'action',
}

export enum ButtonSize {
	XS = 'xs',
	SM = 'sm',
	MD = 'md',
	LG = 'lg',
	Icon = 'icon',
}

export enum ButtonBackground {
	Ink500 = 'ink-500',
	Ink400 = 'ink-400',
	Vanilla100 = 'vanilla-100',
	Vanilla200 = 'vanilla-200',
}

export enum ButtonColor {
	Primary = 'primary',
	Destructive = 'destructive',
	Warning = 'warning',
	Secondary = 'secondary',
}

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	variant?: ButtonVariant;
	width?: string;
	prefixIcon?: React.ReactElement;
	suffixIcon?: React.ReactElement;
	size?: ButtonSize;
	loading?: boolean;
	background?: ButtonBackground;
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
		ref,
	) => {
		const Comp = asChild ? Slot : 'button';

		const iconSizes: Record<ButtonSize, number> = {
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
					loading && 'cursor-wait',
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
	},
);
Button.displayName = 'Button';

export { Button, buttonVariants };
