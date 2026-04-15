import {
	ChevronDown,
	ChevronUp,
	SolidAlertTriangle,
	SolidCheckCircle2,
	SolidInfoCircle,
	SolidXCircle,
	X,
} from '@signozhq/icons';
import React from 'react';
import { cn } from '../lib/utils.js';
import styles from './callout.module.scss';

export type CalloutColor = 'robin' | 'forest' | 'amber' | 'cherry' | 'sakura' | 'aqua';

export type CalloutProps = Pick<
	React.ComponentProps<'div'>,
	'id' | 'className' | 'style' | 'children'
> & {
	title?: React.ReactNode;
	type?: 'info' | 'success' | 'warning' | 'error';
	showIcon?: boolean;
	icon?: React.ReactNode;
	color?: CalloutColor | (string & {});
	size?: 'small' | 'medium';
	action?: 'none' | 'dismissible' | 'expandable';
	defaultExpanded?: boolean;
	onClick?: () => void;
	testId?: string;
};

const typeToColorMap = {
	info: 'robin',
	success: 'forest',
	warning: 'amber',
	error: 'cherry',
} as const;

const defaultIcons = {
	info: <SolidInfoCircle />,
	success: <SolidCheckCircle2 />,
	warning: <SolidAlertTriangle />,
	error: <SolidXCircle />,
};

/**
 * A callout component for displaying informational messages with optional icons and descriptions.
 * Supports multiple color variants, sizes, and interactive actions (dismissible/expandable).
 *
 * @example
 * ```tsx
 * // Basic info callout
 * <Callout title="What is instrumentation?" />
 * ```
 *
 * @example
 * ```tsx
 * // With description and icon
 * <Callout
 *   title="Success!"
 *   description="Your changes have been saved."
 *   type="success"
 *   showIcon
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Dismissible error callout
 * <Callout
 *   title="Error occurred"
 *   description="Please try again later."
 *   type="error"
 *   showIcon
 *   action="dismissible"
 *   onActionClick={() => console.log('dismissed')}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Expandable callout (toggles description visibility)
 * <Callout
 *   title="Collapsible information"
 *   description="This description can be toggled."
 *   type="info"
 *   showIcon
 *   action="expandable"
 *   onClick={() => console.log('toggled')}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Medium size with custom color
 * <Callout
 *   title="Custom callout"
 *   color="aqua"
 *   size="medium"
 * />
 * ```
 */
function Callout({
	className,
	title,
	children,
	type = 'info',
	showIcon = true,
	icon,
	color,
	size = 'small',
	action = 'none',
	onClick,
	defaultExpanded = true,
	testId,
	id,
	...props
}: CalloutProps) {
	const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
	const IconComponent = icon || (showIcon && defaultIcons[type]);

	const handleActionClick = React.useCallback(() => {
		if (action === 'expandable') {
			setIsExpanded((expand) => !expand);
		}
		onClick?.();
	}, [onClick, action]);

	const iconComponent = React.useMemo(() => {
		return IconComponent ? (
			<div className={styles['callout__icon']}>
				{React.isValidElement(IconComponent) ? (
					React.cloneElement(IconComponent as React.ReactElement, {
						'aria-hidden': true,
						className: cn((IconComponent as React.ReactElement).props?.className),
						color: 'var(--callout-icon-color)',
						size: size === 'medium' ? 16 : 12,
					})
				) : (
					<span style={{ color: 'var(--callout-icon-color)' }}>{IconComponent}</span>
				)}
			</div>
		) : null;
	}, [IconComponent, size]);

	return (
		<div
			data-slot="callout"
			data-color={color ?? typeToColorMap[type]}
			data-testid={testId}
			id={id}
			className={cn(
				styles['callout'],
				size === 'small' ? styles['callout--small'] : styles['callout--medium'],
				className
			)}
			role={action === 'expandable' ? 'button' : 'alert'}
			onClick={action === 'expandable' ? handleActionClick : undefined}
			{...props}
		>
			{iconComponent}
			<div className={styles['callout__content']}>
				{title && (
					<div data-slot="callout-title" className={styles['callout__title']}>
						{title}
					</div>
				)}
				{children && action !== 'expandable' && (
					<div data-slot="callout-description" className={styles['callout__description']}>
						{children}
					</div>
				)}
				{children && action === 'expandable' && isExpanded && (
					<div data-slot="callout-description" className={styles['callout__description']}>
						{children}
					</div>
				)}
			</div>
			{action !== 'none' && (
				<button
					type="button"
					aria-label={action === 'dismissible' ? 'Close' : isExpanded ? 'Collapse' : 'Expand'}
					className={styles['callout__action']}
					onClick={action === 'dismissible' ? handleActionClick : undefined}
				>
					{action === 'dismissible' ? (
						<X size={size === 'medium' ? 16 : 14} />
					) : isExpanded ? (
						<ChevronUp size={size === 'medium' ? 16 : 14} />
					) : (
						<ChevronDown size={size === 'medium' ? 16 : 14} />
					)}
				</button>
			)}
		</div>
	);
}

export { Callout };
