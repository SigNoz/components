'use client';

import * as TogglePrimitive from '@radix-ui/react-toggle';
import type * as React from 'react';

import { cn } from '../lib/utils.js';
import styles from './toggle-group.module.css';

type ToggleVariant = 'default' | 'outline';
type ToggleSize = 'default' | 'sm' | 'lg';

interface ToggleProps extends React.ComponentProps<typeof TogglePrimitive.Root> {
	variant?: ToggleVariant;
	size?: ToggleSize;
}

function Toggle({ className, variant = 'default', size = 'default', ...props }: ToggleProps) {
	return (
		<TogglePrimitive.Root
			data-slot="toggle"
			data-variant={variant}
			data-size={size}
			className={cn(styles['toggle'], className)}
			{...props}
		/>
	);
}

export { Toggle };
export type { ToggleProps, ToggleVariant, ToggleSize };
