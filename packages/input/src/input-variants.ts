import { cva } from 'class-variance-authority';

export const inputVariants = cva(
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
