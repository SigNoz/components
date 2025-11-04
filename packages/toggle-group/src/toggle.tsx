'use client';

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './lib/utils';

const toggleVariants = cva(
	"inline-flex items-center justify-center gap-2 rounded-md font-sans text-xs font-normal leading-5 tracking-tighter disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3 [&_svg]:shrink-0 outline-none transition-colors",
	{
		variants: {
			variant: {
				default: '',
				outline: '',
			},
			size: {
				default: 'h-9 px-3',
				sm: 'h-8 px-2',
				lg: 'h-10 px-4',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

function Toggle({
	className,
	variant,
	size,
	...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
	VariantProps<typeof toggleVariants>) {
	return (
		<TogglePrimitive.Root
			data-slot="toggle"
			className={cn(toggleVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Toggle, toggleVariants };
