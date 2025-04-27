import { cva } from 'class-variance-authority';

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer disabled:pointer-events-none disabled:opacity-60 bg-[var(--button-background)] text-[var(--button-solid-foreground)] hover:bg-[var(--button-hover-background)] ',
	{
		variants: {
			variant: {
				solid: '',
				outlined:
					'border border-solid bg-transparent border-[var(--button-background)] text-[var(--button-outlined-foreground)] hover:bg-[var(--button-background)] hover:text-[var(--button-solid-foreground)] disabled:opacity-60',
				dashed:
					'border border-dashed bg-transparent border-[var(--button-background)] text-[var(--button-outlined-foreground)] hover:bg-[var(--button-background)] hover:text-[var(--button-solid-foreground)] disabled:opacity-60',
				ghost:
					'bg-transparent text-[var(--button-outlined-foreground)] hover:border-[var(--button-background)] hover:text-[var(--button-solid-foreground)] disabled:opacity-60',
				link:
					'bg-transparent text-[var(--button-outlined-foreground)]/90  hover:bg-transparent hover:text-[var(--button-outlined-foreground)] disabled:opacity-60 font-weight-normal',
			},
			size: {
				xs: 'h-[26px] px-2 py-1 text-[10px] leading-[14px] gap-1.5',
				sm: 'h-[32px] px-4 py-2 text-xs leading-6 gap-2',
				md: 'h-[36px] px-4 py-2 text-xs leading-6 gap-2',
				lg: 'h-[48px] px-6 py-3.5 text-base leading-6 gap-2',
				icon: 'h-9 w-9',
			},
		},
		defaultVariants: {
			size: 'md',
			variant: 'outlined',
		},
	},
);

export default buttonVariants;
