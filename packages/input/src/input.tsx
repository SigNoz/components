import './index.css';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './lib/utils';

const inputVariants = cva(
	'flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			theme: {
				light:
					'border-input text-foreground file:text-foreground focus-visible:ring-ring',
				dark:
					'border-input-dark bg-background-dark text-primary-foreground-dark file:text-foreground-dark placeholder:text-muted-foreground-dark focus-visible:ring-ring-dark',
			},
		},
		defaultVariants: {
			theme: 'light',
		},
	},
);

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, theme, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(inputVariants({ theme, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = 'Input';

export { Input, inputVariants };
