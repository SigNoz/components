import './index.css';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './lib/utils';

const badgeVariants = cva(
	'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden bg-[var(--badge-background)] text-[var(--badge-foreground)] hover:bg-[var(--badge-hover-background)] cursor-default',
	{
		variants: {
			variant: {
				default: 'border-transparent',
				outline:
					'border-[var(--badge-background)] bg-transparent text-[var(--badge-background)] hover:bg-[var(--badge-background)] hover:text-[var(--badge-foreground)]',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

type BadgeColor =
	| 'vanilla'
	| 'robin'
	| 'forest'
	| 'amber'
	| 'sienna'
	| 'cherry'
	| 'sakura'
	| 'aqua';

interface BadgeProps
	extends React.ComponentProps<'span'>,
		VariantProps<typeof badgeVariants> {
	asChild?: boolean;
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
			data-slot="badge"
			className={cn(
				badgeVariants({ variant }),
				capitalize ? 'font-medium uppercase tracking-wider' : 'font-normal',
				className,
			)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
