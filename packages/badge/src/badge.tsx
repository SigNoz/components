import './index.css';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './lib/utils';

const badgeVariants = cva(
	'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden bg-[var(--badge-background)] text-[var(--badge-foreground)] hover:bg-[var(--badge-hover-background)]',
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

function Badge({
	className,
	variant,
	color = 'primary',
	asChild = false,
	...props
}: React.ComponentProps<'span'> &
	VariantProps<typeof badgeVariants> & {
		asChild?: boolean;
		color?: 'primary' | 'secondary' | 'destructive' | 'warning';
	}) {
	const Comp = asChild ? Slot : 'span';

	return (
		<Comp
			data-color={color}
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
