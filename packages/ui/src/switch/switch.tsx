// packages/ui/src/switch/switch.tsx
import './index.css'; // Keep for CSS variable definitions

import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './switch.module.css';

type SwitchColor = 'robin' | 'forest' | 'amber' | 'sienna' | 'cherry' | 'sakura' | 'aqua';

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
	color?: SwitchColor;
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
	({ className, color = 'robin', ...props }, ref) => (
		<SwitchPrimitive.Root
			ref={ref}
			data-color={color}
			className={cn(styles['switch'], className)}
			{...props}
		>
			<SwitchPrimitive.Thumb className={styles['switch__thumb']} />
		</SwitchPrimitive.Root>
	)
);
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
