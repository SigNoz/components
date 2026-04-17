import { Slot } from '@radix-ui/react-slot';
import type React from 'react';
import { cn } from '../lib/utils.js';
import { TextEllipsis, type TextEllipsisProps } from '../text-ellipsis/index.js';
import styles from './badge.module.css';

type BadgeVariant = 'default' | 'outline';

type BadgeColor =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'error'
	| 'warning'
	| 'robin'
	| 'forest'
	| 'amber'
	| 'sienna'
	| 'cherry'
	| 'sakura'
	| 'aqua'
	| 'vanilla';

type TextEllipsisPosition = TextEllipsisProps['position'];

interface BadgeProps
	extends Pick<React.ComponentProps<'span'>, 'className' | 'children' | 'id' | 'style'> {
	/**
	 * The testId associated with the badge.
	 */
	testId?: string;
	/**
	 * @default false
	 */
	asChild?: boolean;
	/**
	 * @default default
	 */
	variant?: BadgeVariant;
	/**
	 * @default primary
	 */
	color?: BadgeColor;
	/**
	 * @default false
	 */
	capitalize?: boolean;
	/**
	 * Enable text ellipsis truncation. When true, uses 'center' position.
	 * When a position is provided ('start' | 'center' | 'end'), truncates at that position.
	 * Only works when children is a string. For non-string children, use CSS text-overflow instead.
	 * @default false
	 */
	textEllipsis?: boolean | TextEllipsisPosition;
}

const colorMap: Record<string, string> = {
	success: 'forest',
	warning: 'amber',
	error: 'cherry',
	primary: 'robin',
	secondary: 'vanilla',
};

function Badge({
	className,
	variant = 'default',
	color = 'primary',
	asChild = false,
	capitalize = false,
	testId,
	textEllipsis = false,
	children,
	...props
}: BadgeProps) {
	const Comp = asChild ? Slot : 'span';

	// Determine ellipsis position
	const ellipsisPosition: TextEllipsisPosition | false =
		textEllipsis === true ? 'center' : textEllipsis === false ? false : textEllipsis;

	// Check if we should apply text ellipsis
	const shouldApplyEllipsis = ellipsisPosition && typeof children === 'string';

	// Warn if textEllipsis is used with non-string children
	if (ellipsisPosition && typeof children !== 'string') {
		console.warn(
			'Badge: textEllipsis only works when children is a string. For non-string children, use CSS text-overflow (textWrap) instead.'
		);
	}

	const content = shouldApplyEllipsis ? (
		<TextEllipsis position={ellipsisPosition} className={styles.badgeEllipsis}>
			{children}
		</TextEllipsis>
	) : (
		children
	);

	return (
		<Comp
			data-color={colorMap[color] || color}
			data-variant={variant}
			data-capitalize={capitalize}
			data-slot="badge"
			data-testid={testId}
			data-text-ellipsis={shouldApplyEllipsis || undefined}
			className={cn(styles.badge, className)}
			{...props}
		>
			{content}
		</Comp>
	);
}

export { Badge };
export type { BadgeProps, BadgeVariant, BadgeColor };
