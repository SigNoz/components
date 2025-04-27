import './index.css';

import React from 'react';
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import buttonVariants from './button-variants';
import { cn } from './lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'solid' | 'outlined' | 'dashed' | 'ghost' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon';
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
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = 'solid',
			color,
			size = 'md',
			width,
			prefixIcon,
			suffixIcon,
			asChild = false,
			disabled,
			loading = false,
			children,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : 'button';

		const iconSizes: Record<ButtonSize, number> = {
			xs: 10,
			sm: 16,
			md: 16,
			lg: 20,
			icon: 16,
		};

		return (
			<Comp
				data-color={color}
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
