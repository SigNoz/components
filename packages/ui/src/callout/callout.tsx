import './index.css';
import {
	SolidAlertTriangle,
	SolidCheckCircle2,
	SolidInfoCircle,
	SolidXCircle,
	X,
} from '@signozhq/icons';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './callout.module.css';

export type CalloutType = 'info' | 'success' | 'warning' | 'error';
export type CalloutSize = 'small' | 'medium';

const defaultIcons = {
	info: <SolidInfoCircle />,
	success: <SolidCheckCircle2 />,
	warning: <SolidAlertTriangle />,
	error: <SolidXCircle />,
};

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
	type?: CalloutType;
	size?: CalloutSize;
	icon?: React.ReactNode;
	message?: string;
	description?: string;
	showIcon?: boolean;
	dismissable?: boolean;
	onClose?: () => void;
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
	(
		{
			className,
			type = 'info',
			size = 'medium',
			icon,
			message,
			description,
			children,
			showIcon = true,
			dismissable = false,
			onClose,
			color,
			...props
		},
		ref
	) => {
		const IconComponent = icon || (showIcon && defaultIcons[type]) || null;

		return (
			<div
				ref={ref}
				data-slot="callout"
				data-color={color || type}
				data-type={type}
				data-size={size}
				className={cn(styles['callout'], className)}
				{...props}
			>
				{IconComponent ? (
					React.isValidElement(IconComponent) ? (
						React.cloneElement(IconComponent as React.ReactElement, {
							'aria-hidden': true,
							className: cn(
								styles['callout__icon'],
								(IconComponent as React.ReactElement).props?.className
							),
							size: size === 'medium' ? 16 : 12,
						})
					) : (
						<span>{IconComponent}(IconComponent as React</span>
					)
				) : (
					<div className={cn(size === 'medium' ? 'w-4' : 'w-3')} />
				)}
				<div className={styles['callout__content']}>
					{message && <div className={styles['callout__message']}>{message}</div>}
					{description && <div className={styles['callout__description']}>{description}</div>}
					{children}
				</div>
				{dismissable && (
					<button
						type="button"
						aria-label="Close"
						onClick={onClose}
						className={styles.callout__dismissable}
					>
						<X size={size === 'medium' ? 16 : 14} className="" />
					</button>
				)}
			</div>
		);
	}
);
Callout.displayName = 'Callout';

export { Callout };
