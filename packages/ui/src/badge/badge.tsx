import { Slot } from '@radix-ui/react-slot';
import type React from 'react';
import { cn } from '../lib/utils.js';
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
	...props
}: BadgeProps) {
	const Comp = asChild ? Slot : 'span';

	return (
		<Comp
			data-color={colorMap[color] || color}
			data-variant={variant}
			data-capitalize={capitalize}
			data-slot="badge"
			data-testid={testId}
			className={cn(styles.badge, className)}
			{...props}
		/>
	);
}

export { Badge };
export type { BadgeProps, BadgeVariant, BadgeColor };
