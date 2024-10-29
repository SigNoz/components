import { cva } from 'class-variance-authority';
import { cn } from './lib/utils';
import { buttonVariants } from '@signozhq/button';

// Variants for pagination wrapper alignment
export const paginationWrapperVariants = cva('flex w-full', {
	variants: {
		align: {
			start: 'justify-start',
			center: 'justify-center',
			end: 'justify-end',
		},
	},
	defaultVariants: {
		align: 'end',
	},
});

// Variants for pagination items (links, buttons, divider)
export const paginationItemVariants = cva(
	'flex items-center justify-center font-inter',
	{
		variants: {
			variant: {
				link: cn(
					buttonVariants({ variant: 'ghost', size: 'icon', theme: 'dark' }),
					'hover:bg-vanilla-200/10 hover:text-vanilla-100',
				),
				active: cn(
					buttonVariants({ variant: 'default', size: 'icon', theme: 'dark' }),
					'hover:bg-vanilla-200/10 hover:text-vanilla-100',
				),
				nav: cn(
					buttonVariants({ variant: 'ghost', size: 'default', theme: 'dark' }),
					'hover:bg-vanilla-200/10 hover:text-vanilla-100',
				),
				divider: 'h-9 w-9',
			},
			disabled: {
				true: 'pointer-events-none opacity-50',
			},
		},
		defaultVariants: {
			variant: 'link',
			disabled: false,
		},
	},
);
