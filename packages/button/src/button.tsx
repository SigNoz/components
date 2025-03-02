import './index.css';

import React from 'react';
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from './lib/utils';

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	asChild?: boolean;
	backgroundColor?: string;
	textColor?: string;
	border?: string;
	width?: string;
	size?: 'xs' | 'sm' | 'md' | 'lg';
	prefixIcon?: React.ReactElement;
	suffixIcon?: React.ReactElement;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			backgroundColor,
			textColor,
			border,
			width,
			size = 'md',
			prefixIcon,
			suffixIcon,
			asChild = false,
			disabled,
			children,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : 'button';

		const iconSizes = {
			xs: 10,
			sm: 16,
			md: 16,
			lg: 20,
		};

		const sizeConfig = {
			xs: {
				container: 'h-[26px] px-2 py-1', // 8px horizontal, 4px vertical padding
				text: 'text-[10px] leading-[14px]', // 10px font, 14px line height
				gap: 'gap-1.5', // 6px gap
			},
			sm: {
				container: 'h-[32px] px-4 py-2', // 16px horizontal, 8px vertical padding
				text: 'text-xs leading-6', // 12px font, 24px line height
				gap: 'gap-2', // 8px gap
			},
			md: {
				container: 'h-[36px] px-4 py-2', // 16px horizontal, 8px vertical padding
				text: 'text-xs leading-6', // 12px font, 24px line height
				gap: 'gap-2', // 8px gap
			},
			lg: {
				container: 'h-[48px] px-6 py-3.5', // 24px horizontal, 14px vertical padding
				text: 'text-base leading-6', // 16px font, 24px line height
				gap: 'gap-2', // 8px gap
			},
		}[size];

		return (
			<Comp
				className={cn(
					'inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-ring font-inter m-2 ',
					sizeConfig.container,
					sizeConfig.text,
					sizeConfig.gap,
					backgroundColor && `bg-${backgroundColor}`,
					textColor && `text-${textColor}`,
					border && `border ${border}`,
					width && `w-${width}`,
					disabled && 'opacity-50 pointer-events-none',
					className,
				)}
				disabled={disabled}
				ref={ref}
				{...props}
			>
				{prefixIcon && (
					<span>
						{React.cloneElement(prefixIcon, {
							...(!prefixIcon.props.size && { size: iconSizes[size] }),
						})}
					</span>
				)}
				{children}
				{suffixIcon && (
					<span>
						{React.cloneElement(suffixIcon, {
							...(!suffixIcon.props.size && { size: iconSizes[size] }),
						})}
					</span>
				)}
			</Comp>
		);
	},
);

Button.displayName = 'Button';

export default Button;
