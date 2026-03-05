import './index.css';
import { Slot } from '@radix-ui/react-slot';
import type * as React from 'react';

import { cn } from '../lib/utils.js';
import styles from './badge.module.css';

type BadgeVariant = 'default' | 'outline';

type BadgeColor =
	| 'vanilla'
	| 'robin'
	| 'forest'
	| 'amber'
	| 'sienna'
	| 'cherry'
	| 'sakura'
	| 'aqua';

interface BadgeProps extends React.ComponentProps<'span'> {
	asChild?: boolean;
	variant?: BadgeVariant;
	color?: BadgeColor;
	capitalize?: boolean;
}

function Badge({
	className,
	variant = 'default',
	color = 'robin',
	asChild = false,
	capitalize = false,
	...props
}: BadgeProps) {
	const Comp = asChild ? Slot : 'span';

	return (
		<Comp
			data-color={color}
			data-variant={variant}
			data-capitalize={capitalize}
			data-slot="badge"
			className={cn(styles['badge'], className)}
			{...props}
		/>
	);
}

export { Badge };
export type { BadgeProps, BadgeVariant, BadgeColor };
