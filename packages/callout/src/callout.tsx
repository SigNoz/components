import './index.css';
import React from 'react';
import { cva } from 'class-variance-authority';

import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';
import { cn } from './lib/utils';

interface CalloutProps extends React.ComponentProps<'div'> {
	message?: React.ReactNode;
	description?: React.ReactNode;
	type?: 'info' | 'success' | 'warning' | 'error';
	showIcon?: boolean;
	icon?: React.ReactNode;
	color?: string;
	size?: 'small' | 'medium';
	dismissable?: boolean;
	onClose?: () => void;
}

const typeToColorMap = {
	info: 'robin',
	success: 'forest',
	warning: 'amber',
	error: 'cherry',
} as const;

const defaultIcons = {
	info: <Info />,
	success: <CheckCircle2 />,
	warning: <AlertTriangle />,
	error: <XCircle />,
};

const calloutVariants = cva(
	'relative w-full rounded-lg border flex gap-[10px]',
	{
		variants: {
			size: {
				small: 'p-3 pb-[14px] text-sm',
				medium: 'p-4 text-base',
			},
		},
		defaultVariants: {
			size: 'small',
		},
	},
);

function Callout({
	className,
	message,
	description,
	type = 'info',
	showIcon = false,
	icon,
	color,
	size = 'small',
	dismissable = false,
	onClose,
	...props
}: CalloutProps) {
	const IconComponent = icon || (showIcon && defaultIcons[type]);

	return (
		<div
			data-slot="callout"
			data-color={color ?? typeToColorMap[type]}
			role="alert"
			className={cn(calloutVariants({ size }), className)}
			{...props}
		>
			{IconComponent ? (
				React.cloneElement(IconComponent as React.ReactElement, {
					'aria-hidden': true,
					className: cn(
						'mt-1',
						(IconComponent as React.ReactElement)?.props?.className,
					),
					color: 'var(--callout-icon-color)',
					size: size === 'medium' ? 16 : 12,
				})
			) : (
				<div className={cn(size === 'medium' ? 'w-4' : 'w-3')} />
			)}
			<div className="grid gap-0.5 flex-1">
				{message && (
					<div
						data-slot="callout-title"
						className={cn(
							'line-clamp-1 min-h-4 font-medium tracking-tight text-[var(--callout-title-color)]',
							size === 'medium' && 'text-base',
						)}
					>
						{message}
					</div>
				)}
				{description && (
					<div
						data-slot="callout-description"
						className={cn(
							'grid justify-items-start gap-1 [&_p]:leading-relaxed text-[var(--callout-description-color)] font-normal leading-5',
							size === 'medium' ? 'text-base' : 'text-sm',
						)}
					>
						{description}
					</div>
				)}
			</div>
			{dismissable && (
				<button
					type="button"
					aria-label="Close"
					onClick={onClose}
					className="self-start p-1 rounded-sm  transition-colors cursor-pointer"
				>
					<X
						size={size === 'medium' ? 16 : 14}
						className="text-[var(--callout-description-color)] hover:text-[var(--callout-title-color)] transition-colors duration-100 ease-out"
					/>
				</button>
			)}
		</div>
	);
}

export { Callout };
