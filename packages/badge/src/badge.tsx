import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const badgeBaseClass =
	'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

const badgeVariants = cva(badgeBaseClass, {
	variants: {
		variant: {
			primary: 'bg-primary text-primary-foreground hover:bg-blue-600',
			secondary:
				'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
			danger:
				'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
			outline:
				'text-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-900',
		},
		size: {
			default: 'px-3 py-0.5',
			sm: 'px-2 py-0.25 text-xs',
			lg: 'px-4 py-1',
			icon: 'p-0.5',
		},
	},
	defaultVariants: {
		variant: 'primary',
		size: 'default',
	},
});

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, ...props }: BadgeProps) => {
	return <div className={badgeVariants({ variant, className })} {...props} />;
};

export default Badge;
